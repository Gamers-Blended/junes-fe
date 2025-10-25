export interface PaymentMethod {
  id: string;
  type: "payment";
  cardType: string;
  cardLastFour: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  billingAddressId: string;
  isDefault: boolean;
}