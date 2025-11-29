import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import {
  SavedInfoType,
  SavedInfoAction,
  SavedItemSelectorCaller,
} from "../utils/Enums.tsx";

interface SavedItemSelectorProps {
  mode: SavedInfoType.ADDRESS | SavedInfoType.PAYMENT;
  caller: string;
  items: Address[] | PaymentMethod[];
  initialSelectedId?: string | null;
  onItemSelect: (itemId: string) => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  className?: string;
}

const SavedItemSelector: React.FC<SavedItemSelectorProps> = ({
  mode,
  caller,
  items,
  initialSelectedId = null,
  onItemSelect,
  onConfirm,
  showConfirmButton = true,
  className = "",
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialSelectedId
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const isAddressMode = mode === SavedInfoType.ADDRESS;
  const label = isAddressMode
    ? caller === SavedItemSelectorCaller.CHECKOUT
      ? "Address"
      : "Select a billing address"
    : "Select a payment method";
  const emptyMessage = isAddressMode
    ? "No address found"
    : "No payment method found";
  const addButtonText = isAddressMode
    ? "Add An Address"
    : "Add A Payment Method";
  const confirmButtonText = isAddressMode
    ? "Use This Address"
    : "Use This Payment";
  const radioName = isAddressMode ? "address" : "payment";
  const selectedItem = items.find((item) => item.id === selectedItemId);

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedItemId(initialSelectedId);
  }, [initialSelectedId]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId); // Update internal state
    onItemSelect(itemId); // Notify parent
  };

  const handleAddAddress = () => {
    const state: NavigationState = {
      from: "checkout",
      fieldToChange: SavedInfoType.ADDRESS,
      action: SavedInfoAction.ADD,
    };
    navigate("/modifyaddress/", { state });
  };

  const handleConfirm = () => {
    setIsEditMode(false);
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleChangeClick = () => {
    setIsEditMode(true);
  };

  const renderItemDetails = (item: Address | PaymentMethod) => {
    if (isAddressMode) {
      const address = item as Address;
      return (
        <div className="address-details">
          {!isEditMode && <strong>Delivering to </strong>}
          <strong>{address.fullName}</strong> <br />
          {address.addressLine}, {address.country}, {address.zipCode},{" "}
          {address.phoneNumber}
        </div>
      );
    }
  };

  // DISPLAY MODE: Display only selected item
  if (!isEditMode && selectedItem) {
    return (
      <div className={`select-billing-address-container ${className}`}>
        <div className="billing-address-display">
          {renderItemDetails(selectedItem)}
          <button
            className="action-link align-left"
            onClick={handleChangeClick}
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // EDIT MODE: Display full list
  return (
    <div className={`select-billing-address-container ${className}`}>
      <label className="label bold padding-bottom">{label}</label>
      <div className="billing-address-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className={`billing-address-item ${
                selectedItemId === item.id ? "selected" : ""
              }`}
              onClick={() => handleItemSelect(item.id)}
            >
              <input
                type="radio"
                name={radioName}
                checked={selectedItemId === item.id}
                onChange={() => {}}
                className="address-radio"
              />
              {renderItemDetails(item)}
            </div>
          ))
        ) : (
          <div className="billing-address-display">
            <p>{emptyMessage}</p>
            <button
              className="action-link align-left"
              onClick={isAddressMode ? handleAddAddress : () => {}}
            >
              {addButtonText}
            </button>
          </div>
        )}
      </div>
      {/* Buttons when items exist */}
      {items.length > 0 && (
        <div className="btn-container">
          <button
            className="common-button no-btn larger-width"
            onClick={isAddressMode ? handleAddAddress : () => {}}
          >
            {addButtonText}
          </button>
          {showConfirmButton && (
            <button
              className="common-button yes-button larger-width"
              onClick={handleConfirm}
            >
              {confirmButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedItemSelector;
