import { AddressFormField } from "./Enums";

export interface AddressValidationErrors {
  country?: string;
  fullName?: string;
  phoneNumber?: string;
  zipCode?: string;
  addressLine?: string;
}

export interface AddressFormData {
  country: string;
  fullName: string;
  phoneNumber: string;
  zipCode: string;
  addressLine: string;
}

/**
 * Validates 1 address field
 * @param fieldName - Name of field to validate
 * @param value - Value to validate
 * @returns Error message if validation fails, undefined otherwise
 */
export const validateAddressField = (
  fieldName: keyof AddressValidationErrors,
  value: string
): string | undefined => {
  switch (fieldName) {
    case AddressFormField.COUNTRY:
      if (!value || value.trim() === "")
        return "Please select a country/region";
      break;
    case AddressFormField.FULL_NAME:
      if (!value || value.trim() === "") {
        return "Full name is required";
      }
      if (value.trim().length < 2) {
        return "Full name must be at least 2 characters long";
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return "Full name can only contain letters, spaces, hyphens, and apostrophes";
      }
      break;
    case AddressFormField.PHONE_NUMBER:
      if (!value || value.trim() === "") {
        return "Phone number is required";
      }
      // Remove spaces, dashes, and parentheses for validation
      const cleanPhone = value.replace(/[\s\-()]/g, "");
      if (!/^\+?[\d]{8,15}$/.test(cleanPhone)) {
        return "Please enter a valid phone number (8-15 digits)";
      }
      break;
    case AddressFormField.ZIP_CODE:
      if (!value || value.trim() === "") {
        return "Zip code is required";
      }
      if (value.trim().length < 3) {
        return "Please enter a valid zip code";
      }
      break;
    case AddressFormField.ADDRESS_LINE:
      if (!value || value.trim() === "") {
        return "Address is required";
      }
      if (value.trim().length < 5) {
        return "Please enter a complete address";
      }
      break;
  }
  return undefined;
};

/**
 * Validates all address fields
 * @param formData - Address form data to validate
 * @returns Object containing validation errors (empty if all valid) + boolean indicating if form is valid
 */
export const validateAllAddressFields = (
  formData: AddressFormData
): { errors: AddressValidationErrors; isValid: boolean } => {
  const errors: AddressValidationErrors = {};

  errors.country = validateAddressField(
    AddressFormField.COUNTRY,
    formData.country
  );
  errors.fullName = validateAddressField(
    AddressFormField.FULL_NAME,
    formData.fullName
  );
  errors.phoneNumber = validateAddressField(
    AddressFormField.PHONE_NUMBER,
    formData.phoneNumber
  );
  errors.zipCode = validateAddressField(
    AddressFormField.ZIP_CODE,
    formData.zipCode
  );
  errors.addressLine = validateAddressField(
    AddressFormField.ADDRESS_LINE,
    formData.addressLine
  );

  // Check if there are any errors
  const isValid = !Object.values(errors).some((error) => error !== undefined);

  return { errors, isValid };
};
