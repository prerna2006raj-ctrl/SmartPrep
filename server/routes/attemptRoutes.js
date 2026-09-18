const express = require("express");
const router = express.Router();
const {
  recordAttempt,
  getMyAttempts,
} = require("../controllers/attemptController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, recordAttempt);
router.get("/", protect, getMyAttempts);

module.exports = router;
