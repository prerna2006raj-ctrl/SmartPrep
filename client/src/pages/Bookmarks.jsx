import { useState, useEffect } from 'react';
import api from '../api/axios';

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/auth/bookmarks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(res.data);
      } catch (err) {
        setError('Failed to load bookmarks. Please make sure you are logged in.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token]);

  const handleRemove = async (paperId) => {
    try {
      await api.delete('/auth/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
        data: { paperId },
      });
      setBookmarks((prev) => prev.filter((paper) => paper._id !== paperId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading bookmarks...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Your Bookmarks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {bookmarks.map((paper) => (
          <div key={paper._id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-800">{paper.examName}</h2>
            <p className="text-sm text-gray-500 mb-2">{paper.examCategory} • {paper.year}</p>
            {paper.subject && <p className="text-sm text-gray-600 mb-3">{paper.subject}</p>}

            <div className="flex gap-2">
                <a
                href={paper.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-700 text-white text-sm px-4 py-2 rounded hover:bg-blue-800 transition"
              >
                View Paper
              </a>

              <button
                onClick={() => handleRemove(paper._id)}
                className="inline-block bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookmarks.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          You haven't bookmarked any papers yet. Go to the Papers page to add some!
        </p>
      )}
    </div>
  );
}

export default Bookmarks;