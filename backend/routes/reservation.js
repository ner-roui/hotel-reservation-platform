const express = require("express");
const router = express.Router();

const { createReservation } = require("../controllers/reservation");

router.post("/reservations/:roomId",authMiddleware,createReservation);

module.exports = router;