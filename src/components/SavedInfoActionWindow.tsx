import React, { useState } from "react";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import {
  SavedInfoType,
  SavedInfoAction,
  SavedItemSelectorCaller,
} from "../utils/Enums.tsx";
import AddressCardContent from "../components/AddressCardContent";
import SavedItemSelector from "../components/SavedItemSelector";
import { formatCardNumber } from "../utils/utils";
import { getCardType } from "../utils/cardTypeUtils";
import { PaymentFormField } from "../utils/Enums";
import {
  CARD_NUMBER_WITH_SPACES_LENGTH,
  validatePaymentField,
  validateAllPaymentFields,
  PaymentValidationErrors,
} from "../utils/paymentValidation";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { mockAddressList } from "../mocks/data/address.ts";

import visaIcon from "../assets/acceptedCardsIcons/visaIcon.png";
import masterCardIcon from "../assets/acceptedCardsIcons/masterCardIcon.png";
import americanExpressIcon from "../assets/acceptedCardsIcons/americanExpressIcon.png";
import dinnersClubIcon from "../assets/acceptedCardsIcons/dinersClubIcon.png";
import discoverIcon from "../assets/acceptedCardsIcons/discoverIcon.png";
import jcbIcon from "../assets/acceptedCardsIcons/jcbIcon.png";
import unionPayIcon from "../assets/acceptedCardsIcons/unionPayIcon.png";

// Discriminated union type guard
type SavedInfoActionWindowProps =
  | {
      type: SavedInfoType.ADDRESS;
      mode: SavedInfoAction.DELETE;
      savedItemData: Address;
      onClose?: () => void;
      onConfirm?: () => void;
      errorMessage?: string;
      setErrorMessage?: (message: string) => void;
      isModalLoading?: boolean;
      setIsModalLoading?: (loading: boolean) => void;
    }
  | {
      type: SavedInfoType.PAYMENT;
      mode: SavedInfoAction.ADD;
      savedItemData?: undefined;
      onAdd?: () => void;
      onClose?: () => void;
      errorMessage?: string;
      setErrorMessage?: (message: string) => void;
      isModalLoading?: boolean;
      setIsModalLoading?: (loading: boolean) => void;
    }
  | {
      type: SavedInfoType.PAYMENT;
      mode: SavedInfoAction.EDIT;
      savedItemData: PaymentMethod;
      onEdit?: () => void;
      onClose?: () => void;
      onConfirm?: () => void;
      errorMessage?: string;
      setErrorMessage?: (message: string) => void;
      isModalLoading?: boolean;
      setIsModalLoading?: (loading: boolean) => void;
    }
  | {
      type: SavedInfoType.PAYMENT;
      mode: SavedInfoAction.DELETE;
      savedItemData: PaymentMethod;
      onClose?: () => void;
      onConfirm?: () => void;
      errorMessage?: string;
      setErrorMessage?: (message: string) => void;
      isModalLoading?: boolean;
      setIsModalLoading?: (loading: boolean) => void;
    };

