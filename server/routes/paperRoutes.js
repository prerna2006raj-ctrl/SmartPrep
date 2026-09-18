const express = require('express');
const router = express.Router();
const { getPapers, createPaper, deletePaper } = require('../controllers/paperController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getPapers);
router.post('/', protect, adminOnly, createPaper);
router.delete('/:id', protect, adminOnly, deletePaper);

module.exports = router;