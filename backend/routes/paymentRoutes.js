const express = require("express");

const router = express.Router();
const auth = require('../middleware/auth')

const {
  createPayment,
  getTotalPayments,
} = require("../controllers/payment");

// CREATE PAYMENT
router.post("/createpayment/:id", auth, createPayment);

// CALCUL SUM  PAYMENT
router.get("/payments/total", getTotalPayments);
module.exports = router;