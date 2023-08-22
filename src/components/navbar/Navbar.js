import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Appheader = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
      let username = sessionStorage.getItem("username");
      if (username === "" || username === null) {
        navigate("/login");
      }
    }
  }, [location]);
  return (
    <div className="nav_items">
      {showNavbar && (
        <div className="header">
          <Link to={"/"}>Home</Link>
          <Link to={"/table"}>Table</Link>
          <Link to={"/login"}>Logout</Link>
        </div>
      )}
    </div>
  );
};

export default Appheader;
