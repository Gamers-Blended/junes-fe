import { useLocation, useNavigate } from "react-router-dom";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { JSX, useState } from "react";

interface EmailSentPageProps {
  offlineMode?: boolean;
}

const EmailSentPage: React.FC<EmailSentPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, email } = location.state || {};
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const renderHeader = (): JSX.Element => {
    switch (from) {
      case "forgetPassword":
        return <h1>PASSWORD RESET EMAIL SENT</h1>;
      case "createUser":
        return <h1>ACCOUNT VERIFICATION EMAIL SENT</h1>;
      default:
        return <h1>EMAIL HAS BEEN SENT</h1>;
    }
  };

  const handleBackToLoginPage = (): void => {
    console.log("Routing to login page");
    navigate("/login/");
  };

  const handleResendEmail = async (): Promise<void> => {
    setSuccessMessage("");
    setApiError("");
    setIsLoading(true);

    if (offlineMode) {
      console.log("Offline mode: Skipping resend verification email API call");
      // Simulate successful creation
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      try {
        await resendEmail(email);
      } catch (error) {
        setApiError(
          getApiErrorMessage(
            error,
            "Failed to resend verification email. Please try again.",
          ),
        );
        setIsLoading(false);
        return;
      }
    }

    console.log("Resent verification email");
    setIsLoading(false);
  };

  const resendEmail = async (email: string): Promise<void> => {
    console.info("Calling resend verification email API...");

    const response = await apiClient.post(
      `${REQUEST_MAPPING}/auth/resend-verification?email=${email}`,
    );

    console.log("Resend verification email response:", response.data);
    setSuccessMessage(response.data.message);
  };

  return (
    <div className="form-parent-container">
      <div className="form">
        <div className="form-title">{renderHeader()}</div>

        <div className="form-container">
          {from && (
            <p className="form-text">
              An email has been sent to <strong>{email}</strong>.<br />
              Please open it in your inbox and follow the steps stated in the
              email.
            </p>
          )}

          {/* Success Message */}
          {successMessage && <div>{successMessage}</div>}

          {/* Error Message */}
          {apiError && <div className="error-message">{apiError}</div>}

          {/* Links */}
          {from === "createUser" && (
            <div className="actions-container">
              <div className="links-container">
                <button
                  onClick={handleResendEmail}
                  className={`link-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Resending email..." : "Resend email"}
                </button>
              </div>
            </div>
          )}

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

export default EmailSentPage;
