// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["Admin", "Réception", "Client"],
      default: "Client",
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Actif", "Inactif"],
      default: "Actif"
    },
    
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation"
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser login
// userSchema.index({ email: 1 });

const UserModel =  mongoose.model("User", userSchema);
module.exports = UserModel