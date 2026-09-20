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
router.post(
  "/generate",
  protect,
  adminOnly,
  generateMockTest
);

// Create mock test manually
router.post(
  "/",
  protect,
  adminOnly,
  createMockTest
);

// Get single mock test
router.get("/:id", getMockTestById);

module.exports = router;