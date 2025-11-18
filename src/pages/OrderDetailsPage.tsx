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

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
