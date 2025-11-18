import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OrderTable from "../components/OrderTable";
import { mockOrderList } from "../mocks/data/orders";
import Footer from "../components/Footer";

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handlePrintInvoice = (orderId: string) => {
    const url = `/invoice/${orderId}`;
    console.log(`Navigating to invoice page for ${orderId}`);
    navigate(url);
  };

  return (
    <div className="order-details-page-container">
      <div className="order-header">
        <h1>ORDER #{mockOrderList[0].id}</h1>
      </div>

      <div className="order-details-row">
        <div className="order-details-dates">
          <div>
            <strong>Order date: </strong>
            {mockOrderList[0].orderDate}
          </div>
          <div>
            <strong>Shipped date: </strong>
            {mockOrderList[0].shippedDate ? mockOrderList[0].shippedDate : "-"}
          </div>
        </div>

        <div className="print-invoice-container">
          <button
            className="action-link"
            onClick={() => handlePrintInvoice(mockOrderList[0].id)}
          >
            Print invoice
          </button>
        </div>
      </div>

      <OrderTable orderData={mockOrderList[0]} mode="details" />

      {/* Shipping Details */}
      <div className="order-footer-info">
        <div className="shipping-address-section">
          <h3>Shipping Address</h3>
          <div>{mockOrderList[0].shippingAddress?.addressLine}</div>
          <div>{mockOrderList[0].shippingAddress?.unitNumber}</div>
          <div>{mockOrderList[0].shippingAddress?.country}</div>
          <div>{mockOrderList[0].shippingAddress?.zipCode}</div>
          <div>{mockOrderList[0].shippingAddress?.phoneNumber}</div>
        </div>

        <div className="shipping-info-section">
          <h3>Shipping</h3>
          <div className="shipping-info">
            <div className="shipping-info-labels">
              <div>Shipping Weight:</div>
              <div>Tracking Number:</div>
              <div>Shipping Date:</div>
            </div>
            <div className="shipping-info-values">
              <div>{mockOrderList[0].shippingWeight}</div>
              <div>{mockOrderList[0].trackingNumber}</div>
              <div>{mockOrderList[0].shippedDate}</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
