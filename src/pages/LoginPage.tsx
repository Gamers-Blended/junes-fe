import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Credentials } from "../utils/Enums";
import { validateEmail, validatePassword } from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import { FormErrors } from "../types/formErrors";
import { apiClient } from "../utils/api.ts";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";
import { FormInput } from "../components/FormInput.tsx";
import axios from "axios";

interface LoginPageProps {
  offlineMode?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, []);

  const handleSignIn = async (): Promise<void> => {
    // Clear previous login error
    setLoginError("");

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const newErrors: FormErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);

    // If no errors, proceed login
    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);

      if (offlineMode) {
        console.log("Offline mode: Skipping login API call");
        // Simulate successful login
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        try {
          await signIn(email, password);
        } catch (error) {
          console.error("Error during sign-in:", error);
          return;
        }
      }

      setIsLoggedIn(true);
      console.log("Signed in");
      navigate("/myaccount/");
      // No need to set isLoading to false here as we navigate away
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    console.log("Calling login API...");

    const requestData = {
      email: email,
      password: password,
    };
    try {
      const response = await apiClient.post(
        "/junes/api/v1/auth/login",
        requestData,
      );

      console.log("Login successful");

      // Store JWT
      const { token, userID, email: userEmail } = response.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userID", userID);
      localStorage.setItem("userEmail", userEmail);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setLoginError(
          error.response.data.message || "Login failed. Please try again.",
        );
        console.error("Login failed:", error.response.data);
      }
      setIsLoading(false);
      throw error;
    }
  };

  const handleEmailChange = createInputChangeHandler(
    setEmail,
    setErrors,
    Credentials.EMAIL,
  );

  const handlePasswordChange = createInputChangeHandler(
    setPassword,
    setErrors,
    Credentials.PASSWORD,
  );

  const handleCreateAccount = (): void => {
    console.log("Routing to create account page");
    navigate("/createaccount/");
  };

  const handleForgotPassword = (): void => {
    console.log("Routing to forgot password page");
    navigate("/resetpassword/");
  };

  return (
    <div className="form-parent-container">
      <div className="form">
        <div className="form-title">
          <h1>LOGIN</h1>
        </div>

        <div className="form-container">
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

          {/* Password Input */}
          <FormInput
            label="Password"
            type={Credentials.PASSWORD}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            error={errors.password}
            className={`input-field password-input ${
              errors.password ? "error" : ""
            }`}
            showPasswordToggle={true}
          />

          {/* Sign In Button and Links */}
          <div className="actions-container">
            <button
              onClick={handleSignIn}
              className={`form-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="links-container">
              <button
                onClick={handleCreateAccount}
                className="link-button"
                disabled={isLoading}
              >
                Create account
              </button>
              <button
                onClick={handleForgotPassword}
                className="link-button"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>

        {loginError && <div className="error-message">{loginError}</div>}
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
