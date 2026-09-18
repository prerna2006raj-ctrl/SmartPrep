const express = require("express");
const router = express.Router();
const {
  solveDoubt,
  evaluateAnswer,
  generateStudyPlan,
} = require("../controllers/aiController");

router.post("/solve-doubt", solveDoubt);
router.post("/evaluate-answer", evaluateAnswer);
router.post("/generate-study-plan", generateStudyPlan);

module.exports = router;
