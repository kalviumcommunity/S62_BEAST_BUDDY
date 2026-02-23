const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create user
    const user = await User.create({ name, email, password });
    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        spiritAnimal: user.spiritAnimal,
        confidenceScore: user.confidenceScore,
        streak: user.streak,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        spiritAnimal: user.spiritAnimal,
        confidenceScore: user.confidenceScore,
        streak: user.streak,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /auth/quiz-history
 * Fetch user's quiz history (AnimalMatch records)
 */
router.get("/quiz-history", authMiddleware, async (req, res) => {
  try {
    const AnimalMatch = require("../models/AnimalMatch");
    const matches = await AnimalMatch.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 matches

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (err) {
    console.error("Get quiz history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /auth/update-profile
 * Update user profile (name, preferences, streak, etc.)
 */
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, preferences, streak, lastQuizDate, avatar } = req.body;
    const updateData = {};

    // Only update provided fields
    if (name) updateData.name = name;
    if (preferences) updateData.preferences = preferences;
    if (streak !== undefined) updateData.streak = streak;
    if (lastQuizDate) updateData.lastQuizDate = lastQuizDate;
    // Allow avatar updates (string URL or base64 data)
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
