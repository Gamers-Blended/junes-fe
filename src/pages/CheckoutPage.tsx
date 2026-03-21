import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockAddressList } from "../mocks/data/address";
import { mockPaymentMethodList } from "../mocks/data/paymentMethod";
import { mockCartItemList } from "../mocks/data/productInCartDTO.ts";
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
import { calculateSubtotal } from "../utils/cartUtils.ts";
import SavedItemSelector from "../components/SavedItemSelector";
import OrderTable from "../components/OrderTable";
import { useAuth } from "../components/AuthContext.tsx";
import { Address } from "../types/address.ts";
import { PaymentMethod } from "../types/paymentMethod.ts";
import { Page } from "../types/page.ts";
import { ProductInCartDTO } from "../types/productInCartDTO.ts";
import {
  mapProductInCartDTOToItemList,
  mapProductInCartDTOToOrderItemDTO,
} from "../utils/mappers.ts";
import { CheckoutOrderDetails } from "../types/orderDetails.ts";
import { ShippingResponse } from "../types/shippingResponse.ts";
import { ResponseMessage } from "../types/responseMessage.ts";

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
    null,
  );
  const [savedAddressList, setSavedAddressList] = useState<Address[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [savedPaymentMethodList, setSavedPaymentMethodList] = useState<
    PaymentMethod[]
  >([]);
  const [cartItems, setCartItems] = useState<ProductInCartDTO[]>([]);
  const [orderDetails, setOrderDetails] = useState<CheckoutOrderDetails>({
    totalAmount: 0,
    transactionItemDTOList: [],
    shippingCost: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCartItems, setIsLoadingCartItems] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  useAuthRedirect(isLoggedIn);

  // Functions that make API calls
  const fetchSavedItems = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const [addressList, paymentMethodList] = await Promise.all([
        getSavedAddresses(),
        getSavedPaymentMethods(),
      ]);

      console.log("Number of fetched addresses:", addressList.length);
      console.log(
        "Number of fetched payment methods:",
        paymentMethodList.length,
      );

      setSavedAddressList(addressList);
      setSavedPaymentMethodList(paymentMethodList);

      if (addressList.length > 0) {
        setSelectedAddressId(getDefaultId(addressList));
        console.log("Default selected address ID:", addressList[0].id);
      }

      if (paymentMethodList.length > 0) {
        setSelectedPaymentMethodId(getDefaultId(paymentMethodList));
        console.log(
          "Default selected payment method ID:",
          paymentMethodList[0].id,
        );
      }
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Failed to fetch saved items. Please try again.",
        ),
      );
      console.error("Error fetching saved items:", error);
    } finally {
      setIsLoading(false);
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

  const fetchCartItems = async (): Promise<ProductInCartDTO[]> => {
    setIsLoadingCartItems(true);
    setErrorMessage("");

    try {
      const response = await getCartItems();
      setCartItems(response);
      return response;
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Failed to load cart items"));
      return [];
    } finally {
      setIsLoadingCartItems(false);
    }
  };

  const getCartItems = async (): Promise<ProductInCartDTO[]> => {
    if (offlineMode) {
      console.log("Offline mode: using mock cart items");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockCartItemList;
    }

    console.log("Fetching cart items from API...");
    const response = await apiClient.get<Page<ProductInCartDTO>>(
      `${REQUEST_MAPPING}/cart/products`,
    );

    const page = response.data;

    // Ensure content field is an array
    if (!page || !Array.isArray(page.content)) {
      console.warn("Unexpected cart API response shape", page);
      return [];
    }

    return page.content;
  };

  const getShippingFee = async (items: ProductInCartDTO[]): Promise<number> => {
    if (offlineMode) {
      console.log("Offline mode: using mock shipping fee");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return 5.99; // Mock shipping fee
    }

    if (items.length === 0) {
      console.warn("No items in cart, skipping shipping fee calculation");
      return 0;
    }

    console.log("Fetching shipping fee from API...");

    const response = await apiClient.post<ShippingResponse>(
      `${REQUEST_MAPPING}/shipping/calculate`,
      { orderItemDTOList: items.map(mapProductInCartDTOToOrderItemDTO) },
    );

    console.log("Shipping fee retrieved:", response.data.shippingCost);
    return response.data.shippingCost;
  };

  const callPlaceOrderAPI = async (): Promise<ResponseMessage> => {
    if (offlineMode) {
      console.log("Offline mode: skipping Place Order API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { message: "Order placed successfully (offline mode)" };
    }

    console.log("Calling Place Order API...");

    // Build order request payload
    const addressDTO = savedAddressList.find(
      (addr) => addr.id === selectedAddressId,
    );
    if (!addressDTO || !selectedAddressId || !selectedPaymentMethodId) {
      setErrorMessage("Please select a valid address and payment method.");
      return { message: "Failed to place order." };
    }

    const orderRequest = {
      addressDTO: addressDTO,
      paymentMethodID: selectedPaymentMethodId,
      orderItemDTOList: cartItems.map(mapProductInCartDTOToOrderItemDTO),
      shippingCost: orderDetails.shippingCost,
    };

    const response = await apiClient.post<ResponseMessage>(
      `${REQUEST_MAPPING}/order/place`,
      orderRequest,
    );
    return response.data;
  };

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      const [cartItems] = await Promise.all([
        fetchCartItems(),
        fetchSavedItems(),
      ]);

      if (cancelled) return;

      let fee = 0;
      if (cartItems.length > 0) {
        try {
          fee = await getShippingFee(cartItems);
        } catch (error) {
          if (!cancelled) {
            setErrorMessage(
              getApiErrorMessage(
                error,
                "Failed to calculate shipping fee. Please try again.",
              ),
            );
            console.error("Error fetching shipping fee:", error);
          }
        }
      }

      if (!cancelled) {
        setOrderDetails(buildCheckoutOrderDetails(cartItems, fee));
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const getDefaultId = <T extends { id: string; isDefault: boolean }>(
    items: T[],
  ): string | null => {
    return (items.find((item) => item.isDefault) ?? items[0])?.id ?? null;
  };

  const getTotalAmount = (
    cartItems: ProductInCartDTO[],
    shippingFee: number,
  ): number => {
    if (!shippingFee) {
      shippingFee = 0;
    }

    return calculateSubtotal(cartItems) + shippingFee;
  };

  const buildCheckoutOrderDetails = (
    cartItems: ProductInCartDTO[],
    shippingFee: number,
  ): CheckoutOrderDetails => {
    const totalAmount = getTotalAmount(cartItems, shippingFee);

    const checkoutOrderDetails = {
      totalAmount: totalAmount,
      transactionItemDTOList: cartItems.flatMap(mapProductInCartDTOToItemList),
      shippingCost: shippingFee,
    };

    return checkoutOrderDetails;
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    console.log("Selected address ID:", addressId);
  };

  const handlePaymentMethodSelection = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
    console.log("Selected payment method ID:", paymentMethodId);
  };

  const handlePlaceOrder = async (): Promise<void> => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await callPlaceOrderAPI();

      console.log("Place order response:", response);
      navigate("/orderplaced");
    } catch (error) {
      setErrorMessage("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page-container">
      <div className="common-header">
        <h1>CHECKOUT</h1>
      </div>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

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
              isDataLoading={isLoading}
            />

            <SavedItemSelector
              mode={SavedInfoType.PAYMENT}
              caller={SavedItemSelectorCaller.CHECKOUT}
              items={savedPaymentMethodList}
              initialSelectedId={selectedPaymentMethodId}
              onItemSelect={handlePaymentMethodSelection}
              showConfirmButton={true}
              className="checkout-page"
              isDataLoading={isLoading}
            />
          </div>
        </div>

        <div className="right-column">
          <OrderTable orderData={orderDetails} mode={OrderTableMode.INVOICE} />

          <div className="button-container">
            <button
              className={`form-button cart-button extended-width ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
              onClick={handlePlaceOrder}
            >
              {isLoading ? "Placing Your Order..." : "Place Your Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
