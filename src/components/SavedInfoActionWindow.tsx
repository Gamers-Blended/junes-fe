import React, { useState } from "react";
import { Address } from "../types/address";
import AddressCardContent from "../components/AddressCardContent";

interface SavedInfoActionWindowProps {
  type?: "address" | "payment";
  mode: "add" | "edit" | "delete";
  addressData: Address;
  onClose?: () => void;
  onConfirm?: () => void;
}

const SavedInfoActionWindow: React.FC<SavedInfoActionWindowProps> = ({
  type = "address",
  mode = "delete",
  addressData,
  onClose = () => console.log("Close clicked"),
  onConfirm = () => console.log("Confirm clicked"),
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleConfirm = () => {
    if (type === "payment" && mode === "edit" && currentPage === 1) {
      setCurrentPage(2);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="saved-info-overlay">
      <div className="saved-info-modal">
        <div className="saved-info-header">
          <h2 className="saved-info-title">Confirm deletion</h2>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>

        {type === "address" && (
          <div className="address-content-wrapper">
            <AddressCardContent {...addressData} />
          </div>
        )}

        <div className="btn-container">
          <button className="common-button no-btn" onClick={onClose}>
            No
          </button>
          <button className="common-button yes-button" onClick={handleConfirm}>
            {type === "payment" && currentPage === 1 ? "Next" : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedInfoActionWindow;
