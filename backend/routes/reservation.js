


const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createReservation, 
   checkInReservation,
  getAllReservations,
  getUserReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  cancelReservation,
  checkOutReservation,
  getReservationsAnnule,
  getMonthlyRevenue
} = require("../controllers/reservation");


router.post("/:roomId", auth,createReservation);
router.get("/getallreservations", auth, getAllReservations);
router.get("/getreservationsannule", getReservationsAnnule);
router.get("/myreservation", auth, getUserReservations);
router.get("/monthly-revenue", getMonthlyRevenue);
router.get("/reservationbyid/:id", auth, getReservationById);
router.put("/updatereservation/:id", auth, updateReservation);
router.delete("/deletereservation/:id", auth, deleteReservation);
router.patch("/cancel/:id", auth, cancelReservation);
router.patch("/checkin/:id", auth, checkInReservation);
router.patch("/checkout/:id", auth, checkOutReservation);

module.exports = router;