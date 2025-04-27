import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import DebugWindow from "./DebugWindow";

import loginIcon from "../assets/loginIcon.png";
import myAccountIcon from "../assets/accountCircleIcon.png";
import shoppingCartIcon from "../assets/shoppingCartIcon.png";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLoginClick = () => {
    if (isLoggedIn) {
      navigate("/myaccount");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">Junes</div>
        <div className="nav-search-bar-container">
          <input
            type="text"
            placeholder="Search..."
            className="nav-search-bar"
          />
        </div>

        <div className="nav-options-container">
          <img
            src={isLoggedIn ? myAccountIcon : loginIcon}
            alt={isLoggedIn ? "My Account" : "Log In"}
            className="nav-options-icon"
            onClick={handleLoginClick}
          />
          <img src={shoppingCartIcon} alt="Cart" className="nav-options-icon" />
          <span className="nav-options-span">EN | SGD</span>
        </div>
      </div>

      <DebugWindow />
    </div>
  );
};

export default NavigationBar;
