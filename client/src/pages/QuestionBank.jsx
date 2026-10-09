
import { useEffect, useMemo, useState } from "react";
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
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function QuestionBank() {
  const { category, exam } = useParams();

  // Resolve URL slugs such as /exams/ssc/ssc-cgl/question-bank
  // to the exact exam name stored in MongoDB: "SSC CGL".
  const examName = useMemo(() => {
    const categoryData = examCategories.find(
      (item) => slugify(item.name) === slugify(category)
    );

    const matchedExam = categoryData?.exams.find(
      (item) => slugify(item) === slugify(exam)
    );

    if (matchedExam) return matchedExam;

    // Fallback for routes whose exam slug includes the category.
    const allExams = examCategories.flatMap((item) => item.exams);
    const matchedBySlug = allExams.find(
      (item) => slugify(item) === slugify(exam)
    );

    if (matchedBySlug) return matchedBySlug;

    return exam
      ? exam
          .split("-")
          .map((word) =>
            word ? word.charAt(0).toUpperCase() + word.slice(1) : ""
          )
          .join(" ")
      : "SSC CGL";
  }, [category, exam]);

  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [importantOnly, setImportantOnly] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

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
        }
      } catch (err) {
        if (!cancelled) {
          setQuestions([]);
          setError(
            err.response?.data?.message ||
              "Unable to load Question Bank questions. Please check your connection and try again."
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

  // Build the topic list from the fetched questions.
  const topics = useMemo(() => {
    const matchingQuestions =
      selectedSubject === "All Subjects"
        ? questions
        : questions.filter((q) => q.subject === selectedSubject);

    return [
      ...new Set(
        matchingQuestions
          .map((q) => q.topic || "General")
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [questions, selectedSubject]);

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

      const importantMatches =
        !importantOnly || question.isImportant === true;

      return (
        subjectMatches &&
        topicMatches &&
        difficultyMatches &&
        importantMatches
      );
    });
  }, [
    questions,
    selectedSubject,
    selectedTopic,
    selectedDifficulty,
    importantOnly,
  ]);

  const resetFilters = () => {
    setSelectedSubject("All Subjects");
    setSelectedTopic("All Topics");
    setSelectedDifficulty("All");
    setImportantOnly(false);
  };

  const toggleAnswer = (questionId) => {
    setRevealedAnswers((previous) => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  };

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
            Filter by subject, topic, and difficulty, then reveal answers and
            explanations to check your understanding.
          </p>
        </div>

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
                onChange={(event) =>
                  setSelectedDifficulty(event.target.value)
                }
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

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="font-medium">Loading questions...</p>
            <p className="mt-1 text-sm text-slate-500">
              Fetching questions for {examName}.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-800">
              Unable to load questions
            </h2>
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

        {!loading && !error && questions.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-bold text-amber-900">
              No questions found for {examName}
            </h2>
            <p className="mt-2 text-sm text-amber-800">
              The API responded successfully, but no questions matched this
              exam name. Check the exam route and the exact exam value stored
              in the database.
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

        {!loading && !error && filteredQuestions.length > 0 && (
          <div className="space-y-5">
            {filteredQuestions.map((question, index) => {
              const questionId = question._id || `${question.subject}-${index}`;
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