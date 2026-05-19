


const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createReservation, 
  getAllReservations,
  getUserReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  cancelReservation
} = require("../controllers/reservation");


router.post("/:roomId", auth,createReservation);
router.get("/getallreservations", auth, getAllReservations);
router.get("/myreservation", auth, getUserReservations);
router.get("/reservationbyid/:id", auth, getReservationById);
router.put("/updatereservation/:id", auth, updateReservation);
router.delete("/deletereservation/:id", auth, deleteReservation);
router.patch("/cancel/:id", auth, cancelReservation);



module.exports = router;