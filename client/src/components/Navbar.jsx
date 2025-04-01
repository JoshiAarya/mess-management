import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white font-bold text-xl">
                Khanna Mess
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              
              {/* Links visible to authenticated users */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/menu"
                    className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Today's Menu
                  </Link>
                </>
              )}
              
              {/* Admin links */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
                <Link
                  to="/admin/login"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/menu"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Today's Menu
              </Link>
            </>
          )}
          
          {isAdmin && (
            <Link
              to="/admin"
              className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Admin Panel
            </Link>
          )}
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-white hover:bg-indigo-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Register
              </Link>
              <Link
                to="/admin/login"
                className="text-yellow-500 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 