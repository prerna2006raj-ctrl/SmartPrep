const { GoogleGenerativeAI } = require("@google/generative-ai");
const Question = require("../models/Question");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const prompt = `You are a helpful tutor for Indian competitive exam students (UPSC, SSC, Banking, Railways, etc.). Explain the following doubt clearly and simply, using examples where helpful. Keep the explanation concise but complete.

Question: ${question}`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

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
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Study Planner
// =====================================================

const generateStudyPlan = async (req, res) => {
  try {
    const {
      examName,
      examDate,
      hoursPerDay,
      weakSubjects,
    } = req.body;

    if (!examName || !examDate) {
      return res.status(400).json({
        message: "Exam name and exam date are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

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
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Generate Quiz From PDF
// =====================================================

const { PDFParse } = require("pdf-parse");

const generateQuizFromPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No PDF file uploaded",
      });
    }

    const parser = new PDFParse({
      data: req.file.buffer,
    });

    const pdfData = await parser.getText();

    const extractedText = pdfData.text.slice(0, 8000);

    await parser.destroy();

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        message: "Could not extract readable text from this PDF",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

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

    res.status(200).json({
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate quiz: " + error.message,
    });
  }
};


// =====================================================
// Generate Question Bank
// =====================================================

const generateQuestionBank = async (req, res) => {
  try {
    const {
      exam,
      subject,
      numberOfQuestions,
      difficulty,
    } = req.body;

    // Validate input
    if (!exam || !subject || !numberOfQuestions) {
      return res.status(400).json({
        message:
          "Exam, subject and number of questions are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const prompt = `You are an expert question setter for Indian competitive exams.

Generate exactly ${numberOfQuestions} multiple-choice questions for:

Exam: ${exam}
Subject: ${subject}
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

    // Ask Gemini to generate questions
    const result = await model.generateContent(prompt);

    let responseText = result.response.text();

    // Remove markdown code fences if Gemini adds them
    responseText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Convert AI response to JavaScript array
    const questions = JSON.parse(responseText);

    if (!Array.isArray(questions)) {
      return res.status(500).json({
        message: "AI returned an invalid question format",
      });
    }

    // Validate questions before saving
    for (const question of questions) {
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

    // Prepare questions for MongoDB
    const questionsToSave = questions.map((question) => ({
      exam,
      subject,
      questionText: question.questionText,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex,
      explanation: question.explanation || "",
      difficulty: difficulty || "Medium",
    }));

    // Save all questions to MongoDB
    const savedQuestions = await Question.insertMany(
      questionsToSave
    );

    res.status(201).json({
      message: `${savedQuestions.length} questions generated and saved successfully`,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("Question generation error:", error);

    res.status(500).json({
      message:
        "Failed to generate questions: " + error.message,
    });
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