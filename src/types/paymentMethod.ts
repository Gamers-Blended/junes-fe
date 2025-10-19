export interface PaymentMethod {
  id: string;
  type: "payment";
  cardType: string;
  cardLastFour: string;
  isDefault: boolean;
}