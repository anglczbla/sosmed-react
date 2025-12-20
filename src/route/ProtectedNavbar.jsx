import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
const ProtectedNavbar = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedNavbar;
