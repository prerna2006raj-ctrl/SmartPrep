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

    // 1. Validate input
    const requestedQuestions = Number(numberOfQuestions);
    const duration = Number(durationMinutes);

    if (
      !examCategory ||
      !Number.isInteger(requestedQuestions) ||
      requestedQuestions < 1 ||
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return res.status(400).json({
        message: "Please provide a valid exam, question count, and duration.",
      });
    }

    // 2. Match only mock-test questions
    const filter = {
      exam: examCategory,
      source: "mock-test",
    };

    if (subject) {
      filter.subject = subject;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // 3. Count questions matching all selected filters
    let availableQuestions = await Question.countDocuments(filter);

    console.log("Mock-test filter:", filter);
    console.log("Matching questions:", availableQuestions);

    // If the exact difficulty has too few questions,
    // use questions of other difficulties for the same exam/subject.
    if (availableQuestions < requestedQuestions && difficulty) {
      const broaderFilter = {
        exam: examCategory,
        source: "mock-test",
      };

      if (subject) {
        broaderFilter.subject = subject;
      }

      const broaderCount = await Question.countDocuments(broaderFilter);

      if (broaderCount > availableQuestions) {
        console.log(
          `Using all difficulties: ${broaderCount} questions available.`,
        );

        delete filter.difficulty;
        availableQuestions = broaderCount;
      }
    }

    // 4. Ask Gemini only if the database has too few questions
    let aiGenerated = 0;

    if (availableQuestions < requestedQuestions) {
      const missingQuestions = requestedQuestions - availableQuestions;

      console.log(`Need ${missingQuestions} additional questions.`);

      try {
        if (!process.env.GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY is not configured.");
        }

        const model = genAI.getGenerativeModel({
          model: "gemini-3.8-flash",
        });

        const prompt = `Generate exactly ${missingQuestions} multiple-choice practice questions.

Exam: ${examCategory}
Subject: ${subject || "General"}
Difficulty: ${difficulty || "Medium"}

Return ONLY a valid JSON array. Each item must contain:
{
  "questionText": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0,
  "explanation": "Short explanation",
  "topic": "Topic"
}

Rules:
- Exactly four non-empty options.
- correctAnswerIndex must be an integer from 0 to 3.
- Use original, relevant competitive-exam questions.
- Do not include markdown or text outside the JSON array.`;

        let result;
        let lastError;

        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            result = await model.generateContent(prompt);
            break;
          } catch (error) {
            lastError = error;

            const status = error.status || error.statusCode;
            const temporary =
              [429, 500, 502, 503, 504].includes(status) ||
              /overloaded|high demand|503 service unavailable/i.test(
                error.message || "",
              );

            if (!temporary || attempt === 2) {
              throw error;
            }

            const delay = 1000 * Math.pow(2, attempt);

            console.log(
              `Gemini unavailable. Retry ${attempt + 1}/2 in ${delay}ms.`,
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!result) {
          throw lastError || new Error("Gemini generation failed.");
        }

        let responseText = result.response
          .text()
          .replace(/```json\s*/gi, "")
          .replace(/```/g, "")
          .trim();

        const generatedQuestions = JSON.parse(responseText);

        if (
          !Array.isArray(generatedQuestions) ||
          generatedQuestions.length !== missingQuestions
        ) {
          throw new Error("AI returned an unexpected number of questions.");
        }

        const questionsToSave = generatedQuestions.map((q) => {
          if (
            !q.questionText ||
            !Array.isArray(q.options) ||
            q.options.length !== 4 ||
            q.options.some(
              (option) => typeof option !== "string" || !option.trim(),
            ) ||
            !Number.isInteger(q.correctAnswerIndex) ||
            q.correctAnswerIndex < 0 ||
            q.correctAnswerIndex > 3
          ) {
            throw new Error("AI returned an invalid question.");
          }

          return {
            exam: examCategory,
            subject: subject || "General",
            topic: q.topic || "General",
            questionText: q.questionText.trim(),
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
            explanation: q.explanation || "",
            difficulty: difficulty || "Medium",
            isImportant: false,
            source: "mock-test",
          };
        });

        await Question.insertMany(questionsToSave);
        aiGenerated = questionsToSave.length;

        console.log(`${aiGenerated} AI questions saved.`);
      } catch (aiError) {
        console.error("AI generation unavailable:", aiError.message);

        // Continue if the database already has enough questions.
        const refreshedCount = await Question.countDocuments(filter);

        if (refreshedCount < requestedQuestions) {
          return res.status(503).json({
            message:
              "There are not enough questions for this selection, and AI generation is temporarily unavailable. Try another subject or question count.",
            availableQuestions: refreshedCount,
            requestedQuestions,
          });
        }
      }
    }

    // 5. Fetch enough questions to create the test
    let questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: requestedQuestions } },
    ]);

    // If AI questions were saved with a difficulty that did not
    // match the original filter, use the broader exam/subject filter.
    if (questions.length < requestedQuestions) {
      const fallbackFilter = {
        exam: examCategory,
        source: "mock-test",
      };

      if (subject) {
        fallbackFilter.subject = subject;
      }

      questions = await Question.aggregate([
        { $match: fallbackFilter },
        { $sample: { size: requestedQuestions } },
      ]);
    }

    if (questions.length < requestedQuestions) {
      return res.status(400).json({
        message: "Not enough matching mock-test questions are available.",
        availableQuestions: questions.length,
        requestedQuestions,
      });
    }

    // 6. Build and save the mock test
    const mockQuestions = questions.map((question) => ({
      questionText: question.questionText,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex,
    }));

    const title = subject
      ? `${examCategory} - ${subject} Mock Test`
      : `${examCategory} Mock Test`;

    const mockTest = new MockTest({
      title,
      examCategory,
      subject: subject || "",
      durationMinutes: duration,
      questions: mockQuestions,
    });

    const savedMockTest = await mockTest.save();

    return res.status(201).json({
      message: "Mock test generated successfully",
      mockTest: savedMockTest,
      aiGenerated,
      usedExistingQuestions: mockQuestions.length - aiGenerated,
    });
  } catch (error) {
    console.error("Mock test generation error:", error);

    return res.status(500).json({
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
