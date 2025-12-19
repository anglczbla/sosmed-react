import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
            >
              Sosmed✨
            </Link>
          </div>
          <div className="flex space-x-6 items-center">
            <Link
              to="/"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Home
            </Link>

            {accessToken ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/create-post"
                  className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Add Post
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
