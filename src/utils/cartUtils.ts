import { ProductInCartDTO } from "../types/productInCartDTO";

export const calculateSubtotal = (cartItems: ProductInCartDTO[]): number => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }

    return cartItems.reduce((total, cartItem) => {
      // If either value is missing, skip this item in total calculation
      if (cartItem.price == null || cartItem.quantity == null) {
        return total;
      }

      // Ensure price and quantity are valid
      const price = Number(cartItem.price) || 0;
      const quantity = Number(cartItem.quantity) || 0;

      return total + price * quantity;
    }, 0);
}