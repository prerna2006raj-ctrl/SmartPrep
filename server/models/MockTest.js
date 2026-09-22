const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
  },

  correctAnswerIndex: {
    type: Number,
    required: true,
  },
});

const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  examCategory: {
    type: String,
    required: true,
  },

  // Subject associated with the mock test
  subject: {
    type: String,
    default: "",
  },

  durationMinutes: {
    type: Number,
    required: true,
  },

  questions: [questionSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MockTest", mockTestSchema);