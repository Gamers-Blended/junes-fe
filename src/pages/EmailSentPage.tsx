import { useLocation } from "react-router-dom";
import { JSX } from "react";

const EmailSentPage: React.FC = () => {
  const location = useLocation();
  const { from, email } = location.state || {};

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
        </div>
      </div>
    </div>
  );
};

export default EmailSentPage;
