import { useNavigate, useLocation } from "react-router-dom";

const useNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return {
    accessToken,
    logout,
    isActive
  };
};

export default useNavbar;
