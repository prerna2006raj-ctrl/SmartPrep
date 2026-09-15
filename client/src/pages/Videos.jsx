import { useState, useEffect } from 'react';
import api from '../api/axios';

function Videos() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await api.get('/videos', {
          params: category ? { examCategory: category } : {},
        });
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Video Resources</h1>

      <div className="max-w-md mx-auto mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Banking">Banking</option>
          <option value="SSC">SSC</option>
          <option value="Railways">Railways</option>
          <option value="UPSC">UPSC</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading videos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {videos.map((video) => (
            <div key={video._id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
              <p className="text-sm text-gray-500 mb-1">{video.examCategory} • {video.topic}</p>
              {video.channelName && (
                <p className="text-xs text-gray-400 mb-3">by {video.channelName}</p>
              )}

              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Watch on YouTube
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No videos found for this category.</p>
      )}
    </div>
  );
}

export default Videos;