import { useState, useEffect } from "react";
import api from "../api/axios";
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
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/attempts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttempts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10">Loading your performance data...</p>
    );

  const chartData = [...attempts].reverse().map((a, index) => ({
    name: `Attempt ${index + 1}`,
    percentage: Math.round((a.score / a.totalQuestions) * 100),
  }));

  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (sum, a) => sum + (a.score / a.totalQuestions) * 100,
            0,
          ) / attempts.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Your Performance
      </h1>

      {attempts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          You haven't attempted any mock tests yet. Take one to see your
          progress here!
        </p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white shadow-md rounded-lg p-5 text-center">
              <p className="text-gray-500 text-sm">Tests Taken</p>
              <p className="text-3xl font-bold text-blue-700">
                {attempts.length}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-5 text-center">
              <p className="text-gray-500 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-blue-700">
                {averageScore}%
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-5 text-center">
              <p className="text-gray-500 text-sm">Latest Score</p>
              <p className="text-3xl font-bold text-blue-700">
                {Math.round(
                  (attempts[0].score / attempts[0].totalQuestions) * 100,
                )}
                %
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Score Trend
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-md rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Attempt History
            </h2>
            <div className="space-y-2">
              {attempts.map((a) => (
                <div
                  key={a._id}
                  className="flex justify-between border-b border-gray-100 py-2 text-sm"
                >
                  <span className="text-gray-700">{a.testTitle}</span>
                  <span className="text-gray-500">
                    {a.score}/{a.totalQuestions} •{" "}
                    {new Date(a.attemptedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
