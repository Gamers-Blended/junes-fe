import React, { useState } from "react";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import AddressCardContent from "../components/AddressCardContent";
import { formatCardNumber } from "../utils/utils";
import { PaymentFormField } from "../utils/Enums";
import {
  CARD_NUMBER_WITH_SPACES_LENGTH,
  validatePaymentField,
  validateAllPaymentFields,
  PaymentValidationErrors,
} from "../utils/paymentValidation";

import visaIcon from "../assets/acceptedCardsIcons/visaIcon.png";
import masterCardIcon from "../assets/acceptedCardsIcons/masterCardIcon.png";
import americanExpressIcon from "../assets/acceptedCardsIcons/americanExpressIcon.png";
import jcbIcon from "../assets/acceptedCardsIcons/jcbIcon.png";
import unionPayIcon from "../assets/acceptedCardsIcons/unionPayIcon.png";

// Discriminated union type guard
type SavedInfoActionWindowProps =
  | {
      type: "address";
      mode: "delete";
      savedItemData: Address;
      onClose?: () => void;
      onConfirm?: () => void;
    }
  | {
      type: "payment";
      mode: "add";
      savedItemData?: undefined;
      onAdd?: () => void;
      onClose?: () => void;
    }
  | {
      type: "payment";
      mode: "edit";
      savedItemData: PaymentMethod;
      onEdit?: () => void;
      onClose?: () => void;
      onConfirm?: () => void;
    }
  | {
      type: "payment";
      mode: "delete";
      savedItemData: PaymentMethod;
      onClose?: () => void;
      onConfirm?: () => void;
    };

