const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// Add a bookmark
const addBookmark = async (req, res) => {
  try {
    const { paperId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.bookmarks.includes(paperId)) {
      return res.status(400).json({ message: "Paper already bookmarked" });
    }

    user.bookmarks.push(paperId);
    await user.save();

    res
      .status(200)
      .json({ message: "Bookmark added", bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a bookmark
const removeBookmark = async (req, res) => {
  try {
    const { paperId } = req.body;
    const user = await User.findById(req.user._id);

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== paperId);
    await user.save();

    res
      .status(200)
      .json({ message: "Bookmark removed", bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookmarked papers (with full paper details)
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("bookmarks");
    res.status(200).json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  addBookmark,
  removeBookmark,
  getBookmarks,
};
