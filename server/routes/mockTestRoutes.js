const express = require('express');
const router = express.Router();
const { getMockTests, getMockTestById, createMockTest } = require('../controllers/mockTestController');

router.get('/', getMockTests);
router.get('/:id', getMockTestById);
router.post('/', createMockTest);

module.exports = router;