const SavedInfoActionWindow: React.FC<SavedInfoActionWindowProps> = (props) => {
  const {
    type,
    mode,
    savedItemData,
    onClose = () => console.log("Close clicked"),
  } = props;

  const [currentPage, setCurrentPage] = useState(1);

  // Form state for payment methods
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState(
    type === "payment" && savedItemData ? savedItemData.cardHolderName : ""
  );
  const [expirationMonth, setExpirationMonth] = useState(
    type === "payment" && savedItemData ? savedItemData.expirationMonth : ""
  );
  const [expirationYear, setExpirationYear] = useState(
    type === "payment" && savedItemData ? savedItemData.expirationYear : ""
  );

  // Validation states
  const [paymentValidationError, setPaymentValidationError] =
    useState<PaymentValidationErrors>({});
  const [paymentTouched, setPaymentTouched] = useState<Set<string>>(new Set());

  const handleAction = () => {
    if (type === "payment" && mode === "add") {
      // Validate payment fields
      const { errors: paymentErrors, isValid: isPaymentValid } =
        validateAllPaymentFields({
          cardNumber,
          cardHolderName,
          expirationMonth,
          expirationYear,
        });

      setPaymentValidationError(paymentErrors);
      setPaymentTouched(
        new Set([
          PaymentFormField.CARD_NUMBER,
          PaymentFormField.CARD_HOLDER_NAME,
          PaymentFormField.EXPIRATION_MONTH,
          PaymentFormField.EXPIRATION_YEAR,
        ])
      );

      if (!isPaymentValid) {
        console.log("Validation failed");
        return;
      }

      const onAdd = props.onAdd || (() => console.log("Add clicked"));
      onAdd();
    } else if (type === "payment" && mode === "edit") {
      if (currentPage === 1) {
        setCurrentPage(2);
      } else {
        const onConfirm =
          props.onConfirm || (() => console.log("Confirm clicked"));
        onConfirm();
      }
    } else {
      // Delete mode for address and payment
      const onConfirm =
        props.onConfirm || (() => console.log("Confirm clicked"));
      onConfirm();
    }
  };

  // Card number needs to be formatted before processing
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCardNumber = formatCardNumber(e.target.value);
    setCardNumber(formattedCardNumber);

    // Clear error if field has been touched
    if (paymentTouched.has(PaymentFormField.CARD_NUMBER)) {
      const error = validatePaymentField(
        PaymentFormField.CARD_NUMBER,
        formattedCardNumber,
        {
          cardNumber: formattedCardNumber,
          cardHolderName,
          expirationMonth,
          expirationYear,
        }
      );
      setPaymentValidationError((prevErrors) => ({
        ...prevErrors,
        cardNumber: error,
      }));
    }
  };

  const handlePaymentFieldChange = (fieldName: string, value: string) => {
    switch (fieldName) {
      case PaymentFormField.CARD_HOLDER_NAME:
        setCardHolderName(value);
        break;
      case PaymentFormField.EXPIRATION_MONTH:
        setExpirationMonth(value);
        break;
      case PaymentFormField.EXPIRATION_YEAR:
        setExpirationYear(value);
        break;
    }

    // Clear error if field has been touched
    if (paymentTouched.has(fieldName)) {
      const error = validatePaymentField(
        fieldName as keyof PaymentValidationErrors,
        value,
        {
          cardNumber,
          cardHolderName:
            fieldName === PaymentFormField.CARD_HOLDER_NAME
              ? value
              : cardHolderName,
          expirationMonth:
            fieldName === PaymentFormField.EXPIRATION_MONTH
              ? value
              : expirationMonth,
          expirationYear:
            fieldName === PaymentFormField.EXPIRATION_YEAR
              ? value
              : expirationYear,
        }
      );
      setPaymentValidationError((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error,
      }));
    }
  };

  const handlePaymentBlur = (fieldName: string) => {
    setPaymentTouched((prev) => new Set(prev).add(fieldName));

    let value = "";
    switch (fieldName) {
      case PaymentFormField.CARD_NUMBER:
        value = cardNumber;
        break;
      case PaymentFormField.CARD_HOLDER_NAME:
        value = cardHolderName;
        break;
      case PaymentFormField.EXPIRATION_MONTH:
        value = expirationMonth;
        break;
      case PaymentFormField.EXPIRATION_YEAR:
        value = expirationYear;
        break;
    }

    const error = validatePaymentField(
      fieldName as keyof PaymentValidationErrors,
      value,
      {
        cardNumber,
        cardHolderName,
        expirationMonth,
        expirationYear,
      }
    );
    setPaymentValidationError((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const showPaymentValidationError = (fieldName: string): boolean => {
    return (
      paymentTouched.has(fieldName) &&
      !!paymentValidationError[fieldName as keyof PaymentValidationErrors]
    );
  };

  const getTitle = () => {
    if (type === "payment" && mode === "add") return "Add payment method";
    if (type === "payment" && mode === "edit") return "Edit payment method";
    if (type === "payment" && mode === "delete") return "Remove payment method";
    if (type === "address" && mode === "delete") return "Confirm deletion";
    return "";
  };

  const getButtonText = () => {
    if (type === "payment" && mode === "add") return "Add Card";
    if (type === "payment" && mode === "delete") return "Remove";
    if (type === "payment" && mode === "edit" && currentPage === 1)
      return "Save";
    if (type === "payment" && mode === "edit" && currentPage === 2)
      return "Use This Address";
    if (type === "address" && mode === "delete") return "Yes";
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const years = Array.from({ length: 10 }, (_, i) => String(2025 + i));

  const renderAddOrEditPaymentMethodForm = () => {
    const billingAddress =
      type === "payment" && savedItemData
        ? savedItemData.billingAddressId
        : null;

    return (
      <div className="add-edit-payment-form-container">
        {/* Left Column - Card Details */}
        <div className="add-edit-payment-left-column">
          {/* Card Number */}
          <div className="input-group padding-bottom">
            <label className="label bold">Card number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              onBlur={() => handlePaymentBlur(PaymentFormField.CARD_NUMBER)}
              className={`input-field ${
                showPaymentValidationError(PaymentFormField.CARD_NUMBER)
                  ? "error"
                  : ""
              }`}
              maxLength={CARD_NUMBER_WITH_SPACES_LENGTH}
            />
            {showPaymentValidationError(PaymentFormField.CARD_NUMBER) && (
              <div className="form-error-message">
                {paymentValidationError.cardNumber}
              </div>
            )}
          </div>

          {/* Cardholder Name */}
          <div className="input-group padding-bottom">
            <label className="label bold">Name on card</label>
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Expiration Date */}
          <div className="add-edit-payment-form-row">
            <div className="input-group padding-bottom">
              <label className="label bold">Expiration date</label>
              <div className="expiration-inputs-container">
                <select
                  value={expirationMonth}
                  onChange={(e) => setExpirationMonth(e.target.value)}
                  className="input-field expiration-select"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={expirationYear}
                  onChange={(e) => setExpirationYear(e.target.value)}
                  className="input-field expiration-select"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Accepted Cards */}
        <div className="add-edit-payment-right-column">
          <p className="accepted-cards-text">
            Junes accepts all major credit and debit cards:
          </p>
          <div className="card-logos-container">
            <div className="card-logo-row">
              <img src={visaIcon} alt="Visa" className="card-logo" />
              <img
                src={masterCardIcon}
                alt="MasterCard"
                className="card-logo"
              />
              <img
                src={americanExpressIcon}
                alt="American Express"
                className="card-logo"
              />
            </div>

            <div className="card-logo-row">
              <img src={jcbIcon} alt="JCB" className="card-logo" />
              <img src={unionPayIcon} alt="UnionPay" className="card-logo" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="saved-info-overlay">
      <div className="saved-info-modal">
        {/* Header */}
        <div className="saved-info-header">
          <h2 className="saved-info-title">{getTitle()}</h2>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>

        {/* Delete Address */}
        {type === "address" && savedItemData && (
          <div className="address-content-wrapper">
            <AddressCardContent {...savedItemData} />
          </div>
        )}

        {/* Add Payment Method */}
        {type === "payment" && mode === "add" && (
          <div className="payment-content-wrapper">
            {renderAddOrEditPaymentMethodForm()}
          </div>
        )}

        <div className="btn-container">
          <button className="common-button no-btn" onClick={onClose}>
            {type === "address" && mode === "delete" ? "No" : "Cancel"}
          </button>
          <button className="common-button yes-button" onClick={handleAction}>
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedInfoActionWindow;
