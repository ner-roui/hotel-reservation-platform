const express = require("express");

const router = express.Router();
const auth = require('../middleware/auth')

const {
  createPayment,
  getTotalPayments,
  getPendingPaymentsThisMonth,
  getTotalPaymentsThisMonth
} = require("../controllers/payment");

// CREATE PAYMENT
router.post("/createpayment/:id", auth, createPayment);

// CALCUL SUM  PAYMENT
router.get("/total", getTotalPayments);

// CALCUL SUM  PAYMENT FOR THIS MONTH
router.get("/total-month", getTotalPaymentsThisMonth);

// PENDING  PAYMENT
router.get("/pending", getPendingPaymentsThisMonth);


module.exports = router;