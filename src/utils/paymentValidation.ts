import { PaymentFormField } from "./Enums";

const CARD_NUMBER_MIN_LENGTH = 13;
export const CARD_NUMBER_WITHOUT_SPACES_LENGTH = 16;
export const CARD_NUMBER_WITH_SPACES_LENGTH = 19;

export interface PaymentValidationErrors {
  cardNumber?: string;
  cardHolderName?: string;
  expirationMonth?: string;
  expirationYear?: string;
}

export interface PaymentFormData {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
}

/**
 * Validates card number with Luhn algorithm (e.g. 4242 4242 4242 4242)
 * @param cardNumber - card number to validate (with or without spaces)
 * @returns true if valid, false otherwise
 */
export const luhnCheck = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s/g, "");
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Check if card has expired
 * @param month - Expiration month (01 - 12)
 * @param year - Expiration year (YYYY)
 * @returns true if expired, false otherwise
 */
const isCardExpired = (month: string, year: string): boolean => {
  if (!month || !year) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 0-indexed

  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);

  if (expYear < currentYear) return true;
  if (expYear === currentYear && expMonth < currentMonth) return true;

  return false;
};

/**
 * Validates 1 payment field
 * @param fieldName - Name of field to validate
 * @param value  - Value to validate
 * @param allValues - All payment values (for expiration date validation)
 * @returns Error message if validation fails, undefined otherwise
 */
export const validatePaymentField = (
  fieldName: keyof PaymentValidationErrors,
  value: string,
  allValues?: PaymentFormData
): string | undefined => {
  switch (fieldName) {
    case PaymentFormField.CARD_NUMBER:
      if (!value || value.trim() === "") {
        return "Card number is required";
      }
      // Remove spaces for validation
      const cleanCardNumber = value.replace(/\s/g, "");
      if (!/^\d+$/.test(cleanCardNumber)) {
        return "Card number must contain only digits";
      }
      if (
        cleanCardNumber.length < CARD_NUMBER_MIN_LENGTH ||
        cleanCardNumber.length > CARD_NUMBER_WITH_SPACES_LENGTH
      ) {
        return `Card number must be between ${CARD_NUMBER_MIN_LENGTH} and ${CARD_NUMBER_WITH_SPACES_LENGTH} digits`;
      }
      if (!luhnCheck(cleanCardNumber)) {
        return "Please enter a valid card number";
      }
      break;

    case PaymentFormField.CARD_HOLDER_NAME:
      if (!value || value.trim() === "") {
        return "Cardholder name is required";
      }
      if (value.trim().length < 2) {
        return "Cardholder name must be at least 2 characters long";
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return "Cardholder name can only contain letters, spaces, hypens, and apostrophes";
      }
      break;

    case PaymentFormField.EXPIRATION_MONTH:
      if (!value || value.trim() === "") {
        return "Please select an expiration month";
      }
      const monthNum = parseInt(value, 10);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return "Please select a valid month";
      }
      // When year is provided
      if (
        allValues?.expirationYear &&
        isCardExpired(value, allValues.expirationYear)
      ) {
        return "Card has expired";
      }
      break;

    case PaymentFormField.EXPIRATION_YEAR:
      if (!value || value.trim() === "") {
        return "Please select an expiration year";
      }
      const yearNum = parseInt(value, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < currentYear) {
        return "Please select a valid year";
      }
      // When month is provided
      if (
        allValues?.expirationMonth &&
        isCardExpired(allValues.expirationMonth, value)
      ) {
        return "Card has expired";
      }
      break;
  }
  return undefined;
};

/**
 * Validates all payment fields
 * @param formData - Payment form data to validate
 * @returns Object containing validation errors (empty if all valid) + boolean indicating if form is valid
 */
export const validateAllPaymentFields = (
  formData: PaymentFormData
): { errors: PaymentValidationErrors; isValid: boolean } => {
  const errors: PaymentValidationErrors = {};

  errors.cardNumber = validatePaymentField(
    PaymentFormField.CARD_NUMBER,
    formData.cardNumber,
    formData
  );
  errors.cardHolderName = validatePaymentField(
    PaymentFormField.CARD_HOLDER_NAME,
    formData.cardHolderName,
    formData
  );
  errors.expirationMonth = validatePaymentField(
    PaymentFormField.EXPIRATION_MONTH,
    formData.expirationMonth,
    formData
  );
  errors.expirationYear = validatePaymentField(
    PaymentFormField.EXPIRATION_YEAR,
    formData.expirationYear,
    formData
  );

  // Check if there are any errors
  const isValid = !Object.values(errors).some((error) => error !== undefined);

  return { errors, isValid };
};
