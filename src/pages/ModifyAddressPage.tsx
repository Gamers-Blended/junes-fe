import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { JSX } from "react";
import { getCountryCode } from "../utils/utils";
import CountrySelector from "../components/CountrySelector";
import { useAuth } from "../components/AuthContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";

interface ValidationErrors {
  country?: string;
  fullName?: string;
  phoneNumber?: string;
  zipCode?: string;
  addressLine?: string;
}

const ModifyAddressPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const location = useLocation();
  const { action, item } = location.state || {};

  // Initialise states with existing values if editing
  const [country, setCountry] = useState<string>(
    getCountryCode(item?.country || "")
  );
  const [fullName, setFullName] = useState<string>(item?.name || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    item?.phoneNumber || ""
  );
  const [zipCode, setZipCode] = useState<string>(item?.zipCode || "");
  const [addressLine, setAddressLine] = useState<string>(
    item?.addressLine || ""
  );
  const [unitNumber, setUnitNumber] = useState<string>(item?.unitNumber || "");
  const [isDefault, setIsDefault] = useState<boolean>(item?.isDefault || false);

  // Validation error states
  const [validationError, setValidationError] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useAuthRedirect(isLoggedIn);

  const validateField = (
    fieldName: string,
    value: string
  ): string | undefined => {
    switch (fieldName) {
      case "country":
        if (!value || value.trim() === "")
          return "Please select a country/region";
        break;
      case "fullName":
        if (!value || value.trim() === "") {
          return "Full name is required";
        }
        if (value.trim().length < 2) {
          return "Full name must be at least 2 characters long";
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          return "Full name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;

      case "phoneNumber":
        if (!value || value.trim() === "") {
          return "Phone number is required";
        }
        // Remove spaces, dashes, and parentheses for validation
        const cleanPhone = value.replace(/[\s\-()]/g, "");
        if (!/^\+?[\d]{8,15}$/.test(cleanPhone)) {
          return "Please enter a valid phone number (8-15 digits)";
        }
        break;

      case "zipCode":
        if (!value || value.trim() === "") {
          return "Zip code is required";
        }
        if (value.trim().length < 3) {
          return "Please enter a valid zip code";
        }
        break;

      case "addressLine":
        if (!value || value.trim() === "") {
          return "Address is required";
        }
        if (value.trim().length < 5) {
          return "Please enter a complete address";
        }
        break;
    }
    return undefined;
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.country = validateField("country", country);
    newErrors.fullName = validateField("fullName", fullName);
    newErrors.phoneNumber = validateField("phoneNumber", phoneNumber);
    newErrors.zipCode = validateField("zipCode", zipCode);
    newErrors.addressLine = validateField("addressLine", addressLine);

    setValidationError(newErrors);

    // Mark all fields as touched
    setTouched(
      new Set(["country", "fullName", "phoneNumber", "zipCode", "addressLine"])
    );

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => new Set(prev).add(fieldName));

    let value = "";
    switch (fieldName) {
      case "country":
        value = country;
        break;
      case "fullName":
        value = fullName;
        break;
      case "phoneNumber":
        value = phoneNumber;
        break;
      case "zipCode":
        value = zipCode;
        break;
      case "addressLine":
        value = addressLine;
        break;
    }

    const error = validateField(fieldName, value);
    setValidationError((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Update field value
    switch (fieldName) {
      case "country":
        setCountry(value);
        break;
      case "fullName":
        setFullName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "zipCode":
        setZipCode(value);
        break;
      case "addressLine":
        setAddressLine(value);
        break;
      case "unitNumber":
        setUnitNumber(value);
        break;
    }

    // Clear error if field has been touched
    if (touched.has(fieldName)) {
      const error = validateField(fieldName, value);
      setValidationError((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error,
      }));
    }
  };

  const showValidationError = (fieldName: string): boolean => {
    return (
      touched.has(fieldName) &&
      !!validationError[fieldName as keyof ValidationErrors]
    );
  };

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
    if (!validateAllFields()) {
      console.log("Validation failed");
      return;
    }

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
          <div onBlur={() => handleBlur("country")}>
            <CountrySelector
              value={country}
              onChange={(code, name) => handleFieldChange("country", code)}
              error={showValidationError("country")}
            />
          </div>
          {showValidationError("country") && (
            <div className="form-error-message">{validationError.country}</div>
          )}
        </div>

        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="fullName" className="label bold">
            Full name (First and Last name)
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            className={`input-field ${
              showValidationError("fullName") ? "error" : ""
            }`}
          />
          {showValidationError("fullName") && (
            <div className="form-error-message">{validationError.fullName}</div>
          )}
        </div>

        {/* Phone Number */}
        <div className="input-group">
          <label htmlFor="phoneNumber" className="label bold">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
            onBlur={() => handleBlur("phoneNumber")}
            className={`input-field ${
              showValidationError("phoneNumber") ? "error" : ""
            }`}
          />
          <div className="align-left">May be used to assist delivery</div>
          {showValidationError("phoneNumber") && (
            <div className="form-error-message">
              {validationError.phoneNumber}
            </div>
          )}
        </div>

        {/* Zip Code */}
        <div className="input-group">
          <label htmlFor="zipCode" className="label bold">
            Zip code
          </label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => handleFieldChange("zipCode", e.target.value)}
            onBlur={() => handleBlur("zipCode")}
            className={`input-field ${
              showValidationError("zipCode") ? "error" : ""
            }`}
          />
          {showValidationError("zipCode") && (
            <div className="form-error-message">{validationError.zipCode}</div>
          )}
        </div>

        {/* Address */}
        <div className="input-group">
          <label htmlFor="addressLine" className="label bold">
            Address
          </label>
          <input
            type="text"
            value={addressLine}
            onChange={(e) => handleFieldChange("addressLine", e.target.value)}
            onBlur={() => handleBlur("addressLine")}
            className={`input-field ${
              showValidationError("addressLine") ? "error" : ""
            }`}
          />
          {showValidationError("addressLine") && (
            <div className="form-error-message">
              {validationError.addressLine}
            </div>
          )}
        </div>

        {/* Unit number */}
        <div className="input-group">
          <label htmlFor="unitNumber" className="label bold">
            Unit number
          </label>
          <input
            type="text"
            value={unitNumber}
            onChange={(e) => handleFieldChange("unitNumber", e.target.value)}
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
            <label
              className="filter-label"
              onClick={() => setIsDefault(!isDefault)}
            >
              Make this my default address
            </label>
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
