const MockTest = require("../models/MockTest");
const Question = require("../models/Question");

// =====================================================
// Get all mock tests
// =====================================================

const getMockTests = async (req, res) => {
  try {
    const tests = await MockTest.find().select("-questions.correctAnswerIndex");

    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// Get single mock test
// =====================================================

const getMockTestById = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        message: "Mock test not found",
      });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// Create mock test manually
// =====================================================

const createMockTest = async (req, res) => {
  try {
    const newTest = new MockTest(req.body);

    const savedTest = await newTest.save();

    res.status(201).json(savedTest);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// =====================================================
// Generate Mock Test automatically
// =====================================================

const generateMockTest = async (req, res) => {
  try {
    const { examCategory, subject, numberOfQuestions, durationMinutes } =
      req.body;

    // Validate input
    if (!examCategory || !numberOfQuestions || !durationMinutes) {
      return res.status(400).json({
        message: "Exam, number of questions and duration are required",
      });
    }

    // Build filter for Question Bank
    const filter = {
      exam: examCategory,
    };

    // Subject is optional
    if (subject) {
      filter.subject = subject;
    }

    // Randomly select questions from Question Bank
    const questions = await Question.aggregate([
      {
        $match: filter,
      },
      {
        $sample: {
          size: Number(numberOfQuestions),
        },
      },
    ]);

    // Check if enough questions exist
    if (questions.length < Number(numberOfQuestions)) {
      return res.status(400).json({
        message: `Only ${questions.length} questions are available for ${examCategory}. Generate more questions first.`,
      });
    }

    // Convert Question Bank questions
    // into MockTest question format
    const mockQuestions = questions.map((question) => ({
      questionText: question.questionText,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex,
    }));

    // Create title automatically
    const title = subject
      ? `${examCategory} - ${subject} Mock Test`
      : `${examCategory} Mock Test`;

    // Create MockTest
    const mockTest = new MockTest({
      title,
      examCategory,
      subject: subject || "",
      durationMinutes: Number(durationMinutes),
      questions: mockQuestions,
    });

    const savedMockTest = await mockTest.save();

    res.status(201).json({
      message: "Mock test generated successfully",
      mockTest: savedMockTest,
    });
  } catch (error) {
    console.error("Mock test generation error:", error);

    res.status(500).json({
      message: "Failed to generate mock test: " + error.message,
    });
  }
};

module.exports = {
  getMockTests,
  getMockTestById,
  createMockTest,
  generateMockTest,
};
