import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import OrderTable from "../components/OrderTable";
import { OrderTableMode } from "../utils/Enums";
import { formatDateTimeWithHyphens } from "../utils/utils.ts";
import { useTransactionDetails } from "../utils/useTransactionDetails.ts";
import Footer from "../components/Footer";

interface OrderDetailsPageProps {
  offlineMode?: boolean;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { orderNumber } = useParams();

  useAuthRedirect(isLoggedIn);

  const { transactionDetails, isLoading, errorMessage } = useTransactionDetails(
    {
      orderNumber,
      offlineMode,
    },
  );

  return (
    <div className="order-details-page-container">
      <div className="order-header">
        <h1>ORDER #{orderNumber ?? ""}</h1>
      </div>

      <div className="order-details-row">
        <div className="order-details-dates">
          <div>
            <strong>Order date: </strong>
            {formatDateTimeWithHyphens(transactionDetails?.orderDate ?? "")}
          </div>
          <div>
            <strong>Shipped date: </strong>
            {transactionDetails?.shippedDate
              ? formatDateTimeWithHyphens(transactionDetails?.shippedDate ?? "")
              : "-"}
          </div>
        </div>

        <div className="print-invoice-container">
          <Link
            to={`/invoice/${transactionDetails?.orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-link"
          >
            Print invoice
          </Link>
        </div>
      </div>

      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : isLoading ? (
        <div className="loading-message">
          <p>Loading order details...</p>
        </div>
      ) : (
        transactionDetails && (
          <OrderTable
            orderData={transactionDetails}
            mode={OrderTableMode.DETAILS}
          />
        )
      )}

      {/* Shipping Details */}
      <div className="order-info-container">
        <div className="order-info-left-column">
          <h3>Shipping Address</h3>
          <div>{transactionDetails?.shippingAddress.addressLine}</div>
          <div>{transactionDetails?.shippingAddress?.unitNumber}</div>
          <div>{transactionDetails?.shippingAddress.country}</div>
          <div>{transactionDetails?.shippingAddress.zipCode}</div>
          <div>{transactionDetails?.shippingAddress.phoneNumber}</div>
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
              <div>{transactionDetails?.shippingWeight}</div>
              <div>{transactionDetails?.trackingNumber}</div>
              <div>
                {transactionDetails?.shippedDate
                  ? formatDateTimeWithHyphens(transactionDetails?.shippedDate)
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
