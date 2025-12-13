import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      <Link to="/profile">Profile</Link>
      <Link to="/home">Home</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Navbar;
