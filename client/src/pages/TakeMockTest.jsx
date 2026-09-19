import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function TakeMockTest() {
  const { id } = useParams();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/mocktests/${id}`);

        setTest(res.data);

        // Convert minutes into seconds
        setTimeLeft(res.data.durationMinutes * 60);
      } catch (err) {
        console.error("Failed to load test:", err);
      }
    };

    fetchTest();
  }, [id]);

  useEffect(() => {
    if (!test || submitted || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [test, submitted, timeLeft]);

  useEffect(() => {
    if (test && timeLeft === 0 && !submitted) {
      setTimeUp(true);
      handleSubmit();
    }
  }, [timeLeft, test, submitted]);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;

    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleSubmit = async () => {
    if (submitted || !test) return;

    let correctCount = 0;

    test.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    const token = localStorage.getItem("token");

    if (token) {
      try {
        await api.post(
          "/attempts",
          {
            testId: test._id,
            testTitle: test.title,
            score: correctCount,
            totalQuestions: test.questions.length,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.error("Failed to record attempt:", err);
      }
    }
  };

  // Convert seconds into MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  if (!test) {
    return <p className="text-center mt-10">Loading test...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">{test.title}</h1>

            <p className="text-gray-500">
              {test.durationMinutes} minutes • {test.questions.length} questions
            </p>
          </div>

          {!submitted && (
            <div
              className={`px-4 py-2 rounded-lg font-bold text-lg ${
                timeLeft <= 60
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              ⏱ {formattedTime}
            </div>
          )}
        </div>

        {timeLeft <= 60 && timeLeft > 0 && !submitted && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            ⚠️ Less than one minute remaining!
          </div>
        )}

        {submitted && timeUp && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded mb-6">
            <p className="font-bold text-lg">⏰ Time's Up!</p>
            <p>
              Your test was automatically submitted because the time limit
              ended.
            </p>
            <p className="mt-1">
              You scored {score} out of {test.questions.length}
            </p>
          </div>
        )}

        {submitted && !timeUp && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6">
            <p className="font-bold">Test Submitted Successfully!</p>
            <p>
              You scored {score} out of {test.questions.length}
            </p>
          </div>
        )}

        {test.questions.map((q, index) => (
          <div key={q._id} className="bg-white shadow-md rounded-lg p-5 mb-4">
            <p className="font-semibold text-gray-800 mb-3">
              {index + 1}. {q.questionText}
            </p>

            <div className="space-y-2">
              {q.options.map((option, optIndex) => {
                const isSelected = answers[q._id] === optIndex;
                const isCorrect = optIndex === q.correctAnswerIndex;

                let optionStyle = "border-gray-300";

                if (submitted && isCorrect) {
                  optionStyle = "border-green-500 bg-green-50";
                } else if (submitted && isSelected && !isCorrect) {
                  optionStyle = "border-red-500 bg-red-50";
                } else if (isSelected) {
                  optionStyle = "border-blue-500 bg-blue-50";
                }

                return (
                  <label
                    key={optIndex}
                    className={`block border rounded px-4 py-2 cursor-pointer ${optionStyle}`}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      className="mr-2"
                      disabled={submitted}
                      checked={isSelected}
                      onChange={() => handleSelect(q._id, optIndex)}
                    />

                    {option}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition font-semibold"
          >
            Submit Test
          </button>
        ) : (
          <Link
            to="/mock-tests"
            className="block text-center bg-gray-700 text-white py-3 rounded hover:bg-gray-800 transition font-semibold"
          >
            Back to Mock Tests
          </Link>
        )}
      </div>
    </div>
  );
}

export default TakeMockTest;
