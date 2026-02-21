import React, { useState, useEffect, JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { SavedInfoType, SavedInfoAction } from "../utils/Enums.tsx";
import {
  clearSavedAddressesCache,
  getCachedSavedAddresses,
  setCachedSavedAddresses,
  clearSavedPaymentMethodsCache,
  getCachedSavedPaymentMethods,
  setCachedSavedPaymentMethods,
} from "../utils/cacheUtils.ts";
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

type PaymentMethodDTO = Omit<PaymentMethod, "id" | "type"> & {
  paymentMethodID: string;
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
  const [modalErrorMessage, setModalErrorMessage] = useState<string>("");
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

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

  // Functions that make API calls
  const fetchSavedItems = async () => {
    setErrorMessage("");

    try {
      const response = await getSavedItems();

      if (isAddressMode) {
        const addressList = response as Address[];
        console.log("Number of fetched addresses:", addressList.length);
      } else {
        const paymentMethodList = response as PaymentMethod[];
        console.log(
          "Number of fetched payment methods:",
          paymentMethodList.length,
        );
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

    if (isAddressMode) {
      const cacheKey = "savedAddresses";

      const cachedData = getCachedSavedAddresses(cacheKey);
      if (cachedData) {
        console.log("Using cached saved addresses for key:", cacheKey);
        return cachedData.data;
      }

      console.log("Fetching saved items from API...");

      // API returns AddressDTO[], transform to Address[]
      const response = await apiClient.get<AddressDTO[]>(
        `${REQUEST_MAPPING}/saved-items/addresses/user`,
      );

      const addressList: Address[] = response.data.map((item) => ({
        ...item,
        id: item.addressID,
        type: SavedInfoType.ADDRESS,
      }));

      setCachedSavedAddresses(cacheKey, addressList);
      console.log("Saved addresses cached with key:", cacheKey);

      return addressList;
    } else {
      const cacheKey = "savedPaymentMethods";

      const cachedData = getCachedSavedPaymentMethods(cacheKey);
      if (cachedData) {
        console.log("Using cached saved payment methods for key:", cacheKey);
        return cachedData.data;
      }

      console.log("Fetching saved items from API...");

      // API returns PaymentMethodDTO[], transform to PaymentMethod[]
      const response = await apiClient.get<PaymentMethodDTO[]>(
        `${REQUEST_MAPPING}/saved-items/payment-methods/user`,
      );

      const paymentMethodList: PaymentMethod[] = response.data.map((item) => ({
        ...item,
        id: item.paymentMethodID,
        type: SavedInfoType.PAYMENT,
      }));

      setCachedSavedPaymentMethods(cacheKey, paymentMethodList);
      console.log("Saved payment methods cached with key:", cacheKey);

      return paymentMethodList;
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const deleteAddress = async (id: string) => {
    if (offlineMode) {
      console.log("Offline mode: Skipping delete address API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    console.log("Calling API to delete address with id:", id);

    await apiClient.delete(`${REQUEST_MAPPING}/saved-items/address/${id}`);

    console.log("Address deleted");
  };

  const setDefaultAddress = async (id: string) => {
    if (offlineMode) {
      console.log("Offline mode: Skipping set default address API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    console.log("Calling API to set default address with id:", id);

    await apiClient.post(`${REQUEST_MAPPING}/saved-items/set-default`, {
      mode: "address",
      savedItemID: id,
    });

    console.log("Default address set");
  };

  const clearAddressCacheAndRefetch = async () => {
    clearSavedAddressesCache();
    await fetchSavedItems();
  };

  const deletePaymentMethod = async () => {
    if (offlineMode) {
      console.log("Offline mode: Skipping delete payment method API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    console.log(
      "Calling API to delete payment method with id:",
      actionWindowState.item?.id,
    );

    await apiClient.delete(
      `${REQUEST_MAPPING}/saved-items/payment-method/${actionWindowState.item?.id}`,
    );

    console.log("Payment method deleted");
  };

  const setDefaultPaymentMethod = async (id: string) => {
    if (offlineMode) {
      console.log("Offline mode: Skipping set default payment method API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    console.log("Calling API to set default payment method with id:", id);

    await apiClient.post(`${REQUEST_MAPPING}/saved-items/set-default`, {
      mode: "payment_method",
      savedItemID: id,
    });

    console.log("Default payment method set");
  };

  const clearPaymentMethodCacheAndRefetch = async () => {
    clearSavedPaymentMethodsCache();
    await fetchSavedItems();
  };

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

  // Validation check when clicking delete before opening confirmation modal
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

  // Handle actual delete action after confirming in modal
  const handleConfirmDelete = async () => {
    if (!actionWindowState.item) return;

    setModalErrorMessage("");
    setIsModalLoading(true);

    const idToDelete = actionWindowState.item.id;
    const itemType = actionWindowState.type;

    try {
      if (isAddressMode) {
        await deleteAddress(idToDelete);
        clearAddressCacheAndRefetch();
      } else {
        await deletePaymentMethod();
        clearPaymentMethodCacheAndRefetch();
      }

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
    } catch (error) {
      setModalErrorMessage(
        getApiErrorMessage(
          error,
          `Failed to delete ${itemType}. Please try again.`,
        ),
      );
      console.error("Error deleting item:", error);
      return;
    } finally {
      setIsModalLoading(false);
    }
  };

  // Payment Handlers to be passed to modal
  const handleAddPaymentMethod = async () => {
    console.log("add payment method");

    await clearPaymentMethodCacheAndRefetch();

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

  const handleEditPaymentMethod = async () => {
    console.log("edit payment method");

    await clearPaymentMethodCacheAndRefetch();

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

    setModalErrorMessage("");
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const handleSetDefault = async (id: string, type: string) => {
    setErrorMessage("");

    console.log(`Set default for item with id: ${id}`);

    try {
      if (type == SavedInfoType.ADDRESS) {
        await setDefaultAddress(id);
        clearAddressCacheAndRefetch();
      } else {
        await setDefaultPaymentMethod(id);
        clearPaymentMethodCacheAndRefetch();
      }

      setSuccessMessage({
        type:
          type === "address" ? SavedInfoType.ADDRESS : SavedInfoType.PAYMENT,
        action: "default_updated",
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          `Failed to set default ${type}. Please try again.`,
        ),
      );
      console.error("Error setting default:", error);
    }
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
              errorMessage={modalErrorMessage}
              setErrorMessage={setModalErrorMessage}
              isModalLoading={isModalLoading}
              setIsModalLoading={setIsModalLoading}
              offlineMode={offlineMode}
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
                errorMessage={modalErrorMessage}
                setErrorMessage={setModalErrorMessage}
                isModalLoading={isModalLoading}
                setIsModalLoading={setIsModalLoading}
                offlineMode={offlineMode}
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
                errorMessage={modalErrorMessage}
                isModalLoading={isModalLoading}
                offlineMode={offlineMode}
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
            errorMessage={modalErrorMessage}
            isModalLoading={isModalLoading}
            offlineMode={offlineMode}
          />
        )}
    </div>
  );
};

export default SavedInfoPage;
