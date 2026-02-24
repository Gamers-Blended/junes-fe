import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { FormInput } from "../components/FormInput.tsx";

interface ResetPasswordPageProps {
  offlineMode?: boolean;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // null = still checking

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmEmail: "",
    confirmPassword: "",
  });
  const [apiError, setApiError] = useState<string>("");
  const [isValidating, setisValidating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }

    const validateToken = async () => {
      setisValidating(true);

      if (offlineMode) {
        console.log("Offline mode: Skipping validate reset token API call");
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsTokenValid(true);
        return;
      }

      try {
        await apiClient.get(
          `${REQUEST_MAPPING}/auth/validate-reset-token/${token}`,
        );
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
      } finally {
        setisValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const resetPassword = async (password: string) => {
    setIsLoading(true);
    setApiError("");

    if (offlineMode) {
      console.log("Offline mode: Skipping reset password API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      try {
        await apiClient.post(`${REQUEST_MAPPING}/auth/reset-password`, {
          token: token,
          newPassword: password,
        });
      } catch (error) {
        setApiError(
          getApiErrorMessage(
            error,
            "Failed to reset password. Please try again.",
          ),
        );
        console.error("Error resetting password:", error);
        setIsLoading(false);
        return;
      }
    }

    console.log("Password reset");
    const state: NavigationState = {
      from: "resetpassword",
      successMessage: "Password reset",
    };
    navigate("/usercredentialschanged/", { state });
    // No need to set isLoading to false here as we navigate away
  };

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
      resetPassword(password);
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

          {isValidating || isTokenValid === null ? (
            <div>Validating link, please wait...</div>
          ) : isTokenValid ? (
            <>
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

              {apiError && <div className="error-message">{apiError}</div>}

              {/* Reset Button */}
              <div className="actions-container">
                <button
                  onClick={handleReset}
                  className={`form-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  Reset Password
                </button>
              </div>
            </>
          ) : (
            <div className="error-message">
              <p>Sorry, your password reset link has expired. </p>
              <p>
                Please visit the <strong>Forgot Password page</strong> to
                receive a new link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
