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



app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      "http://localhost:5173",
    ];
    // Accepte tous les domaines vercel.app de votre projet
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
// Répondre aux requêtes preflight OPTIONS
app.options("*", cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://hotel-reservation-platform-one.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

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