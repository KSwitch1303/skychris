import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency, prependCurrencySymbol, replaceCurrencySymbols } from '@/utils/currencyFormatter';

/**
 * Custom hook that provides currency formatting functions using the current app currency settings
 */
const useCurrencyFormatter = () => {
  const { currency } = useCurrency();
  
  /**
   * Format a number as currency using the current app currency settings
   */
  const format = (amount: number) => formatCurrency(amount, currency);
  
  /**
   * Prepend the current currency symbol to a number or string
   */
  const prepend = (value: number | string) => prependCurrencySymbol(value, currency.symbol);
  
  /**
   * Replace all $ symbols in a string with the current currency symbol
   */
  const replace = (text: string) => replaceCurrencySymbols(text, currency.symbol);
  
  return {
    format,
    prepend,
    replace,
    symbol: currency.symbol,
    code: currency.code,
    name: currency.name
  };
};

export default useCurrencyFormatter;
