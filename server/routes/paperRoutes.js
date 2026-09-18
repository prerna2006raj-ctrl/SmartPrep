const express = require('express');
const router = express.Router();
const { getPapers, createPaper } = require('../controllers/paperController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getPapers);
router.post('/', protect, adminOnly, createPaper);

module.exports = router;