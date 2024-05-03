import React from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";

const Navbar = () => {
  return (
    <div className="nav-bar">
      <nav>
        <NavLink to="/login">
          <span>Login</span>
        </NavLink>
        <br></br>
        <NavLink to="/register">
          <span>Register</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
