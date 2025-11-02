import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import { SavedInfoType, SavedInfoAction } from "../utils/Enums.tsx";

export interface NavigationState {
  from: string;
  email?: string;
  fieldToChange?: "email" | "password" | SavedInfoType.ADDRESS | SavedInfoType.PAYMENT;
  action?: SavedInfoAction.ADD | SavedInfoAction.EDIT;
  item?: Address | PaymentMethod;
}