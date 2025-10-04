import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { NavigationState } from "../types/navigationState";

import bookIcon from "../assets/bookIcon.png";
import cardIcon from "../assets/cardIcon.png";

const MyAccountPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("test name");
  const [email, setEmail] = useState<string>("test@junes.com");

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleLogOut = (): void => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleChangeEmail = (): void => {
    console.log("Directing user to change email");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "email",
    };
    navigate("/changecredentials/", { state });
  };

  const handleChangePassword = (): void => {
    console.log("Directing user to change password");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "password",
    };
    navigate("/changecredentials/", { state });
  };

  const handleMyAddresses = (): void => {
    console.log("Directing user to my addresses");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "address",
    };
    navigate("/changesavedinfo/", { state });
  };

  const handleMyPayments = (): void => {
    console.log("Directing user to my payments");
    const state: NavigationState = {
      from: "myaccount",
      fieldToChange: "payment",
    };
    navigate("/changesavedinfo/", { state });
  };

  return (
    <div className="my-account-page-container">
      <div className="my-account-content">
        <div className="my-account-left">
          <div className="my-account-header">
            <h1>MY ACCOUNT</h1>
          </div>

          <div className="my-account-details">
            <p>
              <strong>Username:</strong> {username}
              <br />
              <strong>Email:</strong> {email}
            </p>
          </div>

          <div className="my-account-actions">
            <div className="my-account-actions-button-row">
              <button className="form-button" onClick={handleLogOut}>
                Log Out
              </button>
            </div>

            <div className="my-account-actions-button-row">
              <button className="form-button" onClick={handleChangeEmail}>
                Change Email
              </button>

              <button className="form-button" onClick={handleChangePassword}>
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="my-account-right">
          <div className="feature-card" onClick={handleMyAddresses}>
            <div className="feature-card-top">
              <img src={bookIcon} className="feature-icon" alt="address" />
              <h2>My Addresses</h2>
            </div>
            <div className="feature-card-bottom">
              Edit, remove or set default address
            </div>
          </div>

          <div className="feature-card" onClick={handleMyPayments}>
            <div className="feature-card-top">
              <img src={cardIcon} className="feature-icon" alt="payment" />
              <h2>My Payments</h2>
            </div>
            <div className="feature-card-bottom">
              Manage or add payment methods
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
