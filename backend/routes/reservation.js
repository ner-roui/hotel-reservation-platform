


const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createReservation, 
  getAllReservations,
  getUserReservations,
  getReservationById,
} = require("../controllers/reservationController");

router.post("/reservations/:roomId",auth, createReservation);
router.get("/reservations", auth, getAllReservations);
router.get("/reservations/me", auth, getUserReservations);
router.get("/reservations/:id", auth, getReservationById);



module.exports = router;