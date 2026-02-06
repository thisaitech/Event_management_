/**
 * Currency utility functions for converting and formatting prices
 */

// Exchange rate: 1 USD = 83 INR (approximate)
const USD_TO_INR_RATE = 83;

/**
 * Converts USD price to INR (Rupees)
 * @param priceInUSD - Price in USD
 * @returns Price in INR (rounded to nearest integer)
 */
export const convertToRupees = (priceInUSD: number | string | null | undefined): number => {
  if (!priceInUSD) return 0;
  const price = typeof priceInUSD === 'string' ? parseFloat(priceInUSD) : priceInUSD;
  if (isNaN(price)) return 0;
  return Math.round(price * USD_TO_INR_RATE);
};

/**
 * Formats price in Rupees with currency symbol
 * @param priceInUSD - Price in USD
 * @returns Formatted string like "₹8,300" or "N/A" if invalid
 */
export const formatPriceInRupees = (priceInUSD: number | string | null | undefined): string => {
  if (!priceInUSD) return 'N/A';
  const priceInINR = convertToRupees(priceInUSD);
  if (priceInINR === 0) return 'N/A';
  // Format with thousand separators
  return `₹${priceInINR.toLocaleString('en-IN')}`;
};

