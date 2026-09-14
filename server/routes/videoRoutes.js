const express = require('express');
const router = express.Router();
const { getVideos, createVideo } = require('../controllers/videoController');

router.get('/', getVideos);
router.post('/', createVideo);

module.exports = router;