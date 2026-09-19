import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Papers from "./pages/Papers";
import MockTests from "./pages/MockTests";
import TakeMockTest from "./pages/TakeMockTest";
import DoubtSolver from "./pages/DoubtSolver";
import AnswerEvaluator from "./pages/AnswerEvaluator";
import Bookmarks from "./pages/Bookmarks";
import Videos from "./pages/Videos";
import StudyPlanner from "./pages/StudyPlanner";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AIQuizGenerator from "./pages/AIQuizGenerator";
import AIQuizHistory from "./pages/AIQuizHistory";
function App() {
  return (
    <BrowserRouter>
      {/* Global SmartPrep Navigation */}
      <Navbar />

      {/* Main Application Area */}
      <main className="min-h-screen bg-slate-50 pt-[72px] lg:ml-[250px]">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Resources */}
          <Route path="/papers" element={<Papers />} />
          <Route path="/videos" element={<Videos />} />

          {/* Mock Tests */}
          <Route path="/mock-tests" element={<MockTests />} />
          <Route path="/mock-tests/:id" element={<TakeMockTest />} />

          {/* AI Features */}
          <Route path="/doubt-solver" element={<DoubtSolver />} />

          <Route path="/answer-evaluator" element={<AnswerEvaluator />} />
          <Route path="/ai-quiz" element={<AIQuizGenerator />} />

          <Route path="/quiz-history" element={<AIQuizHistory />} />

          {/* User Features */}
          <Route path="/bookmarks" element={<Bookmarks />} />

          <Route path="/study-planner" element={<StudyPlanner />} />

          {/* Dashboard / Analytics */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/settings" element={<Settings />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
