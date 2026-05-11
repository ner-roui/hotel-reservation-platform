// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const chambreRoutes = require("./routes/chambreRoutes");

const authRoutes = require("./routes/userRoutes");



// const chambresRoutes = require("./routes/chambres");

const app = express();

// ─────────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────────

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/chambres", chambreRoutes);
app.use("/api/auth", authRoutes);
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