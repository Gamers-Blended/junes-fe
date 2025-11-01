export interface Address {
  id: string;
  type: "address";
  fullName: string;
  addressLine: string;
  unitNumber?: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}