import { useParams } from "react-router-dom";
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
          <button className="action-link">Print invoice</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
