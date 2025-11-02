export enum Platform {
  PS4 = "ps4",
  PS5 = "ps5",
  NSW = "nsw",
  NSW2 = "nsw2",
  XBOX = "xbox",
  PC = "pc",
}

export enum StockStatus {
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out of Stock",
  PRE_ORDER = "Pre-order",
}

export enum SavedInfoType {
  ADDRESS = "address",
  PAYMENT = "payment",
}

export enum SavedInfoAction {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
}

export enum AddressFormField {
  COUNTRY = "country",
  FULL_NAME = "fullName",
  PHONE_NUMBER = "phoneNumber",
  ZIP_CODE = "zipCode",
  ADDRESS_LINE = "addressLine",
  UNIT_NUMBER = "unitNumber",
}

export enum PaymentFormField {
  CARD_NUMBER = "cardNumber",
  CARD_HOLDER_NAME = "cardHolderName",
  EXPIRATION_MONTH = "expirationMonth",
  EXPIRATION_YEAR = "expirationYear",
}
