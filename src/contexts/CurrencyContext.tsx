'use client'
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface Currency {
  symbol: string;
  code: string;
  name: string;
}

interface CurrencyContextType {
  currency: Currency;
  isLoading: boolean;
  refreshCurrency: () => Promise<void>;
}

const defaultCurrency: Currency = {
  symbol: '$',
  code: 'USD',
  name: 'US Dollar'
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  isLoading: true,
  refreshCurrency: async () => {}
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrency = async () => {
    try {
      const response = await fetch('/api/currency', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch currency settings');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setCurrency({
          symbol: data.data.symbol,
          code: data.data.code,
          name: data.data.name
        });
      }
    } catch (error) {
      console.error('Error fetching currency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    // Initialize with currency from API
    fetch('/api/currency/init', { credentials: 'include' })
      .then(() => fetchCurrency())
      .catch(err => {
        console.error('Error initializing currency:', err);
        setIsLoading(false);
      });
  }, []);

  const refreshCurrency = async () => {
    setIsLoading(true);
    await fetchCurrency();
  };

  const value = {
    currency,
    isLoading,
    refreshCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
