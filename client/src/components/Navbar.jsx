import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        SmartPrep
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-700">
          Home
        </Link>
        <Link to="/papers" className="text-gray-700 hover:text-blue-700">
          Papers
        </Link>
        <Link to="/mock-tests" className="text-gray-700 hover:text-blue-700">
          Mock Tests
        </Link>
        <Link to="/doubt-solver" className="text-gray-700 hover:text-blue-700">
          Ask AI
        </Link>
        <Link
          to="/answer-evaluator"
          className="text-gray-700 hover:text-blue-700"
        >
          Answer Evaluator
        </Link>
        <Link to="/bookmarks" className="text-gray-700 hover:text-blue-700">
          Bookmarks
        </Link>
        <Link to="/videos" className="text-gray-700 hover:text-blue-700">
          Videos
        </Link>
        {user ? (
          <>
            <span className="text-gray-600 text-sm">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-700">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-700">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
