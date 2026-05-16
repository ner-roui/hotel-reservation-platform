const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },

    chambre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chambre",
      required: true,
    },

    arrivee: {
      type: Date,
      required: true,
    },

    depart: {
      type: Date,
      required: true,
    },

    nuits: {
      type: Number,
      required: true,
    },

    prixParNuit: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },

    paymentMethod: {
      type: String,
      enum: ["CARD", "CASH", "ONLINE"],
      default: "CARD",
    },
  },
  { timestamps: true }
);

const reservationModel = mongoose.model("Reservation", reservationSchema);

module.exports = reservationModel