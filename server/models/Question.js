
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      default: "General",
      trim: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) =>
          Array.isArray(options) &&
          options.length === 4 &&
          options.every(
            (option) =>
              typeof option === "string" &&
              option.trim().length > 0
          ),
        message: "A question must have exactly four non-empty options.",
      },
    },

    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      validate: {
        validator: Number.isInteger,
        message: "The correct answer index must be an integer.",
      },
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    isImportant: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: ["mock-test", "question-bank"],
      default: "mock-test",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);