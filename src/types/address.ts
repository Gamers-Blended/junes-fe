export interface Address {
  id: string;
  type: "address";
  name: string;
  addressLine: string;
  unitNumber?: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}