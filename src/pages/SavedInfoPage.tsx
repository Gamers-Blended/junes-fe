import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { JSX } from "react";
import { Address } from "../types/address";
import AddressCardContent from "../components/AddressCardContent";
import SavedInfoActionWindow from "../components/SavedInfoActionWindow.tsx";
import Breadcrumb from "../components/Breadcrumb.tsx";
import Footer from "../components/Footer";

type SavedItem = Address;

const SavedInfoPage: React.FC = () => {
  const location = useLocation();
  const { fieldToChange } = location.state || {};
  const navigate = useNavigate();
  const MAX_NUMBER_OF_ITEMS = 5;

  const isAddressMode = fieldToChange === "address";

  // States for modal
  const [showActionWindow, setShowActionWindow] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Address | null>(null);

  // Dummy data
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: "1",
      type: "address",
      name: "Name1",
      addressLine1: "Address Line 11",
      addressLine2: "Address Line 21",
      country: "Country1",
      zipCode: "Zip Code1",
      phoneNumber: "Phone Number1",
      isDefault: true,
    },
    {
      id: "2",
      type: "address",
      name: "Name2",
      addressLine1: "Address Line 12",
      addressLine2: "Address Line 22",
      country: "Country2",
      zipCode: "Zip Code2",
      phoneNumber: "Phone Number2",
      isDefault: false,
    },
    {
      id: "3",
      type: "address",
      name: "Name",
      addressLine1: "Address Line 1",
      addressLine2: "Address Line 2",
      country: "Country",
      zipCode: "Zip Code",
      phoneNumber: "Phone Number",
      isDefault: false,
    },
    {
      id: "4",
      type: "address",
      name: "Name",
      addressLine1: "Address Line 1",
      addressLine2: "Address Line 2",
      country: "Country",
      zipCode: "Zip Code",
      phoneNumber: "Phone Number",
      isDefault: false,
    },
    {
      id: "5",
      type: "address",
      name: "Name",
      addressLine1: "Address Line 1",
      addressLine2: "Address Line 2",
      country: "Country",
      zipCode: "Zip Code",
      phoneNumber: "Phone Number",
      isDefault: false,
    },
  ]);

  const canAddMoreItems = savedItems.length < MAX_NUMBER_OF_ITEMS;

  const renderHeader = (): JSX.Element => {
    switch (fieldToChange) {
      case "address":
        return <h1>MY ADDRESSES</h1>;
      case "payment":
        return <h1>MY PAYMENTS</h1>;
      default:
        return <h1>SAVED INFO</h1>;
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Edit item with id: ${id}`);
  };

  const handleRemove = (id: string) => {
    console.log(`Remove item with id: ${id}`);
    const item = savedItems.find((item) => item.id === id);
    if (item) {
      setItemToDelete(item);
      setShowActionWindow(true);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setSavedItems(savedItems.filter((item) => item.id !== itemToDelete.id));
      setShowActionWindow(false);
      setItemToDelete(null);
      console.log(`Deleted item with id: ${itemToDelete.id}`);
    }
  };

  const handleCloseActionWindow = () => {
    setShowActionWindow(false);
    setItemToDelete(null);
  };

  const handleSetDefault = (id: string) => {
    console.log(`Set default for item with id: ${id}`);
  };

  const handleAddItem = () => {
    console.log("Adding a new item");
    const state: NavigationState = {
      from: "savedinfo",
      fieldToChange: "address",
      action: "add",
    };
    navigate("/modifyaddress/", { state });
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

      <div className="card-actions">
        <button className="action-link" onClick={() => handleEdit(address.id)}>
          Edit
        </button>
        <span className="action-separator">|</span>
        <button
          className="action-link"
          onClick={() => handleRemove(address.id)}
        >
          Remove
        </button>
        {!address.isDefault && (
          <>
            <span className="action-separator">|</span>
            <button
              className="action-link"
              onClick={() => handleSetDefault(address.id)}
            >
              Set as Default
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="saved-info-page-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="saved-info-content">
        <div className="common-header">{renderHeader()}</div>

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
            <div className="add-text">Add {isAddressMode ? "address" : ""}</div>
          </div>

          {/* Saved Items */}
          {savedItems.map((item) =>
            item.type === "address" ? (
              renderAddressCard(item as Address)
            ) : (
              <div></div>
            )
          )}
        </div>
      </div>

      <Footer />

      {/* Action Window Modal */}
      {showActionWindow && itemToDelete && (
        <SavedInfoActionWindow
          type={itemToDelete.type}
          mode="delete"
          addressData={itemToDelete}
          onClose={handleCloseActionWindow}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default SavedInfoPage;
