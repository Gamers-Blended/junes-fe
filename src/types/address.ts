export interface Address {
  id: string;
  type: "address";
  name: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}