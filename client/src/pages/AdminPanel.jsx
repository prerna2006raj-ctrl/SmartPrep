import { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('paper');
  const [message, setMessage] = useState('');
  const [papers, setPapers] = useState([]);

  const [paperForm, setPaperForm] = useState({
    examName: '', examCategory: '', year: '', subject: '', pdfLink: '', youtubeLink: '',
  });

  const [videoForm, setVideoForm] = useState({
    examCategory: '', topic: '', title: '', youtubeUrl: '', channelName: '',
  });

  const [testForm, setTestForm] = useState({
    title: '', examCategory: '', durationMinutes: '',
  });
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
  ]);

  const token = localStorage.getItem('token');

  const fetchPapers = async () => {
    try {
      const res = await api.get('/papers');
      setPapers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchPapers();
    }
  }, [activeTab]);

  const handlePaperSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/papers', paperForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Paper added successfully!');
      setPaperForm({ examName: '', examCategory: '', year: '', subject: '', pdfLink: '', youtubeLink: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add paper');
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/videos', videoForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Video added successfully!');
      setVideoForm({ examCategory: '', topic: '', title: '', youtubeUrl: '', channelName: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add video');
    }
  };

  const handleDeletePaper = async (id) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;
    try {
      await api.delete(`/papers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPapers((prev) => prev.filter((p) => p._id !== id));
      setMessage('Paper deleted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete paper');
    }
  };

  // --- Mock Test question builder helpers ---
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const updateCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswerIndex = Number(value);
    setQuestions(updated);
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post(
        '/mocktests',
        { ...testForm, durationMinutes: Number(testForm.durationMinutes), questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Mock test added successfully!');
      setTestForm({ title: '', examCategory: '', durationMinutes: '' });
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add mock test');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Admin Panel</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('paper')}
            className={`px-4 py-2 rounded ${activeTab === 'paper' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Add Paper
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded ${activeTab === 'video' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Add Video
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 rounded ${activeTab === 'test' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Add Mock Test
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded ${activeTab === 'manage' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Manage Papers
          </button>
        </div>

        {message && (
          <p className="text-center mb-4 text-sm font-medium text-green-700">{message}</p>
        )}

        {activeTab === 'paper' && (
          <form onSubmit={handlePaperSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-3">
            <input type="text" placeholder="Exam Name (e.g. SSC CGL)" value={paperForm.examName}
              onChange={(e) => setPaperForm({ ...paperForm, examName: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="Exam Category (e.g. SSC)" value={paperForm.examCategory}
              onChange={(e) => setPaperForm({ ...paperForm, examCategory: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="number" placeholder="Year" value={paperForm.year}
              onChange={(e) => setPaperForm({ ...paperForm, year: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="Subject (optional)" value={paperForm.subject}
              onChange={(e) => setPaperForm({ ...paperForm, subject: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" />
            <input type="text" placeholder="PDF Link" value={paperForm.pdfLink}
              onChange={(e) => setPaperForm({ ...paperForm, pdfLink: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="YouTube Link (optional)" value={paperForm.youtubeLink}
              onChange={(e) => setPaperForm({ ...paperForm, youtubeLink: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" />
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
              Add Paper
            </button>
          </form>
        )}

        {activeTab === 'video' && (
          <form onSubmit={handleVideoSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-3">
            <input type="text" placeholder="Exam Category (e.g. Banking)" value={videoForm.examCategory}
              onChange={(e) => setVideoForm({ ...videoForm, examCategory: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="Topic" value={videoForm.topic}
              onChange={(e) => setVideoForm({ ...videoForm, topic: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="Video Title" value={videoForm.title}
              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="YouTube URL" value={videoForm.youtubeUrl}
              onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="Channel Name (optional)" value={videoForm.channelName}
              onChange={(e) => setVideoForm({ ...videoForm, channelName: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" />
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
              Add Video
            </button>
          </form>
        )}

        {activeTab === 'test' && (
          <form onSubmit={handleTestSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-3">
            <input type="text" placeholder="Test Title (e.g. SSC CGL Mock Test 2)" value={testForm.title}
              onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" placeholder="Exam Category (e.g. SSC)" value={testForm.examCategory}
              onChange={(e) => setTestForm({ ...testForm, examCategory: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="number" placeholder="Duration (minutes)" value={testForm.durationMinutes}
              onChange={(e) => setTestForm({ ...testForm, durationMinutes: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2" required />

            <hr className="my-4" />
            <h3 className="font-semibold text-gray-700">Questions</h3>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded p-4 space-y-2 relative">
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-2 right-2 text-red-600 text-xs hover:underline"
                  >
                    Remove
                  </button>
                )}
                <input
                  type="text" placeholder={`Question ${qIndex + 1}`} value={q.questionText}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required
                />
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text" placeholder={`Option ${optIndex + 1}`} value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required
                  />
                ))}
                <select
                  value={q.correctAnswerIndex}
                  onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  {q.options.map((_, optIndex) => (
                    <option key={optIndex} value={optIndex}>
                      Correct Answer: Option {optIndex + 1}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm"
            >
              + Add Another Question
            </button>

            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 mt-2">
              Create Mock Test
            </button>
          </form>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">All Papers</h2>
            <div className="space-y-2">
              {papers.map((paper) => (
                <div key={paper._id} className="flex justify-between items-center border-b border-gray-100 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{paper.examName}</p>
                    <p className="text-xs text-gray-500">{paper.examCategory} • {paper.year}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePaper(paper._id)}
                    className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {papers.length === 0 && (
                <p className="text-gray-500 text-center py-4">No papers found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;