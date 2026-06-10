const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const https = require("https");
const dns = require("dns");
const cookieParser = require("cookie-parser");
require("dotenv").config();

dns.setDefaultResultOrder("ipv4first");

const chambreRoutes    = require("./routes/chambreRoutes");
const authRoutes       = require("./routes/userRoutes");
const reservationRoute = require("./routes/reservation");
const paymentRoute     = require("./routes/paymentRoutes");

const PORT       = process.env.PORT || 3000;
const RENDER_URL = "https://hotel-reservation-platform-dgtp.onrender.com";

const app = express();

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────

const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      "https://hotel-reservation-platform-one.vercel.app",
      "https://hotel-reservation-platform-lum.vercel.app",
      "http://localhost:5173",
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("(.*)", cors(corsOptions)); // ← fix: (.*) au lieu de *

// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// Static uploads
// ─────────────────────────────────────────────

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.use("/api/chambres",     chambreRoutes);
app.use("/api/auth",         authRoutes);
app.use("/api/reservations", reservationRoute);
app.use("/api/payments",     paymentRoute);

app.get("/", (req, res) => {
  res.json({ message: "API running ✅" });
});

// ─────────────────────────────────────────────
// Keep-alive (empêche Render de mettre en sleep)
// ─────────────────────────────────────────────

function startKeepAlive() {
  setInterval(() => {
    https
      .get(`${RENDER_URL}/`, (res) => {
        console.log(`[keep-alive] ping → ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error("[keep-alive] erreur:", err.message);
      });
  }, 14 * 60 * 1000);
}

// ─────────────────────────────────────────────
// MongoDB + démarrage
// ─────────────────────────────────────────────

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      if (process.env.NODE_ENV === "production") {
        startKeepAlive();
      }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });