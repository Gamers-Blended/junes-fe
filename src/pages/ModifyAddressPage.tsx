import { useLocation } from "react-router-dom";
import { JSX } from "react";
import Breadcrumb from "../components/Breadcrumb";

const ModifyAddressPage: React.FC = () => {
  const location = useLocation();
  const { action, item } = location.state || {};

  const renderHeader = (): JSX.Element => {
    switch (action) {
      case "add":
        return <h1>ADD A NEW ADDRESS</h1>;
      case "edit":
        return <h1>EDIT YOUR ADDRESS {item.id}</h1>;
      default:
        return <h1>INVALID ACTION</h1>;
    }
  };

  return (
    <div className="modify-address-page-container">
      <div>
        <Breadcrumb
          items={[
            { label: "My Account", path: "/myaccount/" },
            {
              label: "My Addresses",
              path: "/savedinfo/",
              state: { fieldToChange: "address" },
            },
          ]}
        />
      </div>
      <div className="header">{renderHeader()}</div>

      {action === "edit" && (
        <div>
          <p>{item.name}</p>
          <p>
            {item.addressLine1}, {item.country}, {item.zipCode}{" "}
            {item.phoneNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModifyAddressPage;
