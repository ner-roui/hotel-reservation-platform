// controllers/chambreController.js

const ChambreModel = require("../models/RoomModels");

// ─────────────────────────────────────────────
// ADD ROOM
// ─────────────────────────────────────────────

addRoom = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
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



// ─────────────────────────────────────────────
// GET ALL ROOMS
// ─────────────────────────────────────────────

getAllRooms = async (req, res) => {
  try {
    const chambres = await ChambreModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Liste des chambres",
      count: chambres.length,
      chambres,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

// ─────────────────────────────────────────────
// GET ROOM BY ID
// ─────────────────────────────────────────────

getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const chambre = await ChambreModel.findById(id)

    if (!chambre) {
      return res.status(404).json({
        message: "Chambre introuvable",
      });
    }

    return res.status(200).json({
      message: "Chambre trouvée",
      chambre,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};



// ─────────────────────────────────────────────
// GET AVAILABLE ROOMS
// ─────────────────────────────────────────────

getAvailableRooms = async (req, res) => {
  try {
    const chambres = await ChambreModel.find({
      statut: "Disponible",
      disponible_reservation: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Chambres disponibles",
      count: chambres.length,
      chambres,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};


// ─────────────────────────────────────────────
// GET NOT CLEANING ROOMS
// ─────────────────────────────────────────────

getRoomsToClean = async (req, res) => {
  try {
    const chambres = await ChambreModel.find({
      statut: "À nettoyer",
      disponible_reservation: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Chambres disponibles",
      count: chambres.length,
      chambres,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

// ─────────────────────────────────────────────
// GET CLEANING ROOMS
// ─────────────────────────────────────────────

getCleanedRooms = async (req, res) => {
  try {
    const chambres = await ChambreModel.find({
      statut: "Disponible",
    }).sort({ updatedAt: -1 }).limit(10);

    res.json(chambres);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

// ─────────────────────────────────────────────
// UPDATE ROOM
// ─────────────────────────────────────────────

updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

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

    // check room
    const chambre = await ChambreModel.findById(id);

    if (!chambre) {
      return res.status(404).json({
        message: "Chambre introuvable",
      });
    }

    // images
    let images = chambre.images;

    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `/uploads/chambres/${file.filename}`
      );
    }

    // equipements
    let equipements = chambre.equipements;

    if (req.body.equipements) {
      const parsed = JSON.parse(req.body.equipements);

      equipements = parsed.map((nom) => ({
        nom,
        disponible: true,
      }));
    }

    // update
    const updatedRoom = await ChambreModel.findByIdAndUpdate(
      id,
      {
        numero,
        type,
        etage,
        capacite,
        superficie,
        vue,
        prix_nuit,
        prix_week,
        statut,
        images,
        equipements,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Chambre mise à jour",
      chambre: updatedRoom,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

// ─────────────────────────────────────────────
// DELETE ROOM
// ─────────────────────────────────────────────

deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const chambre = await ChambreModel.findById(id);

    if (!chambre) {
      return res.status(404).json({
        message: "Chambre introuvable",
      });
    }

    await ChambreModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Chambre supprimée",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};




module.exports = {addRoom, getAllRooms, getRoomById, getAvailableRooms , getRoomsToClean ,getCleanedRooms , updateRoom  ,deleteRoom }
