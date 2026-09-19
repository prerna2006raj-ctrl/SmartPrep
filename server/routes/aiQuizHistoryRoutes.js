const express = require("express");
const router = express.Router();

const {
  saveQuizHistory,
  getQuizHistory,
  clearQuizHistory,
} = require("../controllers/aiQuizHistoryController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, saveQuizHistory);
router.get("/", protect, getQuizHistory);
router.delete("/", protect, clearQuizHistory);

module.exports = router;
