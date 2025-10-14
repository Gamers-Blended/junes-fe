import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams();

  return (
    <div className="order-details-page-container">
      <h1>ORDER #{orderId}</h1>
      <div className="order-details-dates"></div>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
