import { useNavigate } from "react-router-dom";

import checkoutIcon from "../assets/checkoutIcon.png";

const CartPage = () => {
  const isEmptyCart = false; // Toggle
  const navigate = useNavigate();

  const handleCheckout = (): void => {
    console.log("Navigating to checkout page");
    navigate("/checkout");
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
          <button className="form-button checkout-button" onClick={handleCheckout}>
            <img src={checkoutIcon} alt="Checkout" className="checkout-icon" />
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
