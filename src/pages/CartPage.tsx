import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCartItemList, emptyCartList } from "../mocks/data/cart";
import ProductImageAndDescription from "../components/ProductImageAndDescription";
import QuantitySelector from "../components/QuantitySelector";

import checkoutIcon from "../assets/checkoutIcon.png";

const CartPage = () => {
  // const isEmptyCart = true; // Toggle
  const isEmptyCart = false; // Toggle
  const [cartItems, setCartItems] = useState(
    isEmptyCart ? emptyCartList : mockCartItemList
  );
  const navigate = useNavigate();

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
        cartItem.item.id === itemId
          ? { ...cartItem, item: { ...cartItem.item, quantity: newQuantity } }
          : cartItem
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.item.id !== itemId)
    );
  };

  const calculateSubtotal = (): number => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }

    return cartItems.reduce((total, cartItem) => {
      if (!cartItem?.item?.price || !cartItem?.item?.quantity) {
        return total;
      }

      // Ensure price and quantity are valid
      const price = Number(cartItem.item.price) || 0;
      const quantity = Number(cartItem.item.quantity) || 0;

      return total + price * quantity;
    }, 0);
  };

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
        {isEmptyCart ? null : (
          <button className="form-button cart-button" onClick={handleCheckout}>
            <img src={checkoutIcon} alt="Checkout" className="checkout-icon" />
            Checkout
          </button>
        )}
      </div>

      {isEmptyCart ? (
        <div className="empty-cart-message-box">
          Your cart is empty
          <button className="form-button" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-items-list">
          {cartItems.map((cartItem) => (
            <div key={cartItem.item.id} className="cart-item-container">
              <ProductImageAndDescription item={cartItem.item} mode="cart" />
              <QuantitySelector
                className="cart-item"
                initialQuantity={cartItem.item.quantity}
                onChange={(newQuantity) =>
                  handleQuantityChange(cartItem.item.id, newQuantity)
                }
              />

              <div className="cart-item-price">
                $
                {cartItem.item.price && cartItem.item.quantity
                  ? (cartItem.item.price * cartItem.item.quantity).toFixed(2)
                  : "0.00"}
              </div>

              <button
                className="close-btn cart-item"
                onClick={() => handleRemoveItem(cartItem.item.id)}
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

        {isEmptyCart ? null : (
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
