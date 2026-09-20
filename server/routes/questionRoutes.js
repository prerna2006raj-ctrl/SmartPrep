const express = require("express");

const router = express.Router();

const {
  getQuestions,
  createQuestion,
} = require("../controllers/questionController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.get("/", getQuestions);

router.post("/", protect, adminOnly, createQuestion);

module.exports = router;