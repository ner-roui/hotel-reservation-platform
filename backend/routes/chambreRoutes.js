// routes/chambreRoutes.js

const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const { addRoom } = require("../controllers/chambre");

// ADD ROOM
router.post("/add-room",upload.array("images", 10),addRoom);

module.exports = router;