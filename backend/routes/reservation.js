


const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createReservation, 
  getAllReservations,
  getUserReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} = require("../controllers/reservation");

router.post("/:roomId", createReservation);
router.get("/getallreservations", auth, getAllReservations);
router.get("/myreservation", auth, getUserReservations);
router.get("/reservationbyid/:id", auth, getReservationById);
router.put("/updatereservation/:id", auth, updateReservation);
router.delete("/deletereservation/:id", auth, deleteReservation);



module.exports = router;