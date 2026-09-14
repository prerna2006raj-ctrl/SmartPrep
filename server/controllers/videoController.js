const VideoLink = require('../models/VideoLink');

// Get all video links (optionally filter by exam category)
const getVideos = async (req, res) => {
  try {
    const filter = req.query.examCategory ? { examCategory: req.query.examCategory } : {};
    const videos = await VideoLink.find(filter);
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new video link
const createVideo = async (req, res) => {
  try {
    const newVideo = new VideoLink(req.body);
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getVideos, createVideo };