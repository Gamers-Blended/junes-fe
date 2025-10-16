import { Address } from "../types/address";

export interface NavigationState {
  from: string;
  email?: string;
  fieldToChange?: "email" | "password" | "address" | "payment";
  action?: "add" | "edit";
  item?: Address;
}