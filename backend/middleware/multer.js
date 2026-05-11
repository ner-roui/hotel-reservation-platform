const express = require("express");
const multer = require("multer");
const ChambreModel = require("../models/Chambre");

const router = express.Router();

// ─────────────────────────────────────────────
// Multer config
// ─────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/chambres");
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Images uniquement"));
    }
  },
});
