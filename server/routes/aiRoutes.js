const express = require('express');
const router = express.Router();
const { solveDoubt, evaluateAnswer } = require('../controllers/aiController');

router.post('/solve-doubt', solveDoubt);
router.post('/evaluate-answer', evaluateAnswer);

module.exports = router;