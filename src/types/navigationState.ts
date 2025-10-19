import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";

export interface NavigationState {
  from: string;
  email?: string;
  fieldToChange?: "email" | "password" | "address" | "payment";
  action?: "add" | "edit";
  item?: Address | PaymentMethod;
}