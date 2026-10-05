const express = require("express");

const router = express.Router();

const {
  getMockTests,
  getMockTestById,
  createMockTest,
  generateMockTest,
} = require("../controllers/mockTestController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Get all mock tests
router.get("/", getMockTests);

// Generate mock test automatically
// Normal logged-in users can generate tests
router.post(
  "/generate",
  protect,
  generateMockTest
);

// Create mock test manually
// Only admins can create tests manually
router.post(
  "/",
  protect,
  adminOnly,
  createMockTest
);

// Get single mock test
router.get("/:id", getMockTestById);

module.exports = router;