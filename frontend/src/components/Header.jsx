import React from "react";

import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const Header = () => {
  const { theme } = useTheme(); // Get theme from context

  return (
    
    <nav className={`navbar navbar-expand-lg navbar-${theme === "light" ? "light" : "dark"} bg-${theme === "light" ? "light" : "dark"}`}>
      <div className="container-fluid">
        {/* Brand/Logo */}
        <Link className="navbar-brand" to="/">
          My Portfolio
        </Link>

        {/* Hamburger Menu Button for Small Screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">
                Projects
              </Link>
            </li>
          </ul>

          {/* Theme Switcher Button */}
          <button
            onClick={useTheme().toggleTheme}
            className={`btn btn-${theme === "light" ? "dark" : "light"}`}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;