# SmartPrep 🎯

SmartPrep is a full-stack platform built to help students preparing for Indian competitive exams (UPSC, SSC, Banking, Railways, and more) access previous year question papers, curated video resources, mock tests, and AI-powered study tools — all in one place.
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-project.vercel.app)
🔗 **Live Demo:** [https://your-project.vercel.app](https://smart-prep-ten.vercel.app/)
🔗 **Backend API:** [https://your-backend.onrender.com](https://smartprep-o25n.onrender.com/)

> Note: The backend is hosted on Render's free tier, which spins down after inactivity. The first request may take 30-60 seconds to wake up — please be patient!


## ✨ Features

- 🔐 **Authentication** — Secure signup/login with JWT tokens and bcrypt password hashing
- 📄 **Question Papers** — Browse and access previous year papers by exam and subject
- 🎥 **Video Resources** — Curated YouTube videos filterable by exam category
- 📝 **Mock Tests** — Take timed mock tests with instant scoring and answer review
- 🔖 **Bookmarks** — Save papers for quick access later (tied to your account)
- 🤖 **AI Doubt Solver** — Ask any exam-related doubt and get a clear, tutor-style explanation (powered by Gemini)
- 📊 **AI Answer Evaluator** — Get rubric-based feedback on written answers, similar to UPSC Mains evaluation — scored on structure, relevance, content depth, and word limit, with a suggested model answer outline

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Authentication:** JWT, bcrypt
**AI:** Google Gemini API

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- A MongoDB Atlas account (or local MongoDB)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Backend Setup

```bash
cd server
npm install
```

### Create a `.env` file in `server` with:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Run the server:

```bash
node index.js
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## 📌 Project Status

Actively being developed as a placement/portfolio project.

## 👤 Author

Prerna Raj — BCA student, Chitkara University
