const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
const authMiddleware = (req, res, next) => {
  // Use lowercase 'authorization' from req.headers
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(' ')[1]; // get token part after "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id: user._id }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create user
    const user = await User.create({ name, email, password });
    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
  router.post("/login", async (req, res) => {
  const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
