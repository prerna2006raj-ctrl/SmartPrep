import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PerformanceAnalytics() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");

  // -----------------------------------------
  // GET TEST ATTEMPTS
  // -----------------------------------------

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/attempts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.attempts || [];

        setAttempts(data);
      } catch (error) {
        console.error("Error loading performance analytics:", error);

        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  // -----------------------------------------
  // FILTER BY DATE
  // -----------------------------------------

  const filteredAttempts = useMemo(() => {
    if (range === "all") {
      return attempts;
    }

    const days = Number(range);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return attempts.filter((attempt) => {
      return new Date(attempt.attemptedAt) >= cutoff;
    });
  }, [attempts, range]);

  // -----------------------------------------
  // CALCULATIONS
  // -----------------------------------------

  const scores = filteredAttempts.map((attempt) => {
    if (!attempt.totalQuestions) {
      return 0;
    }

    return Math.round((attempt.score / attempt.totalQuestions) * 100);
  });

  const totalTests = filteredAttempts.length;

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : 0;

  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const bestAttempt =
    filteredAttempts.length > 0
      ? filteredAttempts[scores.indexOf(bestScore)]
      : null;

  // -----------------------------------------
  // PERFORMANCE TREND
  // -----------------------------------------

  const trendData = [...filteredAttempts].reverse().map((attempt) => ({
    date: new Date(attempt.attemptedAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),

    score: attempt.totalQuestions
      ? Math.round((attempt.score / attempt.totalQuestions) * 100)
      : 0,

    testName: attempt.testTitle || "Mock Test",
  }));

  // -----------------------------------------
  // SCORE DISTRIBUTION
  // -----------------------------------------

  const distributionData = [
    {
      range: "0-40%",
      tests: scores.filter((s) => s <= 40).length,
    },
    {
      range: "41-60%",
      tests: scores.filter((s) => s > 40 && s <= 60).length,
    },
    {
      range: "61-80%",
      tests: scores.filter((s) => s > 60 && s <= 80).length,
    },
    {
      range: "81-100%",
      tests: scores.filter((s) => s > 80).length,
    },
  ];

  // -----------------------------------------
  // STRONGEST / WEAKEST
  // -----------------------------------------

  let strongestTest = null;
  let weakestTest = null;

  if (filteredAttempts.length > 0) {
    strongestTest = filteredAttempts.reduce((best, current) => {
      const currentScore = current.totalQuestions
        ? current.score / current.totalQuestions
        : 0;

      const bestScoreValue = best.totalQuestions
        ? best.score / best.totalQuestions
        : 0;

      return currentScore > bestScoreValue ? current : best;
    });

    weakestTest = filteredAttempts.reduce((weakest, current) => {
      const currentScore = current.totalQuestions
        ? current.score / current.totalQuestions
        : 0;

      const weakestScoreValue = weakest.totalQuestions
        ? weakest.score / weakest.totalQuestions
        : 0;

      return currentScore < weakestScoreValue ? current : weakest;
    });
  }

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />

          <p className="text-slate-500">Loading performance analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
              📊
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Performance Analytics
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Track your progress, analyze your performance and identify your weak
            areas.
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full md:w-auto rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none"
        >
          <option value="7">Last 7 Days</option>

          <option value="30">Last 30 Days</option>

          <option value="90">Last 90 Days</option>

          <option value="all">All Time</option>
        </select>
      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {filteredAttempts.length === 0 ? (
        <div className="min-h-[500px] bg-white border border-slate-200 rounded-2xl flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-50 flex items-center justify-center text-4xl">
              📊
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              No test data yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Complete a mock test to start seeing your performance analytics
              here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* =====================================
              STAT CARDS
          ===================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {/* TOTAL TESTS */}

            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-xl">
                  📝
                </div>

                <span className="text-xs font-medium text-emerald-600">
                  Attempts
                </span>
              </div>

              <p className="text-sm text-slate-500">Total Tests Attempted</p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {totalTests}
              </p>

              <p className="text-xs text-slate-400 mt-2">Tests completed</p>
            </div>

            {/* AVERAGE */}

            <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-xl">
                  🎯
                </div>

                <span className="text-xs font-medium text-emerald-600">
                  Average
                </span>
              </div>

              <p className="text-sm text-slate-500">Average Score</p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {averageScore}%
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Across attempted tests
              </p>
            </div>

            {/* BEST SCORE */}

            <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center text-xl">
                  🏆
                </div>

                <span className="text-xs font-medium text-purple-600">
                  Best
                </span>
              </div>

              <p className="text-sm text-slate-500">Best Score</p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {bestScore}%
              </p>

              <p className="text-xs text-slate-400 mt-2 truncate">
                {bestAttempt?.testTitle || "No test"}
              </p>
            </div>

            {/* ACCURACY */}

            <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center text-xl">
                  🎯
                </div>

                <span className="text-xs font-medium text-orange-600">
                  Overall
                </span>
              </div>

              <p className="text-sm text-slate-500">Accuracy</p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {averageScore}%
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Based on test scores
              </p>
            </div>
          </div>

          {/* =====================================
              CHARTS
          ===================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-6">
            {/* PERFORMANCE TREND */}

            <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-slate-800">
                    Performance Trend
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Score across your recent tests
                  </p>
                </div>

                <span className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-600">
                  Score (%)
                </span>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                    />

                    <Tooltip
                      formatter={(value) => [`${value}%`, "Score"]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.testName || ""
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#4361ee"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#4361ee",
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PERFORMANCE OVERVIEW */}

            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-slate-800">Performance Overview</h2>

              <p className="text-xs text-slate-400 mt-1">
                Overall performance snapshot
              </p>

              <div className="flex justify-center mt-6">
                <div
                  className="w-44 h-44 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#4361ee ${averageScore}%, #e2e8f0 ${averageScore}% 100%)`,
                  }}
                >
                  <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">
                      {averageScore}%
                    </span>

                    <span className="text-xs text-slate-500">
                      Overall Accuracy
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />

                    <span className="text-sm text-slate-600">
                      Current Score
                    </span>
                  </div>

                  <span className="font-semibold">{averageScore}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-200" />

                    <span className="text-sm text-slate-600">Remaining</span>
                  </div>

                  <span className="font-semibold">{100 - averageScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================
              RECENT ATTEMPTS
          ===================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800">
                  Recent Test Attempts
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Your latest mock test performance
                </p>
              </div>

              <span className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-blue-600">
                View All
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                      Date
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                      Test Name
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                      Score
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                      Total Questions
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                      Accuracy
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttempts.slice(0, 8).map((attempt) => {
                    const score = attempt.totalQuestions
                      ? Math.round(
                          (attempt.score / attempt.totalQuestions) * 100,
                        )
                      : 0;

                    return (
                      <tr
                        key={attempt._id}
                        className="border-b border-slate-50 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 text-sm text-slate-500">
                          {new Date(attempt.attemptedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-blue-700">
                          {attempt.testTitle}
                        </td>

                        <td className="px-4 py-4 text-sm font-bold text-slate-800">
                          {attempt.score}/{attempt.totalQuestions}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-500">
                          {attempt.totalQuestions}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              score >= 80
                                ? "bg-emerald-50 text-emerald-600"
                                : score >= 60
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {score}%
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* =====================================
              BOTTOM SECTION
          ===================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* SCORE DISTRIBUTION */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-slate-800">Score Distribution</h2>

              <p className="text-xs text-slate-400 mt-1 mb-5">
                Number of tests in each score range
              </p>

              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                    <XAxis
                      dataKey="range"
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="tests"
                      name="Tests"
                      fill="#4361ee"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PERFORMANCE SUMMARY */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-slate-800">Performance Summary</h2>

              <p className="text-xs text-slate-400 mt-1 mb-5">
                Quick insights from your results
              </p>

              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="text-2xl">🏆</div>

                  <div>
                    <p className="font-semibold text-indigo-700">
                      Your Average Score is {averageScore}%
                    </p>

                    <p className="text-xs text-indigo-600 mt-1">
                      Keep practicing to improve your performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold text-slate-700 mb-3">
                  Key Insights
                </p>

                <div className="space-y-3">
                  {strongestTest && (
                    <div className="flex gap-3 text-sm text-slate-600">
                      <span className="text-emerald-500">✓</span>

                      <span>
                        Best performance:
                        <strong className="ml-1 text-slate-800">
                          {strongestTest.testTitle}
                        </strong>
                      </span>
                    </div>
                  )}

                  {weakestTest && (
                    <div className="flex gap-3 text-sm text-slate-600">
                      <span className="text-orange-500">✓</span>

                      <span>
                        Needs more practice:
                        <strong className="ml-1 text-slate-800">
                          {weakestTest.testTitle}
                        </strong>
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3 text-sm text-slate-600">
                    <span className="text-emerald-500">✓</span>

                    <span>
                      You have completed <strong>{totalTests}</strong> test
                      {totalTests !== 1 ? "s" : ""}.
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm text-slate-600">
                    <span className="text-emerald-500">✓</span>

                    <span>
                      Your highest score is <strong>{bestScore}%</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PerformanceAnalytics;
