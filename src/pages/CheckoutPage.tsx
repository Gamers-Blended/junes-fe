import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockAddressList } from "../mocks/data/address";
import { mockPaymentMethodList } from "../mocks/data/paymentMethod";
import { mockOrderList } from "../mocks/data/orders";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import {
  SavedInfoType,
  SavedItemSelectorCaller,
  OrderTableMode,
} from "../utils/Enums";
import {
  getCachedSavedAddresses,
  setCachedSavedAddresses,
  getCachedSavedPaymentMethods,
  setCachedSavedPaymentMethods,
} from "../utils/cacheUtils.ts";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import SavedItemSelector from "../components/SavedItemSelector";
import OrderTable from "../components/OrderTable";
import { useAuth } from "../components/AuthContext.tsx";
import { Address } from "../types/address.ts";
import { PaymentMethod } from "../types/paymentMethod.ts";

type AddressDTO = Omit<Address, "id" | "type"> & {
  addressID: string;
};

type PaymentMethodDTO = Omit<PaymentMethod, "id" | "type"> & {
  paymentMethodID: string;
};

interface CheckoutPageProps {
  offlineMode?: boolean;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    mockAddressList[0].id,
  );
  const [savedAddressList, setSavedAddressList] = useState<Address[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(mockPaymentMethodList[0].id);
  const [savedPaymentMethodList, setSavedPaymentMethodList] = useState<
    PaymentMethod[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  useAuthRedirect(isLoggedIn);

  // Functions that make API calls
  const fetchSavedItems = async () => {
    setErrorMessage("");

    try {
      const addressList = await getSavedAddresses();
      console.log("Number of fetched addresses:", addressList.length);

      const paymentMethodList = await getSavedPaymentMethods();
      console.log(
        "Number of fetched payment methods:",
        paymentMethodList.length,
      );

      setSavedAddressList(addressList);
      setSavedPaymentMethodList(paymentMethodList);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Failed to fetch saved items. Please try again.",
        ),
      );
      console.error("Error fetching saved items:", error);
    }
  };

  const getSavedAddresses = async (): Promise<Address[]> => {
    if (offlineMode) {
      console.log("Offline mode: Skipping get Saved Items API call (Address)");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockAddressList;
    }

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
  };

  const getSavedPaymentMethods = async (): Promise<PaymentMethod[]> => {
    if (offlineMode) {
      console.log("Offline mode: Skipping get Saved Items API call (Address)");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockPaymentMethodList;
    }

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
  };

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    console.log("Selected address ID:", addressId);
  };

  const handlePaymentMethodSelection = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
    console.log("Selected payment method ID:", paymentMethodId);
  };

  const handlePlaceOrder = (): void => {
    console.log("Placing order...");
    navigate("/orderplaced");
  };

  return (
    <div className="checkout-page-container">
      <div className="common-header">
        <h1>CHECKOUT</h1>
      </div>

      <div className="content-wrapper">
        <div className="left-column">
          <div className="component-box">
            <SavedItemSelector
              mode={SavedInfoType.ADDRESS}
              caller={SavedItemSelectorCaller.CHECKOUT}
              items={savedAddressList}
              initialSelectedId={selectedAddressId}
              onItemSelect={handleAddressSelection}
              showConfirmButton={true}
              className="checkout-page"
            />

            <SavedItemSelector
              mode={SavedInfoType.PAYMENT}
              caller={SavedItemSelectorCaller.CHECKOUT}
              items={savedPaymentMethodList}
              initialSelectedId={selectedPaymentMethodId}
              onItemSelect={handlePaymentMethodSelection}
              showConfirmButton={true}
              className="checkout-page"
            />
          </div>
        </div>

        <div className="right-column">
          <OrderTable
            orderData={mockOrderList[0]}
            mode={OrderTableMode.INVOICE}
          />

          <div className="button-container">
            <button
              className="form-button cart-button extended-width"
              onClick={handlePlaceOrder}
            >
              Place Your Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
