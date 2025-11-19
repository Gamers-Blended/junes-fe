import { useParams, Link } from "react-router-dom";
import OrderTable from "../components/OrderTable";
import { OrderTableMode } from "../utils/Enums";
import { mockOrderList } from "../mocks/data/orders";
import Footer from "../components/Footer";

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams();

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
          <Link
            to={`/invoice/${mockOrderList[0].id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-link"
          >
            Print invoice
          </Link>
        </div>
      </div>

      <OrderTable orderData={mockOrderList[0]} mode={OrderTableMode.DETAILS} />

      {/* Shipping Details */}
      <div className="order-info-container">
        <div className="order-info-left-column">
          <h3>Shipping Address</h3>
          <div>{mockOrderList[0].shippingAddress?.addressLine}</div>
          <div>{mockOrderList[0].shippingAddress?.unitNumber}</div>
          <div>{mockOrderList[0].shippingAddress?.country}</div>
          <div>{mockOrderList[0].shippingAddress?.zipCode}</div>
          <div>{mockOrderList[0].shippingAddress?.phoneNumber}</div>
        </div>

        <div className="order-info-right-column">
          <h3>Shipping</h3>
          <div className="order-info-sub-section">
            <div className="order-info-sub-section-labels">
              <div>Shipping Weight:</div>
              <div>Tracking Number:</div>
              <div>Shipping Date:</div>
            </div>
            <div className="order-info-sub-section-values">
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
