import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generator states
  const [exam, setExam] = useState("SSC CGL");
  const [subject, setSubject] = useState("Quantitative Aptitude");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing mock tests
  const fetchTests = async () => {
    try {
      const res = await api.get("/mock-tests");
      setTests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load mock tests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Generate mock test
  const handleGenerateMockTest = async () => {
    try {
      setGenerating(true);
      setMessage("");
      setError("");

      const res = await api.post("/mock-tests/generate", {
        examCategory: exam,
        subject,
        numberOfQuestions: Number(numberOfQuestions),
        durationMinutes: Number(durationMinutes),
      });

      setMessage(res.data.message);

      // Refresh mock tests
      await fetchTests();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to generate mock test."
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center">
        Loading mock tests...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-700">
          Mock Tests
        </h1>

        {/* Generate Mock Test */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Generate Mock Test
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Automatically create a mock test using questions from
            the Question Bank.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Exam */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Exam
              </label>

              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="SSC CGL">SSC CGL</option>
                <option value="SSC CHSL">SSC CHSL</option>
                <option value="SSC MTS">SSC MTS</option>
                <option value="UPSC Civil Services">
                  UPSC Civil Services
                </option>
                <option value="IBPS PO">IBPS PO</option>
                <option value="SBI PO">SBI PO</option>
                <option value="RRB NTPC">RRB NTPC</option>
                <option value="GATE CSE">GATE CSE</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="Quantitative Aptitude">
                  Quantitative Aptitude
                </option>
                <option value="Reasoning">
                  Reasoning
                </option>
                <option value="English">
                  English
                </option>
                <option value="General Awareness">
                  General Awareness
                </option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Number of Questions
              </label>

              <select
                value={numberOfQuestions}
                onChange={(e) =>
                  setNumberOfQuestions(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="20">20 Questions</option>
                <option value="50">50 Questions</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Duration
              </label>

              <select
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="10">10 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerateMockTest}
            disabled={generating}
            className="mt-6 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {generating
              ? "Generating Mock Test..."
              : "Generate Mock Test"}
          </button>

          {/* Success message */}
          {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        {/* Existing Mock Tests */}
        <h2 className="mb-5 text-2xl font-bold text-gray-800">
          Available Mock Tests
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div
              key={test._id}
              className="rounded-lg bg-white p-5 shadow-md transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {test.title}
              </h3>

              <p className="mb-2 text-sm text-gray-500">
                {test.examCategory}
              </p>

              <p className="mb-4 text-sm text-gray-600">
                {test.questions.length} Questions •{" "}
                {test.durationMinutes} mins
              </p>

              <Link
                to={`/mock-tests/${test._id}`}
                className="inline-block rounded bg-blue-700 px-4 py-2 text-sm text-white transition hover:bg-blue-800"
              >
                Start Test
              </Link>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
            No mock tests available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default MockTests;