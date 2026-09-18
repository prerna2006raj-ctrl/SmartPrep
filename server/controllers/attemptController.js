const TestAttempt = require("../models/TestAttempt");

// Record a new attempt
const recordAttempt = async (req, res) => {
  try {
    const { testId, testTitle, score, totalQuestions } = req.body;

    const attempt = await TestAttempt.create({
      user: req.user._id,
      test: testId,
      testTitle,
      score,
      totalQuestions,
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attempts for the logged-in user
const getMyAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id }).sort({
      attemptedAt: -1,
    });
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordAttempt, getMyAttempts };
