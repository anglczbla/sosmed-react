import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const ProtectedNavbar = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProtectedNavbar;
