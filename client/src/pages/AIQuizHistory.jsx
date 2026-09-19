import { useEffect, useState } from "react";
import api from "../api/axios";
function AIQuizHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/quiz-history");
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to load quiz history:", error);
      }
    };

    fetchHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await api.delete("/quiz-history");
      setHistory([]);
    } catch (error) {
      console.error("Failed to clear quiz history:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              AI Quiz History
            </h1>

            <p className="mt-1 text-gray-600">
              View your previously generated quiz results.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No Quiz History Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Generate and submit an AI quiz to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((quiz) => {
              const accuracy = Math.round(
                (quiz.score / quiz.totalQuestions) * 100,
              );

              return (
                <div key={quiz._id} className="rounded-lg bg-white p-5 shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {quiz.fileName}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(quiz.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {quiz.score} / {quiz.totalQuestions}
                      </p>

                      <p className="text-sm text-gray-600">
                        {accuracy}% accuracy
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIQuizHistory;
