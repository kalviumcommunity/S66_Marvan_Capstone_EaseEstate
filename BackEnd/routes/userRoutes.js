const express = require("express");
const userRoutes = express.Router();
const { registerUser, loginUser, getAllUsers, addToFavorites, removeFromFavorites, getUserFavorites, addToWishlist, removeFromWishlist, getUserWishlist } = require("../controllers/userController.js");

userRoutes.post("/signup" , registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/" , getAllUsers);

// Favorites routes
userRoutes.post("/:userId/favorites/:propertyId", addToFavorites);
userRoutes.delete("/:userId/favorites/:propertyId", removeFromFavorites);
userRoutes.get("/:userId/favorites", getUserFavorites);

// Wishlist routes
userRoutes.post("/:userId/wishlist/:propertyId", addToWishlist);
userRoutes.delete("/:userId/wishlist/:propertyId", removeFromWishlist);
userRoutes.get("/:userId/wishlist", getUserWishlist);

module.exports = userRoutes;
