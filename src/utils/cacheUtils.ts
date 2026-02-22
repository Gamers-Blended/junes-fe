import { TransactionHistoryResponse } from "../types/transaction";
import { OrderDetails } from "../types/orderDetails";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";

// Cache structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry<any>;
}

// SessionStorage keys for different caches
const CACHE_KEYS = {
  TRANSACTION_HISTORY: "transactionHistoryCache",
  TRANSACTION_DETAILS: "transactionDetailsCache",
  USER_DETAILS: "userDetailsCache",
  SAVED_ADDRESSES: "savedAddressesCache",
  SAVED_PAYMENT_METHODS: "savedPaymentMethodsCache",
} as const;

type CacheKeyType = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];

/**
 * Get cache from sessionStorage
 */
export const getCache = (cacheKey: CacheKeyType): Cache => {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error(
      `Error reading cache from sessionStorage (${cacheKey}):`,
      error,
    );
    return {};
  }
};

/**
 *
 * Save cache to sessionStorage
 */
export const saveCache = (cacheKey: CacheKeyType, cache: Cache): void => {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(cache));
  } catch (error) {
    console.error(`Error saving cache to sessionStorage (${cacheKey}):`, error);
  }
};

/**
 * Clear specific cache in sessionStorage
 */
export const clearCache = (cacheKey: CacheKeyType): void => {
  sessionStorage.removeItem(cacheKey);
  console.log(`Cache cleared for key: ${cacheKey}`);
};

/**
 * Clear all caches in sessionStorage
 * Only call when user logs out
 */
export const clearAllCaches = (): void => {
  Object.values(CACHE_KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
  });
  console.log("All caches cleared.");
};

/**
 * Get a specific cached item by key
 */
export const getCachedItem = <T>(
  cacheKey: CacheKeyType,
  itemKey: string,
): CacheEntry<T> | null => {
  const cache = getCache(cacheKey);
  return cache[itemKey] || null;
};

/**
 * Set a specific cached item by key
 */
export const setCachedItem = <T>(
  cacheKey: CacheKeyType,
  itemKey: string,
  data: T,
): void => {
  const cache = getCache(cacheKey);
  cache[itemKey] = { data, timestamp: Date.now() };
  saveCache(cacheKey, cache);
};

// ========== Transaction History specific functions ==========

/**
 * Clear transaction cache from sessionStorage
 * Calls this function when:
 * - User logs out
 * - User creates a new order
 * - User modifies an existing order
 * - User cancels an order
 */
export const clearTransactionCache = (): void => {
  clearCache(CACHE_KEYS.TRANSACTION_HISTORY);
};

/**
 * Get a specific cached transaction history by key
 */
export const getCachedTransactionHistory = (
  itemKey: string,
): CacheEntry<TransactionHistoryResponse> | null => {
  return getCachedItem<TransactionHistoryResponse>(
    CACHE_KEYS.TRANSACTION_HISTORY,
    itemKey,
  );
};

/**
 * Set a specific cached transaction history by key
 */
export const setCachedTransactionHistory = (
  itemKey: string,
  data: TransactionHistoryResponse,
): void => {
  setCachedItem<TransactionHistoryResponse>(
    CACHE_KEYS.TRANSACTION_HISTORY,
    itemKey,
    data,
  );
};

// ========== Transaction Details specific functions ==========

/**
 * Clear transaction cache from sessionStorage
 * Calls this function when:
 * - User logs out
 * - User modifies an existing order
 * - User cancels an order
 */
export const clearTransactionDetailsCache = (): void => {
  clearCache(CACHE_KEYS.TRANSACTION_DETAILS);
};

/**
 * Get a specific cached transaction details by key
 */
export const getCachedTransactionDetails = (
  itemKey: string,
): CacheEntry<OrderDetails> | null => {
  return getCachedItem<OrderDetails>(
    CACHE_KEYS.TRANSACTION_DETAILS,
    itemKey,
  );
};

/**
 * Set a specific cached transaction details by key
 */
export const setCachedTransactionDetails = (
  itemKey: string,
  data: OrderDetails,
): void => {
  setCachedItem<OrderDetails>(
    CACHE_KEYS.TRANSACTION_DETAILS,
    itemKey,
    data,
  );
};

// ========== User Details specific functions ==========

/**
 * Clear user details cache from sessionStorage
 * Calls this function when:
 * - User updates their profile information
 */
export const clearUserDetailsCache = (): void => {
  clearCache(CACHE_KEYS.USER_DETAILS);
};

/**
 * Get a specific cached user details by key
 */
export const getCachedUserDetails = (
  itemKey: string,
): CacheEntry<{ email: string }> | null => {
  return getCachedItem<{ email: string }>(CACHE_KEYS.USER_DETAILS, itemKey);
};

/**
 * Set a specific cached user details by key
 */
export const setCachedUserDetails = (
  itemKey: string,
  data: { email: string },
): void => {
  setCachedItem<{ email: string }>(CACHE_KEYS.USER_DETAILS, itemKey, data);
};

// ========== Saved Address specific functions ==========

/**
 * Clear saved addresses cache from sessionStorage
 * Calls this function when:
 * - User updates their saved addresses
 */
export const clearSavedAddressesCache = (): void => {
  clearCache(CACHE_KEYS.SAVED_ADDRESSES);
};

/**
 * Get a specific cached saved addresses by key
 */
export const getCachedSavedAddresses = (
  itemKey: string,
): CacheEntry<Address[]> | null => {
  return getCachedItem<Address[]>(CACHE_KEYS.SAVED_ADDRESSES, itemKey);
};

/**
 * Set a specific cached saved addresses by key
 */
export const setCachedSavedAddresses = (
  itemKey: string,
  data: Address[],
): void => {
  setCachedItem<Address[]>(CACHE_KEYS.SAVED_ADDRESSES, itemKey, data);
};

// ========== Saved Payment Method specific functions ==========

/**
 * Clear saved payment methods cache from sessionStorage
 * Calls this function when:
 * - User updates their saved payment methods
 */
export const clearSavedPaymentMethodsCache = (): void => {
  clearCache(CACHE_KEYS.SAVED_PAYMENT_METHODS);
};

/**
 * Get a specific cached saved payment methods by key
 */
export const getCachedSavedPaymentMethods = (
  itemKey: string,
): CacheEntry<PaymentMethod[]> | null => {
  return getCachedItem<PaymentMethod[]>(
    CACHE_KEYS.SAVED_PAYMENT_METHODS,
    itemKey,
  );
};

/**
 * Set a specific cached saved payment methods by key
 */
export const setCachedSavedPaymentMethods = (
  itemKey: string,
  data: PaymentMethod[],
): void => {
  setCachedItem<PaymentMethod[]>(
    CACHE_KEYS.SAVED_PAYMENT_METHODS,
    itemKey,
    data,
  );
};

export { CACHE_KEYS };
