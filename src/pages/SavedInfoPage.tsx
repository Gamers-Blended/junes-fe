import React, { useState, useEffect, JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { SavedInfoType, SavedInfoAction } from "../utils/Enums.tsx";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import { mockAddressList } from "../mocks/data/address.ts";
import { mockPaymentMethodList } from "../mocks/data/paymentMethod.ts";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { useAuth } from "../components/AuthContext";
import AddressCardContent from "../components/AddressCardContent";
import PaymentMethodCardContent from "../components/PaymentMethodCardContent.tsx";
import SavedItemCardActionContent from "../components/SavedItemCardActionContent.tsx";
import SavedInfoActionWindow from "../components/SavedInfoActionWindow.tsx";
import AccountInfoChangedMessageBox from "../components/AccountInfoChangedMessageBox.tsx";
import Breadcrumb from "../components/Breadcrumb.tsx";
import Footer from "../components/Footer";

type SavedItem = Address | PaymentMethod;
type AddressDTO = Omit<Address, "id" | "type"> & {
  addressID: string;
};

interface SavedInfoPageProps {
  offlineMode?: boolean;
}

const SavedInfoPage: React.FC<SavedInfoPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const location = useLocation();
  const { fieldToChange } = location.state || {};
  const navigate = useNavigate();
  const MAX_NUMBER_OF_ITEMS = 5;

  const isAddressMode = fieldToChange === SavedInfoType.ADDRESS;
  const isPaymentMode = fieldToChange === SavedInfoType.PAYMENT;

  // State for modal
  const [actionWindowState, setActionWindowState] = useState<{
    isOpen: boolean;
    type: SavedInfoType | null;
    mode: SavedInfoAction | null;
    item: SavedItem | null;
  }>({
    isOpen: false,
    type: null,
    mode: null,
    item: null,
  });

  // State for success message
  const [successMessage, setSuccessMessage] = useState<{
    type: SavedInfoType.ADDRESS | SavedInfoType.PAYMENT;
    action: "added" | "removed" | "updated" | "default_updated";
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const breadcrumbItems = [
    {
      label: "My Account",
      path: "/myaccount/",
    },
  ];

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

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

  const getSuccessMessage = () => {
    if (!successMessage) return "";

    const { type, action } = successMessage;

    // e.g. Default address updated
    if (action === "default_updated") {
      return `Default ${type} updated`;
    }

    // e.g. Address removed
    return `${type.charAt(0).toUpperCase() + type.slice(1)} ${action}`;
  };

  // Functions to fetch saved items
  const fetchSavedItems = async () => {
    setErrorMessage("");

    try {
      const response = await getSavedItems();

      if (isAddressMode) {
        const addressList = response as Address[];
        console.log("Number of fetched addresses:", addressList.length);
      }

      setSavedItems(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          `Failed to fetch saved ${isAddressMode ? `Address(es)` : `Payment Method(s)`}. Please try again.`,
        ),
      );
      console.error("Error fetching saved items:", error);
    }
  };

  const getSavedItems = async (): Promise<SavedItem[]> => {
    if (offlineMode) {
      console.log("Offline mode: Skipping get Saved Items API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return isAddressMode ? mockAddressList : mockPaymentMethodList;
    }

    console.log("Fetching saved items from API:");

    if (isAddressMode) {
      // API returns AddressDTO[], transform to Address[]
      const response = await apiClient.get<AddressDTO[]>(
        `${REQUEST_MAPPING}/saved-items/addresses/user`,
      );

      const addressList: Address[] = response.data.map((item) => ({
        ...item,
        id: item.addressID,
        type: SavedInfoType.ADDRESS,
      }));

      return addressList;
    } else {
      return isAddressMode ? mockAddressList : mockPaymentMethodList;
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, []);

  // Handlers
  // For address, go to new page
  const handleAddItem = () => {
    setErrorMessage("");

    console.log(
      `Add new ${isAddressMode ? SavedInfoType.ADDRESS : SavedInfoType.PAYMENT}`,
    );
    if (isAddressMode) {
      const state: NavigationState = {
        from: "savedinfo",
        fieldToChange: SavedInfoType.ADDRESS,
        action: SavedInfoAction.ADD,
      };
      navigate("/modifyaddress/", { state });
    } else if (isPaymentMode) {
      console.log("Open add payment method window");
      setActionWindowState({
        isOpen: true,
        type: SavedInfoType.PAYMENT,
        mode: SavedInfoAction.ADD,
        item: null,
      });
    }
  };

  // For address, go to new page
  const handleEdit = (itemToEdit: SavedItem) => {
    setErrorMessage("");

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
      setActionWindowState({
        isOpen: true,
        type: SavedInfoType.PAYMENT,
        mode: SavedInfoAction.EDIT,
        item: itemToEdit,
      });
    }
  };

  const handleRemove = (id: string) => {
    setErrorMessage("");

    console.log(`Remove item with id: ${id}`);
    const item = savedItems.find((item) => item.id === id);
    if (item && item.isDefault == false) {
      setActionWindowState({
        isOpen: true,
        type: item.type,
        mode: SavedInfoAction.DELETE,
        item: item,
      });
    } else {
      setErrorMessage(
        "Cannot remove default item. Please set another item as default before removing.",
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!actionWindowState.item) return;

    const idToDelete = actionWindowState.item.id;
    const itemType = actionWindowState.type;

    setSavedItems((prev) => prev.filter((item) => item.id !== idToDelete));
    setSuccessMessage({
      type:
        itemType === SavedInfoType.ADDRESS
          ? SavedInfoType.ADDRESS
          : SavedInfoType.PAYMENT,
      action: "removed",
    });
    console.log(`Deleted item with id: ${idToDelete}`);
    setActionWindowState({
      isOpen: false,
      type: itemType,
      mode: SavedInfoAction.DELETE,
      item: null,
    });
  };

  // Payment Handlers to be passed to modal
  const handleAddPaymentMethod = () => {
    console.log("add payment method");
    setActionWindowState({
      isOpen: false,
      type: SavedInfoType.PAYMENT,
      mode: SavedInfoAction.ADD,
      item: null,
    });
    setSuccessMessage({
      type: SavedInfoType.PAYMENT,
      action: "added",
    });
  };

  const handleEditPaymentMethod = () => {
    console.log("edit payment method");
    setActionWindowState({
      isOpen: false,
      type: SavedInfoType.PAYMENT,
      mode: SavedInfoAction.EDIT,
      item: null,
    });
    setSuccessMessage({
      type: SavedInfoType.PAYMENT,
      action: "updated",
    });
  };

  const handleCloseActionWindow = () => {
    setActionWindowState({
      isOpen: false,
      type: null,
      mode: null,
      item: null,
    });
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const handleSetDefault = (id: string, type: string) => {
    console.log(`Set default for item with id: ${id}`);
    setSuccessMessage({
      type: type === "address" ? SavedInfoType.ADDRESS : SavedInfoType.PAYMENT,
      action: "default_updated",
    });
  };

  const renderAddressCard = (address: Address) => (
    <div key={address.id} className="saved-item-card">
      {address.isDefault && <div className="default-badge">Default</div>}

      <AddressCardContent {...address} />
      <SavedItemCardActionContent
        item={address}
        onEdit={() => handleEdit(address)}
        onRemove={() => handleRemove(address.id)}
        onSetDefault={() => handleSetDefault(address.id, SavedInfoType.ADDRESS)}
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
        onSetDefault={() =>
          handleSetDefault(paymentMethod.id, SavedInfoType.PAYMENT)
        }
      />
    </div>
  );

  return (
    <div className="saved-info-page-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="saved-info-content">
        <div className="common-header">{renderHeader()}</div>

        {/* Success Message */}
        {successMessage && (
          <AccountInfoChangedMessageBox
            message={getSuccessMessage()}
            onClose={handleCloseSuccessMessage}
          />
        )}

        {/* Error Message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

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
              : renderPaymentMethodCard(item as PaymentMethod),
          )}
        </div>
      </div>

      <Footer />

      {/* Action Window Modal */}
      {/* Payment */}
      {actionWindowState.isOpen && isPaymentMode && (
        <>
          {actionWindowState.mode === SavedInfoAction.ADD && (
            <SavedInfoActionWindow
              type={SavedInfoType.PAYMENT}
              mode={SavedInfoAction.ADD}
              onAdd={handleAddPaymentMethod}
              onClose={handleCloseActionWindow}
            />
          )}

          {actionWindowState.mode === SavedInfoAction.EDIT &&
            actionWindowState.item && (
              <SavedInfoActionWindow
                type={SavedInfoType.PAYMENT}
                mode={SavedInfoAction.EDIT}
                savedItemData={actionWindowState.item as PaymentMethod}
                onEdit={handleEditPaymentMethod}
                onClose={handleCloseActionWindow}
              />
            )}

          {actionWindowState.mode === SavedInfoAction.DELETE &&
            actionWindowState.item && (
              <SavedInfoActionWindow
                type={SavedInfoType.PAYMENT}
                mode={SavedInfoAction.DELETE}
                savedItemData={actionWindowState.item as PaymentMethod}
                onConfirm={handleConfirmDelete}
                onClose={handleCloseActionWindow}
              />
            )}
        </>
      )}

      {/* Address - Delete */}
      {actionWindowState.isOpen &&
        actionWindowState.mode === SavedInfoAction.DELETE &&
        actionWindowState.item?.type === SavedInfoType.ADDRESS && (
          <SavedInfoActionWindow
            type={SavedInfoType.ADDRESS}
            mode={SavedInfoAction.DELETE}
            savedItemData={actionWindowState.item as Address}
            onConfirm={handleConfirmDelete}
            onClose={handleCloseActionWindow}
          />
        )}
    </div>
  );
};

export default SavedInfoPage;
