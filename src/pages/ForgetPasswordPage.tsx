import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { FormErrors } from "../types/formErrors";
import { Credentials } from "../utils/Enums";
import { validateEmail } from "../utils/inputValidationUtils";
import { createInputChangeHandler } from "../utils/FormHandlers";
import { FormInput } from "../components/FormInput.tsx";

const ForgetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
  });

  const handleSendEmail = (): void => {
    const newErrors: FormErrors = {
      email: validateEmail(email),
    };

    setErrors(newErrors);

    // If no errors, proceed sign in
    if (!newErrors.email && !newErrors.password) {
      console.log("User created");
      const state: NavigationState = { from: "forgetPassword", email };
      navigate("/emailsent/", { state });
    }
  };

  const handleEmailChange = createInputChangeHandler(
    setEmail,
    setErrors,
    Credentials.EMAIL
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
            <button onClick={handleSendEmail} className="form-button">
              Send Email
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

export default ForgetPasswordPage;
