import loginIcon from "../assets/loginIcon.png";
import shoppingCartIcon from "../assets/shoppingCartIcon.png";

const NavigationBar = () => {
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
          <img src={loginIcon} alt="Log In" className="nav-options-icon" />
          <img src={shoppingCartIcon} alt="Cart" className="nav-options-icon" />
          <span className="nav-options-span">EN | SGD</span>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
