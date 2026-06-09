// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const dns = require("dns");
cookieParser = require("cookie-parser")
dns.setDefaultResultOrder("ipv4first");
const chambreRoutes = require("./routes/chambreRoutes");

const authRoutes = require("./routes/userRoutes");
const reservationRoute = require("./routes/reservation");
const paymentRoute = require("./routes/paymentRoutes")



// const chambresRoutes = require("./routes/chambres");

const app = express();

// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────

app.use(
  cors({
    origin: ["http://localhost:5173", "https://hotel-reservation-platform-one.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/chambres", chambreRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoute);
app.use("/api/payments", paymentRoute);
// ─────────────────────────────────────────────
// Static uploads
// ─────────────────────────────────────────────

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// app.use("/api/chambres", chambresRoutes);

// ─────────────────────────────────────────────
// Test route
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "API running ",
  });
});

// ─────────────────────────────────────────────
// MongoDB connection
// ─────────────────────────────────────────────


console.log('process env' , process.env.MONGO_URI);
mongoose
    
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(3000, () => {
      console.log(" Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error");
    console.error(err);
  });