const AIQuizHistory = require("../models/AIQuizHistory");

// Save a quiz result
const saveQuizHistory = async (req, res) => {
  try {
    const { fileName, score, totalQuestions } = req.body;

    if (!fileName || score === undefined || !totalQuestions) {
      return res.status(400).json({
        message: "Missing quiz history data",
      });
    }

    const history = await AIQuizHistory.create({
      user: req.user._id,
      fileName,
      score,
      totalQuestions,
    });

    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in user's quiz history
const getQuizHistory = async (req, res) => {
  try {
    const history = await AIQuizHistory.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete logged-in user's quiz history
const clearQuizHistory = async (req, res) => {
  try {
    await AIQuizHistory.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      message: "Quiz history cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveQuizHistory,
  getQuizHistory,
  clearQuizHistory,
};
