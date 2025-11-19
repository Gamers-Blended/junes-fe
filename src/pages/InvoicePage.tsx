import { useParams } from "react-router-dom";
import { mockOrderList } from "../mocks/data/orders";

const InvoicePage: React.FC = () => {
  const { orderId } = useParams();

  return (
    <div className="invoice-page-container">
      <div className="invoice-header">
        <h1 className="company-name">JUNES</h1>
        <h2 className="invoice-title">Tax Invoice</h2>
      </div>

      <div className="order-info-container">
        <div className="order-info-left-column">
          <h3 className="section-title">Customer Information</h3>
          <div>{mockOrderList[0].shippingAddress?.addressLine}</div>
          <div>{mockOrderList[0].shippingAddress?.unitNumber}</div>
          <div>{mockOrderList[0].shippingAddress?.country}</div>
          <div>{mockOrderList[0].shippingAddress?.zipCode}</div>
          <div>{mockOrderList[0].shippingAddress?.phoneNumber}</div>
        </div>

        <div className="order-info-right-column">
          <div className="order-info-sub-section">
            <div className="order-info-sub-section-labels bold">
              <div>Order Number:</div>
              <div>Order Date:</div>
            </div>
            <div className="order-info-sub-section-values">
              <div>{mockOrderList[0].id}</div>
              <div>{mockOrderList[0].orderDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
