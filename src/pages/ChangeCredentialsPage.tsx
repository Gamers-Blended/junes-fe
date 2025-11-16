import { useState, JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { mockUserData } from "../mocks/data/userData.ts";
import { Credentials } from "../utils/Enums.tsx";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateNewPasswordCreation,
  validateEmail,
  validateMatch,
  setMatchValidationError,
} from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import { FormInput } from "../components/FormInput.tsx";
import Breadcrumb from "../components/Breadcrumb.tsx";

const ChangeCredentialsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmEmail: "",
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
    let newErrors: FormErrors = {
      email: "",
      password: "",
      confirmEmail: "",
      confirmPassword: "",
    };

    if (isPasswordMode) {
      newErrors.password = validateNewPasswordCreation(password);
      newErrors.confirmPassword = validateMatch(
        password,
        confirmPassword,
        Credentials.PASSWORD
      );
    } else {
      newErrors.email = validateEmail(email);
      newErrors.confirmEmail = validateMatch(
        email,
        confirmEmail,
        Credentials.EMAIL
      );
    }

    setErrors(newErrors);

    // If no errors, proceed update
    if (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmEmail &&
      !newErrors.confirmPassword
    ) {
      console.log(`Credentials (${fieldToChange}) updated!`);
      if (fieldToChange === Credentials.PASSWORD) {
        const state: NavigationState = {
          from: "changecredentials",
          successMessage: `${
            fieldToChange.charAt(0).toUpperCase() + fieldToChange.slice(1)
          } changed`,
        };
        navigate("/myaccount/", { state });
      } else if (fieldToChange === Credentials.EMAIL) {
        navigate("/emailsent/");
      }
    }
  };

  const handlePasswordChange = createInputChangeHandler(
    setPassword,
    setErrors,
    Credentials.PASSWORD
  );

  const handleConfirmPasswordChange = createInputChangeHandler(
    setConfirmPassword,
    setErrors,
    Credentials.CONFIRM_PASSWORD
  );

  const handleEmailChange = createInputChangeHandler(
    setEmail,
    setErrors,
    Credentials.EMAIL
  );

  const handleConfirmEmailChange = createInputChangeHandler(
    setConfirmEmail,
    setErrors,
    Credentials.CONFIRM_EMAIL
  );

  const validateConfirmPasswordOnBlur = (): void => {
    setMatchValidationError(
      password,
      confirmPassword,
      setErrors,
      Credentials.CONFIRM_PASSWORD
    );
  };

  const validateConfirmEmailOnBlur = (): void => {
    setMatchValidationError(
      email,
      confirmEmail,
      setErrors,
      Credentials.CONFIRM_EMAIL
    );
  };

  return (
    <div className="change-credentials-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-parent-container">
        <div className="form">
          <div className="form-title text-align-left">
            <h1>{renderHeader()}</h1>
          </div>

          <div className="form-container">
            {isPasswordMode ? (
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
            ) : (
              <>
                <div className="text-align-left">
                  <p>
                    <strong>Old email</strong>
                    <br />
                    {mockUserData.email}
                  </p>
                </div>
                {/* New Email Input */}
                <FormInput
                  label="New email"
                  type={Credentials.EMAIL}
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  error={errors.email}
                  className={`input-field password-input ${
                    errors.email ? "error" : ""
                  }`}
                />
                {/* Confirm Email Input */}
                <FormInput
                  label="Confirm email"
                  type={Credentials.EMAIL}
                  placeholder="Re-type your email"
                  value={confirmEmail}
                  onChange={handleConfirmEmailChange}
                  onBlur={validateConfirmEmailOnBlur}
                  error={errors.confirmEmail}
                  className={`input-field ${
                    errors.confirmEmail ? "error" : ""
                  }`}
                />
              </>
            )}

            {/* Update Button */}
            <div className="actions-container">
              <button onClick={handleUpdate} className="form-button">
                Update {isPasswordMode ? "Password" : "Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCredentialsPage;
