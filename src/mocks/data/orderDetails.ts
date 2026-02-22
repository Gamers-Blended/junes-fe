import { OrderDetails } from "../../types/orderDetails";
import { SavedInfoType } from "../../utils/Enums";

export const mockOrderDetails: OrderDetails = {
  orderNumber: "J123456789",
  orderDate: "2025-09-22T15:41:00",
  totalAmount: 150.75,
  transactionItemDTOList: [
    {
      productId: "65f8a12b3e5d827b94c8f2a1",
      name: "Atelier Marie Remake: The Alchemist of Salburg",
      slug: "atelier-marie-remake-the-alchemist-of-salburg",
      platform: "nsw",
      region: "asia",
      edition: "std",
      price: 49.99,
      productImageUrl: "nsw_asia_std_atelier_marie_remake.jpg",
      quantity: 1,
    },
    {
      productId: "681a55f2cb20535492b5e68e",
      name: "Ninja Gaiden: Master Collection",
      slug: "ninja-gaiden-master-collection",
      platform: "nsw",
      region: "asia",
      edition: "std",
      price: 39.99,
      productImageUrl: "nsw_asia_std_ninja_gaiden_master_collection.jpg",
      quantity: 2,
    },
  ],
  shippingCost: 10.1,
  shippedDate: "2025-09-25T10:00:00",
  shippingAddress: {
    id: "A1",
    type: SavedInfoType.ADDRESS,
    fullName: "John Doe",
    addressLine: "123 Main St, Metropolis, NY, 10001, USA",
    country: "USA",
    zipCode: "10001",
    phoneNumber: "123-456-7890",
    isDefault: true,
  },
  shippingWeight: 1.5,
  trackingNumber: "TRACK123456",
};
