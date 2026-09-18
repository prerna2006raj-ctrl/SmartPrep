import { useState } from "react";
import api from "../api/axios";

function StudyPlanner() {
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [weakSubjects, setWeakSubjects] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlan("");
    setLoading(true);

    try {
      const res = await api.post("/ai/generate-study-plan", {
        examName,
        examDate,
        hoursPerDay: hoursPerDay || undefined,
        weakSubjects: weakSubjects || undefined,
      });
      setPlan(res.data.plan);
    } catch (err) {
      setError(
        "Something went wrong while generating your plan. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-1 text-center">
          AI Study Planner
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          Get a personalized week-by-week study plan tailored to your exam and
          timeline
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Name
          </label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. SSC CGL"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Date
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hours Available Per Day (optional)
          </label>
          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            placeholder="e.g. 5"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weak Subjects/Topics (optional)
          </label>
          <input
            type="text"
            value={weakSubjects}
            onChange={(e) => setWeakSubjects(e.target.value)}
            placeholder="e.g. Quantitative Aptitude, English"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Generating your plan..." : "Generate Study Plan"}
          </button>
        </form>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {plan && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold text-blue-700 mb-4">
              Your Study Plan
            </h2>
            <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
              {plan}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyPlanner;
