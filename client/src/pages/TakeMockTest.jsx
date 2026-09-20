import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function TakeMockTest() {
  const { id } = useParams();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Fetch Test
  // ==============================
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/mock-tests/${id}`);

        setTest(res.data);

        // Start timer using test duration
        setTimeLeft(res.data.durationMinutes * 60);
      } catch (err) {
        console.error("Failed to load test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  // ==============================
  // Countdown Timer
  // ==============================
  useEffect(() => {
    // Do not start timer until test and time are loaded
    if (!test || timeLeft === null || submitted) {
      return;
    }

    // Stop timer when it reaches zero
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null) {
          return null;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, submitted, timeLeft]);

  // ==============================
  // Auto Submit When Time Ends
  // ==============================
  useEffect(() => {
    if (
      test &&
      timeLeft === 0 &&
      !submitted
    ) {
      setTimeUp(true);
      handleSubmit();
    }
  }, [timeLeft, test, submitted]);

  // ==============================
  // Select Answer
  // ==============================
  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionIndex,
    }));
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
          }
        );
      } catch (err) {
        console.error("Failed to record attempt:", err);
      }
    }
  };

  // ==============================
  // Format Timer
  // ==============================
  const minutes =
    timeLeft !== null
      ? Math.floor(timeLeft / 60)
      : 0;

  const seconds =
    timeLeft !== null
      ? timeLeft % 60
      : 0;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  // ==============================
  // Loading
  // ==============================
  if (loading || !test) {
    return (
      <p className="mt-10 text-center">
        Loading test...
      </p>
    );
  }

  // ==============================
  // Statistics
  // ==============================
  const totalQuestions = test.questions.length;

  const answeredCount = Object.keys(answers).length;

  const unansweredCount =
    totalQuestions - answeredCount;

  const incorrectCount =
    answeredCount - score;

  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

  const currentQ = test.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              {test.title}
            </h1>

            <p className="mt-1 text-gray-500">
              {test.durationMinutes} minutes •{" "}
              {totalQuestions} questions
            </p>
          </div>

          {/* TIMER */}

          {!submitted && (
            <div
              className={`rounded-lg border px-5 py-3 text-xl font-bold shadow-sm ${
                timeLeft <= 60
                  ? "border-red-300 bg-red-100 text-red-700"
                  : "border-blue-300 bg-blue-100 text-blue-700"
              }`}
            >
              ⏱ {formattedTime}
            </div>
          )}
        </div>

        {/* ================================= */}
        {/* TIME WARNING */}
        {/* ================================= */}

        {!submitted &&
          timeLeft !== null &&
          timeLeft <= 60 &&
          timeLeft > 0 && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
              ⚠️ Less than one minute remaining!
            </div>
          )}

        {/* ================================= */}
        {/* RESULT SUMMARY */}
        {/* ================================= */}

        {submitted && (
          <div className="mb-6">

            {timeUp ? (
              <div className="mb-5 rounded-lg border border-red-400 bg-red-100 px-5 py-4 text-red-800">
                <p className="text-xl font-bold">
                  ⏰ Time's Up!
                </p>

                <p className="mt-1">
                  Your test was automatically submitted
                  because the time limit ended.
                </p>
              </div>
            ) : (
              <div className="mb-5 rounded-lg border border-green-400 bg-green-100 px-5 py-4 text-green-800">
                <p className="text-xl font-bold">
                  ✅ Test Submitted Successfully!
                </p>
              </div>
            )}

            {/* Result Cards */}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  Score
                </p>

                <p className="text-2xl font-bold text-blue-700">
                  {score}/{totalQuestions}
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  Percentage
                </p>

                <p className="text-2xl font-bold text-purple-700">
                  {percentage}%
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  Correct
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {score}
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  Incorrect
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {incorrectCount}
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <p className="text-sm text-gray-500">
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

          {/* ================================= */}
          {/* QUESTION NAVIGATION */}
          {/* ================================= */}

          <div className="md:col-span-1">

            <div className="sticky top-5 rounded-lg bg-white p-5 shadow-md">

              <h2 className="mb-4 font-bold text-gray-800">
                Questions
              </h2>

              <div className="grid grid-cols-5 gap-2">

                {test.questions.map((q, index) => {

                  const isAnswered =
                    answers[q._id] !== undefined;

                  const isCurrent =
                    currentQuestion === index;

                  let buttonStyle =
                    "bg-gray-100 text-gray-700";

                  if (isCurrent) {
                    buttonStyle =
                      "bg-blue-700 text-white ring-2 ring-blue-300";
                  } else if (isAnswered) {
                    buttonStyle =
                      "border border-green-300 bg-green-100 text-green-700";
                  }

                  if (submitted) {

                    if (
                      answers[q._id] ===
                      q.correctAnswerIndex
                    ) {
                      buttonStyle =
                        "bg-green-500 text-white";
                    } else if (isAnswered) {
                      buttonStyle =
                        "bg-red-500 text-white";
                    } else {
                      buttonStyle =
                        "bg-gray-200 text-gray-500";
                    }
                  }

                  return (
                    <button
                      key={q._id}
                      onClick={() =>
                        setCurrentQuestion(index)
                      }
                      className={`h-10 w-10 rounded-lg text-sm font-semibold ${buttonStyle}`}
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
                    <span className="h-4 w-4 rounded border border-green-300 bg-green-100"></span>
                    Answered
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded bg-gray-100"></span>
                    Not Answered
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded bg-blue-700"></span>
                    Current
                  </div>

                </div>
              )}

              {/* Progress */}

              <div className="mt-5 border-t pt-4">

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

            <div className="rounded-lg bg-white p-6 shadow-md">

              <p className="mb-2 text-sm text-gray-500">
                Question {currentQuestion + 1} of{" "}
                {totalQuestions}
              </p>

              <p className="mb-5 text-lg font-semibold text-gray-800">
                {currentQ.questionText}
              </p>

              {/* OPTIONS */}

              <div className="space-y-3">

                {currentQ.options.map(
                  (option, optIndex) => {

                    const isSelected =
                      answers[currentQ._id] ===
                      optIndex;

                    const isCorrect =
                      optIndex ===
                      currentQ.correctAnswerIndex;

                    let optionStyle =
                      "border-gray-300 hover:border-blue-400";

                    if (submitted && isCorrect) {
                      optionStyle =
                        "border-green-500 bg-green-50";
                    } else if (
                      submitted &&
                      isSelected &&
                      !isCorrect
                    ) {
                      optionStyle =
                        "border-red-500 bg-red-50";
                    } else if (isSelected) {
                      optionStyle =
                        "border-blue-500 bg-blue-50";
                    }

                    return (
                      <label
                        key={optIndex}
                        className={`block cursor-pointer rounded-lg border px-4 py-3 transition ${optionStyle}`}
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
                  }
                )}

              </div>

              {/* ================================= */}
              {/* QUESTION NAVIGATION */}
              {/* ================================= */}

              <div className="mt-8 flex justify-between gap-4">

                <button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.max(
                        0,
                        currentQuestion - 1
                      )
                    )
                  }
                  disabled={currentQuestion === 0}
                  className="rounded bg-gray-200 px-5 py-2 text-gray-700 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentQuestion <
                totalQuestions - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestion(
                        Math.min(
                          totalQuestions - 1,
                          currentQuestion + 1
                        )
                      )
                    }
                    className="rounded bg-blue-700 px-5 py-2 text-white hover:bg-blue-800"
                  >
                    Next →
                  </button>
                ) : !submitted ? (
                  <button
                    onClick={handleSubmit}
                    className="rounded bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
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
            className="mt-6 block rounded-lg bg-gray-700 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
          >
            Back to Mock Tests
          </Link>
        )}

      </div>
    </div>
  );
}

export default TakeMockTest;