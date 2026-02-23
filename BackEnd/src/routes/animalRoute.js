const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");

/**
 * GET /api/animals
 * Fetch all animals
 * Query params: ?sort=name, ?tags=predator,land
 */
router.get("/", async (req, res) => {
  try {
    const { sort = "name" } = req.query;

    let query = Animal.find();

    // Optional: filter by tags if provided
    if (req.query.tags) {
      const tagArray = req.query.tags.split(",").map((t) => t.trim());
      query = query.where("tags").in(tagArray);
    }

    // Sort results
    if (sort === "name") {
      query = query.sort({ name: 1 });
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    }

    const animals = await query.exec();

    res.status(200).json({
      success: true,
      count: animals.length,
      data: animals,
    });
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch animals",
    });
  }
});

/**
 * GET /api/animals/:id
 * Fetch a single animal by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid animal ID",
      });
    }

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: animal,
    });
  } catch (error) {
    console.error("Error fetching animal:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch animal",
    });
  }
});

module.exports = router;
