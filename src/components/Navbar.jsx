import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div>
      <Link to="/profile">Profile</Link>
      <Link to="/home">Home</Link>
    </div>
  );
};

export default Navbar;
