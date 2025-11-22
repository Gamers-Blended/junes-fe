import { Item } from "../store/productSlice";

export interface CartItem {
  userId: number;
  item: Item;
}
