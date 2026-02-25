import { useLocation, useNavigate } from "react-router-dom";
import { Credentials } from "../utils/Enums.tsx";
import { JSX } from "react";

const UserCredentialsChangedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fieldToChange } = location.state || {};

  const renderHeader = (): JSX.Element => {
    switch (fieldToChange) {
      case Credentials.PASSWORD:
        return <h1>YOUR PASSWORD HAS BEEN RESET</h1>;
      case Credentials.EMAIL:
        return <h1>YOUR EMAIL HAS BEEN VERIFIED</h1>;
      default:
        return <h1>CREDENTIALS HAS BEEN CHANGED</h1>;
    }
  };

  const renderMessageText = (): string => {
    switch (fieldToChange) {
      case Credentials.PASSWORD:
        return "Please login with your new password.";
      case Credentials.EMAIL:
        return "You can now login with your verified email!";
      default:
        return "";
    }
  };

  const handleBackToLoginPage = (): void => {
    console.log("Routing to login page");
    navigate("/login/");
  };

  return (
    <div className="form-parent-container">
      <div className="form">
        <div className="form-title">{renderHeader()}</div>

        <div className="form-container">
          <p className="form-text">{renderMessageText()}</p>

          {/* Link */}
          <div className="actions-container">
            <div className="links-container">
              <button onClick={handleBackToLoginPage} className="link-button">
                Back to login page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCredentialsChangedPage;
