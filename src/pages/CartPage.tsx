import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "../types/page.ts";
import { ProductInCartDTO } from "../types/productInCartDTO.ts";
import CartItemRow from "../components/CartItemRow.tsx";
import { mockCartItemList } from "../mocks/data/productInCartDTO.ts";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import { calculateSubtotal } from "../utils/cartUtils.ts";

import checkoutIcon from "../assets/checkoutIcon.png";

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

  const deleteCartItem = async (itemId: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await callDeleteCartItemAPI(itemId);
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem.id !== itemId),
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Failed to remove item from cart"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const callDeleteCartItemAPI = async (productId: string) => {
    if (offlineMode) {
      console.log("Offline mode: simulating cart item deletion");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    } else {
      console.log("Deleting cart item from API");
      const response = await apiClient.delete(
        `${REQUEST_MAPPING}/cart/remove/${productId}`,
      );

      console.log("Delete cart item response:", response.data);
    }
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
          ? { ...cartItem, quantity: newQuantity }
          : cartItem,
      ),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    deleteCartItem(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const clearCart = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await callClearCartAPI();
      setCartItems([]);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Failed to clear cart"));
    } finally {
      setIsLoading(false);
    }
  };

  const callClearCartAPI = async () => {
    if (offlineMode) {
      console.log("Offline mode: simulating cart clearance");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    } else {
      console.log("Clearing cart via API");
      const response = await apiClient.delete(`${REQUEST_MAPPING}/cart/items`);

      console.log("Clear cart response:", response.data);
    }
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
        {cartItems.length === 0 ? null : (
          <button
            className="form-button clear-button"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        )}
        <div className="sub-header-subtotal">
          <div className="subtotal-label">Subtotal</div>
          <span className="subtotal-amount">
            ${calculateSubtotal(cartItems).toFixed(2)}
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
            <CartItemRow
              key={cartItem.id}
              cartItem={cartItem}
              onRemove={handleRemoveItem}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      )}

      <div className="cart-footer">
        <div className="subtotal-section">
          <div className="subtotal-row">
            <span className="subtotal-text">Subtotal</span>
            <span className="subtotal-value">
              ${calculateSubtotal(cartItems).toFixed(2)}
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
