/**
 * Format price for display. NPR (Nepali Rupees) shows as RS. xxx, else $xxx.xx
 */
export function formatPrice(price, currency = 'USD') {
  const num = Number(price);
  if (currency === 'NPR') return `RS.${num % 1 === 0 ? num : num.toFixed(2)}`;
  return `$${num.toFixed(2)}`;
}
