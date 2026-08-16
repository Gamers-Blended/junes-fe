import React, { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import {
  SavedInfoType,
  SavedInfoAction,
  SavedItemSelectorCaller,
  PaymentFormField,
} from "../utils/Enums.tsx";
import AddressCardContent from "../components/AddressCardContent";
import SavedItemSelector from "../components/SavedItemSelector";
import {
  validatePaymentField,
  PaymentValidationErrors,
} from "../utils/paymentValidation";
import {
  getCachedSavedAddresses,
  setCachedSavedAddresses,
} from "../utils/cacheUtils.ts";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { mockAddressList } from "../mocks/data/address.ts";

import visaIcon from "../assets/acceptedCardsIcons/visaIcon.png";
import masterCardIcon from "../assets/acceptedCardsIcons/masterCardIcon.png";
import americanExpressIcon from "../assets/acceptedCardsIcons/americanExpressIcon.png";
import jcbIcon from "../assets/acceptedCardsIcons/jcbIcon.png";
import unionPayIcon from "../assets/acceptedCardsIcons/unionPayIcon.png";

function generateIdempotencyKey(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}-${Date.now()}`;
}

// Loaded once at module scope - recreating this pre-render would tear down and remount Stripe.js on every re-render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
      offlineMode?: boolean;
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
      offlineMode?: boolean;
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
      offlineMode?: boolean;
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
      offlineMode?: boolean;
    };

type AddressDTO = Omit<Address, "id" | "type"> & {
  addressID: string;
};

const SavedInfoActionWindowInner: React.FC<SavedInfoActionWindowProps> = (
  props,
) => {
  const {
    type,
    mode,
    savedItemData,
    errorMessage,
    setErrorMessage,
    isModalLoading = false,
    setIsModalLoading,
    onClose = () => console.log("Close clicked"),
    offlineMode = false,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [billingAddressList, setBillingAddressList] = useState<Address[]>([]);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<
    string | null
  >(
    type === SavedInfoType.PAYMENT && savedItemData
      ? savedItemData.billingAddressID
      : null,
  );

  // Form state for payment methods
  const [cardHolderName, setCardHolderName] = useState(
    type === SavedInfoType.PAYMENT && savedItemData
      ? savedItemData.cardHolderName
      : "",
  );
  const [isDefault, setIsDefault] = useState(false);

  // Idempotency key for ADD flow
  // Generated once per attempt
  const idempotencyKeyRef = useRef<string | undefined>(undefined);
  if (!idempotencyKeyRef.current) {
    idempotencyKeyRef.current = generateIdempotencyKey();
  }
  const resetIdempotencyKey = () => {
    idempotencyKeyRef.current = generateIdempotencyKey();
  };

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

  // Stripe
  const stripe = useStripe();
  const elements = useElements();

  // Functions for API calls
  useEffect(() => {
    // Trigger only in PAYMENT EDIT mode and on the first page
    if (
      type === SavedInfoType.PAYMENT &&
      mode === SavedInfoAction.EDIT &&
      currentPage === 1
    ) {
      fetchSavedAddresses();
    }
  }, [type, mode, currentPage]);

  const fetchSavedAddresses = async () => {
    setIsModalLoading?.(true);
    setErrorMessage?.("");

    try {
      const response = await getSavedAddresses();
      setBillingAddressList(response);
    } catch (error) {
      setErrorMessage?.(
        getApiErrorMessage(
          error,
          "Failed to fetch saved billing addresses. Please try again.",
        ),
      );
      console.error("Error fetching saved billing addresses:", error);
    } finally {
      setIsModalLoading?.(false);
    }
  };

  const getSavedAddresses = async (): Promise<Address[]> => {
    if (offlineMode) {
      console.log("Offline mode: Skipping get Saved Items API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockAddressList;
    }

    const cacheKey = "savedAddresses";

    const cachedData = getCachedSavedAddresses(cacheKey);
    if (cachedData) {
      console.log("Using cached saved addresses for key:", cacheKey);
      return cachedData.data;
    }

    console.log("Fetching saved items from API...");

    // API returns AddressDTO[], transform to Address[]
    const response = await apiClient.get<AddressDTO[]>(
      `${REQUEST_MAPPING}/saved-items/addresses/user`,
    );

    const addressList: Address[] = response.data.map((item) => ({
      ...item,
      id: item.addressID,
      type: SavedInfoType.ADDRESS,
    }));

    setCachedSavedAddresses(cacheKey, addressList);
    console.log("Saved addresses cached with key:", cacheKey);

    return addressList;
  };

  const attachAddressToPaymentMethod = async () => {
    if (offlineMode) {
      console.log(
        "Offline mode: Skipping attach address to payment method API call",
      );
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }
    console.log("Making API call to attach address to payment method...");

    await apiClient.post(`${REQUEST_MAPPING}/saved-items/attach`, {
      addressID: selectedBillingAddressId,
      paymentMethodID: savedItemData?.id,
    });

    console.log("Address attached to payment method successfully");
  };

  // Handler for buttons
  const handleAction = async () => {
    setIsModalLoading?.(true);
    setErrorMessage?.("");

    try {
      if (type === SavedInfoType.PAYMENT && mode === SavedInfoAction.ADD) {
        // Add mode for payment
        // Card number/expiration/CVC live inside Stripe's PaymentElement - validated by Stripe on confirmSetup
        // Validate only cardHolderName
        const cardHolderNameError = validatePaymentField(
          PaymentFormField.CARD_HOLDER_NAME,
          cardHolderName,
          {
            cardNumber: "",
            cardHolderName,
            expirationMonth: "",
            expirationYear: "",
          },
        );

        setPaymentValidationError({ cardHolderName: cardHolderNameError });
        setPaymentTouched(new Set([PaymentFormField.CARD_HOLDER_NAME]));

        if (cardHolderNameError) {
          console.log("Validation failed");
          return;
        }

        await handleAddPaymentMethod();

        props.onAdd?.();
      } else if (
        type === SavedInfoType.PAYMENT &&
        mode === SavedInfoAction.EDIT
      ) {
        // Edit mode for payment
        if (currentPage == 2) {
          // Page 2: attach selected billing address to payment method
          await attachAddressToPaymentMethod();
        } else {
          // Page 1: edit card details
          await handleUpdatePaymentMethod();
        }

        props.onEdit?.();
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
          cardNumber: "",
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
        cardNumber: "",
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

  // EDIT-mode fields only
  const renderEditableCardFields = () => {
    return (
      <>
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
    return (
      <div className="add-edit-payment-form-container">
        {/* Left Column - Card Details */}
        <div className="add-edit-payment-left-column">
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
              onBlur={() =>
                handlePaymentBlur(PaymentFormField.CARD_HOLDER_NAME)
              }
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

          {/* Card number / expiration / CVC - rendered and validated by Stripe inside iframe */}
          <div className="input-group padding-bottom">
            <label className="label bold">Card details</label>
            <div className="input-field stripe-element-wrapper">
              <PaymentElement
                options={{
                  fields: { billingDetails: { name: "never" } },
                }}
              />
            </div>
            {!stripe && (
              <div className="form-error-message">
                Loading secure payment form...
              </div>
            )}
          </div>

          {/* Set as Default */}
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="defaultPaymentMethod"
                className={"checkbox-item"}
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <label
                className={"filter-label"}
                onClick={() => setIsDefault(!isDefault)}
              >
                Make this my default payment method
              </label>
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

  const renderEditPaymentMethodFormPage1 = () => {
    if (type !== SavedInfoType.PAYMENT || !savedItemData) return null;

    const payment = savedItemData as PaymentMethod;
    const billingAddress = billingAddressList.find(
      (addr) => addr.id === payment.billingAddressID,
    );

    return (
      <div className="add-edit-payment-form-container">
        {/* Left Column - Card Details without Card Number */}
        <div className="add-edit-payment-left-column">
          {renderEditableCardFields()}
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
        items={billingAddressList}
        initialSelectedId={selectedBillingAddressId}
        onItemSelect={handleAddressSelect}
        onConfirm={handleAction}
        showConfirmButton={true}
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

  // Functions for Stripe integration
  const handleAddPaymentMethod = async () => {
    if (offlineMode) {
      console.log("Offline mode: Skipping add payment method API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    if (!stripe || !elements) {
      setErrorMessage?.(
        "Payment form is still loading. Please wait a moment and try again.",
      );
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    // Deferred-Elements
    // Validate & collect entered card details BEFORE SetupIntent exists server-side
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage?.(
        getApiErrorMessage(
          submitError,
          "Please check your card details and try again.",
        ),
      );
      console.error("Error submitting payment element:", submitError);
      throw submitError;
    }

    // Call 1: Create SetupIntent on server, get client_secret
    const { data } = await apiClient.post(
      `${REQUEST_MAPPING}/saved-items/payment-method/setup-intent`,
      {},
      {
        headers: {
          "Idempotency-Key": `${idempotencyKeyRef.current}-setup-intent`,
        },
      },
    );
    const { clientSecret } = data;

    // Call 2: Confirm SetupIntent with Stripe using client_secret and card details
    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: { name: cardHolderName },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage?.(
        getApiErrorMessage(
          error,
          "Failed to process your request. Please try again.",
        ),
      );
      console.error("Error confirming setup intent:", error);
      throw error;
    }

    // Call 3: Persist SetupIntent's PaymentMethod ID in own database
    await apiClient.post(
      `${REQUEST_MAPPING}/saved-items/payment-method`,
      {
        stripePaymentMethodID: setupIntent.payment_method,
        isDefault: isDefault,
      },
      {
        headers: {
          "Idempotency-Key": idempotencyKeyRef.current,
        },
      },
    );

    resetIdempotencyKey();
  };

  const handleUpdatePaymentMethod = async () => {
    if (offlineMode) {
      console.log("Offline mode: Skipping update payment method API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    if (!stripe || !elements) {
      setErrorMessage?.(
        "Payment form is still loading. Please wait a moment and try again.",
      );
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    console.log("Calling API to edit payment method...");

    const response = await apiClient.put(
      `${REQUEST_MAPPING}/saved-items/payment-method/${savedItemData?.id}`,
      {
        cardHolderName: cardHolderName,
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        billingAddressId: selectedBillingAddressId,
      },
      {
        headers: {
          "Idempotency-Key": idempotencyKeyRef.current,
        },
      },
    );

    console.log("Payment method edited successfully:", response.data);
    resetIdempotencyKey();
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

// Deferred initialization
// (mode: "setup", no clientSecret)
// SetupIntent is created on submit
// In handleAddPaymentMethod - PaymentElement can still render immediately in ADD mode
const SavedInfoActionWindow: React.FC<SavedInfoActionWindowProps> = (props) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "setup",
        currency: "sgd",
        payment_method_types: ["card"],
      }}
    >
      <SavedInfoActionWindowInner {...props} />
    </Elements>
  );
};

export default SavedInfoActionWindow;
