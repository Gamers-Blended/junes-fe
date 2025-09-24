// Validate email field
const EMAIL_MAX_LENGTH = 254;

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
