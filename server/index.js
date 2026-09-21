const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const paperRoutes = require("./routes/paperRoutes");
const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const mockTestRoutes = require("./routes/mockTestRoutes");
const questionRoutes = require("./routes/questionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const aiQuizHistoryRoutes = require("./routes/aiQuizHistoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/attempts", attemptRoutes);
app.use("/api/quiz-history", aiQuizHistoryRoutes);
app.use("/api/mock-tests", mockTestRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/papers", paperRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) =>
    console.log("MongoDB connection error:", err)
  );

// Test route
app.get("/", (req, res) => {
  res.send("SmartPrep backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});