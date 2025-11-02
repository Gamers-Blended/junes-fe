import React, { useState, JSX } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { SavedInfoType, SavedInfoAction } from "../utils/Enums.tsx";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { useAuth } from "../components/AuthContext";
import AddressCardContent from "../components/AddressCardContent";
import PaymentMethodCardContent from "../components/PaymentMethodCardContent.tsx";
import SavedItemCardActionContent from "../components/SavedItemCardActionContent.tsx";
import SavedInfoActionWindow from "../components/SavedInfoActionWindow.tsx";
import AccountInfoChangedMessageBox from "../components/AccountInfoChangedMessageBox.tsx";
import Breadcrumb from "../components/Breadcrumb.tsx";
import Footer from "../components/Footer";

type SavedItem = Address | PaymentMethod;

const SavedInfoPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const location = useLocation();
  const { fieldToChange } = location.state || {};
  const navigate = useNavigate();
  const MAX_NUMBER_OF_ITEMS = 5;

  const isAddressMode = fieldToChange === SavedInfoType.ADDRESS;
  const isPaymentMode = fieldToChange === SavedInfoType.PAYMENT;

  // States for modal
  const [showActionWindow, setShowActionWindow] = useState(false);
  const [isAddPaymentMode, setIsAddPaymentMode] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    Address | PaymentMethod | null
  >(null);

  // State for success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Dummy data
  const [savedItems, setSavedItems] = useState<SavedItem[]>(
    isAddressMode
      ? [
          {
            id: "1",
            type: SavedInfoType.ADDRESS,
            fullName: "Name1",
            addressLine: "Address Line 11",
            unitNumber: "Address Line 21",
            country: "Singapore",
            zipCode: "Zip Code1",
            phoneNumber: "Phone Number1",
            isDefault: true,
          },
          {
            id: "2",
            type: SavedInfoType.ADDRESS,
            fullName: "Name2",
            addressLine: "Address Line 12",
            unitNumber: "Address Line 22",
            country: "United States",
            zipCode: "Zip Code2",
            phoneNumber: "Phone Number2",
            isDefault: false,
          },
          {
            id: "3",
            type: SavedInfoType.ADDRESS,
            fullName: "Name",
            addressLine: "Address Line 1",
            unitNumber: "Address Line 2",
            country: "Japan",
            zipCode: "Zip Code",
            phoneNumber: "Phone Number",
            isDefault: false,
          },
          {
            id: "4",
            type: SavedInfoType.ADDRESS,
            fullName: "Name",
            addressLine: "Address Line 1",
            unitNumber: "Address Line 2",
            country: "India",
            zipCode: "Zip Code",
            phoneNumber: "Phone Number",
            isDefault: false,
          },
          {
            id: "5",
            type: SavedInfoType.ADDRESS,
            fullName: "Name",
            addressLine: "Address Line 1",
            unitNumber: "Address Line 2",
            country: "China",
            zipCode: "Zip Code",
            phoneNumber: "Phone Number",
            isDefault: false,
          },
        ]
      : [
          {
            id: "1",
            type: SavedInfoType.PAYMENT,
            cardType: "Visa",
            cardLastFour: "1111",
            cardHolderName: "test card",
            expirationMonth: "08",
            expirationYear: "2028",
            billingAddressId: "123",
            isDefault: true,
          },
          {
            id: "2",
            type: SavedInfoType.PAYMENT,
            cardType: "Visa",
            cardLastFour: "1234",
            cardHolderName: "test card",
            expirationMonth: "08",
            expirationYear: "2028",
            billingAddressId: "123",
            isDefault: false,
          },
          {
            id: "3",
            type: SavedInfoType.PAYMENT,
            cardType: "MasterCard",
            cardLastFour: "3333",
            cardHolderName: "test card",
            expirationMonth: "08",
            expirationYear: "2028",
            billingAddressId: "123",
            isDefault: false,
          },
        ]
  );

  useAuthRedirect(isLoggedIn);

  const canAddMoreItems = savedItems.length < MAX_NUMBER_OF_ITEMS;

  const renderHeader = (): JSX.Element => {
    switch (fieldToChange) {
      case SavedInfoType.ADDRESS:
        return <h1>MY ADDRESSES</h1>;
      case SavedInfoType.PAYMENT:
        return <h1>MY PAYMENTS</h1>;
      default:
        return <h1>SAVED INFO</h1>;
    }
  };

  const handleAddItem = () => {
    console.log(`Add new ${isAddressMode ? SavedInfoType.ADDRESS : SavedInfoType.PAYMENT}`);
    if (isAddressMode) {
      const state: NavigationState = {
        from: "savedinfo",
        fieldToChange: SavedInfoType.ADDRESS,
        action: SavedInfoAction.ADD,
      };
      navigate("/modifyaddress/", { state });
    } else if (isPaymentMode) {
      console.log("Open add payment method window");
      setIsAddPaymentMode(true);
      setShowActionWindow(true);
    }
  };

  const handleEdit = (itemToEdit: SavedItem) => {
    console.log(`Edit item: ${itemToEdit.type} with id: ${itemToEdit.id}`);
    if (isAddressMode) {
      const state: NavigationState = {
        from: "savedinfo",
        fieldToChange: SavedInfoType.ADDRESS,
        action: SavedInfoAction.EDIT,
        item: itemToEdit,
      };
      navigate("/modifyaddress/", { state });
    } else if (isPaymentMode) {
      console.log("Open edit payment method window");
    }
  };

  const handleRemove = (id: string) => {
    console.log(`Remove item with id: ${id}`);
    const item = savedItems.find((item) => item.id === id);
    if (item) {
      setItemToDelete(item);
      setIsAddPaymentMode(false);
      setShowActionWindow(true);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setSavedItems(savedItems.filter((item) => item.id !== itemToDelete.id));
      setShowActionWindow(false);
      setItemToDelete(null);
      setShowSuccessMessage(true);
      console.log(`Deleted item with id: ${itemToDelete.id}`);
    }
  };

  const handleAddPaymentMethod = () => {
    console.log("added!");
  };

  const handleCloseActionWindow = () => {
    setShowActionWindow(false);
    setItemToDelete(null);
    setIsAddPaymentMode(false);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleSetDefault = (id: string) => {
    console.log(`Set default for item with id: ${id}`);
  };

  const breadcrumbItems = [
    {
      label: "My Account",
      path: "/myaccount/",
    },
  ];

  const renderAddressCard = (address: Address) => (
    <div key={address.id} className="saved-item-card">
      {address.isDefault && <div className="default-badge">Default</div>}

      <AddressCardContent {...address} />
      <SavedItemCardActionContent
        item={address}
        onEdit={() => handleEdit(address)}
        onRemove={() => handleRemove(address.id)}
        onSetDefault={() => handleSetDefault(address.id)}
      />
    </div>
  );

  const renderPaymentMethodCard = (paymentMethod: PaymentMethod) => (
    <div key={paymentMethod.id} className="saved-item-card">
      {paymentMethod.isDefault && <div className="default-badge">Default</div>}

      <PaymentMethodCardContent {...paymentMethod} />
      <SavedItemCardActionContent
        item={paymentMethod}
        onEdit={() => handleEdit(paymentMethod)}
        onRemove={() => handleRemove(paymentMethod.id)}
        onSetDefault={() => handleSetDefault(paymentMethod.id)}
      />
    </div>
  );

  return (
    <div className="saved-info-page-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="saved-info-content">
        <div className="common-header">{renderHeader()}</div>

        {/* Success Message */}
        {showSuccessMessage && (
          <AccountInfoChangedMessageBox
            message="Address deleted"
            onClose={handleCloseSuccessMessage}
          />
        )}

        <div className="items-grid">
          {/* Add Item Box - always displayed first */}

          <div
            className={`add-item-card ${!canAddMoreItems ? "disabled" : ""}`}
            onClick={canAddMoreItems ? handleAddItem : undefined}
            title={
              !canAddMoreItems
                ? "Up to 5 items can be saved at any one time."
                : ""
            }
          >
            <div className="add-icon">+</div>
            <div className="add-text">
              Add {isAddressMode ? SavedInfoType.ADDRESS : "payment method"}
            </div>
          </div>

          {/* Saved Items */}
          {savedItems.map((item) =>
            item.type === SavedInfoType.ADDRESS
              ? renderAddressCard(item as Address)
              : renderPaymentMethodCard(item as PaymentMethod)
          )}
        </div>
      </div>

      <Footer />

      {/* Action Window Modal */}
      {/* Address - Delete */}
      {showActionWindow && itemToDelete && itemToDelete.type === SavedInfoType.ADDRESS && (
        <SavedInfoActionWindow
          type={SavedInfoType.ADDRESS}
          mode={SavedInfoAction.DELETE}
          savedItemData={itemToDelete as Address}
          onClose={handleCloseActionWindow}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Payment - Add */}
      {showActionWindow && isAddPaymentMode && (
        <SavedInfoActionWindow
          type={SavedInfoType.PAYMENT}
          mode={SavedInfoAction.ADD}
          onAdd={handleAddPaymentMethod}
          onClose={handleCloseActionWindow}
        />
      )}

      {/* Payment - Delete */}
      {showActionWindow && itemToDelete && itemToDelete.type === SavedInfoType.PAYMENT && (
        <SavedInfoActionWindow
          type={SavedInfoType.PAYMENT}
          mode={SavedInfoAction.DELETE}
          savedItemData={itemToDelete as PaymentMethod}
          onClose={handleCloseActionWindow}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default SavedInfoPage;
