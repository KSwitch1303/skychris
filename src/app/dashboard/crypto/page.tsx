'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import { FiArrowDown, FiArrowUp, FiChevronRight, FiRefreshCw, FiDollarSign, FiPercent } from 'react-icons/fi';
import DashboardHeader from '../../../components/DashboardHeader';

// Define cryptocurrency options
const cryptocurrencies = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 67245.18 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3385.72 },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 1.25 },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 142.35 },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', price: 18.47 },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', price: 92.17 },
];

const BuyCryptoPage = () => {
  const theme = useTheme();
  
  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencies[0]);
  const [amount, setAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Calculate crypto amount based on dollar amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      const cryptoValue = parseFloat(value) / selectedCrypto.price;
      setCryptoAmount(cryptoValue.toFixed(8));
    } else {
      setCryptoAmount('0');
    }
  };
  
  // Handle crypto selection change
  const handleCryptoChange = (e: SelectChangeEvent) => {
    const cryptoId = e.target.value;
    const selected = cryptocurrencies.find(crypto => crypto.id === cryptoId);
    
    if (selected) {
      setSelectedCrypto(selected);
      
      // Recalculate amount
      if (amount && !isNaN(parseFloat(amount))) {
        const cryptoValue = parseFloat(amount) / selected.price;
        setCryptoAmount(cryptoValue.toFixed(8));
      }
    }
  };
  
  // Handle buy action
  const handleBuyCrypto = () => {
    // Validate input
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Show loading state
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        setCryptoAmount('0');
      }, 3000);
    }, 1500);
  };
  
  return (
    <>
      <DashboardHeader title="Buy Cryptocurrency" subtitle="Purchase digital assets with your SwiftMint balance" />
      
      <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
        {success ? (
          <Alert 
            severity="success" 
            sx={{ mb: 4, '& .MuiAlert-message': { fontSize: '1rem' } }}
          >
            Success! Your cryptocurrency purchase has been processed.
          </Alert>
        ) : null}
      
        {error ? (
          <Alert 
            severity="error" 
            sx={{ mb: 4, '& .MuiAlert-message': { fontSize: '1rem' } }}
          >
            {error}
          </Alert>
        ) : null}
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
          gap: { xs: 2, md: 4 }
        }}>
          <Box>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: theme.palette.background.paper,
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: { xs: 2, md: 4 }, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  Buy Cryptocurrency
                </Typography>
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 2, md: 3 }
                }}>
                  <Box>
                    <FormControl fullWidth sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      },
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        p: { xs: '12px 14px', md: '14px' }
                      }
                    }}>
                      <InputLabel id="crypto-select-label">Select Cryptocurrency</InputLabel>
                      <Select
                        labelId="crypto-select-label"
                        value={selectedCrypto.id}
                        label="Select Cryptocurrency"
                        onChange={handleCryptoChange}
                      >
                        {cryptocurrencies.map(crypto => (
                          <MenuItem key={crypto.id} value={crypto.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                              <Typography>{crypto.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {crypto.symbol}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box>
                    <TextField
                      fullWidth
                      label="Amount (USD)"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      type="number"
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '0.95rem', md: '1rem' },
                          p: { xs: '12px 14px', md: '16.5px 14px' }
                        }
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
    />
                  </Box>
                  
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      my: 1,
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,255,0,0.1)',
                        borderRadius: '50%',
                        p: 1,
                      }}>
                        <FiArrowDown size={24} color={theme.palette.primary.main} />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, md: 3 },
                        bgcolor: theme.palette.background.default,
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">You will receive:</Typography>
                        <Box>
                          <Typography variant="h5" sx={{ 
                            fontWeight: 700, 
                            color: theme.palette.primary.main, 
                            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                            lineHeight: 1.2
                          }}>
                            {cryptoAmount} {selectedCrypto.symbol}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Rate: 1 {selectedCrypto.symbol} = ${selectedCrypto.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                  
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2, 
                      mb: 1
                    }}>
                      <Typography variant="body2" color="textSecondary">
                        Network Fee:
                      </Typography>
                      <Typography variant="body2">
                        $1.99
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Typography variant="body2" color="textSecondary">
                        Total: ${amount ? (parseFloat(amount) + 1.99).toFixed(2) : '0.00'}
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={handleBuyCrypto}
                      disabled={!amount || parseFloat(amount) <= 0 || loading}
                      sx={{
                        py: { xs: 1.25, md: 1.5 },
                        mt: 2,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        `Buy ${selectedCrypto.symbol} Now`
                      )}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
          
          <Box>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: theme.palette.background.paper,
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                height: '100%',
              }}
            >
              <Box sx={{ p: { xs: 2, md: 3 }, pb: { xs: 1, md: 2 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 2, md: 3 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Market Prices
                </Typography>
                
                {cryptocurrencies.map((crypto, index) => (
                  <React.Fragment key={crypto.id}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {crypto.symbol}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          {crypto.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${crypto.price.toLocaleString()}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}>
                          {index % 2 === 0 ? (
                            <FiArrowUp size={14} color="green" />
                          ) : (
                            <FiArrowDown size={14} color="red" />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              ml: 0.5,
                              color: index % 2 === 0 ? 'success.main' : 'error.main'
                            }}
                          >
                            {index % 2 === 0 ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {index < cryptocurrencies.length - 1 && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
              </Box>
              
              <Box sx={{ p: { xs: 2, md: 3 }, pt: { xs: 1, md: 2 } }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Prices updated every 5 minutes. Last update: {new Date().toLocaleTimeString()}
                </Typography>
                
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<FiRefreshCw />}
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.9rem', md: '1rem' } 
                  }}
                >
                  Refresh Prices
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BuyCryptoPage;
