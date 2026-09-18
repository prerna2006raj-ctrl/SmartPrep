const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Doubt Solver
const solveDoubt = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are a helpful tutor for Indian competitive exam students (UPSC, SSC, Banking, Railways, etc.). Explain the following doubt clearly and simply, using examples where helpful. Keep the explanation concise but complete.

Question: ${question}`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Answer Evaluation
const evaluateAnswer = async (req, res) => {
  try {
    const { question, studentAnswer, wordLimit } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are an expert UPSC Mains answer evaluator. Evaluate the student's answer below using this rubric:

1. Structure (Introduction, Body, Conclusion) - Score out of 10
2. Relevance to the question asked - Score out of 10
3. Content depth (facts, examples, data) - Score out of 10
4. Word limit adherence (limit: ${wordLimit || 'not specified'} words) - Score out of 10

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
    res.status(500).json({ message: error.message });
  }
};
// Study Planner
const generateStudyPlan = async (req, res) => {
  try {
    const { examName, examDate, hoursPerDay, weakSubjects } = req.body;

    if (!examName || !examDate) {
      return res.status(400).json({ message: 'Exam name and exam date are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const today = new Date().toDateString();

    const prompt = `You are an expert exam preparation coach for Indian competitive exams. Create a personalized study plan.

Today's date: ${today}
Exam: ${examName}
Exam date: ${examDate}
Available study hours per day: ${hoursPerDay || 'not specified, assume 4 hours'}
Weak subjects/topics to prioritize: ${weakSubjects || 'not specified, cover all standard topics evenly'}

Create a week-by-week study plan (not day-by-day, to keep it practical) from today until the exam date. For each week, list:
- Focus topics/subjects for that week
- Suggested study activities (reading, practice questions, mock tests, revision)
- A weekly goal or milestone

If the timeline is very short (under 2 weeks) or very long (over 6 months), adjust the plan structure sensibly. End with a short motivational note and 2-3 general exam-day tips.`;

    const result = await model.generateContent(prompt);
    const plan = result.response.text();

    res.status(200).json({ plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { solveDoubt, evaluateAnswer, generateStudyPlan };

