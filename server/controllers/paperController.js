const Paper = require('../models/Paper');

// Get all papers
const getPapers = async (req, res) => {
  try {
    const papers = await Paper.find();
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new paper
const createPaper = async (req, res) => {
  try {
    const newPaper = new Paper(req.body);
    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getPapers, createPaper };