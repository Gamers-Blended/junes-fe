import { SavedInfoType } from "../utils/Enums.tsx";

export interface PaymentMethod {
  id: string;
  type: SavedInfoType.PAYMENT;
  cardType: string;
  cardLastFour: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  billingAddressId: string;
  isDefault: boolean;
}