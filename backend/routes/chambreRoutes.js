// routes/chambreRoutes.js

const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const {addRoom ,
        getAllRooms,
        getRoomById,
        getAvailableRooms,
        getRoomsToClean,
        getCleanedRooms,
        updateRoom  ,deleteRoom
} = require("../controllers/chambre");

// ADD ROOM
router.post("/add-room",upload.array("images", 10),addRoom);

// GET all
router.get("/get-room", getAllRooms);

// GET available
router.get("/available", getAvailableRooms);

// GET to-clean
router.get("/to-clean", getRoomsToClean);

// GET cleaned
router.get("/cleaned", getCleanedRooms);

// GET by id
router.get("/:id", getRoomById);


// UPDATE ROOM
router.put("/update-room/:id",upload.array("images", 10),updateRoom);


// DELETE ROOM
router.delete("/delete/:id", deleteRoom);


module.exports = router;