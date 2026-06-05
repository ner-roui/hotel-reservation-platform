// routes/chambreRoutes.js

const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const upload = require("../middleware/multer");
const {addRoom ,
        getAllRooms,
        getRoomById,
        getAvailableRooms,
        getRoomsToClean,
        getCleanedRooms,
        cleanRoom,
        updateRoomStatus,
        getOccupiedRooms ,
        getChambresDisponibles,
        updateRoom  ,deleteRoom,
        getUnavailableDates
} = require("../controllers/chambre");

// ADD ROOM
router.post("/add-room",auth, isAdmin, upload.array("images", 10), addRoom);

// GET all
router.get("/get-room", getAllRooms);

// GET disponibles
router.get('/disponibles', getChambresDisponibles);

// GET available
router.get("/available", getAvailableRooms);


// GET not-available
router.get("/not-available", getOccupiedRooms);

// GET to-clean
router.get("/to-clean", getRoomsToClean);


// GET cleaned
router.get("/cleaned", getCleanedRooms);

router.get("/unavailable-dates/:id", getUnavailableDates);


// PUT ROOM CLEAN
router.put("/clean/:id", cleanRoom);


// GET by id
router.get("/:id", getRoomById);


// UPDATE ROOM
router.put("/update-room/:id",upload.array("images", 10),updateRoom);

// UPDATE STATUS ROOM
router.patch("/status/:id", updateRoomStatus);

// DELETE ROOM
router.delete("/delete/:id", deleteRoom);



module.exports = router;