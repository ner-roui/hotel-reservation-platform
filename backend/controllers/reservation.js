const Reservation = require("../models/ReservationModel");
const RoomModel = require("../models/RoomModels");

/**
 * CREATE RESERVATION
 */

const createReservation = async (req, res) => {
  try {
    const { userId } = req.user;
    const { roomId } = req.params;
    const { arrivee, depart, prixParNuit } = req.body;

    const room = await RoomModel.findById(roomId);

    const start = new Date(arrivee);
    const end = new Date(depart);

    // 1. CHECK OVERLAP DANS ARRAY
    const isOverlap = room.reservation_active?.some((r) => {
      const checkin = new Date(r.date_checkin);
      const checkout = new Date(r.date_checkout);
      const payment = r.paymentStatus;

      return start < checkout && end > checkin && payment === "PAID";
    });

    if (isOverlap) {
      return res.status(400).json({
        message: "Chambre déjà réservée pour cette période",
      });
    }

    // 2. calcul nuits
    const nuits = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nuits <= 0) {
      return res.status(400).json({
        message: "Dates invalides",
      });
    }

    const total = nuits * prixParNuit;

    // 3. create reservation
    const reservation = await Reservation.create({
       user: userId,
      chambre: roomId,
      arrivee: start,
      depart: end,
      nuits,
      prixParNuit,
      total,
      status: "PENDING",
      paymentStatus: "UNPAID",
    });

    // 4. push dans room array
  await RoomModel.findByIdAndUpdate(roomId, {
    $push: {
      reservation_active: {
        reservation_id: reservation._id,
        date_checkin: start,
        date_checkout: end,
        montant: total
      }
    }
  });

    return res.status(201).json({
      message: "Réservation créée avec succès",
      reservation,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};



export const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    if (reservation.user.toString() !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    if (reservation.status === "CANCELLED") {
      return res.status(400).json({ message: "Déjà annulée" });
    }

    if (reservation.status === "COMPLETED") {
      return res.status(400).json({ message: "Réservation terminée, impossible d'annuler" });
    }

    // 1. update reservation principale
    reservation.status = "CANCELLED";
    reservation.cancelledAt = new Date();
    reservation.cancelledBy = userId;

    await reservation.save();

    // 2. update reservationActive (snapshot chambre)
    await Chambre.updateOne(
      { "reservation_active.reservation_id": reservation._id },
      {
        $set: {
          "reservation_active.$.status": "CANCELLED",
          "reservation_active.$.cancelledAt": reservation.cancelledAt,
          "reservation_active.$.cancelledBy": userId,
        },
      }
    );

    return res.status(200).json({
      message: "Réservation annulée avec succès",
      reservation,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "-password")
      .populate("chambre");

    res.status(200).json({
      message: "Liste des réservations",
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.user;

    const reservations = await Reservation.find({ user: userId })
      .populate("chambre")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Réservations utilisateur",
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate("user", "-password")
      .populate("chambre");

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    res.status(200).json({
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


/**
 * UPDATE RESERVATION
 */
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const { arrivee, depart, prixParNuit } = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    // recalcul dates si modifiées
    let start = reservation.arrivee;
    let end = reservation.depart;

    if (arrivee) start = new Date(arrivee);
    if (depart) end = new Date(depart);

    const nuits = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    if (nuits <= 0) {
      return res.status(400).json({
        message: "Dates invalides",
      });
    }

    const price = prixParNuit || reservation.prixParNuit;
    const total = nuits * price;

    reservation.arrivee = start;
    reservation.depart = end;
    reservation.nuits = nuits;
    reservation.prixParNuit = price;
    reservation.total = total;

    await reservation.save();

    res.status(200).json({
      message: "Réservation mise à jour",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


/**
 * DELETE RESERVATION
 */

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    await Reservation.findByIdAndDelete(id);

    res.status(200).json({
      message: "Réservation supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};



module.exports = { createReservation, 
  getAllReservations,
  getUserReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  cancelReservation
 };