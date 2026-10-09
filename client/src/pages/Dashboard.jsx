
import { useState, useEffect } from "react";
import api from "../api/axios";
import StudyStreak from "../components/StudyStreak";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  // Existing mock-test history
  const [attempts, setAttempts] = useState([]);

  // New Question Bank practice history
  const [practiceAttempts, setPracticeAttempts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [mockTestError, setMockTestError] = useState("");
  const [practiceError, setPracticeError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      try {
        // Fetch both histories independently.
        const [mockResult, practiceResult] = await Promise.allSettled([
          api.get("/attempts", config),
          api.get("/practice-history", config),
        ]);

        if (cancelled) return;

        if (mockResult.status === "fulfilled") {
          const data = mockResult.value.data;

          setAttempts(
            Array.isArray(data)
              ? data
              : Array.isArray(data?.attempts)
                ? data.attempts
                : [],
          );
        } else {
          console.error("Unable to load mock-test history:", mockResult.reason);
          setMockTestError("Unable to load mock-test history.");
        }

        if (practiceResult.status === "fulfilled") {
          const data = practiceResult.value.data;

          setPracticeAttempts(
            Array.isArray(data)
              ? data
              : Array.isArray(data?.attempts)
                ? data.attempts
                : [],
          );
        } else {
          console.error(
            "Unable to load practice history:",
            practiceResult.reason,
          );
          setPracticeError("Unable to load practice history.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="mt-10 text-center text-slate-600">
        Loading your performance data...
      </p>
    );
  }

  // Existing mock-test statistics
  const chartData = [...attempts].reverse().map((attempt, index) => ({
    name: `Attempt ${index + 1}`,
    percentage: attempt.totalQuestions
      ? Math.round((attempt.score / attempt.totalQuestions) * 100)
      : 0,
  }));

  const averageScore = attempts.length
    ? Math.round(
        attempts.reduce(
          (sum, attempt) =>
            sum +
            (attempt.totalQuestions
              ? (attempt.score / attempt.totalQuestions) * 100
              : 0),
          0,
        ) / attempts.length,
      )
    : 0;

  const latestScore = attempts.length
    ? attempts[0].totalQuestions
      ? Math.round(
          (attempts[0].score / attempts[0].totalQuestions) * 100,
        )
      : 0
    : 0;

  // New practice statistics
  const averagePracticeAccuracy = practiceAttempts.length
    ? Math.round(
        practiceAttempts.reduce(
          (sum, attempt) => sum + (attempt.accuracy || 0),
          0,
        ) / practiceAttempts.length,
      )
    : 0;

  const latestPracticeAccuracy = practiceAttempts.length
    ? practiceAttempts[0].accuracy || 0
    : 0;

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "Date unavailable"
      : parsedDate.toLocaleDateString();
  };

  const formatDuration = (seconds = 0) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    if (minutes === 0) return `${remainingSeconds}s`;

    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-700">
          Your Performance
        </h1>

        <p className="mb-8 text-center text-slate-500">
          Track your mock tests and Question Bank practice sessions.
        </p>

        {/* MOCK TEST DASHBOARD */}
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Mock Test Performance
          </h2>

          {mockTestError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {mockTestError}
            </p>
          ) : attempts.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
              You haven't attempted any mock tests yet.
            </p>
          ) : (
            <>
              <StudyStreak attempts={attempts} />

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-sm text-slate-500">Tests Taken</p>
                  <p className="mt-2 text-3xl font-bold text-blue-700">
                    {attempts.length}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-sm text-slate-500">Average Score</p>
                  <p className="mt-2 text-3xl font-bold text-blue-700">
                    {averageScore}%
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-sm text-slate-500">Latest Score</p>
                  <p className="mt-2 text-3xl font-bold text-blue-700">
                    {latestScore}%
                  </p>
                </div>
              </div>

              <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  Mock Test Score Trend
                </h3>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      name="Score"
                      unit="%"
                      stroke="#1d4ed8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  Mock Test History
                </h3>

                <div className="space-y-3">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt._id}
                      className="flex flex-col justify-between gap-2 border-b border-slate-100 py-3 text-sm sm:flex-row"
                    >
                      <span className="font-medium text-slate-700">
                        {attempt.testTitle || "Mock Test"}
                      </span>

                      <span className="text-slate-500">
                        {attempt.score}/{attempt.totalQuestions}
                        {" · "}
                        {formatDate(
                          attempt.attemptedAt || attempt.createdAt,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* QUESTION BANK PRACTICE HISTORY */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Question Bank Practice History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your previous practice sessions and monitor your accuracy.
            </p>
          </div>

          {practiceError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {practiceError}
            </p>
          ) : practiceAttempts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <h3 className="font-semibold text-slate-800">
                No practice sessions yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Complete a session in Question Bank Practice Mode to see your
                scores and history here.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Sessions Completed</p>
                  <p className="mt-2 text-3xl font-bold text-indigo-700">
                    {practiceAttempts.length}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Average Accuracy</p>
                  <p className="mt-2 text-3xl font-bold text-indigo-700">
                    {averagePracticeAccuracy}%
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Latest Accuracy</p>
                  <p className="mt-2 text-3xl font-bold text-indigo-700">
                    {latestPracticeAccuracy}%
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Previous Practice Sessions
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {practiceAttempts.map((attempt) => (
                    <article key={attempt._id} className="p-5">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {attempt.exam}
                          </h4>

                          <p className="mt-1 text-sm text-slate-600">
                            {attempt.subject || "All Subjects"}
                            {" · "}
                            {attempt.topic || "All Topics"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(attempt.createdAt)}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                          {attempt.accuracy || 0}% accuracy
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Score</p>
                          <p className="mt-1 font-bold text-slate-800">
                            {attempt.correctAnswers}/
                            {attempt.totalQuestions}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Attempted</p>
                          <p className="mt-1 font-bold text-slate-800">
                            {attempt.attemptedQuestions}
                          </p>
                        </div>

                        <div className="rounded-lg bg-green-50 p-3">
                          <p className="text-xs text-green-700">Correct</p>
                          <p className="mt-1 font-bold text-green-800">
                            {attempt.correctAnswers}
                          </p>
                        </div>

                        <div className="rounded-lg bg-red-50 p-3">
                          <p className="text-xs text-red-700">Incorrect</p>
                          <p className="mt-1 font-bold text-red-800">
                            {attempt.incorrectAnswers}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span>
                          Unanswered: {attempt.unansweredQuestions}
                        </span>

                        <span>
                          Duration: {formatDuration(attempt.durationSeconds)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

