import { PaymentMethod } from "../../types/paymentMethod";
import { SavedInfoType, CardType } from "../../utils/Enums.tsx";

type SavedItem = PaymentMethod;

export const mockPaymentMethodList: SavedItem[] = [
  {
    id: "b21d89ac-e54b-449f-b3c3-d2760d49327b",
    type: SavedInfoType.PAYMENT,
    cardType: CardType.VISA,
    cardLastFour: "1111",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2028",
    billingAddressID: "53ccfe3e-9302-40a1-bca9-949813e72c1f",
    isDefault: true,
  },
  {
    id: "e2a46ce0-a1ff-46b5-a587-37dd714d050e",
    type: SavedInfoType.PAYMENT,
    cardType: CardType.VISA,
    cardLastFour: "1234",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2028",
    billingAddressID: "f3a932e8-5e2c-4626-9f75-8bc3aead5c36",
    isDefault: false,
  },
  {
    id: "effc5fc0-adea-49b9-a1bf-aa6e5effa2dd",
    type: SavedInfoType.PAYMENT,
    cardType: CardType.MASTERCARD,
    cardLastFour: "3333",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2028",
    billingAddressID: "b846e017-7f9f-4b90-adc4-d785638a4ff6",
    isDefault: false,
  },
  {
    id: "da1d8d55-d6f3-4724-9ea2-4b42f26407cc",
    type: SavedInfoType.PAYMENT,
    cardType: CardType.AMEX,
    cardLastFour: "4444",
    cardHolderName: "test card",
    expirationMonth: "08",
    expirationYear: "2098",
    billingAddressID: "",
    isDefault: false,
  },
];
