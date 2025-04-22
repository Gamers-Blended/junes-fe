import React from "react";

function HomePage() {
  return (
    <div>
      {/* Navigation Bar */}
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
          <span className="nav-options-span">Log In</span>
          <span className="nav-options-span">Cart</span>
          <span className="nav-options-span">EN | SGD</span>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
