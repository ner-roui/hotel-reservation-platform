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

const PORT = process.env.PORT || 3000;

// const chambresRoutes = require("./routes/chambres");

const app = express();

// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────



// ─── CORS ───────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      "http://localhost:5173",
    ];

    // ✅ Accepte TOUTES les URLs Vercel de ton projet
    const vercelRegex = /^https:\/\/hotel-reservation-platform[a-z0-9-]*\.vercel\.app$/;

    if (!origin || allowed.includes(origin) || vercelRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// app.options("/(.*)", cors());



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

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error");
    console.error(err);
  });