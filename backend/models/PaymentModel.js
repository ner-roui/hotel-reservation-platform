const { Schema, model } = require("mongoose");

// ─────────────────────────────────────────────────────────────
// Sous-schéma facture
// ─────────────────────────────────────────────────────────────

const factureSchema = new Schema(
  {
    numero_facture: {
      type: String,
      trim: true,
    },

    url_pdf: {
      type: String,
      trim: true,
    },

    genere_le: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────
// Schéma Payment
// ─────────────────────────────────────────────────────────────

const paymentSchema = new Schema(
  {
    // Relation réservation
    reservation_id: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },

    // Relation chambre
    chambre_id: {
      type: Schema.Types.ObjectId,
      ref: "Chambre",
      required: true,
    },

    // Informations client
    client_nom: {
      type: String,
      trim: true,
      required: true,
    },

    client_prenom: {
      type: String,
      trim: true,
      required: true,
    },

    client_email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Montants
    montant_total: {
      type: Number,
      required: true,
      min: 0,
    },

    montant_paye: {
      type: Number,
      default: 0,
      min: 0,
    },

    montant_restant: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxe: {
      type: Number,
      default: 0,
      min: 0,
    },

    reduction: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Méthode paiement
    methode: {
      type: String,
      enum: [
        "Espèces",
        "Carte bancaire",
        "PayPal",
        "Virement bancaire",
        "Stripe",
      ],
      required: true,
    },

    // Statut paiement
    statut: {
      type: String,
      enum: [
        "En attente",
        "Partiellement payé",
        "Payé",
        "Remboursé",
        "Échoué",
      ],
      default: "En attente",
    },

    // Référence transaction
    transaction_id: {
      type: String,
      trim: true,
    },

    // Dates
    date_paiement: {
      type: Date,
      default: Date.now,
    },

    date_limite: {
      type: Date,
    },

    // Facture
    facture: {
      type: factureSchema,
      default: null,
    },

    // Notes admin
    notes: {
      type: String,
      trim: true,
    },

    // Employé ayant validé
    valide_par: {
      type: String,
      trim: true,
    },
  },

  // reservation_active: {
//   reservation_id,
//   client_nom,
//   date_checkin,
//   date_checkout,
// },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────

paymentSchema.index({ reservation_id: 1 });
paymentSchema.index({ chambre_id: 1 });
paymentSchema.index({ statut: 1 });
paymentSchema.index({ methode: 1 });
paymentSchema.index({ date_paiement: -1 });

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

const PaymentModel = model("Payment", paymentSchema);

module.exports = PaymentModel;