import { Address } from "./address";
import { Item } from "../store/productSlice";

export interface OrderDetails {
  orderNumber: string;
  orderDate: string;
  shippedDate: string;
  totalAmount: number;
  transactionItemDTOList: Item[];
  shippingAddress: Address;
  shippingCost: number;
  shippingWeight: number;
  trackingNumber: string;
}
