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