import React from "react";
import { FormErrors } from "../types/formErrors";

/**
 * Creates an input change handler that updates state and clears errors
 * @param setter - State setter function for the input value
 * @param setErrors - State setter function for form errors
 * @param errorKey - The key in the errors object to clear
 * @returns Change event handler
 */
export const createInputChangeHandler = (
  setter: React.Dispatch<React.SetStateAction<string>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  errorKey: keyof FormErrors
) => {
  return (e: React.ChangeEvent<HTMLInputElement>): void => {
    setter(e.target.value);
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [errorKey]: "" }));
  };
};

/**
 * Creates a password change handler
 * @param setPassword - State setter for password
 * @param setErrors - State setter for errors
 * @returns Password change handler
 */
export const createPasswordChangeHandler = (
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  return createInputChangeHandler(setPassword, setErrors, "password");
};

/**
 * Creates a confirm password change handler
 * @param setConfirmPassword - State setter for confirm password
 * @param setErrors - State setter for errors
 * @returns Confirm password change handler
 */
export const createConfirmPasswordChangeHandler = (
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  return createInputChangeHandler(setConfirmPassword, setErrors, "confirmPassword");
};