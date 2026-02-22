import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import OrderTable from "../components/OrderTable";
import { OrderTableMode } from "../utils/Enums";
import { formatDateTimeWithHyphens } from "../utils/utils.ts";
import { OrderDetails } from "../types/orderDetails.ts";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";
import {
  getCachedTransactionDetails,
  setCachedTransactionDetails,
} from "../utils/cacheUtils.ts";
import { mockOrderDetails } from "../mocks/data/orderDetails.ts";
import Footer from "../components/Footer";

interface OrderDetailsPageProps {
  offlineMode?: boolean;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { orderId } = useParams();
  const [transactionDetails, setTransactionDetails] = useState<OrderDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useAuthRedirect(isLoggedIn);

  const fetchTransactionDetails = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getTransactionDetails();

      setTransactionDetails(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          `Failed to fetch transaction details for ${orderId}. Please try again.`,
        ),
      );
      console.error("Error fetching transaction details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionDetails = async (): Promise<OrderDetails> => {
    if (offlineMode) {
      console.log("Offline mode: Skipping get Transaction Details API call");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockOrderDetails;
    }

    const cacheKey = `transactionDetails_${orderId}`;

    // Check if data exists in cache
    const cachedData = getCachedTransactionDetails(cacheKey);
    if (cachedData) {
      console.log("Using cached transaction details for key:", cacheKey);
      return cachedData.data;
    }

    console.log("Fetching transaction details from API");

    const response = await apiClient.get<OrderDetails>(
      `${REQUEST_MAPPING}/transaction/${orderId}/details`,
    );

    // Store response in cache
    setCachedTransactionDetails(cacheKey, response.data);
    console.log("Transaction details cached with key:", cacheKey);

    return response.data;
  };

  useEffect(() => {
    fetchTransactionDetails();
  }, []);

  return (
    <div className="order-details-page-container">
      <div className="order-header">
        <h1>ORDER #{orderId ?? ""}</h1>
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
