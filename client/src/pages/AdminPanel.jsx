import { useState } from "react";
import api from "../api/axios";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("paper");
  const [message, setMessage] = useState("");

  const [paperForm, setPaperForm] = useState({
    examName: "",
    examCategory: "",
    year: "",
    subject: "",
    pdfLink: "",
    youtubeLink: "",
  });

  const [videoForm, setVideoForm] = useState({
    examCategory: "",
    topic: "",
    title: "",
    youtubeUrl: "",
    channelName: "",
  });

  const token = localStorage.getItem("token");

  const handlePaperSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/papers", paperForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Paper added successfully!");
      setPaperForm({
        examName: "",
        examCategory: "",
        year: "",
        subject: "",
        pdfLink: "",
        youtubeLink: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add paper");
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/videos", videoForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Video added successfully!");
      setVideoForm({
        examCategory: "",
        topic: "",
        title: "",
        youtubeUrl: "",
        channelName: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add video");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Admin Panel
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("paper")}
            className={`px-4 py-2 rounded ${activeTab === "paper" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Add Paper
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded ${activeTab === "video" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Add Video
          </button>
        </div>

        {message && (
          <p className="text-center mb-4 text-sm font-medium text-green-700">
            {message}
          </p>
        )}

        {activeTab === "paper" && (
          <form
            onSubmit={handlePaperSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Exam Name (e.g. SSC CGL)"
              value={paperForm.examName}
              onChange={(e) =>
                setPaperForm({ ...paperForm, examName: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Exam Category (e.g. SSC)"
              value={paperForm.examCategory}
              onChange={(e) =>
                setPaperForm({ ...paperForm, examCategory: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={paperForm.year}
              onChange={(e) =>
                setPaperForm({ ...paperForm, year: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Subject (optional)"
              value={paperForm.subject}
              onChange={(e) =>
                setPaperForm({ ...paperForm, subject: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="PDF Link"
              value={paperForm.pdfLink}
              onChange={(e) =>
                setPaperForm({ ...paperForm, pdfLink: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="YouTube Link (optional)"
              value={paperForm.youtubeLink}
              onChange={(e) =>
                setPaperForm({ ...paperForm, youtubeLink: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            >
              Add Paper
            </button>
          </form>
        )}

        {activeTab === "video" && (
          <form
            onSubmit={handleVideoSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Exam Category (e.g. Banking)"
              value={videoForm.examCategory}
              onChange={(e) =>
                setVideoForm({ ...videoForm, examCategory: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Topic"
              value={videoForm.topic}
              onChange={(e) =>
                setVideoForm({ ...videoForm, topic: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Video Title"
              value={videoForm.title}
              onChange={(e) =>
                setVideoForm({ ...videoForm, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="YouTube URL"
              value={videoForm.youtubeUrl}
              onChange={(e) =>
                setVideoForm({ ...videoForm, youtubeUrl: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Channel Name (optional)"
              value={videoForm.channelName}
              onChange={(e) =>
                setVideoForm({ ...videoForm, channelName: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            >
              Add Video
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
