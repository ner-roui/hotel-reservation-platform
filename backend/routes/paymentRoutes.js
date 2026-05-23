const express = require("express");

const router = express.Router();
const auth = require('../middleware/auth')

const {
  createPayment,
  getTotalPayments,
  getPendingPayments,
  getTotalPaymentsThisMonth
} = require("../controllers/payment");

// CREATE PAYMENT
router.post("/createpayment/:id", auth, createPayment);

// CALCUL SUM  PAYMENT
router.get("/payments/total", getTotalPayments);

// CALCUL SUM  PAYMENT FOR THIS MONTH
router.get("/payments/total-month", getTotalPaymentsThisMonth);

// PENDING  PAYMENT
router.get("/payments/pending", getPendingPayments);


module.exports = router;