import React from "react";
import { FormErrors } from "../types/formErrors";

const EMAIL_MAX_LENGTH = 254;
export const USERNAME_MIN_LENGTH = 6;
export const USERNAME_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 50;

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

// For existing passwords
export const validatePassword = (password: string): string => {
  if (!password.trim()) {
    return "Password is required";
  }

  return "";
};

// For user creation page
export const validateNewPasswordCreation = (password: string): string => {
  if (!password.trim()) {
    return "Password is required";
  }

  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`;
  }

  return "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
): void => {
  if (password !== confirmPassword) {
    setErrors((prev) => ({
      ...prev,
      confirmPassword: "Passwords do not match",
    }));
  }
};

export const validateUsername = (username: string): string => {
  if (!username.trim()) {
    return "Username is required";
  }

  if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
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
