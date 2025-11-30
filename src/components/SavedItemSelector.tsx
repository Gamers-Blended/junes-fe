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
  enableDisplayMode?: boolean;
}

type SavedItem = Address | PaymentMethod;

const SavedItemSelector: React.FC<SavedItemSelectorProps> = ({
  mode,
  caller,
  items,
  initialSelectedId = null,
  onItemSelect,
  onConfirm,
  showConfirmButton = true,
  className = "",
  enableDisplayMode = true,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialSelectedId
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(!enableDisplayMode); // Start in edit mode
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const isAddressMode = mode === SavedInfoType.ADDRESS;
  const label = isAddressMode
    ? caller === SavedItemSelectorCaller.CHECKOUT
      ? "Address"
      : "Select a billing address"
    : "Payment method";
  const emptyMessage = isAddressMode
    ? "No address found"
    : "No payment method found";
  const addButtonText = isAddressMode
    ? "Add An Address"
    : "Add A Payment Method";
  const confirmButtonText = isAddressMode
    ? "Use This Address"
    : "Use This Payment Method";
  const radioName = isAddressMode ? "address" : "payment";
  const selectedItem = items.find((item) => item.id === selectedItemId);
  const MAX_NUMBER_OF_ITEMS = 5;
  const canAddMoreItems = items.length < MAX_NUMBER_OF_ITEMS;

  // For adding & editing address + adding payment method
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

  const handleAddPaymentMethod = () => {
    const state: NavigationState = {
      from: "checkout",
      fieldToChange: SavedInfoType.PAYMENT,
    };
    navigate("/savedinfo/", { state });
  };

  const handleEditAddress = (itemToEdit: SavedItem) => {
    console.log(`Edit item: ${itemToEdit.type} with id: ${itemToEdit.id}`);
    if (isAddressMode) {
      const state: NavigationState = {
        from: "checkout",
        fieldToChange: SavedInfoType.ADDRESS,
        action: SavedInfoAction.EDIT,
        item: itemToEdit,
      };
      navigate("/modifyaddress/", { state });
    }
  };

  const handleConfirm = () => {
    setLoadingMessage(
      `Setting your ${
        caller === SavedItemSelectorCaller.SAVED_INFO
          ? "billing address"
          : isAddressMode
          ? "address"
          : "payment method"
      }...`
    );
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsEditMode(false);
      setIsLoading(false);
      if (onConfirm) {
        onConfirm();
      }
    }, 2000); // 2 seconds delay
  };

  const handleChangeClick = () => {
    setLoadingMessage(
      `Loading your ${isAddressMode ? "address" : "payment"} information...`
    );
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsEditMode(true);
      setIsLoading(false);
    }, 2000); // 2 seconds delay
  };

  const renderItemDetails = (item: Address | PaymentMethod) => {
    if (isAddressMode) {
      // Address mode
      const address = item as Address;
      return (
        <div className="item-details">
          {enableDisplayMode && !isEditMode && <strong>Delivering to </strong>}
          <strong>{address.fullName}</strong>
          <div className="item-more-details">
            {address.addressLine}, {address.country}, {address.zipCode},{" "}
            {address.phoneNumber}
          </div>

          {/* Edit button only available for address */}
          {isAddressMode && isEditMode && (
            <button
              className="action-link align-left"
              onClick={() => handleEditAddress(item)}
            >
              Edit address
            </button>
          )}
        </div>
      );
    } else {
      // Payment mode
      const payment = item as PaymentMethod;
      return (
        <div className="item-details">
          {enableDisplayMode && !isEditMode ? (
            <div>
              <strong>Paying with </strong>{" "}
              <strong>
                {payment.cardType} {payment.cardLastFour}
              </strong>
            </div>
          ) : (
            <div>
              <strong>{payment.cardType}</strong> ending in{" "}
              {payment.cardLastFour}
              <div className="item-more-details">
                {payment.cardHolderName}, {payment.expirationMonth}/
                {payment.expirationYear}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // LOADING STATE: Display loading messages
  if (isLoading) {
    return (
      <div className={`saved-item-selector-container ${className}`}>
        <div className="loading-container">
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // DISPLAY MODE: Display only selected item
  if (enableDisplayMode && !isEditMode && selectedItem) {
    return (
      <div className={`saved-item-selector-container ${className}`}>
        <div className="saved-item-display">
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
    <div className={`saved-item-selector-container ${className}`}>
      <label className="label bold padding-bottom">{label}</label>
      <div className="saved-item-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className={`saved-item ${
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
          <div className="saved-item-display">
            <p>{emptyMessage}</p>
            <button
              className="action-link align-left"
              onClick={
                isAddressMode ? handleAddAddress : handleAddPaymentMethod
              }
            >
              {addButtonText}
            </button>
          </div>
        )}
      </div>

      {!canAddMoreItems && (
        <div className="checkout-error-message">
          You have reached the maximum number of saved{" "}
          {isAddressMode ? "addresses" : "payment methods"}
        </div>
      )}
      {/* Buttons when items exist */}
      {items.length > 0 && (
        <div className="btn-container">
          <button
            className={`common-button no-btn ${
              isAddressMode ? "larger-width" : "payment-method-width"
            } ${!canAddMoreItems ? "disabled" : ""}`}
            onClick={
              isAddressMode && canAddMoreItems
                ? handleAddAddress
                : canAddMoreItems
                ? handleAddPaymentMethod
                : () => {}
            }
          >
            {addButtonText}
          </button>
          {showConfirmButton && (
            <button
              className={`common-button yes-button ${
                isAddressMode ? "larger-width" : "payment-method-width"
              }`}
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
