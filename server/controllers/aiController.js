
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Question = require("../models/Question");
const { PDFParse } = require("pdf-parse");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =====================================================
// Helper: Get Gemini model
// =====================================================

const getGeminiModel = () =>
  genAI.getGenerativeModel({
    model: "gemini-3.8-flash",
  });

// =====================================================
// Helper: Handle AI errors
// =====================================================

const handleAIError = (res, error, operation) => {
  console.error(`${operation} error:`, error);

  if (error.status === 503 || error.status === 429) {
    return res.status(error.status).json({
      message:
        error.status === 503
          ? "AI service is temporarily busy. Please try again later."
          : "AI request limit reached. Please try again later.",
    });
  }

  return res.status(500).json({
    message: `${operation} failed: ${error.message}`,
  });
};

// =====================================================
// Doubt Solver
// =====================================================

const solveDoubt = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const model = getGeminiModel();

    const prompt = `You are a helpful tutor for Indian competitive exam students (UPSC, SSC, Banking, Railways, etc.). Explain the following doubt clearly and simply, using examples where helpful. Keep the explanation concise but complete.

Question: ${question}`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.status(200).json({ answer });
  } catch (error) {
    handleAIError(res, error, "Doubt solving");
  }
};

// =====================================================
// Answer Evaluation
// =====================================================

const evaluateAnswer = async (req, res) => {
  try {
    const { question, studentAnswer, wordLimit } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({
        message: "Question and answer are required",
      });
    }

    const model = getGeminiModel();

    const prompt = `You are an expert UPSC Mains answer evaluator. Evaluate the student's answer below using this rubric:

1. Structure (Introduction, Body, Conclusion) - Score out of 10
2. Relevance to the question asked - Score out of 10
3. Content depth (facts, examples, data) - Score out of 10
4. Word limit adherence (limit: ${wordLimit || "not specified"} words) - Score out of 10

Question: ${question}

Student's Answer: ${studentAnswer}

Provide your response in this exact format:
- Structure Score: X/10
- Relevance Score: X/10
- Content Depth Score: X/10
- Word Limit Score: X/10
- Total Score: X/40
- Strengths: (2-3 bullet points)
- Areas for Improvement: (2-3 bullet points)
- Suggested Model Answer Outline: (brief outline of what an ideal answer would include)`;

    const result = await model.generateContent(prompt);
    const evaluation = result.response.text();

    res.status(200).json({ evaluation });
  } catch (error) {
    handleAIError(res, error, "Answer evaluation");
  }
};

// =====================================================
// Study Planner
// =====================================================

const generateStudyPlan = async (req, res) => {
  try {
    const { examName, examDate, hoursPerDay, weakSubjects } = req.body;

    if (!examName || !examDate) {
      return res.status(400).json({
        message: "Exam name and exam date are required",
      });
    }

    const model = getGeminiModel();
    const today = new Date().toDateString();

    const prompt = `You are an expert exam preparation coach for Indian competitive exams. Create a personalized study plan.

Today's date: ${today}
Exam: ${examName}
Exam date: ${examDate}
Available study hours per day: ${hoursPerDay || "not specified, assume 4 hours"}
Weak subjects/topics to prioritize: ${weakSubjects || "not specified, cover all standard topics evenly"}

Create a week-by-week study plan (not day-by-day, to keep it practical) from today until the exam date. For each week, list:
- Focus topics/subjects for that week
- Suggested study activities (reading, practice questions, mock tests, revision)
- A weekly goal or milestone

If the timeline is very short (under 2 weeks) or very long (over 6 months), adjust the plan structure sensibly. End with a short motivational note and 2-3 general exam-day tips.`;

    const result = await model.generateContent(prompt);
    const plan = result.response.text();

    res.status(200).json({ plan });
  } catch (error) {
    handleAIError(res, error, "Study plan generation");
  }
};

// =====================================================
// Generate Quiz From PDF
// =====================================================

