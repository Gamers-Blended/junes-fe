import { mockUserData } from "../mocks/data/userData";

const OrderPlacedPage = () => {
  const orderId = "J1234";
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
      </div>
    </div>
  );
};

export default OrderPlacedPage;
