const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { register, login, logout, getuserData,
    getUsers, createUser, deleteUser,
    updateUser, getClients } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getuserdata",auth, getuserData);
router.get("/users", getUsers);
router.post("/users/createuser", createUser);
router.get("users/clients", getClients);
router.put("/users/updateuser/:id", updateUser);
router.delete("/users/deleteuser/:id", deleteUser);

module.exports = router;