const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, addBookmark, removeBookmark, getBookmarks } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.post('/bookmarks', protect, addBookmark);
router.delete('/bookmarks', protect, removeBookmark);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;