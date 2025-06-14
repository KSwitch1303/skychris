import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency as formatCurrencyUtil } from '@/utils/currencyFormatter';
import { Box, Typography, TypographyProps } from '@mui/material';

interface CurrencyDisplayProps {
  amount: number;
  variant?: TypographyProps['variant'];
  color?: TypographyProps['color'];
  fontWeight?: TypographyProps['fontWeight'];
  fontSize?: TypographyProps['fontSize'];
  sx?: TypographyProps['sx'];
  showPositiveSign?: boolean;
  showSymbol?: boolean;
}

/**
 * A component that displays currency values consistently
 * with the application's currency settings
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  variant = 'body1',
  color,
  fontWeight,
  fontSize,
  sx,
  showPositiveSign = false,
  showSymbol = true
}) => {
  const { currency } = useCurrency();
  
  const formattedAmount = formatCurrencyUtil(amount, currency);
  
  // Add a + sign for positive amounts if requested
  const displayValue = showPositiveSign && amount > 0 
    ? `+${formattedAmount}` 
    : formattedAmount;
  
  // Optionally hide the symbol (useful for tables with currency symbol in header)
  const valueWithoutSymbol = displayValue.replace(currency.symbol, '');
  const finalValue = showSymbol ? displayValue : valueWithoutSymbol;
    
  return (
    <Typography
      variant={variant}
      color={color}
      fontWeight={fontWeight}
      fontSize={fontSize}
      sx={sx}
    >
      {finalValue}
    </Typography>
  );
};

/**
 * A component that shows a positive amount in green and a negative amount in red
 */
export const ColoredCurrencyDisplay: React.FC<CurrencyDisplayProps> = (props) => {
  const color = props.amount >= 0 ? 'success.main' : 'error.main';
  
  return (
    <CurrencyDisplay
      {...props}
      color={props.color || color}
    />
  );
};

export default CurrencyDisplay;
