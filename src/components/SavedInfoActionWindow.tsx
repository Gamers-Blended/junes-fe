import React, { useState } from "react";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import AddressCardContent from "../components/AddressCardContent";
import { formatCardNumber } from "../utils/utils";
import { CARD_NUMBER_LENGTH } from "../utils/inputValidationUtils";

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

  const handleAction = () => {
    if (type === "payment" && mode === "add") {
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
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
              className="input-field"
              maxLength={CARD_NUMBER_LENGTH + 3} // +3 for spaces
            />
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
            <p>Junes accepts all major credit and debit cards:</p>
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
