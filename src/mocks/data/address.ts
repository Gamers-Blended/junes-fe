import { Address } from "../../types/address";
import { SavedInfoType } from "../../utils/Enums.tsx";

type SavedItem = Address;

export const mockAddressList: SavedItem[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
