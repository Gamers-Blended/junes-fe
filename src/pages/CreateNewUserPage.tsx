import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { Credentials } from "../utils/Enums";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateEmail,
  validateUsername,
  validateNewPasswordCreation,
  validateMatch,
  setMatchValidationError,
} from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import { FormInput } from "../components/FormInput.tsx";

const CreateNewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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
      confirmPassword: validateMatch(
        password,
        confirmPassword,
        Credentials.PASSWORD
      ),
    };

    setErrors(newErrors);

    // If no errors, proceed sign in
    if (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.username &&
      !newErrors.confirmPassword
    ) {
      console.log("User created");
      const state: NavigationState = { from: "createUser", email };
      navigate("/emailsent/", { state });
    }
  };

  const handleEmailChange = createInputChangeHandler(
    setEmail,
    setErrors,
    Credentials.EMAIL
  );

  const handleUsernameChange = createInputChangeHandler(
    setUsername,
    setErrors,
    Credentials.USERNAME
  );

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

  const validateConfirmPasswordOnBlur = (): void => {
    setMatchValidationError(
      password,
      confirmPassword,
      setErrors,
      Credentials.CONFIRM_PASSWORD
    );
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
          <FormInput
            label="Email"
            type={Credentials.EMAIL}
            placeholder="Must be unique"
            value={email}
            onChange={handleEmailChange}
            error={errors.email}
            className={`input-field ${errors.email ? "error" : ""}`}
          />

          {/* Username Input */}
          <FormInput
            label="Username"
            type="username"
            placeholder={`Must be unique, between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`}
            value={username}
            onChange={handleUsernameChange}
            error={errors.username}
            className={`input-field ${errors.username ? "error" : ""}`}
          />

          {/* Password Input */}
          <FormInput
            label="Password"
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
            label="Type Password Again"
            type={Credentials.PASSWORD}
            placeholder="Re-type your password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={validateConfirmPasswordOnBlur}
            error={errors.confirmPassword}
            className={`input-field ${errors.confirmPassword ? "error" : ""}`}
            showPasswordToggle={true}
          />

          {/* Create Button & Links */}
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
