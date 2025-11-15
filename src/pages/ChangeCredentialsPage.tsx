import { useState, JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { Credentials } from "../utils/Enums.tsx";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateNewPasswordCreation,
  validateConfirmPassword,
  validatePasswordMatch,
} from "../utils/inputValidationUtils";
import {
  createPasswordChangeHandler,
  createConfirmPasswordChangeHandler,
} from "../utils/FormHandlers";
import { FormInput } from "../components/FormInput.tsx";
import Breadcrumb from "../components/Breadcrumb.tsx";

const ChangeCredentialsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { fieldToChange } = location.state || {};
  const isPasswordMode = fieldToChange === Credentials.PASSWORD;

  const breadcrumbItems = [
    {
      label: "My Account",
      path: "/myaccount/",
    },
  ];

  const renderHeader = (): JSX.Element => {
    switch (fieldToChange) {
      case Credentials.PASSWORD:
        return <h1>CHANGE PASSWORD</h1>;
      case Credentials.EMAIL:
        return <h1>CHANGE EMAIL</h1>;
      default:
        return <h1>CHANGE CREDENTIALS</h1>;
    }
  };

  const handleUpdate = (): void => {
    const newErrors: FormErrors = {
      email: "",
      password: validateNewPasswordCreation(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(newErrors);

    // If no errors, proceed update
    if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      console.log(`Credentials (${fieldToChange}) updated!`);
      const state: NavigationState = {
        from: "changecredentials",
        successMessage: `${
          fieldToChange.charAt(0).toUpperCase() + fieldToChange.slice(1)
        } changed`,
      };

      if (fieldToChange === Credentials.PASSWORD) {
        navigate("/myaccount/", { state });
      }
    }
  };

  const handlePasswordChange = createPasswordChangeHandler(
    setPassword,
    setErrors
  );

  const handleConfirmPasswordChange = createConfirmPasswordChangeHandler(
    setConfirmPassword,
    setErrors
  );

  const validateConfirmPasswordOnBlur = (): void => {
    validatePasswordMatch(password, confirmPassword, setErrors);
  };

  return (
    <div className="change-credentials-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-parent-container">
        <div className="form">
          <div className="form-title">
            <h1>{renderHeader()}</h1>
          </div>

          <div className="form-container">
            {isPasswordMode && (
              <>
                {/* New Password Input */}
                <FormInput
                  label="New password"
                  type={Credentials.PASSWORD}
                  placeholder={`Between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  className={`input-field password-input ${
                    errors.password ? "error" : ""
                  }`}
                  showPasswordToggle={true}
                />

                {/* Confirm Password Input */}
                <FormInput
                  label="Confirm password"
                  type={Credentials.PASSWORD}
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={validateConfirmPasswordOnBlur}
                  error={errors.confirmPassword}
                  className={`input-field ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                  showPasswordToggle={true}
                />
              </>
            )}

            {/* Update Button */}
            <div className="actions-container">
              <button onClick={handleUpdate} className="form-button">
                Update {isPasswordMode ? "Password" : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCredentialsPage;
