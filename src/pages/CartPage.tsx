import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "../types/page.ts";
import { ProductInCartDTO } from "../types/productInCartDTO.ts";
import { mockCartItemList } from "../mocks/data/productInCartDTO.ts";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import ProductImageAndDescription from "../components/ProductImageAndDescription";
import QuantitySelector from "../components/QuantitySelector";

import checkoutIcon from "../assets/checkoutIcon.png";
import { mapDTOToDisplay } from "../utils/mappers.ts";

interface CartItemProps {
  offlineMode?: boolean;
}

const CartPage: React.FC<CartItemProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const [cartItems, setCartItems] = useState<ProductInCartDTO[]>([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Functions that make API calls
  const fetchCartItems = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getCartItems();
      setCartItems(response);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Failed to load cart items"));
    } finally {
      setIsLoading(false);
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

  const handleCheckout = (): void => {
    console.log("Navigating to checkout page");
    navigate("/checkout");
  };

  const handleContinueShopping = (): void => {
    console.log("Continuing shopping");
    navigate("/");
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, item: { ...cartItem, quantity: newQuantity } }
          : cartItem,
      ),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.id !== itemId),
    );
  };

  const calculateSubtotal = (): number => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }

    return cartItems.reduce((total, cartItem) => {
      if (!cartItem?.price || !cartItem?.quantity) {
        return total;
      }

      // Ensure price and quantity are valid
      const price = Number(cartItem.price) || 0;
      const quantity = Number(cartItem.quantity) || 0;

      return total + price * quantity;
    }, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="cart-page-container">
      <div className="common-header">
        <h1>MY CART</h1>
      </div>

      <div className="sub-header">
        <div className="sub-header-subtotal">
          <div className="subtotal-label">Subtotal</div>
          <span className="subtotal-amount">
            ${calculateSubtotal().toFixed(2)}
          </span>
        </div>
        {cartItems.length === 0 ? null : (
          <button className="form-button cart-button" onClick={handleCheckout}>
            <img src={checkoutIcon} alt="Checkout" className="checkout-icon" />
            Checkout
          </button>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {isLoading ? (
        <div className="loading-message">Loading cart items...</div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart-message-box">
          Your cart is empty
          <button className="form-button" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-items-list">
          {cartItems.map((cartItem) => (
            <div key={cartItem.id} className="cart-item-container">
              <ProductImageAndDescription
                item={mapDTOToDisplay(cartItem)}
                mode="cart"
              />
              <QuantitySelector
                className="cart-item"
                initialQuantity={cartItem.quantity}
                onChange={(newQuantity) =>
                  handleQuantityChange(cartItem.id, newQuantity)
                }
              />

              <div className="cart-item-price">
                $
                {cartItem.price && cartItem.quantity
                  ? (cartItem.price * cartItem.quantity).toFixed(2)
                  : "0.00"}
              </div>

              <button
                className="close-btn cart-item"
                onClick={() => handleRemoveItem(cartItem.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="cart-footer">
        <div className="subtotal-section">
          <div className="subtotal-row">
            <span className="subtotal-text">Subtotal</span>
            <span className="subtotal-value">
              ${calculateSubtotal().toFixed(2)}
            </span>
          </div>
          <div className="tax-note">
            Taxes and shipping calculated at checkout
          </div>
        </div>

        {cartItems.length === 0 ? null : (
          <button
            className="form-button cart-button extended-width"
            onClick={handleCheckout}
          >
            <img src={checkoutIcon} alt="Checkout" className="checkout-icon" />
            Checkout
          </button>
        )}

        <div className="spacer"></div>

        <button className="action-link" onClick={handleContinueShopping}>
          Continue shopping &gt;
        </button>
      </div>
    </div>
  );
};

export default CartPage;
