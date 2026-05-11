// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const chambresRoutes = require("./routes/chambres");

const app = express();

// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

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

app.use("/api/chambres", chambresRoutes);

// ─────────────────────────────────────────────
// Test route
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "API running 🚀",
  });
});

// ─────────────────────────────────────────────
// MongoDB connection
// ─────────────────────────────────────────────

mongoose
  

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });

  .catch((err) => {
    console.error("❌ MongoDB error");
    console.error(err);
  });