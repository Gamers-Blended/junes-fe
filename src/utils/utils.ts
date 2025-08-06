const URL_PREFIX = "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/";

export const formatPrice = (price: string | number): string => {
  // Convert to number first if price is a string
  const numberPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Handle cases where the conversion might fail
  if (isNaN(numberPrice)) {
    console.error('Invalid price value:', price);
    return '0.00';
  }
  
  return numberPrice.toFixed(2);
};

// Handles both arrays and single strings
export function appendUrlPrefix(input: string[]): string[];
export function appendUrlPrefix(input: string): string;
export function appendUrlPrefix(input: string | string[]): string | string[] {
  
  if (Array.isArray(input)) {
    return input.map(item => item ? `${URL_PREFIX}${item}` : "");
  }
  return input ? `${URL_PREFIX}${input}` : "";
};