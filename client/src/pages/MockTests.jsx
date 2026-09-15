import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/mocktests');
        setTests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading mock tests...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Mock Tests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tests.map((test) => (
          <div key={test._id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-800">{test.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{test.examCategory}</p>
            <p className="text-sm text-gray-600 mb-4">
              {test.questions.length} Questions • {test.durationMinutes} mins
            </p>

            <Link
              to={`/mock-tests/${test._id}`}
              className="inline-block bg-blue-700 text-white text-sm px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              Start Test
            </Link>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No mock tests available yet.</p>
      )}
    </div>
  );
}

export default MockTests;