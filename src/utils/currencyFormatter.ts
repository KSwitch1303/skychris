/**
 * Utility function to format currency values with the current app currency settings
 */

type CurrencySettings = {
  symbol: string;
  code: string;
  name: string;
};

/**
 * Formats a number as currency using the provided currency settings
 * @param amount The amount to format
 * @param currency The currency settings to use for formatting
 * @returns Formatted currency string with the correct symbol
 */
export const formatCurrency = (amount: number, currency: CurrencySettings): string => {
  // Validate the currency code - fallback to USD if invalid
  const validCurrencyCode = isValidCurrencyCode(currency.code) ? currency.code : 'USD';
  
  try {
    // Format the number using the currency code
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrencyCode,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    })
    .format(amount)
    // Replace the auto-generated currency symbol with our custom one from settings
    .replace(/^[\p{Sc}\$\u20ac\u00a3\u00a5]/u, currency.symbol);
    
    return formatted;
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    console.warn(`Error formatting currency: ${error}`);
    return `${currency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

// Common valid currency codes
const VALID_CURRENCY_CODES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 
  'NGN', 'ZAR', 'BRL', 'MXN', 'KRW', 'SGD', 'NZD', 'HKD', 'SEK',
  'RUB', 'PHP', 'IDR', 'THB', 'MYR', 'TRY', 'AED', 'SAR', 'PLN'
];

// Check if the currency code is valid
const isValidCurrencyCode = (code: string): boolean => {
  // Must be exactly 3 uppercase letters
  if (typeof code !== 'string' || !/^[A-Z]{3}$/.test(code)) {
    return false;
  }
  
  // Check against our list of common codes
  return VALID_CURRENCY_CODES.includes(code);
};

/**
 * Simple function to prepend a currency symbol to a number or string
 * @param value The value to format (can be number or already formatted string)
 * @param symbol The currency symbol to prepend
 * @returns String with currency symbol
 */
export const prependCurrencySymbol = (value: number | string, symbol: string): string => {
  return `${symbol}${typeof value === 'number' ? value.toLocaleString() : value}`;
};

/**
 * Replace all dollar sign instances in a string with a different currency symbol
 * @param text The text to process
 * @param symbol The currency symbol to use instead of $
 * @returns Text with dollar signs replaced
 */
export const replaceCurrencySymbols = (text: string, symbol: string): string => {
  if (!text) return text;
  return text.replace(/\$/g, symbol);
};

export default {
  formatCurrency,
  prependCurrencySymbol,
  replaceCurrencySymbols
};
