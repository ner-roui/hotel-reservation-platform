const PaymentModel = require("../models/PaymentModel");
const ReservationModel = require("../models/ReservationModel");
const ChambreModel = require("../models/RoomModels");

const createPayment = async (req, res) => {
  try {
    const {
      reservation_id,
      chambre_id,
      client_nom,
      client_prenom,
      client_email,
      montant_total,
      montant_paye,
      taxe,
      reduction,
      methode,
      transaction_id,
      date_limite,
      notes,
      valide_par,
    } = req.body;

    // ─────────────────────────────────────
    // Vérifications
    // ─────────────────────────────────────

    if (
      !reservation_id ||
      !chambre_id ||
      !client_nom ||
      !client_prenom ||
      !montant_total ||
      !methode
    ) {
      return res.status(400).json({
        message: "Tous les champs obligatoires sont requis",
      });
    }

    // Vérifier réservation
    const reservation = await ReservationModel.findById(reservation_id);

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    // Vérifier chambre
    const chambre = await ChambreModel.findById(chambre_id);

    if (!chambre) {
      return res.status(404).json({
        message: "Chambre introuvable",
      });
    }

    // ─────────────────────────────────────
    // Calculs
    // ─────────────────────────────────────

    const totalPaye = montant_paye || 0;

    const totalTaxe = taxe || 0;

    const totalReduction = reduction || 0;

    const montantFinal =
      montant_total + totalTaxe - totalReduction;

    const montantRestant =
      montantFinal - totalPaye;

    // ─────────────────────────────────────
    // Statut automatique
    // ─────────────────────────────────────

    let statut = "En attente";

    if (totalPaye > 0 && totalPaye < montantFinal) {
      statut = "Partiellement payé";
    }

    if (totalPaye >= montantFinal) {
      statut = "Payé";
    }

    // ─────────────────────────────────────
    // Création payment
    // ─────────────────────────────────────

    const payment = await PaymentModel.create({
      reservation_id,
      chambre_id,

      client_nom,
      client_prenom,
      client_email,

      montant_total: montantFinal,
      montant_paye: totalPaye,
      montant_restant: montantRestant,

      taxe: totalTaxe,
      reduction: totalReduction,

      methode,
      statut,

      transaction_id,

      date_limite,

      notes,
      valide_par,
    });

    // ─────────────────────────────────────
    // Mise à jour réservation
    // ─────────────────────────────────────

    if (statut === "Payé") {
      reservation.paymentStatus = "PAID";
    } else {
      reservation.paymentStatus = "UNPAID";
    }

    await reservation.save();

    // ─────────────────────────────────────
    // Response
    // ─────────────────────────────────────

    return res.status(201).json({
      success: true,
      message: "Paiement créé avec succès",
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

module.exports = {
  createPayment,
};