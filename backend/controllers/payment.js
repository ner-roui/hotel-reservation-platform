const PaymentModel = require("../models/PaymentModel");
const ReservationModel = require("../models/ReservationModel");
const ChambreModel = require("../models/RoomModels");


const createPayment = async (req, res) => {
  try {
    
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
        message: "ID réservation manquant",
      });
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
      reservationData.status = "CONFIRMED";

    console.log('reservationdata', reservationData )

    if (!reservationData) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    // Vérifier chambre
    const chambre = await ChambreModel.findById(
      reservationData.chambre._id
    );

    if (!chambre) {
      return res.status(404).json({
        message: "Chambre introuvable",
      });
    }

    // Calculs
    const montant_total =
      reservationData.total + taxe - reduction;

    // const montant_restant =
    //   montant_total - montant_paye;

    // Statut paiement
    let statut = "En attente";

    if (montant_paye === 0) {
      statut = "En attente";
    } else if (montant_paye < montant_total) {
      statut = "Partiellement payé";
    } else if (montant_paye >= montant_total) {
      statut = "Payé";
    }

    // Création paiement
    const payment = await PaymentModel.create({
      reservation: reservationData._id,

      chambre: reservationData.chambre._id,

      user: reservationData.user._id,

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
    if (statut === "Payé") {
      reservationData.paymentStatus = "PAID";
    } else {
      reservationData.paymentStatus = "UNPAID";
    }

    reservationData.paymentMethod = methode;

    await reservationData.save();

    // Mise à jour chambre
    chambre.reservation_active =
      chambre.reservation_active.map((item) => {
        if (
          item.reservation_id.toString() ===
          reservationData._id.toString()
        ) {
          return {
            ...item.toObject(),
            paymentStatus:
              statut === "Payé"
                ? "PAID"
                : "UNPAID",
          };
        }

        return item;
      });
    
    chambre.statut = "Occupée";
    await chambre.save();

    res.status(201).json({
      message: "Paiement créé avec succès",
      payment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
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

    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
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
};





