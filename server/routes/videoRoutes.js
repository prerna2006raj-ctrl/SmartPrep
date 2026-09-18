const express = require('express');
const router = express.Router();
const { getVideos, createVideo, deleteVideo } = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getVideos);
router.post('/', protect, adminOnly, createVideo);
router.delete('/:id', protect, adminOnly, deleteVideo);

module.exports = router;