const express = require("express");
const userRoutes = express.Router();
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController.js");

userRoutes.post("/signup" , registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/" , getAllUsers);

module.exports = userRoutes;
