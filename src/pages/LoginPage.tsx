import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Credentials } from "../utils/Enums";
import { validateEmail, validatePassword } from "../utils/inputValidationUtils";
import {
  createPasswordChangeHandler,
  createInputChangeHandler,
} from "../utils/FormHandlers";
import { FormErrors } from "../types/formErrors";
import { useAuth } from "../components/AuthContext";
import Footer from "../components/Footer";
import { FormInput } from "../components/FormInput.tsx";

const LoginPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, []);

  const handleSignIn = (): void => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const newErrors: FormErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);

    // If no errors, proceed sign in
    if (!newErrors.email && !newErrors.password) {
      setIsLoggedIn(true);
      console.log("Signed in");
      navigate("/myaccount/");
    }
  };

  const handleEmailChange = createInputChangeHandler(
    setEmail,
    setErrors,
    Credentials.EMAIL
  );

  const handlePasswordChange = createPasswordChangeHandler(
    setPassword,
    setErrors
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
            <button onClick={handleSignIn} className="form-button">
              Sign In
            </button>

            <div className="links-container">
              <button onClick={handleCreateAccount} className="link-button">
                Create account
              </button>
              <button onClick={handleForgotPassword} className="link-button">
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
