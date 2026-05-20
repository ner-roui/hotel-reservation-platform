const express = require("express");

const router = express.Router();
const auth = require('../middleware/auth')

const {
  createPayment,
} = require("../controllers/payment");

// CREATE PAYMENT
router.post("/createpayment/:id", auth, createPayment);

module.exports = router;