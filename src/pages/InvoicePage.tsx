import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import OrderTable from "../components/OrderTable";
import { OrderTableMode } from "../utils/Enums";
import { formatDateTimeWithHyphens } from "../utils/utils.ts";
import { useTransactionDetails } from "../utils/useTransactionDetails.ts";

interface InvoicePageProps {
  offlineMode?: boolean;
}

const InvoicePage: React.FC<InvoicePageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { orderNumber = "" } = useParams();

  useAuthRedirect(isLoggedIn);

  const { transactionDetails, isLoading, errorMessage } = useTransactionDetails(
    {
      orderNumber,
      offlineMode,
    },
  );

  return (
    <div className="invoice-page-container">
      <div className="invoice-header">
        <h1 className="company-name">JUNES</h1>
        <h2 className="invoice-title">Tax Invoice</h2>
      </div>

      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : isLoading ? (
        <div className="loading-message">
          <p>Loading order details...</p>
        </div>
      ) : (
        transactionDetails && (
          <>
            <div className="order-info-container">
              <div className="order-info-left-column">
                <h3 className="section-title">Customer Information</h3>
                <div>{transactionDetails?.shippingAddress?.addressLine}</div>
                <div>{transactionDetails?.shippingAddress?.unitNumber}</div>
                <div>{transactionDetails?.shippingAddress?.country}</div>
                <div>{transactionDetails?.shippingAddress?.zipCode}</div>
                <div>{transactionDetails?.shippingAddress?.phoneNumber}</div>
              </div>

              <div className="order-info-right-column">
                <div className="order-info-sub-section">
                  <div className="order-info-sub-section-labels bold">
                    <div>Order Number:</div>
                    <div>Order Date:</div>
                  </div>
                  <div className="order-info-sub-section-values">
                    <div>{transactionDetails?.orderNumber}</div>
                    <div>
                      {transactionDetails?.orderDate
                        ? formatDateTimeWithHyphens(
                            transactionDetails.orderDate,
                          )
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <OrderTable
              orderData={transactionDetails}
              mode={OrderTableMode.INVOICE}
            />
          </>
        )
      )}
    </div>
  );
};

export default InvoicePage;
