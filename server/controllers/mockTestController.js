const MockTest = require('../models/MockTest');

// Get all mock tests (without showing correct answers, for safety)
const getMockTests = async (req, res) => {
  try {
    const tests = await MockTest.find().select('-questions.correctAnswerIndex');
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single mock test by ID (with full details, used when actually taking the test)
const getMockTestById = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Mock test not found' });
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new mock test
const createMockTest = async (req, res) => {
  try {
    const newTest = new MockTest(req.body);
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMockTests, getMockTestById, createMockTest };