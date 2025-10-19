import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { JSX } from "react";
import { getCountryCode } from "../utils/utils";
import CountrySelector from "../components/CountrySelector";
import { useAuth } from "../components/AuthContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";

const ModifyAddressPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const location = useLocation();
  const { action, item } = location.state || {};

  // Initialise states with existing values if editing
  const [country, setCountry] = useState<string>(getCountryCode(item?.country || ""));
  const [fullName, setFullName] = React.useState<string>(item?.name || "");
  const [phoneNumber, setPhoneNumber] = React.useState<string>(item?.phoneNumber || "");
  const [zipCode, setZipCode] = React.useState<string>(item?.zipCode || "");
  const [addressLine, setAddressLine] = React.useState<string>(item?.addressLine || "");
  const [unitNumber, setUnitNumber] = React.useState<string>(item?.unitNumber || "");
  const [isDefault, setIsDefault] = React.useState<boolean>(item?.isDefault || false);

  useAuthRedirect(isLoggedIn);

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

  const handleAction = () => {
    if (action === "add") {
      console.log("Adding new address:", {
        country,
        fullName,
        phoneNumber,
        zipCode,
        addressLine,
        unitNumber,
        isDefault,
      });
    } else if (action === "edit") {
      console.log("Updating address:", {
        country,
        fullName,
        phoneNumber,
        zipCode,
        addressLine,
        unitNumber,
        isDefault,
      });
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
      <div className="common-header">{renderHeader()}</div>

      <div className="form-container">
        {/* Country/Region */}
        <div className="input-group">
          <label htmlFor="country" className="label bold">
            Country/Region
          </label>
          <CountrySelector
            value={country}
            onChange={(code, name) => setCountry(code)}
            error={false}
          />
        </div>

        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="fullName" className="label bold">
            Full name (First and Last name)
          </label>
          <input
            type="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={"input-field"}
          />
        </div>

        {/* Phone Number */}
        <div className="input-group">
          <label htmlFor="phoneNumber" className="label bold">
            Phone Number
          </label>
          <input
            type="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={"input-field"}
          />
          <div className="align-left">May be used to assist delivery</div>
        </div>

        {/* Zip Code */}
        <div className="input-group">
          <label htmlFor="zipCode" className="label bold">
            Zip code
          </label>
          <input
            type="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className={"input-field"}
          />
        </div>

        {/* Address */}
        <div className="input-group">
          <label htmlFor="address" className="label bold">
            Address
          </label>
          <input
            type="address"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className={"input-field"}
          />
        </div>

        {/* Unit number */}
        <div className="input-group">
          <label htmlFor="unitNumber" className="label bold">
            Unit number
          </label>
          <input
            type="unitNumber"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            className={"input-field"}
          />
        </div>

        {/* Set as Default */}
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="in-stock"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            <label className="filter-label">Make this my default address</label>
          </div>
        </div>

        <button
          className="common-button modify-address-button"
          onClick={handleAction}
        >
          {action === "add" ? "Add Address" : "Update Address"}
        </button>

        <Footer />
      </div>
    </div>
  );
};

export default ModifyAddressPage;
