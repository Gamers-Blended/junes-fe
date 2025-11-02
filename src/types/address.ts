import { SavedInfoType } from "../utils/Enums.tsx";

export interface Address {
  id: string;
  type: SavedInfoType.ADDRESS;
  fullName: string;
  addressLine: string;
  unitNumber?: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}