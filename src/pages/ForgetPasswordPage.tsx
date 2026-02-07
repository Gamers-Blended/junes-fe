import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { Credentials } from "../utils/Enums";
import { validateEmail } from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import { apiClient, getApiErrorMessage } from "../utils/api.ts";
import { FormInput } from "../components/FormInput.tsx";

interface ForgotPasswordPageProps {
  offlineMode?: boolean;
}

const ForgetPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
  });
  const [sendEmailError, setSendEmailError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSendEmail = async (): Promise<void> => {
    // Clear previous send email error
    setSendEmailError("");

    const newErrors: FormErrors = {
      email: validateEmail(email),
    };

    setErrors(newErrors);

    // If no errors, proceed sign in
    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);

      if (offlineMode) {
        console.log("Offline mode: Skipping send forget email API call");
        // Simulate successful email send
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        try {
          await sendForgetPasswordEmail(email);
        } catch (error) {
          setSendEmailError(
            getApiErrorMessage(
              error,
              "Failed to send reset password email. Please try again.",
            ),
          );
          setIsLoading(false);
          return;
        }
      }

      console.info("Forget password email sent");
      const state: NavigationState = { from: "forgetPassword", email };
      navigate("/emailsent/", { state });
      // No need to set isLoading to false here as we navigate away
    }
  };

  const sendForgetPasswordEmail = async (email: string): Promise<void> => {
    console.log("Calling forget password API...");

    const response = await apiClient.post(
      "/junes/api/v1/auth/forgot-password?email=" + encodeURIComponent(email),
      {},
    );

    return response.data;
  };

  const handleEmailChange = createInputChangeHandler(
    setEmail,
    setErrors,
    Credentials.EMAIL,
  );

  const handleLoginAsExistingCustomer = (): void => {
    console.log("Routing to login page");
    navigate("/login/");
  };

  return (
    <div className="form-parent-container">
      <div className="form">
        <div className="form-title">
          <h1>FORGET PASSWORD?</h1>
        </div>

        <div className="form-container">
          <p className="form-text">
            Submit your email and an email with instructions to reset your
            password will be sent to you.
          </p>

          {/* Email Input */}
          <FormInput
            label="Email"
            type={Credentials.EMAIL}
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            error={errors.email}
            className={`input-field ${errors.email ? "error" : ""}`}
          />

          {/* Create Button & Links */}
          <div className="actions-container">
            <button
              onClick={handleSendEmail}
              className={`form-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending Email..." : "Send Email"}
            </button>

            <div className="links-container">
              <button
                onClick={handleLoginAsExistingCustomer}
                className="link-button"
                disabled={isLoading}
              >
                Login as existing customer
              </button>
            </div>
          </div>
        </div>

        {sendEmailError && (
          <div className="error-message">{sendEmailError}</div>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
