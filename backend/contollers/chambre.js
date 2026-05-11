// controllers/chambreController.js

const ChambreModel = require("../models/RoomModels");

// ─────────────────────────────────────────────
// ADD ROOM
// ─────────────────────────────────────────────

exports.addRoom = async (req, res) => {
  try {
    const {
      numero,
      type,
      etage,
      capacite,
      superficie,
      vue,
      prix_nuit,
      prix_week,
      statut,
    } = req.body;

    // validation simple
    if (!numero || !type || !capacite || !prix_nuit || !prix_week) {
      return res.status(400).json({
        message: "Champs obligatoires manquants",
      });
    }

    // images
    const images = req.files?.map(
      (file) => `/uploads/chambres/${file.filename}`
    ) || [];

    // equipements
    let equipements = [];

    if (req.body.equipements) {
      const parsed = JSON.parse(req.body.equipements);

      equipements = parsed.map((nom) => ({
        nom,
        disponible: true,
      }));
    }

    // create room
    const chambre = await ChambreModel.create({
      numero,
      type,
      etage: etage || 0,
      capacite,
      superficie: superficie || 0,
      vue,
      prix_nuit,
      prix_week,
      statut: statut || "Disponible",
      images,
      equipements,
    });

    return res.status(201).json({
      message: "Chambre créée",
      chambre,
    });

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Chambre déjà existante",
      });
    }

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};