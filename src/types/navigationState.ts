export interface NavigationState {
  from: string;
  email?: string;
  fieldToChange?: "email" | "password" | "address" | "payment";
}