const SavedInfoActionWindow: React.FC<SavedInfoActionWindowProps> = (props) => {
  const {
    type,
    mode,
    savedItemData,
    errorMessage,
    setErrorMessage,
    isModalLoading = false,
    setIsModalLoading,
    onClose = () => console.log("Close clicked"),
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<
    string | null
  >(
    type === SavedInfoType.PAYMENT && savedItemData
      ? savedItemData.billingAddressId
      : null,
  );

  // Form state for payment methods
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState(
    type === SavedInfoType.PAYMENT && savedItemData
      ? savedItemData.cardHolderName
      : "",
  );

  // Get current date for default expiration
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // 0-indexed
  const currentYear = String(currentDate.getFullYear());
  const [expirationMonth, setExpirationMonth] = useState(
    type === SavedInfoType.PAYMENT && savedItemData
      ? savedItemData.expirationMonth
      : currentMonth,
  );
  const [expirationYear, setExpirationYear] = useState(
    type === SavedInfoType.PAYMENT && savedItemData
      ? savedItemData.expirationYear
      : currentYear,
  );

  // Validation states
  const [paymentValidationError, setPaymentValidationError] =
    useState<PaymentValidationErrors>({});
  const [paymentTouched, setPaymentTouched] = useState<Set<string>>(new Set());

  // Functions for API calls
  const addPaymentMethod = async () => {
    console.log("Making API to add payment method...");

    const response = await apiClient.post(
      `${REQUEST_MAPPING}/saved-items/payment-method`,
      {
        cardType: getCardType(cardNumber),
        cardLastFour: cardNumber.replace(/\s/g, "").slice(-4), // Remove spaces, then take the last 4 characters
        cardHolderName,
        expirationMonth,
        expirationYear,
        billingAddressId: selectedBillingAddressId,
        isDefault: false,
      },
    );

    console.log("Payment method added successfully:", response.data);
  };

  // Handler for buttons
  const handleAction = async () => {
    setIsModalLoading?.(true);
    setErrorMessage?.("");

    try {
      if (type === SavedInfoType.PAYMENT && mode === SavedInfoAction.ADD) {
        // Add mode for payment
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
          ]),
        );

        if (!isPaymentValid) {
          console.log("Validation failed");
          return;
        }

        await addPaymentMethod();

        props.onAdd?.();
      } else if (
        type === SavedInfoType.PAYMENT &&
        mode === SavedInfoAction.EDIT
      ) {
        // Edit mode for payment
        const onEdit = props.onEdit || (() => console.log("Edit confirmed"));
        onEdit();
      } else {
        // Delete mode for address and payment
        const onConfirm =
          props.onConfirm || (() => console.log("Confirm clicked"));
        onConfirm();
      }
    } catch (error) {
      setErrorMessage?.(
        getApiErrorMessage(
          error,
          "Failed to process your request. Please try again.",
        ),
      );
      console.error("Error handling action:", error);
    } finally {
      setIsModalLoading?.(false);
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
        },
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
        },
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
      },
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
    if (type === SavedInfoType.PAYMENT && mode === SavedInfoAction.ADD)
      return "Add payment method";
    if (type === SavedInfoType.PAYMENT && mode === SavedInfoAction.EDIT)
      return "Edit payment method";
    if (type === SavedInfoType.PAYMENT && mode === SavedInfoAction.DELETE)
      return "Remove payment method";
    if (type === SavedInfoType.ADDRESS && mode === SavedInfoAction.DELETE)
      return "Confirm deletion";
    return "";
  };

  const getButtonText = () => {
    if (type === SavedInfoType.PAYMENT && mode === SavedInfoAction.ADD)
      return "Add Card";
    if (type === SavedInfoType.PAYMENT && mode === SavedInfoAction.DELETE)
      return "Remove";
    if (
      type === SavedInfoType.PAYMENT &&
      mode === SavedInfoAction.EDIT &&
      currentPage === 1
    )
      return "Save";
    if (
      type === SavedInfoType.PAYMENT &&
      mode === SavedInfoAction.EDIT &&
      currentPage === 2
    )
      return "Use This Address";
    if (type === SavedInfoType.ADDRESS && mode === SavedInfoAction.DELETE)
      return "Yes";
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const years = Array.from({ length: 10 }, (_, i) => String(2025 + i));

  // Common payment form fields component
  const renderPaymentFormFields = (includeCardNumber: boolean = true) => {
    return (
      <>
        {/* Card Number - only for ADD mode */}
        {includeCardNumber && (
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
        )}

        {/* Cardholder Name */}
        <div className="input-group padding-bottom">
          <label className="label bold">Name on card</label>
          <input
            type="text"
            value={cardHolderName}
            onChange={(e) =>
              handlePaymentFieldChange(
                PaymentFormField.CARD_HOLDER_NAME,
                e.target.value,
              )
            }
            onBlur={() => handlePaymentBlur(PaymentFormField.CARD_HOLDER_NAME)}
            className={`input-field ${
              showPaymentValidationError(PaymentFormField.CARD_HOLDER_NAME)
                ? "error"
                : ""
            }`}
          />
          {showPaymentValidationError(PaymentFormField.CARD_HOLDER_NAME) && (
            <div className="form-error-message">
              {paymentValidationError.cardHolderName}
            </div>
          )}
        </div>

        {/* Expiration Date */}
        <div className="add-edit-payment-form-row">
          <div className="input-group padding-bottom">
            <label className="label bold">Expiration date</label>
            <div className="expiration-inputs-container">
              <select
                value={expirationMonth}
                onChange={(e) =>
                  handlePaymentFieldChange(
                    PaymentFormField.EXPIRATION_MONTH,
                    e.target.value,
                  )
                }
                onBlur={() =>
                  handlePaymentBlur(PaymentFormField.EXPIRATION_MONTH)
                }
                className={`input-field expiration-select ${
                  showPaymentValidationError(PaymentFormField.EXPIRATION_MONTH)
                    ? "error"
                    : ""
                }`}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={expirationYear}
                onChange={(e) =>
                  handlePaymentFieldChange(
                    PaymentFormField.EXPIRATION_YEAR,
                    e.target.value,
                  )
                }
                onBlur={() =>
                  handlePaymentBlur(PaymentFormField.EXPIRATION_YEAR)
                }
                className={`input-field expiration-select ${
                  showPaymentValidationError(PaymentFormField.EXPIRATION_YEAR)
                    ? "error"
                    : ""
                }`}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {(showPaymentValidationError(PaymentFormField.EXPIRATION_MONTH) ||
              showPaymentValidationError(PaymentFormField.EXPIRATION_YEAR)) && (
              <div className="form-error-message">
                {paymentValidationError.expirationMonth ||
                  paymentValidationError.expirationYear}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Render functions for different modes
  const renderAddPaymentMethodForm = () => {
    const billingAddress =
      type === SavedInfoType.PAYMENT && savedItemData
        ? savedItemData.billingAddressId
        : null;

    return (
      <div className="add-edit-payment-form-container">
        {/* Left Column - Card Details */}
        <div className="add-edit-payment-left-column">
          {renderPaymentFormFields(true)}
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
              <img
                src={dinnersClubIcon}
                alt="Dinner's Club"
                className="card-logo"
              />
            </div>

            <div className="card-logo-row">
              <img src={discoverIcon} alt="Discover" className="card-logo" />
              <img src={jcbIcon} alt="JCB" className="card-logo" />
              <img src={unionPayIcon} alt="UnionPay" className="card-logo" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditPaymentMethodFormPage1 = () => {
    if (type !== SavedInfoType.PAYMENT || !savedItemData) return null;

    const payment = savedItemData as PaymentMethod;
    const billingAddress = mockAddressList.find(
      (addr) => addr.id === payment.billingAddressId,
    );

    return (
      <div className="add-edit-payment-form-container">
        {/* Left Column - Card Details without Card Number */}
        <div className="add-edit-payment-left-column">
          {renderPaymentFormFields(false)}
        </div>

        {/* Right Column - Billing Adress */}
        <div className="edit-payment-right-column">
          <label className="label bold">Billing address</label>
          {billingAddress ? (
            // CASE I: Payment method has a linked billing address
            <div className="saved-item-display">
              <p>{billingAddress.fullName}</p>
              <p>{billingAddress.addressLine}</p>
              {billingAddress.unitNumber && <p>{billingAddress.unitNumber}</p>}
              <p>{billingAddress.country}</p>
              <p>{billingAddress.zipCode}</p>
              <p>{billingAddress.phoneNumber}</p>

              <button
                className="action-link align-left"
                onClick={() => setCurrentPage(2)}
              >
                Change
              </button>
            </div>
          ) : (
            // CASE II: No linked billing address
            <div className="saved-item-display">
              <button
                className="action-link align-left"
                onClick={() => setCurrentPage(2)}
              >
                Choose a billing address
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEditPaymentMethodFormPage2 = () => {
    if (type !== SavedInfoType.PAYMENT) return null;

    const handleAddressSelect = (addressId: string) => {
      setSelectedBillingAddressId(addressId);
    };

    return (
      <SavedItemSelector
        mode={SavedInfoType.ADDRESS}
        caller={SavedItemSelectorCaller.SAVED_INFO}
        items={mockAddressList}
        initialSelectedId={selectedBillingAddressId}
        onItemSelect={handleAddressSelect}
        onConfirm={handleAction}
        showConfirmButton={true}
        className=""
        enableDisplayMode={false}
      />
    );
  };

  const renderRemovePaymentMethodText = () => {
    // Only render cardType when this component is handling a payment method
    if (type !== SavedInfoType.PAYMENT || !savedItemData) return null;

    const payment = savedItemData as PaymentMethod;

    return (
      <div className="delete-payment-form-container">
        <div className="payment-form-header">
          {payment.cardType} ending in {payment.cardLastFour}
        </div>
        <div className="delete-payment-form">
          If you do not want this payment method to be displayed in your list of
          payment options, <br />
          click "Remove".
          <br />
          (Disabling this payment method will neither cancel any of your open
          orders nor fail any <br />
          automatic payments set up that use this method.)
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
          <button
            className="close-btn"
            onClick={onClose}
            disabled={isModalLoading}
          >
            X
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Delete Address */}
        {type === SavedInfoType.ADDRESS && savedItemData && (
          <div className="address-content-wrapper">
            <AddressCardContent {...savedItemData} />
          </div>
        )}

        {/* Add Payment Method */}
        {type === SavedInfoType.PAYMENT && mode === SavedInfoAction.ADD && (
          <div className="payment-content-wrapper">
            {renderAddPaymentMethodForm()}
          </div>
        )}

        {/* Edit Payment Method */}
        {type === SavedInfoType.PAYMENT && mode === SavedInfoAction.EDIT && (
          <div className="payment-content-wrapper">
            {currentPage === 1
              ? renderEditPaymentMethodFormPage1()
              : renderEditPaymentMethodFormPage2()}
          </div>
        )}

        {/* Delete Payment Method */}
        {type === SavedInfoType.PAYMENT &&
          mode === SavedInfoAction.DELETE &&
          savedItemData && (
            <div className="payment-content-wrapper">
              {renderRemovePaymentMethodText()}
            </div>
          )}

        {/* Buttons - Only show for non-Edit Payment mode page 2 */}
        {!(
          type === SavedInfoType.PAYMENT &&
          mode === SavedInfoAction.EDIT &&
          currentPage === 2
        ) && (
          <div className="btn-container">
            <button
              className={`common-button no-button ${isModalLoading ? "loading" : ""}`}
              onClick={onClose}
              disabled={isModalLoading}
            >
              {type === SavedInfoType.ADDRESS && mode === SavedInfoAction.DELETE
                ? "No"
                : "Cancel"}
            </button>
            <button
              className={`common-button yes-button ${isModalLoading ? "loading" : ""}`}
              onClick={handleAction}
              disabled={isModalLoading}
            >
              {isModalLoading ? "Loading..." : getButtonText()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedInfoActionWindow;
