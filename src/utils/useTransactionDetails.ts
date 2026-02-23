import { useState, useEffect } from "react";
import { fetchTransactionDetailsApi } from "../hooks/useTransactionDetails";
import { getApiErrorMessage } from "./api";
import { OrderDetails } from "../types/orderDetails.ts";

interface UseTransactionDetailsOptions {
  orderNumber: string | undefined;
  offlineMode: boolean;
  fetchOnMount?: boolean; // defaults to true
}

export const useTransactionDetails = ({
  orderNumber,
  offlineMode,
  fetchOnMount = true,
}: UseTransactionDetailsOptions) => {
  const [transactionDetails, setTransactionDetails] =
    useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchTransactionDetails = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetchTransactionDetailsApi(
        orderNumber,
        offlineMode,
      );
      setTransactionDetails(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          `Failed to fetch transaction details for ${orderNumber}. Please try again.`,
        ),
      );
      console.error("Error fetching transaction details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount && orderNumber) {
      fetchTransactionDetails();
    }
  }, [orderNumber]);

  return {
    transactionDetails,
    isLoading,
    errorMessage,
    refetch: fetchTransactionDetails,
  };
};
