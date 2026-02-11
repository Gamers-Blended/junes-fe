import { mockUserData } from "../mocks/data/userData";
import { mockOrderList } from "../mocks/data/orders";
import { useNavigate } from "react-router-dom";

const OrderPlacedPage = () => {
  const orderId = mockOrderList[0].orderNumber;
  const navigate = useNavigate();

  const handleViewOrderDetails = (orderId: string) => {
    const url = `/order/${orderId}`;
    console.log(`Navigating to order details for ${orderId}`);
    navigate(url);
  };

  const handleContinueShopping = (): void => {
    console.log("Continuing shopping");
    navigate("/");
  };

  return (
    <div className="form-parent-container">
      <div className="form">
        <div className="form-title">
          <h1>WE HAVE RECEIVED YOUR ORDER!</h1>
        </div>

        <div className="form-container">
          <p className="form-text text-align-center">
            A confirmation email has been sent to {mockUserData.email}.<br />
            Your order ID is
          </p>
          <div className="order-id-text">#{orderId}</div>
        </div>

        <div className="spacer"></div>

        <button
          className="action-link"
          onClick={() => handleViewOrderDetails(orderId)}
        >
          View my order
        </button>
        <br />

        <button className="action-link" onClick={handleContinueShopping}>
          Continue shopping &gt;
        </button>
      </div>
    </div>
  );
};

export default OrderPlacedPage;
