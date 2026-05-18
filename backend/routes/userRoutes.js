const express = require("express");
const router = express.Router();

const { register, login, logout, getuserData } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// router.get("/getuserdata", getuserData);

module.exports = router;