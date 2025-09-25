import { useState } from "react";
import { FormErrors } from "../types/formErrors";

const ForgetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
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
          <div className="input-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={`input-field ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <p className="form-error-message">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
