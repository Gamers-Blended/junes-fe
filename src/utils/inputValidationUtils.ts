const EMAIL_MAX_LENGTH = 254;
export const USERNAME_MIN_LENGTH = 6;
export const USERNAME_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 6;

export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return "Email is required";
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  // Length validation
  if (email.length > EMAIL_MAX_LENGTH) {
    return "Email address is too long";
  }

  return "";
};

export const validatePassword = (password: string): string => {
  if (!password.trim()) {
    return "Password is required";
  }

  return "";
};

export const validateUsername = (username: string): string => {
  if (!username.trim()) {
    return "Username is required";
  }

  if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    return `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`;
  }

  const allowedCharsRegex = /^[a-zA-Z0-9_]+$/;
  if (!allowedCharsRegex.test(username)) {
    return "Username can only contain letters, numbers, periods, and underscores";
  }

  if (!/^[a-zA-Z]/.test(username)) {
    return "Username must start with a letter";
  }

  if (username.endsWith(".") || username.endsWith("_")) {
    return "Username cannot end with a period or underscore";
  }

  return "";
};