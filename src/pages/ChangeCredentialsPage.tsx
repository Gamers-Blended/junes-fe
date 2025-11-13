import { useLocation } from "react-router-dom";
import { useState, JSX } from "react";
import { Credentials } from "../utils/Enums.tsx";
import { FormErrors } from "../types/formErrors";
import {
  createPasswordChangeHandler,
  createConfirmPasswordChangeHandler,
} from "../utils/FormHandlers";
import { FormInput } from "../components/FormInput.tsx";
import Breadcrumb from "../components/Breadcrumb.tsx";

const ChangeCredentialsPage: React.FC = () => {
  const location = useLocation();
  const { fieldToChange } = location.state || {};
  const isPasswordMode = fieldToChange === Credentials.PASSWORD;
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleUpdate = (): void => {};

  const handlePasswordChange = createPasswordChangeHandler(
    setPassword,
    setErrors
  );

  const handleConfirmPasswordChange = createConfirmPasswordChangeHandler(
    setConfirmPassword,
    setErrors
  );

  return (
    <div className="change-credentials-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-parent-container">
        <div className="form">
          <div className="form-title">
            <h1>{renderHeader()}</h1>
          </div>

          <div className="form-container">
            {isPasswordMode && (
              <>
                {/* New Password Input */}
                <FormInput
                  label="New password"
                  type={Credentials.PASSWORD}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  showPasswordToggle={true}
                />

                {/* Confirm Password Input */}
                <FormInput
                  label="Confirm password"
                  type={Credentials.CONFIRM_PASSWORD}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={errors.password}
                  showPasswordToggle={true}
                />
              </>
            )}

            {/* Update Button */}
            <div className="actions-container">
              <button onClick={handleUpdate} className="form-button">
                Update {isPasswordMode ? "Password" : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeCredentialsPage;
