const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  examCategory: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
  },
  pdfLink: {
    type: String,
    required: true,
  },
  youtubeLink: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Paper', paperSchema);