import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function TakeMockTest() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      const res = await api.get(`/mocktests/${id}`);
      setTest(res.data);
    };
    fetchTest();
  }, [id]);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

const handleSubmit = async () => {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to record attempt:', err);
    }
  }
};

  if (!test) return <p className="text-center mt-10">Loading test...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">{test.title}</h1>
        <p className="text-gray-500 mb-8">{test.durationMinutes} minutes • {test.questions.length} questions</p>

        {submitted && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6">
            You scored {score} out of {test.questions.length}
          </div>
        )}

        {test.questions.map((q, index) => (
          <div key={q._id} className="bg-white shadow-md rounded-lg p-5 mb-4">
            <p className="font-semibold text-gray-800 mb-3">
              {index + 1}. {q.questionText}
            </p>

            <div className="space-y-2">
              {q.options.map((option, optIndex) => {
                const isSelected = answers[q._id] === optIndex;
                const isCorrect = optIndex === q.correctAnswerIndex;

                let optionStyle = 'border-gray-300';
                if (submitted && isCorrect) optionStyle = 'border-green-500 bg-green-50';
                else if (submitted && isSelected && !isCorrect) optionStyle = 'border-red-500 bg-red-50';
                else if (isSelected) optionStyle = 'border-blue-500 bg-blue-50';

                return (
                  <label
                    key={optIndex}
                    className={`block border rounded px-4 py-2 cursor-pointer ${optionStyle}`}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      className="mr-2"
                      disabled={submitted}
                      checked={isSelected}
                      onChange={() => handleSelect(q._id, optIndex)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition font-semibold"
          >
            Submit Test
          </button>
        ) : (
          <Link
            to="/mock-tests"
            className="block text-center bg-gray-700 text-white py-3 rounded hover:bg-gray-800 transition font-semibold"
          >
            Back to Mock Tests
          </Link>
        )}
      </div>
    </div>
  );
}

export default TakeMockTest;