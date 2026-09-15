import { useState, useEffect } from 'react';
import api from '../api/axios';

function Papers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await api.get('/papers');
        setPapers(res.data);
      } catch (err) {
        setError('Failed to load papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handleBookmark = async (paperId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to bookmark papers');
      return;
    }

    try {
      await api.post(
        '/auth/bookmarks',
        { paperId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Paper bookmarked!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to bookmark');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading papers...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Question Papers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {papers.map((paper) => (
          <div key={paper._id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-800">{paper.examName}</h2>
            <p className="text-sm text-gray-500 mb-2">{paper.examCategory} • {paper.year}</p>
            {paper.subject && (
              <p className="text-sm text-gray-600 mb-3">{paper.subject}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <a
                href={paper.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-700 text-white text-sm px-4 py-2 rounded hover:bg-blue-800 transition"
              >
                View Paper
              </a>

              {paper.youtubeLink && (
                <a
                  href={paper.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Watch Video
                </a>
              )}

              <button
                onClick={() => handleBookmark(paper._id)}
                className="inline-block bg-yellow-500 text-white text-sm px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Bookmark
              </button>
            </div>
          </div>
        ))}
      </div>

      {papers.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No papers available yet.</p>
      )}
    </div>
  );
}

export default Papers;