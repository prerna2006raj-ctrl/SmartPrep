
const express = require("express");
const router = express.Router();

const PracticeAttempt = require("../models/PracticeAttempt");
const { protect } = require("../middleware/authMiddleware");

// Save a completed practice attempt
router.post("/", protect, async (req, res) => {
  try {
    const {
      exam,
      subject,
      topic,
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      durationSeconds,
      answers,
    } = req.body;

    if (
      !exam ||
      !Number.isInteger(totalQuestions) ||
      totalQuestions < 1 ||
      !Number.isInteger(attemptedQuestions) ||
      !Number.isInteger(correctAnswers) ||
      !Number.isInteger(incorrectAnswers) ||
      !Number.isInteger(unansweredQuestions) ||
      !Array.isArray(answers)
    ) {
      return res.status(400).json({
        message: "Invalid practice attempt data.",
      });
    }

    if (
      attemptedQuestions !== correctAnswers + incorrectAnswers ||
      totalQuestions !== attemptedQuestions + unansweredQuestions ||
      answers.length !== totalQuestions ||
      correctAnswers < 0 ||
      incorrectAnswers < 0 ||
      unansweredQuestions < 0 ||
      attemptedQuestions < 0 ||
      correctAnswers > attemptedQuestions ||
      (durationSeconds !== undefined &&
        (!Number.isFinite(durationSeconds) || durationSeconds < 0))
    ) {
      return res.status(400).json({
        message: "Practice attempt totals are inconsistent.",
      });
    }

    const accuracy =
      attemptedQuestions === 0
        ? 0
        : Math.round((correctAnswers / attemptedQuestions) * 100);

    const attempt = await PracticeAttempt.create({
      user: req.user._id,
      exam: String(exam).trim(),
      subject: subject || "All Subjects",
      topic: topic || "All Topics",
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      accuracy,
      durationSeconds: durationSeconds || 0,
      answers: answers.map((answer) => ({
        questionId: String(answer.questionId || ""),
        questionText: String(answer.questionText || ""),
        selectedAnswerIndex:
          Number.isInteger(answer.selectedAnswerIndex)
            ? answer.selectedAnswerIndex
            : null,
        correctAnswerIndex:
          Number.isInteger(answer.correctAnswerIndex)
            ? answer.correctAnswerIndex
            : null,
        isCorrect: answer.isCorrect === true,
      })),
    });

    res.status(201).json({
      message: "Practice attempt saved successfully.",
      attempt,
    });
  } catch (error) {
    console.error("Save practice attempt error:", error);
    res.status(500).json({
      message: "Unable to save practice attempt.",
    });
  }
});

// Get the logged-in student's practice history
router.get("/", protect, async (req, res) => {
  try {
    const attempts = await PracticeAttempt.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ attempts });
  } catch (error) {
    console.error("Fetch practice history error:", error);
    res.status(500).json({
      message: "Unable to fetch practice history.",
    });
  }
});

// Get one attempt belonging to the logged-in student
router.get("/:id", protect, async (req, res) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
      return res.status(400).json({
        message: "Invalid attempt ID.",
      });
    }

    const attempt = await PracticeAttempt.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!attempt) {
      return res.status(404).json({
        message: "Practice attempt not found.",
      });
    }

    res.json({ attempt });
  } catch (error) {
    console.error("Fetch practice attempt error:", error);
    res.status(500).json({
      message: "Unable to fetch practice attempt.",
    });
  }
});

module.exports = router;