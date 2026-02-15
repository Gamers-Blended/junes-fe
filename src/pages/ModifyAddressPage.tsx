import React, { useState, JSX } from "react";
import { useLocation } from "react-router-dom";
import { getCountryCode } from "../utils/utils";
import { clearSavedAddressesCache } from "../utils/cacheUtils.ts";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { useAuth } from "../components/AuthContext";
import CountrySelector from "../components/CountrySelector";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import {
  validateAddressField,
  validateAllAddressFields,
  AddressValidationErrors,
} from "../utils/addressValidation";
import {
  AddressFormField,
  SavedInfoType,
  SavedInfoAction,
} from "../utils/Enums";

interface ModifyAddressPageProps {
  offlineMode?: boolean;
}

const ModifyAddressPage: React.FC<ModifyAddressPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const location = useLocation();
  const { action, item, from } = location.state || {};

  // Initialise states with existing values if editing
  const [addressID, setAddressID] = useState<string>(item?.id || "");

  const [country, setCountry] = useState<string>(
    getCountryCode(item?.country || ""),
  );
  const [fullName, setFullName] = useState<string>(item?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    item?.phoneNumber || "",
  );
  const [zipCode, setZipCode] = useState<string>(item?.zipCode || "");
  const [addressLine, setAddressLine] = useState<string>(
    item?.addressLine || "",
  );
  const [unitNumber, setUnitNumber] = useState<string>(item?.unitNumber || "");
  const [isDefault, setIsDefault] = useState<boolean>(item?.isDefault || false);

  // Validation error states
  const [validationError, setValidationError] =
    useState<AddressValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const [actionError, setActionError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useAuthRedirect(isLoggedIn);

  const editAddress = async () => {
    if (offlineMode) {
      console.log("Offline mode: Simulating address update with data:", {
        country,
        fullName,
        phoneNumber,
        zipCode,
        addressLine,
        unitNumber,
        isDefault,
      });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    console.log("Making API to edit address...");

    const response = await apiClient.put(
      `${REQUEST_MAPPING}/saved-items/address/${item.id}`,
      {
        addressID,
        fullName,
        addressLine,
        unitNumber,
        country,
        zipCode,
        phoneNumber,
        isDefault,
      },
    );

    console.log("Address updated successfully:", response.data);
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => new Set(prev).add(fieldName));

    let value = "";
    switch (fieldName) {
      case AddressFormField.COUNTRY:
        value = country;
        break;
      case AddressFormField.FULL_NAME:
        value = fullName;
        break;
      case AddressFormField.PHONE_NUMBER:
        value = phoneNumber;
        break;
      case AddressFormField.ZIP_CODE:
        value = zipCode;
        break;
      case AddressFormField.ADDRESS_LINE:
        value = addressLine;
        break;
    }

    const error = validateAddressField(
      fieldName as keyof AddressValidationErrors,
      value,
    );
    setValidationError((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Update field value
    switch (fieldName) {
      case AddressFormField.COUNTRY:
        setCountry(value);
        break;
      case AddressFormField.FULL_NAME:
        setFullName(value);
        break;
      case AddressFormField.PHONE_NUMBER:
        setPhoneNumber(value);
        break;
      case AddressFormField.ZIP_CODE:
        setZipCode(value);
        break;
      case AddressFormField.ADDRESS_LINE:
        setAddressLine(value);
        break;
      case AddressFormField.UNIT_NUMBER:
        setUnitNumber(value);
        break;
    }

    // Clear error if field has been touched
    if (touched.has(fieldName)) {
      const error = validateAddressField(
        fieldName as keyof AddressValidationErrors,
        value,
      );
      setValidationError((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error,
      }));
    }
  };

  const showValidationError = (fieldName: string): boolean => {
    return (
      touched.has(fieldName) &&
      !!validationError[fieldName as keyof AddressValidationErrors]
    );
  };

  const renderHeader = (): JSX.Element => {
    switch (action) {
      case SavedInfoAction.ADD:
        return <h1>ADD A NEW ADDRESS</h1>;
      case SavedInfoAction.EDIT:
        return <h1>EDIT YOUR ADDRESS</h1>;
      default:
        return <h1>INVALID ACTION</h1>;
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Loading...";

    return action === SavedInfoAction.ADD ? "Add Address" : "Update Address";
  };

  const getBreadcrumbInfo = () => {
    const isPaymentContext = from === "savedinfofrompayment";

    return {
      label: isPaymentContext ? "My Payments" : "My Addresses",
      state: {
        fieldToChange: isPaymentContext
          ? SavedInfoType.PAYMENT
          : SavedInfoType.ADDRESS,
      },
    };
  };

  const handleAction = async () => {
    setLoading(true);
    setActionError("");

    try {
      // Mark all fields as touched first
      setTouched(
        new Set([
          AddressFormField.COUNTRY,
          AddressFormField.FULL_NAME,
          AddressFormField.PHONE_NUMBER,
          AddressFormField.ZIP_CODE,
          AddressFormField.ADDRESS_LINE,
        ]),
      );

      const { errors, isValid } = validateAllAddressFields({
        country,
        fullName,
        phoneNumber,
        zipCode,
        addressLine,
      });

      setValidationError(errors);

      if (!isValid) {
        console.log("Validation failed");
        return;
      }

      clearSavedAddressesCache();

      if (action === SavedInfoAction.ADD) {
        console.log("Adding new address:", {
          addressID,
          country,
          fullName,
          phoneNumber,
          zipCode,
          addressLine,
          unitNumber,
          isDefault,
        });
      } else if (action === SavedInfoAction.EDIT) {
        await editAddress();
      }
    } catch (error) {
      setActionError(
        getApiErrorMessage(
          error,
          `Failed to ${action === SavedInfoAction.EDIT ? "update" : "add"} address. Please try again.`,
        ),
      );
      console.error(
        `Error ${action === SavedInfoAction.EDIT ? "updating" : "adding"} address:`,
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbInfo = getBreadcrumbInfo();

  return (
    <div className="modify-address-page-container">
      <div>
        <Breadcrumb
          items={[
            { label: "My Account", path: "/myaccount/" },
            {
              label: breadcrumbInfo.label,
              path: "/savedinfo/",
              state: breadcrumbInfo.state,
            },
          ]}
        />
      </div>
      <div className="common-header">{renderHeader()}</div>

      {/* Error Message */}
      {actionError && <div className="error-message">{actionError}</div>}

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
              id="defaultAddress"
              className={`checkbox-item ${action === SavedInfoAction.EDIT ? "cursor-disabled" : ""}`}
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={action === SavedInfoAction.EDIT}
            />
            <label
              className={`filter-label ${action === SavedInfoAction.EDIT ? "cursor-disabled" : ""}`}
              onClick={() =>
                action !== SavedInfoAction.EDIT && setIsDefault(!isDefault)
              }
            >
              Make this my default address
            </label>
          </div>
        </div>

        <button
          className={`common-button modify-address-button ${isLoading ? "loading" : ""}`}
          onClick={handleAction}
          disabled={isLoading}
        >
          {getButtonText()}
        </button>

        <Footer />
      </div>
    </div>
  );
};

export default ModifyAddressPage;
