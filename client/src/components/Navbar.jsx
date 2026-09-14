import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        SmartPrep
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-700">Home</Link>
        <Link to="/papers" className="text-gray-700 hover:text-blue-700">Papers</Link>
        <Link to="/mock-tests" className="text-gray-700 hover:text-blue-700">Mock Tests</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-700">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;