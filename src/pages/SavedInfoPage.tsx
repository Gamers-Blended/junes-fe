import { useState } from "react";
import { useLocation } from "react-router-dom";
import { JSX } from "react";
import Breadcrumb from "../components/Breadcrumb.tsx";
import Footer from "../components/Footer";

interface Address {
  id: string;
  type: "address";
  name: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

type SavedItem = Address;

const SavedInfoPage: React.FC = () => {
  const location = useLocation();
  const { fieldToChange } = location.state || {};
  const MAX_NUMBER_OF_ITEMS = 5;

  const isAddressMode = fieldToChange === "address";

  // Dummy data
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: "1",
      type: "address",
      name: "Name",
      addressLine1: "Address Line 1",
      addressLine2: "Address Line 2",
      country: "Country",
      zipCode: "Zip Code",
      phoneNumber: "Phone Number",
      isDefault: true,
    },
    {
      id: "2",
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
  };

  const handleSetDefault = (id: string) => {
    console.log(`Set default for item with id: ${id}`);
  };

  const handleAddItem = () => {
    console.log("Add new item");
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

      <div className="card-content">
        <div className="item-name">{address.name}</div>
        <div className="item-details">
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.country}</p>
          <p>{address.zipCode}</p>
          <p>{address.phoneNumber}</p>
        </div>
      </div>

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
        {renderHeader()}

        <div className="items-grid">
          {/* Add Item Box - always displayed first if can add more */}
          {canAddMoreItems && (
            <div className="add-item-card" onClick={handleAddItem}>
              <div className="add-icon">+</div>
              <div className="add-text">
                Add {isAddressMode ? "address" : ""}
              </div>
            </div>
          )}

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
    </div>
  );
};

export default SavedInfoPage;
