const MockTest = require("../models/MockTest");
const Question = require("../models/Question");
const TestAttempt = require("../models/TestAttempt");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    const {
      examCategory,
      subject,
      numberOfQuestions,
      durationMinutes,
      difficulty,
    } = req.body;

    // Validate input
    if (!examCategory || !numberOfQuestions || !durationMinutes) {
      return res.status(400).json({
        message: "Exam, number of questions and duration are required",
      });
    }

    const requestedQuestions = Number(numberOfQuestions);

    // -------------------------------------------------
    // 1. Check existing Question Bank
    // -------------------------------------------------

    const filter = {
      exam: examCategory,
    };

    if (subject) {
      filter.subject = subject;
    }

    const availableQuestions = await Question.countDocuments(filter);

    // -------------------------------------------------
    // 2. Calculate missing questions
    // -------------------------------------------------

    const missingQuestions = requestedQuestions - availableQuestions;

    // -------------------------------------------------
    // 3. Generate missing questions using AI
    // -------------------------------------------------

    if (missingQuestions > 0) {
      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
      });

      const prompt = `You are an expert question setter for Indian competitive exams.

Generate exactly ${missingQuestions} multiple-choice questions for:

Exam: ${examCategory}
Subject: ${subject || "General"}
Difficulty: ${difficulty || "Medium"}

Requirements:
- Questions must be relevant to the specified exam and subject.
- Each question must have exactly 4 options.
- Only one option should be correct.
- correctAnswerIndex must be 0, 1, 2, or 3.
- Do not repeat questions.
- Questions should be useful for competitive exam preparation.
- Include a short explanation for every answer.
- Make sure the correctAnswerIndex matches the correct option.

Respond ONLY with valid JSON.
Do not use markdown.
Do not add any text before or after the JSON.

Use exactly this format:

[
  {
    "questionText": "Question here",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Explanation here"
  }
]`;

      const result = await model.generateContent(prompt);

      let responseText = result.response.text();

      responseText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const generatedQuestions = JSON.parse(responseText);

      if (!Array.isArray(generatedQuestions)) {
        return res.status(500).json({
          message: "AI returned an invalid question format",
        });
      }

      // Validate AI questions
      for (const question of generatedQuestions) {
        if (
          !question.questionText ||
          !Array.isArray(question.options) ||
          question.options.length !== 4 ||
          typeof question.correctAnswerIndex !== "number"
        ) {
          return res.status(500).json({
            message: "AI generated an invalid question structure",
          });
        }
      }

      // Save AI-generated questions
      const questionsToSave = generatedQuestions.map((question) => ({
        exam: examCategory,
        subject: subject || "General",
        questionText: question.questionText,
        options: question.options,
        correctAnswerIndex: question.correctAnswerIndex,
        explanation: question.explanation || "",
        difficulty: difficulty || "Medium",
      }));

      await Question.insertMany(questionsToSave);

      console.log(`${generatedQuestions.length} questions generated by AI`);
    }

    // -------------------------------------------------
    // 4. Get questions from Question Bank
    // -------------------------------------------------

    const questions = await Question.aggregate([
      {
        $match: filter,
      },
      {
        $sample: {
          size: requestedQuestions,
        },
      },
    ]);

    // Safety check
    if (questions.length < requestedQuestions) {
      return res.status(400).json({
        message: "Unable to collect enough questions for this mock test.",
      });
    }

    // -------------------------------------------------
    // 5. Convert questions to MockTest format
    // -------------------------------------------------

    const mockQuestions = questions.map((question) => ({
      questionText: question.questionText,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex,
    }));

    // -------------------------------------------------
    // 6. Create Mock Test
    // -------------------------------------------------

    const title = subject
      ? `${examCategory} - ${subject} Mock Test`
      : `${examCategory} Mock Test`;

    const mockTest = new MockTest({
      title,
      examCategory,
      subject: subject || "",
      durationMinutes: Number(durationMinutes),
      questions: mockQuestions,
    });

    const savedMockTest = await mockTest.save();

    // -------------------------------------------------
    // 7. Send response
    // -------------------------------------------------

    res.status(201).json({
      message: "Mock test generated successfully",
      mockTest: savedMockTest,
      aiGenerated: missingQuestions > 0 ? missingQuestions : 0,
    });
  } catch (error) {
    console.error("Mock test generation error:", error);

    res.status(500).json({
      message: "Failed to generate mock test: " + error.message,
    });
  }
};
// Delete a mock test
const deleteMockTest = async (req, res) => {
  try {
    const { id } = req.params;

    const mockTest = await MockTest.findById(id);

    if (!mockTest) {
      return res.status(404).json({
        message: "Mock test not found",
      });
    }

    // Delete related test attempts
    await TestAttempt.deleteMany({
      test: id,
    });

    // Delete the mock test
    await MockTest.findByIdAndDelete(id);

    res.status(200).json({
      message: "Mock test deleted successfully",
    });
  } catch (error) {
    console.error("Delete mock test error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getMockTests,
  getMockTestById,
  createMockTest,
  generateMockTest,
  deleteMockTest,
};
