import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FormErrors } from "../types/formErrors";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateEmail,
  validateUsername,
  validateNewPasswordCreation,
  validateConfirmPassword,
} from "../utils/inputValidationUtils";

const CreateNewUserPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleCreate = (): void => {
    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validateNewPasswordCreation(password),
      username: validateUsername(username),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(newErrors);

    // If no errors, proceed sign in
    if (!newErrors.email && !newErrors.password) {
      console.log("User created");
      navigate("/emailsent/");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(e.target.value);
    // Clear error when user starts typing
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setConfirmPassword(e.target.value);
    // Clear error when user starts typing
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validateConfirmPasswordOnBlur = (): void => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }
  };

  const handleLoginAsExistingCustomer = (): void => {
    console.log("Routing to login page");
    navigate("/login/");
  };

  return (
    <div className="form-parent-container">
      <div className="form">
        <div className="form-title">
          <h1>NEW CUSTOMER</h1>
        </div>

        <div className="form-container">
          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              placeholder="Must be unique"
              value={email}
              onChange={handleEmailChange}
              className={`input-field ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <p className="form-error-message">{errors.email}</p>
            )}
          </div>

          {/* Username Input */}
          <div className="input-group">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              type="text"
              placeholder={`Must be unique, between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`}
              value={username}
              onChange={handleUsernameChange}
              className={`input-field ${errors.username ? "error" : ""}`}
            />
            {errors.username && (
              <p className="form-error-message">{errors.username}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={`Between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`}
                value={password}
                onChange={handlePasswordChange}
                className={`input-field password-input ${
                  errors.password ? "error" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="form-error-message">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <label htmlFor="confirmPassword" className="label">
              Type Password Again
            </label>
            <input
              type="password"
              placeholder="Re-type your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={validateConfirmPasswordOnBlur}
              className={`input-field ${errors.confirmPassword ? "error" : ""}`}
            />
            {errors.confirmPassword && (
              <p className="form-error-message">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Create Button */}
          <div className="actions-container">
            <button onClick={handleCreate} className="form-button">
              Create
            </button>

            <div className="links-container">
              <button
                onClick={handleLoginAsExistingCustomer}
                className="link-button"
              >
                Login as existing customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewUserPage;
