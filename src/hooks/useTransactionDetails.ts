import { REQUEST_MAPPING, apiClient } from "../utils/api";
import {
  getCachedTransactionDetails,
  setCachedTransactionDetails,
} from "../utils/cacheUtils";
import { mockOrderDetails } from "../mocks/data/orderDetails";
import { OrderDetails } from "../types/orderDetails";

export const fetchTransactionDetailsApi = async (
  orderNumber: string | undefined,
  offlineMode: boolean,
): Promise<OrderDetails> => {
  if (offlineMode) {
    console.log("Offline mode: Skipping get Transaction Details API call");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockOrderDetails;
  }

  const cacheKey = `transactionDetails_${orderNumber}`;

  const cachedData = getCachedTransactionDetails(cacheKey);
  if (cachedData) {
    console.log("Using cached transaction details for key:", cacheKey);
    return cachedData.data;
  }

  console.log("Fetching transaction details from API");

  const response = await apiClient.get<OrderDetails>(
    `${REQUEST_MAPPING}/transaction/${orderNumber}/details`,
  );

  // Store response in cache
  setCachedTransactionDetails(cacheKey, response.data);
  console.log("Transaction details cached with key:", cacheKey);

  return response.data;
};
