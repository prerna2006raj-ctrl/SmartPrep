
const express = require("express");
const router = express.Router();

const {
  getQuestions,
  createQuestion,
} = require("../controllers/questionController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Retrieve Question Bank questions
router.get("/", getQuestions);

// Add questions (admin only)
router.post("/", protect, adminOnly, createQuestion);

module.exports = router;