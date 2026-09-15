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
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/mock-tests/:id" element={<TakeMockTest />} />
        <Route path="/doubt-solver" element={<DoubtSolver />} />
        <Route path="/answer-evaluator" element={<AnswerEvaluator />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
