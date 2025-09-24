import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Footer from "../components/Footer";

interface FormErrors {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
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

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-title">
          <h1>LOGIN</h1>
        </div>

        <div className="form-container">
          {/* Email Input */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={`input-field ${errors.email ? "error" : ""}`}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
              <p className="error-message">{errors.password}</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