const generateQuizFromPDF = async (req, res) => {
  let parser;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No PDF file uploaded",
      });
    }

    parser = new PDFParse({
      data: req.file.buffer,
    });

    const pdfData = await parser.getText();
    const extractedText = pdfData.text.slice(0, 8000);

    await parser.destroy();
    parser = null;

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        message: "Could not extract readable text from this PDF",
      });
    }

    const model = getGeminiModel();

    const prompt = `You are creating a multiple-choice quiz based on the following study material. Generate exactly 5 questions based on the key facts and concepts in this text.

Text:
${extractedText}

Respond ONLY with valid JSON in this exact format, no extra text, no markdown formatting:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswerIndex": 0
  }
]`;

    const result = await model.generateContent(prompt);

    let responseText = result.response.text();

    responseText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions = JSON.parse(responseText);

    if (
      !Array.isArray(questions) ||
      questions.length !== 5 ||
      questions.some(
        (question) =>
          !question.questionText ||
          !Array.isArray(question.options) ||
          question.options.length !== 4 ||
          !Number.isInteger(question.correctAnswerIndex) ||
          question.correctAnswerIndex < 0 ||
          question.correctAnswerIndex > 3
      )
    ) {
      return res.status(500).json({
        message: "AI returned an invalid quiz format",
      });
    }

    res.status(200).json({ questions });
  } catch (error) {
    handleAIError(res, error, "PDF quiz generation");
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (cleanupError) {
        console.error("PDF parser cleanup error:", cleanupError);
      }
    }
  }
};

// =====================================================
// Generate Question Bank
// =====================================================

const generateQuestionBank = async (req, res) => {
  try {
    const { exam, subject, numberOfQuestions, difficulty } = req.body;

    const count = Number(numberOfQuestions);

    if (
      !exam ||
      !subject ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 20
    ) {
      return res.status(400).json({
        message:
          "Exam, subject and a question count between 1 and 20 are required",
      });
    }

    const model = getGeminiModel();

    const prompt = `You are an expert question setter for Indian competitive exams.

Generate exactly ${count} important multiple-choice questions for:

Exam: ${exam}
Subject: ${subject}
Difficulty: ${difficulty || "Medium"}

Requirements:
- Focus on important concepts and frequently tested areas.
- Each question must have exactly 4 distinct options.
- Only one option should be correct.
- correctAnswerIndex must be an integer from 0 to 3.
- Do not repeat questions.
- Include a clear explanation for every answer.
- Include a specific topic for every question.
- Ensure the answer index matches the correct option.
- These questions are for the learning and revision Question Bank, NOT timed Mock Tests.
- Return exactly ${count} questions.

Respond ONLY with valid JSON, without markdown or extra text.

Format:
[
  {
    "questionText": "Question here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Explanation here",
    "topic": "Specific topic here"
  }
]`;

    const result = await model.generateContent(prompt);

    let responseText = result.response.text();

    responseText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions = JSON.parse(responseText);

    if (
      !Array.isArray(questions) ||
      questions.length !== count ||
      questions.some(
        (question) =>
          !question.questionText ||
          !Array.isArray(question.options) ||
          question.options.length !== 4 ||
          !Number.isInteger(question.correctAnswerIndex) ||
          question.correctAnswerIndex < 0 ||
          question.correctAnswerIndex > 3 ||
          !question.topic ||
          !question.explanation
      )
    ) {
      return res.status(500).json({
        message: "AI returned an invalid Question Bank format",
      });
    }

    // Save specifically as Question Bank questions.
    const questionsToSave = questions.map((question) => ({
      exam,
      subject,
      topic: question.topic.trim(),
      questionText: question.questionText.trim(),
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex,
      explanation: question.explanation,
      difficulty: difficulty || "Medium",
      isImportant: true,
      source: "question-bank",
    }));

    const savedQuestions = await Question.insertMany(questionsToSave);

    res.status(201).json({
      message: `${savedQuestions.length} Question Bank questions generated and saved successfully`,
      questions: savedQuestions,
    });
  } catch (error) {
    handleAIError(res, error, "Question Bank generation");
  }
};

// =====================================================
// Export Controllers
// =====================================================

module.exports = {
  solveDoubt,
  evaluateAnswer,
  generateStudyPlan,
  generateQuizFromPDF,
  generateQuestionBank,
};