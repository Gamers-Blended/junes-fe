import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { Credentials } from "../utils/Enums.tsx";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateNewPasswordCreation,
  validateMatch,
  setMatchValidationError,
} from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import { FormInput } from "../components/FormInput.tsx";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmEmail: "",
    confirmPassword: "",
  });

  const handleReset = (): void => {
    let newErrors: FormErrors = {
      email: "",
      password: "",
      confirmEmail: "",
      confirmPassword: "",
    };

    newErrors.password = validateNewPasswordCreation(password);
    newErrors.confirmPassword = validateMatch(
      password,
      confirmPassword,
      Credentials.PASSWORD,
    );

    setErrors(newErrors);

    // If no errors, proceed update
    if (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmEmail &&
      !newErrors.confirmPassword
    ) {
      const state: NavigationState = {
        from: "resetpassword",
        successMessage: "Password reset",
      };
      navigate("/usercredentialschanged/", { state });
    }
  };

  const handlePasswordChange = createInputChangeHandler(
    setPassword,
    setErrors,
    Credentials.PASSWORD,
  );

  const handleConfirmPasswordChange = createInputChangeHandler(
    setConfirmPassword,
    setErrors,
    Credentials.CONFIRM_PASSWORD,
  );

  const validateConfirmPasswordOnBlur = (): void => {
    setMatchValidationError(
      password,
      confirmPassword,
      setErrors,
      Credentials.CONFIRM_PASSWORD,
    );
  };

  return (
    <div className="change-credentials-container">
      <div className="form-parent-container">
        <div className="form">
          <div className="form-title text-align-left">
            <h1>RESET PASSWORD</h1>
          </div>

          <div className="form-container">
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
              className={`input-field ${errors.confirmPassword ? "error" : ""}`}
              showPasswordToggle={true}
            />
          </div>

          {/* Reset Button */}
          <div className="actions-container">
            <button onClick={handleReset} className="form-button">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
