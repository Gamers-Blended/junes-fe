import { useState, JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { Credentials } from "../utils/Enums.tsx";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateNewPasswordCreation,
  validatePassword,
  validateEmail,
  validateMatch,
  setMatchValidationError,
} from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { FormInput } from "../components/FormInput.tsx";
import Breadcrumb from "../components/Breadcrumb.tsx";

interface ChangeCredentialsPageProps {
  offlineMode?: boolean;
}

const ChangeCredentialsPage: React.FC<ChangeCredentialsPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = location.state as NavigationState | null;
  const [currentEmail, setCurrentEmail] = useState<string>(
    navigationState?.email || "",
  );
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    currentPassword: "",
    confirmEmail: "",
    confirmPassword: "",
  });
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { fieldToChange } = location.state || {};
  const isPasswordMode = fieldToChange === Credentials.PASSWORD;

  useAuthRedirect(isLoggedIn);

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

  const changePassword = async (password: string): Promise<void> => {
    console.log("Calling update password API...");
    setIsLoading(true);
    setApiError("");

    if (offlineMode) {
      console.log("Offline mode: Skipping update password API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      try {
        await apiClient.patch(`${REQUEST_MAPPING}/user/password`, {
          currentPassword: currentPassword,
          newPassword: password,
        });
      } catch (error) {
        setApiError(
          getApiErrorMessage(
            error,
            "Failed to update password. Please try again.",
          ),
        );
        console.error("Error updating password:", error);
        setIsLoading(false);
        return;
      }
    }

    console.log("Password updated");
    const state: NavigationState = {
      from: "changecredentials",
      successMessage: "Password updated",
      fieldToChange: Credentials.PASSWORD,
    };
    navigate("/myaccount/", { state });
    // No need to set isLoading to false here as we navigate away
  };

  const changeEmail = async (email: string): Promise<void> => {
    console.log("Calling update email API...");
    setIsLoading(true);
    setApiError("");

    if (offlineMode) {
      console.log("Offline mode: Skipping update email API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      try {
        await apiClient.patch(`${REQUEST_MAPPING}/user/email`, {
          currentEmail: currentEmail,
          newEmail: email,
        });
      } catch (error) {
        setApiError(
          getApiErrorMessage(
            error,
            "Failed to update email. Please try again.",
          ),
        );
        console.error("Error updating email:", error);
        setIsLoading(false);
        return;
      }
    }

    console.log("email updated");
    const state: NavigationState = {
      from: "changecredentials",
      successMessage: `A verification email has been sent to ${email}.\nPlease open it in your inbox and follow the steps stated in the email.`,
      fieldToChange: Credentials.EMAIL,
      mode: "info",
    };
    navigate("/myaccount/", { state });
    // No need to set isLoading to false here as we navigate away
  };

  const handleUpdate = async (): Promise<void> => {
    let newErrors: FormErrors = {
      email: "",
      password: "",
      currentPassword: "",
      confirmEmail: "",
      confirmPassword: "",
    };

    if (isPasswordMode) {
      newErrors.currentPassword = validatePassword(currentPassword);
      newErrors.password = validateNewPasswordCreation(password);
      newErrors.confirmPassword = validateMatch(
        password,
        confirmPassword,
        Credentials.PASSWORD,
      );
    } else {
      newErrors.email = validateEmail(email);
      newErrors.confirmEmail = validateMatch(
        email,
        confirmEmail,
        Credentials.EMAIL,
      );
    }

    setErrors(newErrors);

    // If no errors, proceed update
    if (
      !newErrors.email &&
      !newErrors.currentPassword &&
      !newErrors.password &&
      !newErrors.confirmEmail &&
      !newErrors.confirmPassword
    ) {
      if (fieldToChange === Credentials.PASSWORD) {
        await changePassword(password);
      } else if (fieldToChange === Credentials.EMAIL) {
        await changeEmail(email);
      }
    }
  };

  const handleCurrentPasswordChange = createInputChangeHandler(
    setCurrentPassword,
    setErrors,
    Credentials.CURRENT_PASSWORD,
  );

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

  const handleEmailChange = createInputChangeHandler(
    setEmail,
    setErrors,
    Credentials.EMAIL,
  );

  const handleConfirmEmailChange = createInputChangeHandler(
    setConfirmEmail,
    setErrors,
    Credentials.CONFIRM_EMAIL,
  );

  const validateConfirmPasswordOnBlur = (): void => {
    setMatchValidationError(
      password,
      confirmPassword,
      setErrors,
      Credentials.CONFIRM_PASSWORD,
    );
  };

  const validateConfirmEmailOnBlur = (): void => {
    setMatchValidationError(
      email,
      confirmEmail,
      setErrors,
      Credentials.CONFIRM_EMAIL,
    );
  };

  return (
    <div className="change-credentials-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-parent-container">
        <div className="form">
          <div className="form-title text-align-left">{renderHeader()}</div>

          <div className="form-container">
            {isPasswordMode ? (
              <>
                {/* Current Password Input */}
                <FormInput
                  label="Current password"
                  type={Credentials.PASSWORD}
                  placeholder={"Please key in your current password here"}
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  error={errors.currentPassword}
                  className={`input-field password-input ${
                    errors.currentPassword ? "error" : ""
                  }`}
                  showPasswordToggle={true}
                />

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
                    <strong>Current email</strong>
                    <br />
                    {currentEmail}
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
              <button
                onClick={handleUpdate}
                className={`form-button ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                Update {isPasswordMode ? "Password" : "Email"}
              </button>
            </div>

            {/* Error Message */}
            {apiError && <div className="error-message">{apiError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCredentialsPage;
