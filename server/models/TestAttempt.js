const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
    required: true,
  },

  testTitle: {
    type: String,
    required: true,
  },

  // Exam associated with the test
  exam: {
    type: String,
    required: true,
  },

  // Subject associated with the test
  subject: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    required: true,
  },

  totalQuestions: {
    type: Number,
    required: true,
  },

  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "TestAttempt",
  testAttemptSchema
);