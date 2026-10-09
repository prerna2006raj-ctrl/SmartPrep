import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import examCategories from "../data/examCategories";

const SUBJECTS = [
  "Quantitative Aptitude",
  "General Intelligence & Reasoning",
  "English",
  "General Awareness",
];

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getQuestionId = (question) =>
  question._id || `${question.subject}-${question.questionText}`;

function QuestionBank() {
  const { category, exam } = useParams();

  // Resolve URL slugs to the exam name stored in MongoDB.
  const examName = useMemo(() => {
    const categoryData = examCategories.find(
      (item) => slugify(item.name) === slugify(category),
    );

    const matchedExam = categoryData?.exams.find(
      (item) => slugify(item) === slugify(exam),
    );

    if (matchedExam) return matchedExam;

    const allExams = examCategories.flatMap((item) => item.exams);

    const matchedBySlug = allExams.find(
      (item) => slugify(item) === slugify(exam),
    );

    if (matchedBySlug) return matchedBySlug;

    return exam
      ? exam
          .split("-")
          .map((word) =>
            word ? word.charAt(0).toUpperCase() + word.slice(1) : "",
          )
          .join(" ")
      : "SSC CGL";
  }, [category, exam]);

  // Question Bank data and filters.
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [importantOnly, setImportantOnly] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // Practice Mode state.
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceSelections, setPracticeSelections] = useState({});
  const [practiceChecked, setPracticeChecked] = useState({});
  const [reviewMistakesOnly, setReviewMistakesOnly] = useState(false);
  // Persistent practice history state.
  const [practiceStartedAt, setPracticeStartedAt] = useState(null);
  const [historySaveStatus, setHistorySaveStatus] = useState("");
  const savedSessionRef = useRef(false);
  // Loading and error state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  // Fetch questions for the selected exam.
  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/questions", {
          params: { exam: examName },
        });

        const data = response.data;

        const fetchedQuestions = Array.isArray(data)
          ? data
          : Array.isArray(data?.questions)
            ? data.questions
            : [];

        if (!cancelled) {
          setQuestions(fetchedQuestions);
          setRevealedAnswers({});
          setPracticeMode(false);
          setPracticeIndex(0);
          setPracticeSelections({});
          setPracticeChecked({});
          setReviewMistakesOnly(false);
        }
      } catch (err) {
        if (!cancelled) {
          setQuestions([]);
          setError(
            err.response?.data?.message ||
              "Unable to load Question Bank questions. Please check your connection and try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchQuestions();

    return () => {
      cancelled = true;
    };
  }, [examName, retryKey]);

  // Calculate topic-wise question counts for the selected subject.
  const topicCounts = useMemo(() => {
    const matchingQuestions =
      selectedSubject === "All Subjects"
        ? questions
        : questions.filter((q) => q.subject === selectedSubject);

    const counts = matchingQuestions.reduce((result, question) => {
      const topic = (question.topic || "General").trim() || "General";
      result[topic] = (result[topic] || 0) + 1;
      return result;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [questions, selectedSubject]);

  const topics = useMemo(
    () => topicCounts.map((topic) => topic.name),
    [topicCounts],
  );

  // Apply the existing filters.
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const subjectMatches =
        selectedSubject === "All Subjects" ||
        question.subject === selectedSubject;

      const topicMatches =
        selectedTopic === "All Topics" ||
        (question.topic || "General") === selectedTopic;

      const difficultyMatches =
        selectedDifficulty === "All" ||
        question.difficulty === selectedDifficulty;

      const importantMatches = !importantOnly || question.isImportant === true;

      return (
        subjectMatches && topicMatches && difficultyMatches && importantMatches
      );
    });
  }, [
    questions,
    selectedSubject,
    selectedTopic,
    selectedDifficulty,
    importantOnly,
  ]);

  // In review mode, include incorrect and unanswered questions.
  const practiceQuestions = useMemo(() => {
    if (!reviewMistakesOnly) return filteredQuestions;

    return filteredQuestions.filter((question) => {
      const id = getQuestionId(question);

      return (
        !practiceChecked[id] ||
        practiceSelections[id] !== question.correctAnswerIndex
      );
    });
  }, [
    filteredQuestions,
    reviewMistakesOnly,
    practiceChecked,
    practiceSelections,
  ]);

  // Calculate the student's current practice results.
  const practiceAttempted = filteredQuestions.filter((question) => {
    return practiceChecked[getQuestionId(question)];
  }).length;

  const practiceScore = filteredQuestions.filter((question) => {
    const id = getQuestionId(question);

    return (
      practiceChecked[id] &&
      practiceSelections[id] === question.correctAnswerIndex
    );
  }).length;

  const practiceIncorrect = practiceAttempted - practiceScore;

  const practiceAccuracy = practiceAttempted
    ? Math.round((practiceScore / practiceAttempted) * 100)
    : 0;

  // Save a completed Practice Mode session once.
  useEffect(() => {
    const isPracticeComplete =
      practiceMode &&
      !reviewMistakesOnly &&
      filteredQuestions.length > 0 &&
      practiceIndex >= practiceQuestions.length;

    if (!isPracticeComplete || savedSessionRef.current) {
      return;
    }

    // Mark this session before making the request to prevent duplicates.
    savedSessionRef.current = true;

    const durationSeconds = practiceStartedAt
      ? Math.max(0, Math.floor((Date.now() - practiceStartedAt) / 1000))
      : 0;

    const answers = filteredQuestions.map((question) => {
      const id = getQuestionId(question);
      const isAttempted = Boolean(practiceChecked[id]);
      const selectedAnswer = practiceSelections[id];

      const isCorrect =
        isAttempted && selectedAnswer === question.correctAnswerIndex;

      return {
        questionId: String(id),
        questionText: question.questionText || "",
        selectedAnswerIndex: Number.isInteger(selectedAnswer)
          ? selectedAnswer
          : null,
        correctAnswerIndex: Number.isInteger(question.correctAnswerIndex)
          ? question.correctAnswerIndex
          : null,
        isCorrect,
      };
    });

    const incorrectAnswers = practiceAttempted - practiceScore;
    const unansweredQuestions = filteredQuestions.length - practiceAttempted;

    const savePracticeAttempt = async () => {
      setHistorySaveStatus("saving");

      try {
        await api.post("/practice-history", {
          exam: examName,
          subject: selectedSubject,
          topic: selectedTopic,
          totalQuestions: filteredQuestions.length,
          attemptedQuestions: practiceAttempted,
          correctAnswers: practiceScore,
          incorrectAnswers,
          unansweredQuestions,
          durationSeconds,
          answers,
        });

        setHistorySaveStatus("saved");
      } catch (err) {
        console.error(
          "Unable to save practice history:",
          err.response?.data || err.message,
        );

        setHistorySaveStatus("error");
      }
    };

    savePracticeAttempt();
  }, [
    practiceMode,
    reviewMistakesOnly,
    practiceIndex,
    practiceQuestions.length,
    filteredQuestions,
    practiceChecked,
    practiceSelections,
    practiceAttempted,
    practiceScore,
    practiceStartedAt,
    examName,
    selectedSubject,
    selectedTopic,
  ]);
  // Reset the current practice session.
  const startPractice = () => {
    setPracticeIndex(0);
    setPracticeSelections({});
    setPracticeChecked({});
    setReviewMistakesOnly(false);

    setPracticeStartedAt(Date.now());
    setHistorySaveStatus("");
    savedSessionRef.current = false;

    setPracticeMode(true);
  };

  // Exit Practice Mode without affecting the existing question list.
  const exitPractice = () => {
    setPracticeMode(false);
    setReviewMistakesOnly(false);
    setPracticeIndex(0);
  };

  // Check the selected answer.
  const checkPracticeAnswer = () => {
    const question = practiceQuestions[practiceIndex];

    if (!question) return;

    const id = getQuestionId(question);

    if (practiceSelections[id] === undefined || practiceChecked[id]) {
      return;
    }

    setPracticeChecked((previous) => ({
      ...previous,
      [id]: true,
    }));
  };

  // Reset filters.
  const resetFilters = () => {
    setSelectedSubject("All Subjects");
    setSelectedTopic("All Topics");
    setSelectedDifficulty("All");
    setImportantOnly(false);
  };

  // Toggle an answer explanation in browsing mode.
  const toggleAnswer = (questionId) => {
    setRevealedAnswers((previous) => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  };

  // Return the correct option safely.
  const getCorrectAnswer = (question) => {
    const index = question.correctAnswerIndex;

    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < (question.options || []).length
    ) {
      return question.options[index];
    }

    return "Correct answer is unavailable.";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            SmartPrep · Practice Zone
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Question Bank
          </h1>

          <p className="mt-2 text-slate-600">
            Practice important questions for{" "}
            <span className="font-semibold text-slate-800">{examName}</span>.
            Explore topics, apply filters, reveal explanations, or start
            Practice Mode to track your answers and review mistakes.
          </p>
        </div>

        {/* QUESTION STATISTICS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total questions</p>
            <p className="mt-2 text-3xl font-bold">{questions.length}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Matching questions</p>
            <p className="mt-2 text-3xl font-bold">
              {filteredQuestions.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Subjects available</p>
            <p className="mt-2 text-3xl font-bold">
              {new Set(questions.map((q) => q.subject)).size}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Topics available</p>
            <p className="mt-2 text-3xl font-bold">
              {new Set(questions.map((q) => q.topic || "General")).size}
            </p>
          </div>
        </div>

        {/* TOPIC-WISE QUESTION COUNTS */}

        <section className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Explore Topics
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a topic to view its questions.
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              {topicCounts.length} topics
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => setSelectedTopic("All Topics")}
              className={`flex items-center justify-between rounded-xl border p-5 text-left transition ${
                selectedTopic === "All Topics"
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
              }`}
            >
              <span>
                <span className="block font-semibold text-slate-900">
                  All Topics
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  Browse every topic
                </span>
              </span>

              <span className="rounded-lg bg-indigo-100 px-3 py-2 text-lg font-bold text-indigo-700">
                {selectedSubject === "All Subjects"
                  ? questions.length
                  : questions.filter((q) => q.subject === selectedSubject)
                      .length}
              </span>
            </button>

            {topicCounts.map((topic) => (
              <button
                key={topic.name}
                type="button"
                onClick={() => setSelectedTopic(topic.name)}
                className={`flex items-center justify-between rounded-xl border p-5 text-left transition ${
                  selectedTopic === topic.name
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <span className="min-w-0 pr-3">
                  <span className="block font-semibold text-slate-900">
                    {topic.name}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {topic.count === 1
                      ? "1 question"
                      : `${topic.count} questions`}
                  </span>
                </span>

                <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-lg font-bold text-slate-700">
                  {topic.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* FILTER QUESTIONS */}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Filter questions</h2>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Subject
              </span>
              <select
                value={selectedSubject}
                onChange={(event) => {
                  setSelectedSubject(event.target.value);
                  setSelectedTopic("All Topics");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Subjects</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Topic
              </span>
              <select
                value={selectedTopic}
                onChange={(event) => setSelectedTopic(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Difficulty
              </span>
              <select
                value={selectedDifficulty}
                onChange={(event) => setSelectedDifficulty(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="All">All difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
              <input
                type="checkbox"
                checked={importantOnly}
                onChange={(event) => setImportantOnly(event.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />
              <span className="text-sm font-medium text-slate-700">
                Important questions only
              </span>
            </label>
          </div>
        </section>

        {/* PRACTICE MODE CONTROLS */}

        {!loading && !error && filteredQuestions.length > 0 && (
          <section className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Practice Mode
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Answer questions one by one, check explanations, track your
                  score, and review mistakes.
                </p>
                <p className="mt-2 text-sm font-medium text-indigo-700">
                  {filteredQuestions.length} questions in your current selection
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (practiceMode) {
                    exitPractice();
                  } else {
                    startPractice();
                  }
                }}
                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {practiceMode ? "Exit Practice" : "Start Practice"}
              </button>
            </div>
          </section>
        )}

        {/* LOADING STATE */}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="font-medium">Loading questions...</p>
            <p className="mt-1 text-sm text-slate-500">
              Fetching questions for {examName}.
            </p>
          </div>
        )}

        {/* ERROR STATE */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-800">Unable to load questions</h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((value) => value + 1)}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* NO QUESTIONS STATE */}

        {!loading && !error && questions.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-bold text-amber-900">
              No questions found for {examName}
            </h2>
            <p className="mt-2 text-sm text-amber-800">
              The API responded successfully, but no questions matched this exam
              name. Check the exam route and the exact exam value stored in the
              database.
            </p>
            <button
              type="button"
              onClick={() => setRetryKey((value) => value + 1)}
              className="mt-4 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
            >
              Reload questions
            </button>
          </div>
        )}

        {/* NO FILTER MATCHES */}

        {!loading &&
          !error &&
          questions.length > 0 &&
          filteredQuestions.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="font-bold">No matching questions</h2>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your filters or reset them to view all questions.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Reset filters
              </button>
            </div>
          )}

        {/* ONE-QUESTION PRACTICE MODE */}

        {!loading && !error && practiceMode && filteredQuestions.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {practiceIndex >= practiceQuestions.length ? (
              <div className="py-6 text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  {reviewMistakesOnly
                    ? "Review complete!"
                    : "Practice complete!"}
                </h2>

                <p className="mt-3 text-slate-600">
                  You attempted {practiceAttempted} of{" "}
                  {filteredQuestions.length} questions.
                </p>
                <div className="mt-3 text-sm font-medium" aria-live="polite">
                  {historySaveStatus === "saving" && (
                    <p className="text-indigo-600">
                      Saving your practice history...
                    </p>
                  )}

                  {historySaveStatus === "saved" && (
                    <p className="text-green-700">
                      ✓ Your practice session has been saved to your history.
                    </p>
                  )}

                  {historySaveStatus === "error" && (
                    <div className="text-red-700">
                      <p>We couldn't save your practice history.</p>

                      <button
                        type="button"
                        onClick={() => {
                          savedSessionRef.current = false;
                          setHistorySaveStatus("");
                          setPracticeIndex(practiceQuestions.length);
                        }}
                        className="mt-2 rounded-lg border border-red-300 px-3 py-2 hover:bg-red-50"
                      >
                        Retry saving
                      </button>
                    </div>
                  )}
                </div>

                <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-indigo-50 p-4">
                    <p className="text-sm text-slate-600">Correct</p>
                    <p className="mt-1 text-2xl font-bold text-indigo-700">
                      {practiceScore}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-slate-600">Incorrect</p>
                    <p className="mt-1 text-2xl font-bold text-red-700">
                      {practiceIncorrect}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-sm text-slate-600">Accuracy</p>
                    <p className="mt-1 text-2xl font-bold text-green-700">
                      {practiceAccuracy}%
                    </p>
                  </div>
                </div>

                {!reviewMistakesOnly &&
                  filteredQuestions.some((question) => {
                    const id = getQuestionId(question);

                    return (
                      !practiceChecked[id] ||
                      practiceSelections[id] !== question.correctAnswerIndex
                    );
                  }) && (
                    <button
                      type="button"
                      onClick={() => {
                        setReviewMistakesOnly(true);
                        setPracticeIndex(0);
                      }}
                      className="mr-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                      Review mistakes
                    </button>
                  )}

                {reviewMistakesOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewMistakesOnly(false);
                      setPracticeIndex(0);
                    }}
                    className="mr-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                  >
                    Back to all questions
                  </button>
                )}

                <button
                  type="button"
                  onClick={startPractice}
                  className="mt-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Practise again
                </button>

                <button
                  type="button"
                  onClick={exitPractice}
                  className="ml-2 mt-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Exit Practice
                </button>
              </div>
            ) : (
              (() => {
                const question = practiceQuestions[practiceIndex];
                const id = getQuestionId(question);
                const isChecked = Boolean(practiceChecked[id]);
                const selectedAnswer = practiceSelections[id];

                return (
                  <>
                    {/* QUESTION PROGRESS */}

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                        Question {practiceIndex + 1} of{" "}
                        {practiceQuestions.length}
                      </span>

                      <span className="text-sm font-medium text-slate-600">
                        Score: {practiceScore}/{practiceAttempted}
                      </span>
                    </div>

                    <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                          width: `${
                            ((practiceIndex + 1) / practiceQuestions.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    {/* QUESTION DETAILS */}

                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {question.subject}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {question.topic || "General"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          question.difficulty === "Easy"
                            ? "bg-green-50 text-green-700"
                            : question.difficulty === "Hard"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {question.difficulty || "Medium"}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold leading-7 text-slate-900 sm:text-xl">
                      {question.questionText}
                    </h2>

                    {/* SELECTABLE OPTIONS */}

                    <div className="mt-6 space-y-3">
                      {(question.options || []).map((option, index) => {
                        const isCorrect = index === question.correctAnswerIndex;
                        const isSelected = selectedAnswer === index;

                        let optionStyle =
                          "border-slate-200 bg-white hover:border-indigo-300";

                        if (isSelected && !isChecked) {
                          optionStyle =
                            "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100";
                        }

                        if (isChecked && isCorrect) {
                          optionStyle =
                            "border-green-400 bg-green-50 text-green-800";
                        } else if (isChecked && isSelected && !isCorrect) {
                          optionStyle = "border-red-400 bg-red-50 text-red-800";
                        }

                        return (
                          <button
                            key={`${id}-practice-${index}`}
                            type="button"
                            disabled={isChecked}
                            onClick={() =>
                              setPracticeSelections((previous) => ({
                                ...previous,
                                [id]: index,
                              }))
                            }
                            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition ${optionStyle} disabled:cursor-default`}
                          >
                            <span className="font-bold">
                              {String.fromCharCode(65 + index)}.
                            </span>

                            <span className="flex-1">{option}</span>

                            {isChecked && isCorrect && (
                              <span className="font-bold">✓ Correct</span>
                            )}

                            {isChecked && isSelected && !isCorrect && (
                              <span className="font-bold">✗</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* FEEDBACK AND EXPLANATION */}

                    {isChecked && (
                      <div
                        className={`mt-5 rounded-xl border p-4 ${
                          selectedAnswer === question.correctAnswerIndex
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <p className="font-bold">
                          {selectedAnswer === question.correctAnswerIndex
                            ? "Correct answer!"
                            : "Not quite. Keep practising!"}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          <span className="font-semibold">
                            Correct answer:{" "}
                          </span>
                          {getCorrectAnswer(question)}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          <span className="font-semibold">Explanation: </span>
                          {question.explanation ||
                            "No explanation has been added for this question yet."}
                        </p>
                      </div>
                    )}

                    {/* NAVIGATION AND CHECK ANSWER */}

                    <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
                      <button
                        type="button"
                        disabled={practiceIndex === 0}
                        onClick={() =>
                          setPracticeIndex((previous) => previous - 1)
                        }
                        className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                      >
                        Previous
                      </button>

                      {!isChecked ? (
                        <button
                          type="button"
                          disabled={selectedAnswer === undefined}
                          onClick={checkPracticeAnswer}
                          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Check answer
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setPracticeIndex((previous) => previous + 1)
                          }
                          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
                        >
                          {practiceIndex === practiceQuestions.length - 1
                            ? "View results"
                            : "Next question"}
                        </button>
                      )}
                    </div>
                  </>
                );
              })()
            )}
          </section>
        )}

        {/* EXISTING QUESTION BANK BROWSING MODE */}

        {!loading &&
          !error &&
          !practiceMode &&
          filteredQuestions.length > 0 && (
            <div className="space-y-5">
              {filteredQuestions.map((question, index) => {
                const questionId =
                  question._id || `${question.subject}-${index}`;
                const answerRevealed = Boolean(revealedAnswers[questionId]);

                return (
                  <article
                    key={questionId}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {question.subject}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {question.topic || "General"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          question.difficulty === "Easy"
                            ? "bg-green-50 text-green-700"
                            : question.difficulty === "Hard"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {question.difficulty || "Medium"}
                      </span>

                      {question.isImportant && (
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                          ★ Important
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold leading-7 text-slate-900 sm:text-lg">
                      <span className="mr-2 text-indigo-600">
                        Q{index + 1}.
                      </span>
                      {question.questionText}
                    </h3>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(question.options || []).map((option, optionIndex) => (
                        <div
                          key={`${questionId}-option-${optionIndex}`}
                          className={`rounded-xl border p-3 text-sm ${
                            answerRevealed &&
                            optionIndex === question.correctAnswerIndex
                              ? "border-green-300 bg-green-50 font-medium text-green-800"
                              : "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="mr-2 font-semibold">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>

                          {option}

                          {answerRevealed &&
                            optionIndex === question.correctAnswerIndex && (
                              <span className="ml-2 text-xs font-bold">
                                ✓ Correct answer
                              </span>
                            )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => toggleAnswer(questionId)}
                        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        {answerRevealed
                          ? "Hide answer and explanation"
                          : "Show answer and explanation"}
                      </button>

                      {answerRevealed && (
                        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                          <p className="font-semibold text-green-800">
                            Correct answer: {getCorrectAnswer(question)}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            <span className="font-semibold">Explanation: </span>
                            {question.explanation ||
                              "No explanation has been added for this question yet."}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}

export default QuestionBank;
