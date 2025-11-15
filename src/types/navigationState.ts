import { Credentials } from "../utils/Enums.tsx";
import { Address } from "../types/address";
import { PaymentMethod } from "../types/paymentMethod";
import { SavedInfoType, SavedInfoAction } from "../utils/Enums.tsx";

export interface NavigationState {
  from: string; // Source page identifier
  email?: string; // User email (if applicable)
  fieldToChange?: Credentials.EMAIL | Credentials.PASSWORD | SavedInfoType.ADDRESS | SavedInfoType.PAYMENT; // Field being changed
  action?: SavedInfoAction.ADD | SavedInfoAction.EDIT; // Action type for saved info
  item?: Address | PaymentMethod; // Item being edited (if applicable)
  successMessage?: string; // Optional success message to display on the target page
}