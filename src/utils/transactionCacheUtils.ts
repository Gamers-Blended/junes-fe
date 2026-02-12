import { TransactionHistoryResponse } from "../types/transaction";

// Cache structure for transaction history
interface TransactionCache {
  [key: string]: {
    data: TransactionHistoryResponse;
    timestamp: number;
  };
}

// SessionStorage key for transaction cache
const TRANSACTION_CACHE_KEY = "transaction_history_cache";

/**
 * Get cache from sessionStorage
 */
export const getTransactionCache = (): TransactionCache => {
  try {
    const cached = sessionStorage.getItem(TRANSACTION_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error("Error reading from sessionStorage:", error);
    return {};
  }
};

/**
 * Save cache to sessionStorage
 */
export const saveTransactionCache = (cache: TransactionCache): void => {
  try {
    sessionStorage.setItem(TRANSACTION_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error writing cache to sessionStorage:", error);
  }
};

/**
 * Clear all transaction cache from sessionStorage
 * Call this function when:
 * - User logs out
 * - User creates a new order
 * - User modifies an existing order
 * - User cancels an order
 */
export const clearTransactionCache = (): void => {
  sessionStorage.removeItem(TRANSACTION_CACHE_KEY);
  console.log("Transaction cache cleared from sessionStorage.");
};

/**
 * Get a specific cached transaction history by key
 */
export const getCachedTransactionHistory = (
  cacheKey: string,
): { data: TransactionHistoryResponse; timestamp: number } | null => {
  const cache = getTransactionCache();
  return cache[cacheKey] || null;
};

/**
 * Set a specific transaction history in cache
 */
export const setCachedTransactionHistory = (
  cacheKey: string,
  data: TransactionHistoryResponse,
): void => {
  const cache = getTransactionCache();
  cache[cacheKey] = {
    data,
    timestamp: Date.now(),
  };
  saveTransactionCache(cache);
};
