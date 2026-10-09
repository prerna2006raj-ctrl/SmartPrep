
const Question = require("../models/Question");

// =====================================================
// Get Question Bank questions
// =====================================================

const getQuestions = async (req, res) => {
  try {
    const {
      exam,
      subject,
      topic,
      difficulty,
      isImportant,
    } = req.query;

    // Only retrieve Question Bank questions.
    const filter = {
      source: "question-bank",
    };

    if (exam) {
      filter.exam = exam;
    }

    if (subject) {
      filter.subject = subject;
    }

    if (topic) {
      filter.topic = topic;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (isImportant !== undefined) {
      filter.isImportant = isImportant === "true";
    }

    const questions = await Question.find(filter)
      .sort({ subject: 1, topic: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get Question Bank error:", error);

    res.status(500).json({
      message: "Failed to fetch Question Bank questions",
    });
  }
};

// =====================================================
// Create a question manually (Admin only)
// =====================================================

const createQuestion = async (req, res) => {
  try {
    const {
      exam,
      subject,
      topic,
      questionText,
      options,
      correctAnswerIndex,
      explanation,
      difficulty,
      isImportant,
    } = req.body;

    const question = await Question.create({
      exam,
      subject,
      topic: topic || "General",
      questionText,
      options,
      correctAnswerIndex,
      explanation: explanation || "",
      difficulty: difficulty || "Medium",
      isImportant: isImportant ?? true,
      source: "question-bank",
    });

    res.status(201).json({
      message: "Question Bank question created successfully",
      question,
    });
  } catch (error) {
    console.error("Create Question Bank question error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
};

