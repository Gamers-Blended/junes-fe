import { Address } from "../../types/address";
import { SavedInfoType } from "../../utils/Enums.tsx";

type SavedItem = Address;

export const mockAddressList: SavedItem[] = [
  {
    id: "53ccfe3e-9302-40a1-bca9-949813e72c1f",
    type: SavedInfoType.ADDRESS,
    fullName: "Name1",
    addressLine: "Address Line 11",
    unitNumber: "Address Line 21",
    country: "Singapore",
    zipCode: "Zip Code1",
    phoneNumber: "Phone Number1",
    isDefault: true,
  },
  {
    id: "f3a932e8-5e2c-4626-9f75-8bc3aead5c36",
    type: SavedInfoType.ADDRESS,
    fullName: "Name2",
    addressLine: "Address Line 12",
    unitNumber: "Address Line 22",
    country: "United States",
    zipCode: "Zip Code2",
    phoneNumber: "Phone Number2",
    isDefault: false,
  },
  {
    id: "b846e017-7f9f-4b90-adc4-d785638a4ff6",
    type: SavedInfoType.ADDRESS,
    fullName: "Name",
    addressLine: "Address Line 1",
    unitNumber: "Address Line 2",
    country: "Japan",
    zipCode: "Zip Code",
    phoneNumber: "Phone Number",
    isDefault: false,
  },
  {
    id: "ccade9b9-bbde-48fc-b967-540d4c9a6aa8",
    type: SavedInfoType.ADDRESS,
    fullName: "Name",
    addressLine: "Address Line 1",
    unitNumber: "Address Line 2",
    country: "India",
    zipCode: "Zip Code",
    phoneNumber: "Phone Number",
    isDefault: false,
  },
  {
    id: "5924498e-fa9f-4759-a935-94e6fab3eada",
    type: SavedInfoType.ADDRESS,
    fullName: "Name",
    addressLine: "Address Line 1",
    unitNumber: "Address Line 2",
    country: "China",
    zipCode: "Zip Code",
    phoneNumber: "Phone Number",
    isDefault: false,
  },
];
