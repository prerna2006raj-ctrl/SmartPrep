const express = require('express');
const router = express.Router();
const { getVideos, createVideo } = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, createVideo);
router.get('/', getVideos);
router.post('/', createVideo);

module.exports = router;