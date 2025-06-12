'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { 
  FiChevronRight,
  FiPhone,
  FiMonitor,
  FiWifi,
  FiZap,
  FiDroplet,
  FiHome,
  FiCreditCard,
  FiTv,
  FiCalendar
} from 'react-icons/fi';
import DashboardHeader from '../../../components/DashboardHeader';

const billCategories = [
  { id: 'mobile', name: 'Mobile Recharge', icon: <FiPhone size={20} /> },
  { id: 'internet', name: 'Internet', icon: <FiWifi size={20} /> },
  { id: 'electricity', name: 'Electricity', icon: <FiZap size={20} /> },
  { id: 'water', name: 'Water', icon: <FiDroplet size={20} /> },
  { id: 'dth', name: 'DTH/Cable TV', icon: <FiTv size={20} /> },
  { id: 'broadband', name: 'Broadband', icon: <FiMonitor size={20} /> },
  { id: 'gas', name: 'Gas', icon: <FiHome size={20} /> },
  { id: 'credit_card', name: 'Credit Card', icon: <FiCreditCard size={20} /> },
];

const providers = {
  mobile: ['AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'Metro PCS'],
  internet: ['Comcast', 'Spectrum', 'AT&T', 'Verizon Fios', 'CenturyLink'],
  electricity: ['PG&E', 'Southern California Edison', 'Duke Energy', 'Florida Power & Light'],
  water: ['Municipal Water Services', 'City Water Department', 'County Utilities'],
  dth: ['DirecTV', 'Dish Network', 'Spectrum TV', 'Xfinity', 'Sling'],
  broadband: ['Comcast', 'Spectrum', 'AT&T', 'Verizon Fios', 'CenturyLink'],
  gas: ['PG&E', 'Southern California Gas', 'Peoples Gas', 'National Grid'],
  credit_card: ['Visa', 'Mastercard', 'American Express', 'Discover', 'Capital One'],
};

const BillsPage = () => {
  const theme = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [recentPayments, setRecentPayments] = useState([
  ]);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedProvider('');
    setAccountNumber('');
    setAmount('');
    setError('');
  };
  
  const handleProviderChange = (event: SelectChangeEvent) => {
    setSelectedProvider(event.target.value as string);
  };
  
  const handlePayBill = () => {
    // Validate inputs
    if (!accountNumber) {
      setError('Please enter your account number');
      return;
    }
    
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
        setSelectedCategory('');
        setSelectedProvider('');
        setAccountNumber('');
        setAmount('');
      }, 3000);
    }, 1500);
  };
  
  return (
    <>
      <DashboardHeader title="Pay Bills" subtitle="Pay your bills quickly and securely" />
      
      <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
        {success ? (
          <Alert 
            severity="success" 
            sx={{ mb: 4, '& .MuiAlert-message': { fontSize: '1rem' } }}
          >
            Payment successful! Your bill payment has been processed.
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
        
        <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', md: '2fr 1fr'}, gap: 2 }}>
          <Box>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: theme.palette.background.paper,
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: { xs: '0 2px 10px rgba(0,0,0,0.08)', md: '0 4px 20px rgba(0,0,0,0.08)' },
                mx: { xs: -1, sm: 0 }
              }}
            >
              <Box sx={{ p: 3, pb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Select Bill Category
                </Typography>
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' },
                  gap: { xs: 1.5, sm: 2 }
                }}>
                  {billCategories.map(category => (
                    <Box key={category.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          bgcolor: selectedCategory === category.id 
                            ? theme.palette.primary.main
                            : theme.palette.background.default,
                          color: selectedCategory === category.id 
                            ? '#fff'
                            : 'text.primary',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: selectedCategory === category.id 
                              ? theme.palette.primary.main
                              : 'rgba(255,255,255,0.05)',
                          },
                          height: '100%',
                        }}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <CardContent sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: { xs: 1.25, sm: 2 },
                          height: '100%',
                          textAlign: 'center',
                          '&:last-child': { pb: { xs: 1.25, sm: 2 } }
                        }}>
                          <Box sx={{ mb: { xs: 0.5, sm: 1 } }}>
                            {category.icon}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {category.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              {selectedCategory && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Divider sx={{ mb: 3, mt: 1 }} />
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 2, md: 3 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Payment Details
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: { xs: 2, md: 3 }
                  }}>
                    <Box>
                      <FormControl fullWidth>
                        <InputLabel id="provider-label">Select Provider</InputLabel>
                        <Select
                          labelId="provider-label"
                          value={selectedProvider}
                          label="Select Provider"
                          onChange={handleProviderChange}
                        >
                          {providers[selectedCategory as keyof typeof providers].map(provider => (
                            <MenuItem key={provider} value={provider}>
                              {provider}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Box>
                      <TextField
                        fullWidth
                        label="Account Number / Customer ID"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter your account number"
                      />
                    </Box>
                    
                    <Box>
                      <TextField
                        fullWidth
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={handlePayBill}
                        disabled={!selectedProvider || !accountNumber || !amount || loading}
                        sx={{
                          py: 1.5,
                          mt: 2,
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          `Pay $${amount ? parseFloat(amount).toFixed(2) : '0.00'}`
                        )}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
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
              <Box sx={{ p: 3, pb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Payments
                </Typography>
                
                
              </Box>
              
              <Box sx={{ p: 3, pt: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Pay your bills on time and maintain a good credit score
                </Typography>
                
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  endIcon={<FiChevronRight />}
                  sx={{ mt: 1 }}
                >
                  View All Payments
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BillsPage;
