import React, { useState } from "react";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import AddressCardContent from "../components/AddressCardContent";

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

  const isAddress = (item: Address | PaymentMethod): item is Address => {
    return type === "address";
  };

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

  return (
    <div className="saved-info-overlay">
      <div className="saved-info-modal">
        <div className="saved-info-header">
          <h2 className="saved-info-title">
            {getTitle()}
          </h2>
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
