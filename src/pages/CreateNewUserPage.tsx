import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { apiClient } from "../utils/api.ts";
import { Credentials } from "../utils/Enums";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateEmail,
  validateNewPasswordCreation,
  validateMatch,
  setMatchValidationError,
} from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import { FormInput } from "../components/FormInput.tsx";
import axios from "axios";

interface CreateNewUserPageProps {
  offlineMode?: boolean;
}

const CreateNewUserPage: React.FC<CreateNewUserPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [creationError, setCreationError] = useState<string>("");

  const handleCreate = async (): Promise<void> => {
    // Clear previous creation error
    setCreationError("");

    // Validate inputs
    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validateNewPasswordCreation(password),
      confirmPassword: validateMatch(
        password,
        confirmPassword,
        Credentials.PASSWORD,
      ),
    };

    setErrors(newErrors);

    // If no errors, proceed sign in
    if (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    ) {
      try {
        // Skip API call in offline mode
        if (offlineMode) {
          console.log("Offline mode: Skipping user creation API call");
        } else {
          await createUser(email, password);
        }

        console.log("User created");
        const state: NavigationState = { from: "createUser", email };
        navigate("/emailsent/", { state });
      } catch (error) {
        console.error("Error during user creation:", error);
        setCreationError(
          "An error occurred while creating the account. Please try again.",
        );
      }
    }
  };

  const createUser = async (email: string, password: string): Promise<void> => {
    console.info("Calling create user API...");

    const requestData = {
      email: email,
      password: password,
    };
    try {
      const response = await apiClient.post(
        "/junes/api/v1/auth/add-user",
        requestData,
      );

      console.log("User creation response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setCreationError(
          error.response.data.message || "Failed to create user.",
        );
        console.error("Error creating user:", error.response.data);
      }
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

          {creationError && (
            <div className="error-message">{creationError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNewUserPage;
