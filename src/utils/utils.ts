import { StockStatus } from "../utils/Enums.tsx";
import { getData } from "country-list";

const URL_PREFIX = "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/";

// Functions for formatting strings or numbers
export const formatPlatformName = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "ps4":
      return "PS4";
    case "ps5":
      return "PS5";
    case "nsw":
      return "Switch";
    case "nsw2":
      return "Switch 2";
    case "xbox":
      return "Xbox";
    case "pc":
      return "PC";
    default:
      return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
};

export const formatFullPlatformName = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "ps4":
      return "PlayStation 4";
    case "ps5":
      return "PlayStation 5";
    case "nsw":
      return "Nintendo Switch";
    case "nsw2":
      return "Nintendo Switch 2";
    case "xbox":
      return "Xbox Series X/S";
    case "pc":
      return "PC";
    default:
      return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
};

export const formatRegionName = (region: string) => {
  switch (region.toLowerCase()) {
    case "asia":
      return "Asia";
    case "us":
      return "United States";
    case "eur":
      return "Europe";
    default:
      return region.charAt(0).toUpperCase() + region.slice(1);
  }
};

export const formatEditionName = (edition: string) => {
  switch (edition.toLowerCase()) {
    case "std":
      return "Standard";
    case "ce":
      return "Collector's";
    default:
      return edition.charAt(0).toUpperCase() + edition.slice(1);
  }
};

export const formatPrice = (price: string | number): string => {
  // Convert to number first if price is a string
  const numberPrice = typeof price === "string" ? parseFloat(price) : price;

  // Handle cases where the conversion might fail
  if (isNaN(numberPrice)) {
    console.error("Invalid price value:", price);
    return "0.00";
  }

  return numberPrice.toFixed(2);
};

export const formatStringGeneral = (string: string) => {
  if (!string) return "Not Available";

  const words = string.replace(/_/g, " ").split(" ");
  const capitalized = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalized.join(" ");
};

export const formatStringArrays = (strings: string[]) => {
  if (!strings || strings.length === 0) return "Not Available";

  return strings.map(formatStringGeneral).join(", ");
};

export const formatNumberArrays = (numbers: string[]) => {
  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return "Not Available";
  }

  return numbers.join(", ");
};

export const formatCardNumber = (cardNumber: string) => {
  return cardNumber
    .replace(/\D/g, "") // Remove non-digit
    .substring(0, 16) // Limit to 16 digits
    .replace(/(\d{4})/g, "$1 ") // Add space every 4 digits
    .trim(); // Remove trailing space
};

// Convert [yyy,mm,dd] date array to DD Month YYYY format
export const convertDate = (dateArray: number[]) => {
  if (!dateArray || dateArray.length === 0) return "Not Available";

  const day = dateArray[2];
  const month = dateArray[1];
  const year = dateArray[0];
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Append URL prefix to both arrays and single strings
export const appendUrlPrefix = (
  input: string | string[]
): string | string[] => {
  if (Array.isArray(input)) {
    return input.map((item) => (item ? `${URL_PREFIX}${item}` : ""));
  }
  return input ? `${URL_PREFIX}${input}` : "";
};

// Derive product status from releaseDate and stock
export const getStockStatus = (
  releaseDate: number[],
  stock: number
): string => {
  // Parse the release date
  const [year, month, day] = releaseDate;
  // Month is 0-indexed in JavaScript Date
  const releaseDateObj = new Date(year, month - 1, day);
  console.log("Release Date Object:", releaseDateObj, "stock:", stock);

  if (releaseDateObj > new Date()) {
    return StockStatus.PRE_ORDER;
  } else if (stock > 0) {
    return StockStatus.IN_STOCK;
  }
  return StockStatus.OUT_OF_STOCK;
};

// Currency formatter
export const formatCurrency = (currenySymbol: string): string => {
  switch (currenySymbol.toUpperCase()) {
    case "SGD":
      return "S$";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return currenySymbol;
  }
};

export const getCountryCode = (countryValue: string): string => {
  if (!countryValue) return "";

  const countries = getData();
  // Check if already code
  const byCode = countries.find(c => c.code === countryValue);
  if (byCode) return countryValue;

  // Else find by name
  const byName = countries.find(c => c.name === countryValue);
  return byName ? byName.code : countryValue;
}