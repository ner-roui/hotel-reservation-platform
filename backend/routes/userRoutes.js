const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { register, login, logout, getuserData,
    getUsers, createUser, deleteUser} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getuserdata",auth, getuserData);
router.get("/users", getUsers);
router.post("/users/createuser", createUser);
router.delete("/users/deleteuser/:id", deleteUser);
module.exports = router;