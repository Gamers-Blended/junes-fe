import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Credentials } from "../utils/Enums.tsx";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  id,
  name,
  className = "",
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputID = id || name || label.toLowerCase().replace(/\s+/g, "-");

  const inputType = showPasswordToggle && showPassword ? "text" : type;
  const isPasswordField =
    showPasswordToggle &&
    (type === Credentials.PASSWORD || type === Credentials.CONFIRM_PASSWORD);

  const inputElement = (
    <input
      id={inputID}
      name={name}
      type={inputType}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`input-field ${isPasswordField ? "password-input" : ""} ${
        error ? "error" : ""
      } ${className}`}
    />
  );

  return (
    <div className="input-group">
      <label htmlFor={inputID} className="label">
        {label}
      </label>

      {/* Password has Eye Toggle */}
      {isPasswordField ? (
        <div className="password-container">
          {inputElement}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="eye-toggle"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      ) : (
        inputElement
      )}

      {error && (
        <p id={`${inputID}-error`} className="form-error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
