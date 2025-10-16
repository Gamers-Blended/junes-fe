import { useLocation } from "react-router-dom";
import { JSX } from "react";

const ModifyAddressPage: React.FC = () => {
  const location = useLocation();
  const { action } = location.state || {};

  const renderHeader = (): JSX.Element => {
    switch (action) {
      case "add":
        return <h1>ADD A NEW ADDRESS</h1>;
      case "edit":
        return <h1>EDIT YOUR ADDRESS</h1>;
      default:
        return <h1>INVALID ACTION</h1>;
    }
  };

  return (
    <div className="modify-address-page-container">{renderHeader()}</div>
  );
};

export default ModifyAddressPage;
