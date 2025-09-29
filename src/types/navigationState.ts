export interface NavigationState {
  from: string;
  email?: string;
  credentialToChange?: "email" | "password";
}