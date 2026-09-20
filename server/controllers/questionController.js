const Question = require("../models/Question");

// Get questions
const getQuestions = async (req, res) => {
  try {
    const { exam, subject, difficulty } = req.query;

    const filter = {};

    if (exam) {
      filter.exam = exam;
    }

    if (subject) {
      filter.subject = subject;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const questions = await Question.find(filter);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add question
const createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);

    const savedQuestion = await question.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
};