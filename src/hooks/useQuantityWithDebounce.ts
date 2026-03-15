import { useRef, useEffect } from "react";
import { apiClient, REQUEST_MAPPING } from "../utils/api";

export const useQuantityWithDebounce = (
  itemId: string,
  initialQuantity: number,
  delay = 800,
) => {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousQuantity = useRef<number>(initialQuantity);

  const updateQuantityApi = async (newQuantity: number) => {
    try {
      await apiClient.put(
        `${REQUEST_MAPPING}/cart/${itemId}/quantity?quantity=${newQuantity}`,
      );
      previousQuantity.current = newQuantity;
    } catch (error) {
      console.error(`Failed to update quantity for item ${itemId}:`, error);
      // Return last good quantity so caller can revert to it
      return previousQuantity.current;
    }
  };

  const debouncedQuantityChange = (
    newQuantity: number,
    onRevert?: (quantity: number) => void,
  ) => {
    // Skip API call if quantity didn't change
    if (newQuantity === previousQuantity.current) {
      return;
    }

    // Clear existing timer if user is still changing quantity
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to call API after delay
    debounceTimer.current = setTimeout(async () => {
      const revertTo = await updateQuantityApi(newQuantity);
      if (revertTo !== undefined) {
        // Revert on failure
        onRevert?.(revertTo);
      }
    }, delay);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return { debouncedQuantityChange };
};
