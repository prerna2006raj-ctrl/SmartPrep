
const mongoose = require("mongoose");

const practiceAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    exam: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      default: "All Subjects",
      trim: true,
    },

    topic: {
      type: String,
      default: "All Topics",
      trim: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },

    attemptedQuestions: {
      type: Number,
      required: true,
      min: 0,
    },

    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },

    incorrectAnswers: {
      type: Number,
      required: true,
      min: 0,
    },

    unansweredQuestions: {
      type: Number,
      required: true,
      min: 0,
    },

    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        questionText: {
          type: String,
          default: "",
        },
        selectedAnswerIndex: {
          type: Number,
          default: null,
        },
        correctAnswerIndex: {
          type: Number,
          default: null,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PracticeAttempt",
  practiceAttemptSchema
);