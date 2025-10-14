import { useParams } from "react-router-dom";

const InvoicePage: React.FC = () => {
  const { orderId } = useParams();

  return (
    <div className="invoice-page-container">
      <h1>Invoice #{orderId}</h1>
    </div>
  );
};

export default InvoicePage;
