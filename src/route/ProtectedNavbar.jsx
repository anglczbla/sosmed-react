import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
const ProtectedNavbar = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-30 pb-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedNavbar;
