import { useRef, useState } from "react";
import api from "../api/axios";

function AIQuizGenerator() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const handleGenerateQuiz = async () => {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setScore(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await api.post("/ai/generate-quiz", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setQuestions(response.data.questions);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate quiz. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };
  const handleReset = () => {
    setFile(null);
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleSubmit = async () => {
    let calculatedScore = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    try {
      await api.post("/quiz-history", {
        fileName: file?.name || "Unknown PDF",
        score: calculatedScore,
        totalQuestions: questions.length,
      });
    } catch (error) {
      console.error("Failed to save quiz history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          AI Quiz Generator
        </h1>

        <p className="mb-6 text-gray-600">
          Upload a study PDF and let AI create a quiz from it.
        </p>

        {/* Upload Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Upload Study PDF</h2>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError("");
            }}
            className="mb-4 block w-full"
          />

          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating Quiz..." : "Generate Quiz"}
          </button>

          {file && (
            <p className="mt-3 text-sm text-gray-600">Selected: {file.name}</p>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* Quiz */}
        {questions.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold">Your AI-Generated Quiz</h2>

            {questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="mb-5 rounded-lg bg-white p-6 shadow"
              >
                <h3 className="mb-4 font-semibold">
                  {questionIndex + 1}. {question.questionText}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex cursor-pointer items-center rounded border p-3 hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() =>
                          handleAnswerChange(questionIndex, optionIndex)
                        }
                        className="mr-3"
                      />

                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Submit Quiz
            </button>

            {score !== null && (
              <div className="mt-6">
                {/* Score Summary */}
                <div className="rounded-lg bg-white p-6 text-center shadow">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Your Score
                  </h2>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {score} / {questions.length}
                  </p>

                  <p className="mt-2 text-gray-600">
                    Accuracy: {Math.round((score / questions.length) * 100)}%
                  </p>
                </div>

                {/* Detailed Review */}
                <div className="mt-6">
                  <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Detailed Result Review
                  </h2>

                  {questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect =
                      userAnswer === question.correctAnswerIndex;

                    return (
                      <div
                        key={index}
                        className={`mb-5 rounded-lg border-2 bg-white p-6 shadow ${
                          isCorrect ? "border-green-500" : "border-red-500"
                        }`}
                      >
                        {/* Question */}
                        <h3 className="mb-4 font-semibold text-gray-800">
                          {index + 1}. {question.questionText}
                        </h3>

                        {/* Result */}
                        <p
                          className={`mb-4 font-semibold ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </p>

                        {/* User Answer */}
                        <div className="mb-3 rounded bg-gray-50 p-3">
                          <p className="text-sm font-semibold text-gray-600">
                            Your Answer
                          </p>

                          <p
                            className={
                              userAnswer === undefined
                                ? "text-gray-500"
                                : isCorrect
                                  ? "text-green-700"
                                  : "text-red-700"
                            }
                          >
                            {userAnswer === undefined
                              ? "Not answered"
                              : question.options[userAnswer]}
                          </p>
                        </div>

                        {/* Correct Answer */}
                        <div className="rounded bg-green-50 p-3">
                          <p className="text-sm font-semibold text-gray-600">
                            Correct Answer
                          </p>

                          <p className="text-green-700">
                            {question.options[question.correctAnswerIndex]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reset Button */}
                <div className="mt-6 mb-10 text-center">
                  <button
                    onClick={handleReset}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Generate New Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIQuizGenerator;
