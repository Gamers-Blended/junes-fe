import { useLocation } from "react-router-dom";
import { JSX } from "react";

const ChangeCredentialsPage: React.FC = () => {
  const location = useLocation();
  const { credentialToChange } = location.state || {};

  const renderHeader = (): JSX.Element => {
    switch (credentialToChange) {
      case "password":
        return <h1>CHANGE PASSWORD</h1>;
      case "email":
        return <h1>CHANGE EMAIL</h1>;
      default:
        return <h1>CHANGE CREDENTIALS</h1>;
    }
  };

  return (
    <div className="change-credentials-page-container">{renderHeader()}</div>
  );
};

export default ChangeCredentialsPage;
