import { useLocation } from "react-router-dom";
import { JSX } from "react";
import Breadcrumb from "../components/Breadcrumb.tsx";

const ChangeCredentialsPage: React.FC = () => {
  const location = useLocation();
  const { fieldToChange } = location.state || {};

  const breadcrumbItems = [
    {
      label: "My Account",
      path: "/myaccount/",
    },
  ];

  const renderHeader = (): JSX.Element => {
    switch (fieldToChange) {
      case "password":
        return <h1>CHANGE PASSWORD</h1>;
      case "email":
        return <h1>CHANGE EMAIL</h1>;
      default:
        return <h1>CHANGE CREDENTIALS</h1>;
    }
  };

  return (
    <div className="change-credentials-page-container">
      <Breadcrumb items={breadcrumbItems} />
      {renderHeader()}
    </div>
  );
};

export default ChangeCredentialsPage;
