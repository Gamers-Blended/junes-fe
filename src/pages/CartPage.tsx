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

  return (
    <div className="cart-page-container">
      <div className="common-header">
        <h1>MY CART</h1>
      </div>

      <div className="sub-header">
        <div className="sub-header-subtotal">
          <div className="subtotal-label">Subtotal</div>
          <span className="subtotal-amount">$299.97</span>
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
    </div>
  );
};

export default CartPage;
