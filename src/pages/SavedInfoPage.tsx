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
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SavedInfoPage;
