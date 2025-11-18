import { Address } from "./address";
import { Item } from "../store/productSlice";

export interface Order {
  id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: Item[];
  shippingCost?: number;
  shippedDate?: string;
  shippingAddress?: Address;
  shippingWeight?: number;
  trackingNumber?: string;
}
