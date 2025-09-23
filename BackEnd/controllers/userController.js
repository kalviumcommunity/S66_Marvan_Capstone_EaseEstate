const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
        name,
        email,
        password: hashedPassword
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email} });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add property to user's favorites
const addToFavorites = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if property is already in favorites
        if (user.favorites.includes(propertyId)) {
            return res.status(400).json({ error: "Property already in favorites" });
        }

        user.favorites.push(propertyId);
        await user.save();

        const updatedUser = await User.findById(userId).populate('favorites');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove property from user's favorites
const removeFromFavorites = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.favorites = user.favorites.filter(fav => fav.toString() !== propertyId);
        await user.save();

        const updatedUser = await User.findById(userId).populate('favorites');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user's favorites
const getUserFavorites = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add property to user's wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if property is already in wishlist
        if (user.wishlist.includes(propertyId)) {
            return res.status(400).json({ error: "Property already in wishlist" });
        }

        user.wishlist.push(propertyId);
        await user.save();

        const updatedUser = await User.findById(userId).populate('wishlist');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove property from user's wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.wishlist = user.wishlist.filter(item => item.toString() !== propertyId);
        await user.save();

        const updatedUser = await User.findById(userId).populate('wishlist');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user's wishlist
const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('wishlist');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {registerUser, loginUser, getAllUsers, addToFavorites, removeFromFavorites, getUserFavorites, addToWishlist, removeFromWishlist, getUserWishlist};
