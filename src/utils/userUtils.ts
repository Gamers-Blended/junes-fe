import { UserDetails } from "../types/userDetails";
import { apiClient, REQUEST_MAPPING } from "./api";
import { getCachedUserDetails, setCachedUserDetails } from "./cacheUtils";

interface UserOptions {
  offlineMode?: boolean;
  mockData?: UserDetails;
}

export const getUserDetails = async (
  options: UserOptions = {},
): Promise<UserDetails> => {
  const { offlineMode, mockData } = options;

  if (offlineMode && mockData) {
    console.log("Offline mode: Skipping get User Details API call");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { email: mockData.email };
  }

  const cacheKey = "userDetails";
  const cachedData = getCachedUserDetails(cacheKey);

  if (cachedData) {
    console.log("Using cached user details for key:", cacheKey);
    return cachedData.data;
  }

  console.log("Fetching user details from API");
  const response = await apiClient.get<{ email: string }>(
    `${REQUEST_MAPPING}/user/details`,
  );

  setCachedUserDetails(cacheKey, response.data);
  console.log("User details cached with key:", cacheKey);

  return response.data;
};

/**
 * Wrapper for fetching user details with built-in error handling
 */
export const fetchUserDetails = async (
  options?: UserOptions,
): Promise<UserDetails> => {
  try {
    return await getUserDetails(options);
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw null;
  }
};
