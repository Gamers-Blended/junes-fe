import { TransactionHistoryResponse } from "../types/transaction";

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
  USER_DETAILS: "userDetailsCache",
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

export { CACHE_KEYS };
