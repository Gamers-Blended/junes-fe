import React from "react";
import { FormErrors } from "../types/formErrors";

/**
 * Creates an input change handler that updates state and clears errors
 * @param setter - State setter function for the input value
 * @param setErrors - State setter function for form errors
 * @param fieldName - The key in the errors object to clear
 * @returns Change event handler
 */
export const createInputChangeHandler = (
  setter: React.Dispatch<React.SetStateAction<string>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  fieldName: keyof FormErrors
) => {
  return (e: React.ChangeEvent<HTMLInputElement>): void => {
    setter(e.target.value);
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };
};
