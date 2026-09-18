const express = require('express');
const router = express.Router();
const { getMockTests, getMockTestById, createMockTest } = require('../controllers/mockTestController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, createMockTest);
router.get('/', getMockTests);
router.get('/:id', getMockTestById);
router.post('/', createMockTest);

module.exports = router;