import { SavedInfoType, CardType } from "../utils/Enums.tsx";

export interface PaymentMethod {
  id: string;
  type: SavedInfoType.PAYMENT;
  cardType: CardType;
  cardLastFour: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  billingAddressId: string;
  isDefault: boolean;
}