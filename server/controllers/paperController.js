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
// Delete a paper
const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    res.status(200).json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPapers, createPaper, deletePaper };

