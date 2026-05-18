const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { register, login, logout, getuserData } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getuserdata",auth, getuserData);

module.exports = router;