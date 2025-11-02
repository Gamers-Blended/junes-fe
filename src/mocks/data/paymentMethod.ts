import { PaymentMethod } from "../../types/paymentMethod";
import { SavedInfoType } from "../../utils/Enums.tsx";

type SavedItem = PaymentMethod;

export const mockPaymentMethodList: SavedItem[] = [
  {
    id: "1",
    type: SavedInfoType.PAYMENT,
    cardType: "Visa",
    cardLastFour: "1111",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2028",
    billingAddressId: "123",
    isDefault: true,
  },
  {
    id: "2",
    type: SavedInfoType.PAYMENT,
    cardType: "Visa",
    cardLastFour: "1234",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2028",
    billingAddressId: "123",
    isDefault: false,
  },
  {
    id: "3",
    type: SavedInfoType.PAYMENT,
    cardType: "MasterCard",
    cardLastFour: "3333",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2028",
    billingAddressId: "123",
    isDefault: false,
  },
  {
    id: "4",
    type: SavedInfoType.PAYMENT,
    cardType: "MasterCard",
    cardLastFour: "4444",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2098",
    billingAddressId: "123",
    isDefault: false,
  },
];
