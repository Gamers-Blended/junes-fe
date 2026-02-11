import { Address } from "./address";
import { Item } from "../store/productSlice";

export interface Order {
  orderNumber: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  transactionItemDTOList: Item[];
  shippingCost?: number;
  shippedDate?: string;
  shippingAddress?: Address;
  shippingWeight?: number;
  trackingNumber?: string;
}
