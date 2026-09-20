const express = require("express");

const router = express.Router();

const multer = require("multer");

const {
  solveDoubt,
  evaluateAnswer,
  generateStudyPlan,
  generateQuizFromPDF,
  generateQuestionBank,
} = require("../controllers/aiController");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/solve-doubt", solveDoubt);

router.post("/evaluate-answer", evaluateAnswer);

router.post("/generate-study-plan", generateStudyPlan);

router.post(
  "/generate-quiz",
  upload.single("pdf"),
  generateQuizFromPDF
);

router.post(
  "/generate-question-bank",
  generateQuestionBank
);

module.exports = router;