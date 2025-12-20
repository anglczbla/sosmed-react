import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, User, PlusSquare, LogOut, LogIn, UserPlus, Sparkles } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
        isActive(to)
          ? "bg-violet-100 text-violet-700 font-bold"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium"
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{children}</span>
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="group flex items-center gap-2 text-2xl font-black tracking-tighter text-gray-900"
            >
              <div className="bg-violet-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
                <Sparkles size={24} fill="currentColor" />
              </div>
              <span className="bg-clip-text">Sosmed</span>
            </Link>
          </div>

          <div className="flex space-x-2 items-center">
            <NavLink to="/" icon={Home}>Home</NavLink>

            {accessToken ? (
              <>
                <NavLink to="/profile" icon={User}>Profile</NavLink>
                <NavLink to="/create-post" icon={PlusSquare}>Post</NavLink>
                
                <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                
                <button
                  onClick={logout}
                  className="p-2.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                  title="Logout"
                >
                  <LogOut size={20} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 font-bold transition-all"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gray-900 text-white font-bold text-sm shadow-xl shadow-gray-200 hover:bg-violet-600 hover:shadow-violet-200 transition-all active:scale-95"
                >
                  <UserPlus size={18} />
                  <span>Join</span>
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
