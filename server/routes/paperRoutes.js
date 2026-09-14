const express = require('express');
const router = express.Router();
const { getPapers, createPaper } = require('../controllers/paperController');

router.get('/', getPapers);
router.post('/', createPaper);

module.exports = router;