const URL_PREFIX = "https://pub-6e933b871f074c2c83657430de8cf735.r2.dev/";

// Formatting strings or numbers
export const formatPlatformName = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'ps4':
      return 'PS4';
    case 'ps5':
      return 'PS5';
    case 'nsw':
      return 'Switch'
    case 'nsw2':
      return 'Switch 2'
    case 'xbox':
      return 'Xbox'
    case 'pc':
      return 'PC'
    default:
      return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
};

export const formatRegionName = (region: string) => {
  switch (region.toLowerCase()) {
    case 'asia':
      return 'Asia';
    case 'us':
      return 'United States';
    case 'eur':
      return 'Europe';
    default:
      return region.charAt(0).toUpperCase() + region.slice(1);
  }
};

export const formatEditionName = (edition: string) => {
  switch (edition.toLowerCase()) {
    case 'std':
      return 'Standard';
    case 'ce':
      return 'Collector\'s';
    default:
      return edition.charAt(0).toUpperCase() + edition.slice(1);
  }
};

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