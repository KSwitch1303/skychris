'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { CurrencyDisplay, ColoredCurrencyDisplay } from '@/components/common/CurrencyDisplay';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Divider,
  useTheme,
  Tab,
  Tabs,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
// Using Box with flexbox instead of Grid for better TypeScript compatibility
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiChevronRight,
  FiCheck,
  FiLock,
  FiUser,
  FiCalendar
} from 'react-icons/fi';
import { FaPaypal, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`deposit-tabpanel-${index}`}
      aria-labelledby={`deposit-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Quick amount buttons - will be updated with currency symbol in component

export default function DepositsPage() {
  const theme = useTheme();
  const { currency } = useCurrency();
  const formatter = useCurrencyFormatter();
  
  // Quick amount buttons with dynamic currency symbol
  const quickAmounts = [
    { value: 50, label: `${currency.symbol}50` },
    { value: 100, label: `${currency.symbol}100` },
    { value: 200, label: `${currency.symbol}200` },
    { value: 500, label: `${currency.symbol}500` },
    { value: 1000, label: `${currency.symbol}1000` }
  ];
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [amount, setAmount] = useState<string>('100');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    // Format as xxxx xxxx xxxx xxxx
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted.slice(0, 19)); // Max 19 chars (16 digits + 3 spaces)
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    // Format as MM/YY
    if (value.length <= 2) {
      setExpiry(value);
    } else {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvc(value.slice(0, 4)); // Max 4 digits
  };

  const [saveCard, setSaveCard] = useState<boolean>(true);
  
  const handleDeposit = async () => {
    if (parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (tabValue === 0) { // Card payment
      if (!cardNumber || cardNumber.length < 19) {
        setError('Please enter a valid card number');
        return;
      }
      if (!cardName) {
        setError('Please enter the cardholder name');
        return;
      }
      if (!expiry || expiry.length < 5) {
        setError('Please enter a valid expiry date');
        return;
      }
      if (!cvc || cvc.length < 3) {
        setError('Please enter a valid CVC code');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You need to be logged in');
      }

      // First, save the card if the user opted to
      if (tabValue === 0 && saveCard) {
        try {
          const cardResponse = await fetch('/api/cards', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              cardNumber: cardNumber.replace(/\s+/g, ''),
              cardName: cardName,
              expiryDate: expiry,
              cvc: cvc,
              setDefault: true
            })
          });
          
          if (!cardResponse.ok) {
            console.warn('Failed to save card, but continuing with deposit');
          }
        } catch (cardError) {
          console.warn('Error saving card:', cardError);
          // Continue with deposit even if card saving fails
        }
      }

      // Call the deposit API endpoint
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod: tabValue === 0 ? 'card' : 'paypal',
          paymentDetails: tabValue === 0 ? {
            cardNumber: cardNumber.replace(/\s+/g, ''),
            cardName: cardName,
            expiry: expiry,
            // Note: In a real app, you'd handle CVC more securely
          } : {}
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process deposit');
      }
      
      // Show success message
      setSuccess(true);

      // Reset form
      if (tabValue === 0) {
        setCardNumber('');
        setCardName('');
        setExpiry('');
        setCvc('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format amount with dollar sign
  const formatCurrency = (amount: string): string => {
    return `$${parseFloat(amount || '0').toFixed(2)}`;
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 3,
        width: '100%'
      }}
    >
      {/* Page header */}
      <Typography variant="h5" fontWeight={600} mb={3}>
        Deposit Funds
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
        {/* Left column - deposit form */}
        <Box sx={{ width: { xs: '100%', md: '66.66%' }, px: 1.5, mb: { xs: 3, md: 0 } }}>
          <Card 
            sx={{ 
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'visible'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    py: 2,
                  },
                  '& .Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                }}
              >
                <Tab 
                  icon={<FiCreditCard />} 
                  iconPosition="start" 
                  label="Card" 
                  id="deposit-tab-0"
                  aria-controls="deposit-tabpanel-0"
                />
                <Tab 
                  icon={<FaPaypal />} 
                  iconPosition="start" 
                  label="PayPal" 
                  id="deposit-tab-1"
                  aria-controls="deposit-tabpanel-1" 
                />
              </Tabs>
            </Box>

            <Box p={3}>
              {/* Amount section (common to both tabs) */}
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Amount to Deposit
              </Typography>

              <TextField
                fullWidth
                value={amount}
                onChange={handleAmountChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span>{currency.symbol}</span>
                    </InputAdornment>
                  )
                }}
                placeholder="Enter amount"
                sx={{ mb: 2 }}
              />

              {/* Quick amount buttons */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  mb: 3 
                }}
              >
                {quickAmounts.map(option => (
                  <Button
                    key={option.value}
                    variant={amount === option.value.toString() ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleQuickAmountSelect(option.value)}
                    sx={{
                      borderRadius: 2,
                      bgcolor: amount === option.value.toString() ? theme.palette.primary.main : 'transparent',
                      borderColor: theme.palette.primary.main,
                      color: amount === option.value.toString() ? '#fff' : theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: amount === option.value.toString() ? theme.palette.primary.dark : 'rgba(6, 214, 160, 0.1)',
                      },
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <TabPanel value={tabValue} index={0}>
                {/* Credit/Debit Card Form */}
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Card Information
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <FaCcVisa size={24} color="#1A1F71" />
                    <FaCcMastercard size={24} color="#EB001B" />
                    <FaCcAmex size={24} color="#2E77BC" />
                  </Box>

                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    variant="outlined"
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FiCreditCard />
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    variant="outlined"
                    placeholder="John Doe"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FiUser />
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    <Box sx={{ width: '50%', px: 1 }}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        value={expiry}
                        onChange={handleExpiryChange}
                        variant="outlined"
                        placeholder="MM/YY"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FiCalendar />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    <Box sx={{ width: '50%', px: 1 }}>
                      <TextField
                        fullWidth
                        label="CVC"
                        value={cvc}
                        onChange={handleCvcChange}
                        variant="outlined"
                        placeholder="123"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FiLock />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                  </Box>
                  
                  {/* Save card checkbox */}
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSaveCard(!saveCard)}>
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 18, 
                          height: 18, 
                          border: '1px solid', 
                          borderColor: theme.palette.primary.main,
                          borderRadius: 0.5,
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: saveCard ? theme.palette.primary.main : 'transparent',
                        }}
                      >
                        {saveCard && <FiCheck size={14} color="#fff" />}
                      </Box>
                      Save this card for future payments
                    </Typography>
                  </Box> */}
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {/* PayPal Section */}
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <FaPaypal size={60} color="#00457C" />
                  <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                    Click the button below to deposit funds using your PayPal account.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You will be redirected to PayPal to complete the transaction.
                  </Typography>
                </Box>
              </TabPanel>

              {/* Error message */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Deposit button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || parseFloat(amount) <= 0}
                onClick={handleDeposit}
                endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiChevronRight />}
                sx={{
                  mt: 2,
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(255,255,255,0.12)',
                  }
                }}
              >
                {loading ? 'Processing...' : `Request Deposit of ${formatCurrency(amount)}`}
              </Button>

              {/* Secure transaction notice */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <FiLock size={14} />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  Secure transaction. Your financial information is encrypted.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Right column - information */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' }, px: 1.5 }}>
          <Card
            sx={{
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Deposit Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Account Number
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user?.accountNumber || '•••••••••••'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Bank Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user?.bankName || 'Swift Mint Flow'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Important Notes:
              </Typography>

              <Typography variant="body2" color="text.secondary" paragraph>
                • Deposits are pending approval (1-2 business days)
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Minimum deposit amount is {currency.symbol}10
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • No fees for depositing funds
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Pending deposits will appear in your transaction history
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Contact support for help with deposits
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Success notification */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          variant="filled"
          icon={<FiCheck />}
        >
          Deposit submitted successfully! Transaction is pending approval and will appear in your transaction history.
        </Alert>
      </Snackbar>
    </Box>
  );
}
