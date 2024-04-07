import React from "react";
import logo from "./assets/krikey-logo.png";
import chevronDown from "./assets/chevron-down.svg";

const NavBar = () => {
  // just the frontend done, no functionality implemented
  return (
    <div className="nav-bar-container">
      <div className="nav-bar">
        <div className="logo">
          <img
            width="50px"
            height="50px"
            className="logo-img"
            src={logo}
            alt="Logo"
          />
          <div className="text-dropdowns">
            <p>How to Animate</p>
            <img
              width="20px"
              height="20px"
              className="chevron-img"
              src={chevronDown}
              alt="chevron down"
            />
            <p>Business</p>
            <img
              width="20px"
              height="20px"
              className="chevron-img"
              src={chevronDown}
              alt="chevron down"
            />
            <p>Education</p>
            <img
              width="20px"
              height="20px"
              className="chevron-img"
              src={chevronDown}
              alt="chevron down"
            />
            <p>Social Media</p>
            <img
              width="20px"
              height="20px"
              className="chevron-img"
              src={chevronDown}
              alt="chevron down"
            />
            <p>Pricing</p>
            <p>About Us</p>
          </div>
        </div>
        <div className="get-started">
          <button>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
