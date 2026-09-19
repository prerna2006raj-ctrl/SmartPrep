import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function TakeMockTest() {
  const { id } = useParams();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // ==============================
  // Fetch Test
  // ==============================
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/mocktests/${id}`);

        setTest(res.data);

        // Convert minutes into seconds
        setTimeLeft(res.data.durationMinutes * 60);
      } catch (err) {
        console.error('Failed to load test:', err);
      }
    };

    fetchTest();
  }, [id]);

  // ==============================
  // Countdown Timer
  // ==============================
  useEffect(() => {
    if (!test || submitted || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [test, submitted, timeLeft]);

  // ==============================
  // Auto Submit When Time Ends
  // ==============================
  useEffect(() => {
    if (test && timeLeft === 0 && !submitted) {
      setTimeUp(true);
      handleSubmit();
    }
  }, [timeLeft, test, submitted]);

  // ==============================
  // Select Answer
  // ==============================
  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;

    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  // ==============================
  // Submit Test
  // ==============================
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

    const token = localStorage.getItem('token');

    if (token) {
      try {
        await api.post(
          '/attempts',
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
          }
        );
      } catch (err) {
        console.error('Failed to record attempt:', err);
      }
    }
  };

  // ==============================
  // Format Timer
  // ==============================
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  // ==============================
  // Loading
  // ==============================
  if (!test) {
    return (
      <p className="text-center mt-10">
        Loading test...
      </p>
    );
  }

  // ==============================
  // Statistics
  // ==============================
  const totalQuestions = test.questions.length;

  const answeredCount = Object.keys(answers).length;

  const unansweredCount = totalQuestions - answeredCount;

  const incorrectCount = answeredCount - score;

  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

  const currentQ = test.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              {test.title}
            </h1>

            <p className="text-gray-500 mt-1">
              {test.durationMinutes} minutes • {totalQuestions} questions
            </p>
          </div>

          {/* TIMER */}

          {!submitted && (
            <div
              className={`px-5 py-3 rounded-lg font-bold text-xl shadow-sm ${
                timeLeft <= 60
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-blue-100 text-blue-700 border border-blue-300'
              }`}
            >
              ⏱ {formattedTime}
            </div>
          )}

        </div>

        {/* ================================= */}
        {/* TIME WARNING */}
        {/* ================================= */}

        {!submitted && timeLeft <= 60 && timeLeft > 0 && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            ⚠️ Less than one minute remaining!
          </div>
        )}

        {/* ================================= */}
        {/* RESULT SUMMARY */}
        {/* ================================= */}

        {submitted && (
          <div className="mb-6">

            {timeUp ? (
              <div className="bg-red-100 border border-red-400 text-red-800 px-5 py-4 rounded-lg mb-5">
                <p className="font-bold text-xl">
                  ⏰ Time's Up!
                </p>

                <p className="mt-1">
                  Your test was automatically submitted because the time limit ended.
                </p>
              </div>
            ) : (
              <div className="bg-green-100 border border-green-400 text-green-800 px-5 py-4 rounded-lg mb-5">
                <p className="font-bold text-xl">
                  ✅ Test Submitted Successfully!
                </p>
              </div>
            )}

            {/* Result Cards */}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Score
                </p>

                <p className="text-2xl font-bold text-blue-700">
                  {score}/{totalQuestions}
                </p>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Percentage
                </p>

                <p className="text-2xl font-bold text-purple-700">
                  {percentage}%
                </p>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Correct
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {score}
                </p>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Incorrect
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {incorrectCount}
                </p>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Unanswered
                </p>

                <p className="text-2xl font-bold text-gray-600">
                  {unansweredCount}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ================================= */}
        {/* MAIN TEST AREA */}
        {/* ================================= */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* ================================= */}
          {/* QUESTION NAVIGATION */}
          {/* ================================= */}

          <div className="md:col-span-1">

            <div className="bg-white shadow-md rounded-lg p-5 sticky top-5">

              <h2 className="font-bold text-gray-800 mb-4">
                Questions
              </h2>

              <div className="grid grid-cols-5 gap-2">

                {test.questions.map((q, index) => {

                  const isAnswered =
                    answers[q._id] !== undefined;

                  const isCurrent =
                    currentQuestion === index;

                  let buttonStyle =
                    'bg-gray-100 text-gray-700';

                  if (isCurrent) {
                    buttonStyle =
                      'bg-blue-700 text-white ring-2 ring-blue-300';
                  } else if (isAnswered) {
                    buttonStyle =
                      'bg-green-100 text-green-700 border border-green-300';
                  }

                  if (submitted) {
                    if (
                      answers[q._id] ===
                      q.correctAnswerIndex
                    ) {
                      buttonStyle =
                        'bg-green-500 text-white';
                    } else if (isAnswered) {
                      buttonStyle =
                        'bg-red-500 text-white';
                    } else {
                      buttonStyle =
                        'bg-gray-200 text-gray-500';
                    }
                  }

                  return (
                    <button
                      key={q._id}
                      onClick={() =>
                        setCurrentQuestion(index)
                      }
                      className={`w-10 h-10 rounded-lg font-semibold text-sm ${buttonStyle}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}

              </div>

              {/* Answer Status */}

              {!submitted && (
                <div className="mt-5 space-y-2 text-sm">

                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-green-100 border border-green-300"></span>
                    Answered
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-gray-100"></span>
                    Not Answered
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-blue-700"></span>
                    Current
                  </div>

                </div>
              )}

              {/* Progress */}

              <div className="mt-5 pt-4 border-t">

                <p className="text-sm text-gray-500">
                  Progress
                </p>

                <p className="font-semibold text-gray-800">
                  {answeredCount} / {totalQuestions} answered
                </p>

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* CURRENT QUESTION */}
          {/* ================================= */}

          <div className="md:col-span-3">

            <div className="bg-white shadow-md rounded-lg p-6">

              <p className="text-sm text-gray-500 mb-2">
                Question {currentQuestion + 1} of {totalQuestions}
              </p>

              <p className="font-semibold text-gray-800 text-lg mb-5">
                {currentQ.questionText}
              </p>

              {/* OPTIONS */}

              <div className="space-y-3">

                {currentQ.options.map((option, optIndex) => {

                  const isSelected =
                    answers[currentQ._id] === optIndex;

                  const isCorrect =
                    optIndex === currentQ.correctAnswerIndex;

                  let optionStyle =
                    'border-gray-300 hover:border-blue-400';

                  if (submitted && isCorrect) {
                    optionStyle =
                      'border-green-500 bg-green-50';
                  } else if (
                    submitted &&
                    isSelected &&
                    !isCorrect
                  ) {
                    optionStyle =
                      'border-red-500 bg-red-50';
                  } else if (isSelected) {
                    optionStyle =
                      'border-blue-500 bg-blue-50';
                  }

                  return (
                    <label
                      key={optIndex}
                      className={`block border rounded-lg px-4 py-3 cursor-pointer transition ${optionStyle}`}
                    >

                      <input
                        type="radio"
                        name={currentQ._id}
                        className="mr-3"
                        disabled={submitted}
                        checked={isSelected}
                        onChange={() =>
                          handleSelect(
                            currentQ._id,
                            optIndex
                          )
                        }
                      />

                      {option}

                    </label>
                  );

                })}

              </div>

              {/* ================================= */}
              {/* QUESTION NAVIGATION BUTTONS */}
              {/* ================================= */}

              <div className="flex justify-between mt-8 gap-4">

                <button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.max(0, currentQuestion - 1)
                    )
                  }
                  disabled={currentQuestion === 0}
                  className="px-5 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentQuestion < totalQuestions - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestion(
                        Math.min(
                          totalQuestions - 1,
                          currentQuestion + 1
                        )
                      )
                    }
                    className="px-5 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Next →
                  </button>
                ) : !submitted ? (
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
                  >
                    Submit Test
                  </button>
                ) : null}

              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* FINAL BACK BUTTON */}
        {/* ================================= */}

        {submitted && (
          <Link
            to="/mock-tests"
            className="block text-center bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold mt-6"
          >
            Back to Mock Tests
          </Link>
        )}

      </div>

    </div>
  );
}

export default TakeMockTest;