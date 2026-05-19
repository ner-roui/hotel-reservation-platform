const { Schema, model } = require("mongoose");

// ─────────────────────────────────────────────────────────────
// Sous-schémas
// ─────────────────────────────────────────────────────────────

const equipementSchema = new Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    disponible: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const nettoyageSchema = new Schema(
  {
    statut: {
      type: String,
      enum: ["En attente", "En cours", "Fait"],
      default: "Fait",
    },

    demande_le: {
      type: Date,
      default: Date.now,
    },

    fait_le: Date,

    agent: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const maintenanceSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    statut: {
      type: String,
      enum: ["Planifiée", "En cours", "Terminée"],
      default: "Planifiée",
    },

    debut: {
      type: Date,
      default: Date.now,
    },

    fin: Date,

    technicien: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const reservationActiveSchema = new Schema(
  {
    reservation_id: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },

    client_nom: {
      type: String,
      trim: true,
    },

    client_prenom: {
      type: String,
      trim: true,
    },

    client_avatar: String,

    date_checkin: Date,

    date_checkout: Date,

    paymentStatus: {
        type: String,
        enum: ["UNPAID", "PAID"],
        default: "UNPAID",
      },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    montant: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────
// Schéma principal
// ─────────────────────────────────────────────────────────────

const chambreSchema = new Schema(
  {
    // Identification
    numero: {
      type: String,
      required: true,
      trim: true,
    },

    // hotel_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Hotel",
    //   required: true,
    // },

    // Informations chambre
    type: {
      type: String,
      enum: [
        "Standard",
        "Supérieure",
        "Deluxe",
        "Suite",
        "Suite Présidentielle",
      ],
      required: true,
    },

    etage: {
      type: Number,
      min: 0,
    },

    capacite: {
      type: Number,
      required: true,
      min: 1,
    },

    superficie: {
      type: Number,
      min: 0,
    },

    vue: {
      type: String,
      trim: true,
    },

    // Prix \ jour
    prix_nuit: {
      type: Number,
      required: true,
      min: 0,
    },

    // Prix \ semaine
    prix_week: {
      type: Number,
      required: true,
      min: 0,
    },


    // Statut
    statut: {
      type: String,
      enum: ["Disponible", "Occupée", "À nettoyer", "Maintenance", "Inactive"],
      default: "Disponible",
    },

    // Images
    images: {
      type: [String],
      default: [],
    },

    // Equipements
    equipements: {
      type: [equipementSchema],
      default: [],
    },

    // Réservation active
    reservation_active: {
      type: [reservationActiveSchema],
      default: [],
    },

    // Historique nettoyages
    nettoyages: {
      type: [nettoyageSchema],
      default: [],
    },

    // Historique maintenances
    maintenances: {
      type: [maintenanceSchema],
      default: [],
    },

    // Evaluation
    meta: {
      note_moyenne: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      total_avis: {
        type: Number,
        default: 0,
        min: 0,
      },

      total_sejours: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Disponibilité
    disponible_reservation: {
      type: Boolean,
      default: true,
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

// Une chambre unique par hôtel
chambreSchema.index(
  { hotel_id: 1, numero: 1 },
  { unique: true }
);

// Optimisation recherches
chambreSchema.index({ statut: 1 });
chambreSchema.index({ type: 1 });
chambreSchema.index({ prix_nuit: 1 });

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

ChambreModel = model("Chambre", chambreSchema);
module.exports = ChambreModel;