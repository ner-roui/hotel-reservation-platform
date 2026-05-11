// routes/chambreRoutes.js

const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const {addRoom ,
        getAllRooms,
        getRoomById,
        getAvailableRooms,
        updateRoom  ,deleteRoom 
} = require("../controllers/chambre");

// ADD ROOM
router.post("/add-room",upload.array("images", 10),addRoom);

// GET all
router.get("/", getAllRooms);


// GET available
router.get("/available", getAvailableRooms);


// GET by id
router.get("/:id", getRoomById);


// UPDATE ROOM
router.put("/:id",upload.array("images", 10),updateRoom);


// DELETE ROOM
router.delete("/:id", deleteRoom);


module.exports = router;