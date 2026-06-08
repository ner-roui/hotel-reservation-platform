const PaymentModel = require("../models/PaymentModel");
const ReservationModel = require("../models/ReservationModel");
const ChambreModel = require("../models/RoomModels");


const createPayment = async (req, res) => {
  console.log('effectuer un payment -->>');
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID réservation manquant" });
    }

    const {
      methode,
      montant_paye,
      taxe = 0,
      reduction = 0,
      transaction_id,
      notes,
      valide_par,
      date_limite,
    } = req.body;

    // Vérifier réservation
    const reservationData = await ReservationModel.findById(id)
      .populate("user")
      .populate("chambre");

    if (!reservationData) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    // Vérifier chambre
    const chambre = await ChambreModel.findById(reservationData.chambre._id);
    if (!chambre) {
      return res.status(404).json({ message: "Chambre introuvable" });
    }

    // Calculs
    const montant_total = reservationData.total + taxe - reduction;

    // Statut paiement
    let statut = "En attente";
    if (montant_paye === 0) {
      statut = "En attente";
    } else if (montant_paye < montant_total) {
      statut = "Partiellement payé";
    } else if (montant_paye >= montant_total) {
      statut = "Payé";
    }

    // ─────────────────────────────────────────────────────────────
    // LOGIQUE PRIORITÉ : Premier paiement confirmé gagne
    // ─────────────────────────────────────────────────────────────
    const estPaiementConfirme = statut === "Payé";
    console.log('estPaiementConfirme:', estPaiementConfirme, '| statut:', statut);

    if (estPaiementConfirme) {

      // 1. Vérifier si une réservation déjà PAYÉE existe pour les mêmes dates
      const reservationConfirmeeExistante = await ReservationModel.findOne({
        _id:           { $ne: reservationData._id },
        chambre:       reservationData.chambre._id,
        status:        "CONFIRMED",
        paymentStatus: "PAID",
        arrivee:       { $lt: reservationData.depart },   // ✅ chevauchement correct
        depart:        { $gt: reservationData.arrivee },  // ✅ chevauchement correct
      });

      console.log('reservationConfirmeeExistante:', reservationConfirmeeExistante);

      if (reservationConfirmeeExistante) {
        // Une réservation payée existe déjà → annuler la réservation actuelle
        reservationData.status        = "CANCELLED";
        reservationData.paymentStatus = "UNPAID";
        reservationData.cancelledAt   = new Date();       // ✅ champ du schéma
        await reservationData.save();

        return res.status(409).json({
          message:
            "Cette chambre a déjà été payée par un autre client pour ces dates. " +
            "Votre réservation a été automatiquement annulée.",
          reservation_annulee: reservationData._id,
        });
      }

      // 2. Aucune réservation payée concurrente → ce paiement prend la priorité
      //    Annuler toutes les réservations PENDING en chevauchement
      const reservationsEnAttente = await ReservationModel.find({
        _id:           { $ne: reservationData._id },
        chambre:       reservationData.chambre._id,
        status:        "PENDING",                         // ✅ enum du schéma
        paymentStatus: "UNPAID",                          // ✅ enum du schéma
        arrivee:       { $lt: reservationData.depart },   // ✅ champ correct
        depart:        { $gt: reservationData.arrivee },  // ✅ champ correct
      });

      console.log('reservationsEnAttente:', reservationsEnAttente);

      if (reservationsEnAttente.length > 0) {
        const idsAnnules = reservationsEnAttente.map((r) => r._id);

        // Annuler les réservations concurrentes
        await ReservationModel.updateMany(
          { _id: { $in: idsAnnules } },
          {
            $set: {
              status:      "CANCELLED",  // ✅ enum du schéma
              paymentStatus: "UNPAID",   // ✅ enum du schéma
              cancelledAt: new Date(),   // ✅ champ du schéma
            },
          }
        );

        // Retirer ces réservations de chambre.reservation_active
        chambre.reservation_active = chambre.reservation_active.filter(
          (item) =>
            !idsAnnules.some(
              (annuleId) => annuleId.toString() === item.reservation_id.toString()
            )
        );

        console.log(`${idsAnnules.length} réservation(s) annulée(s) au profit de ${reservationData._id}`);
      }

      // Confirmer la réservation actuelle
      reservationData.status = "CONFIRMED";  // ✅ enum du schéma
    }
    // ─────────────────────────────────────────────────────────────

    // Création paiement
    const payment = await PaymentModel.create({
      reservation:   reservationData._id,
      chambre:       reservationData.chambre._id,
      user:          reservationData.user._id,
      montant_total,
      montant_paye,
      taxe,
      reduction,
      methode,
      statut,
      transaction_id,
      date_limite,
      notes,
      valide_par,
      date_paiement: new Date(),
    });

    // Mise à jour réservation
    reservationData.paymentStatus = statut === "Payé" ? "PAID" : "UNPAID";  // ✅ enum du schéma
    reservationData.paymentMethod = methode;
    await reservationData.save();

    // Mise à jour chambre
    chambre.reservation_active = chambre.reservation_active.map((item) => {
      if (item.reservation_id.toString() === reservationData._id.toString()) {
        return {
          ...item.toObject(),
          paymentStatus: statut === "Payé" ? "PAID" : "UNPAID",
        };
      }
      return item;
    });

    await chambre.save();

    res.status(201).json({
      message: "Paiement créé avec succès",
      payment,
      ...(estPaiementConfirme && {
        info: "Votre paiement a été confirmé en priorité. Les réservations en attente concurrentes ont été annulées.",
      }),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// GET ALL PAYMENTS
const getPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.find()
      .populate("user")
      .populate("reservation")
      .populate("chambre")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Liste des paiements récupérée avec succès",
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ─────────────────────────────────────
// GET PAYMENT BY ID
// ─────────────────────────────────────

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await PaymentModel.findById(id)
      .populate("reservation_id")
      .populate("chambre_id");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Paiement introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};
// ─────────────────────────────────────
// GET SUM PAYMENT
// ─────────────────────────────────────


const getTotalPayments = async (req, res) => {
  try {

    const result = await PaymentModel.aggregate([
      {
        $group: {
          _id: null,
          totalMontantPaye: {
            $sum: "$montant_paye"
          }
        }
      }
    ]);

    const total = result[0]?.totalMontantPaye || 0;

    return res.status(200).json({
      success: true,
      totalMontantPaye: total
    });

  } catch (error) {

    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};

// ─────────────────────────────────────
// GET SUM  PAYMENT FOR THIS MONTH
// ─────────────────────────────────────
const getTotalPaymentsThisMonth = async (req, res) => {
  console.log('getTotalPaymentsThisMonth')
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const result = await PaymentModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          totalMontantPaye: {
            $sum: "$montant_paye"
          }
        }
      }
    ]);

    const total = result[0]?.totalMontantPaye || 0;

    return res.status(200).json({
      success: true,
      totalMontantPaye: total
    });

  } catch (error) {

    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};

// ─────────────────────────────────────
// GET PENDING PAYMENTS THIS MONTH
// ─────────────────────────────────────
const getPendingPaymentsThisMonth = async (req, res) => {
  try {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const result = await PaymentModel.aggregate([
      {
        $match: {
          status: "pending", // adapte selon ton champ
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          totalPending: {
            $sum: "$montant_paye"
          }
        }
      }
    ]);

    const total = result[0]?.totalPending || 0;

    return res.status(200).json({
      success: true,
      totalPending: total
    });

  } catch (error) {

    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};

// ─────────────────────────────────────
// UPDATE PAYMENT
// ─────────────────────────────────────

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPayment = await PaymentModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // retourne le document mis à jour
        runValidators: true, // applique les validations du schema
      }
    )
      .populate("reservation_id")
      .populate("chambre_id");

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: "Paiement introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Paiement mis à jour avec succès",
      payment: updatedPayment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────
// DELETE PAYMENT
// ─────────────────────────────────────

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await PaymentModel.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Paiement introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Paiement supprimé avec succès",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    getTotalPayments ,
    getPendingPaymentsThisMonth,
    getTotalPaymentsThisMonth,
};





