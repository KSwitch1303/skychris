'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Chip,
  Alert,
  Stack,
  useTheme,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { FiCopy, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export default function DepositPage() {
  const theme = useTheme();
  const { currency } = useCurrency();
  const { prepend } = useCurrencyFormatter();
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState(`DEP${Date.now().toString().substring(0, 10)}`);
  const [copySuccess, setCopySuccess] = useState(false);
  const [user, setUser] = useState({ 
    firstName: 'John',
    lastName: 'Doe',
    accountNumber: '2345678901',
    balance: 5280.50
  });
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const steps = ['Enter Amount', 'Bank Transfer Details', 'Complete Deposit'];
  
  useEffect(() => {
    // Here you would fetch the user data from API
    // For now, we're using static data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={500} mb={4}>
        Deposit Funds
      </Typography>
      
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" mb={3}>
              How much would you like to deposit?
            </Typography>
            
            <TextField
              fullWidth
              label={`Amount (${currency.symbol})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Enter deposit amount"
              sx={{ mb: 3 }}
              InputProps={{
                inputProps: { min: 0, step: "0.01" },
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
                disabled={!amount || parseFloat(amount) <= 0}
                endIcon={<FiArrowRight />}
              >
                Continue
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" mb={3}>
              Bank Transfer Details
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Make a transfer with your bank using the details below. Use the reference code provided so we can link the payment to your account.
            </Alert>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Bank Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  SwiftMint Bank
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Account Number
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" fontWeight={500}>
                    6789054321
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => handleCopyText('6789054321')} 
                    sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
                  >
                    <FiCopy size={16} />
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Account Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Reference Code
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" fontWeight={500}>
                    {reference}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => handleCopyText(reference)} 
                    sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
                  >
                    {copySuccess ? <FiCheckCircle size={16} color="green" /> : <FiCopy size={16} />}
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Amount to Transfer
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {prepend(parseFloat(amount).toFixed(2))}
                </Typography>
              </Grid>
            </Grid>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={500}>
                Important:
              </Typography>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Always use the reference code provided</li>
                <li>Deposits typically clear within 1-2 business days</li>
                <li>For wire transfers, additional bank fees may apply</li>
              </ul>
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                onClick={() => setActiveStep(0)}
                sx={{ color: theme.palette.text.secondary }}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
                endIcon={<FiArrowRight />}
              >
                I've Made the Transfer
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'rgba(6, 214, 160, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              mx: 'auto'
            }}>
              <FiCheckCircle size={40} color="#06D6A0" />
            </Box>
            
            <Typography variant="h5" fontWeight={600} mb={1}>
              Deposit Initiated
            </Typography>
            
            <Typography variant="body1" color="text.secondary" mb={4}>
              Your deposit request for {prepend(parseFloat(amount).toFixed(2))} has been registered. Your funds will appear in your account once the transfer is received and processed.
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ 
                bgcolor: 'background.default', 
                p: 2, 
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Reference Code
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {reference}
                </Typography>
              </Box>
              
              <Box sx={{ 
                bgcolor: 'background.default', 
                p: 2, 
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {prepend(parseFloat(amount).toFixed(2))}
                </Typography>
              </Box>
              
              <Box sx={{ 
                bgcolor: 'background.default', 
                p: 2, 
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label="Pending" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255, 204, 0, 0.1)', 
                    color: '#FFCC00', 
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }} 
                />
              </Box>
            </Stack>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => {
                  setActiveStep(0);
                  setAmount('');
                  setReference(`DEP${Date.now().toString().substring(0, 10)}`);
                }}
                sx={{ mr: 2 }}
              >
                Make Another Deposit
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
              >
                View Transactions
              </Button>
            </Box>
            
            <Alert severity="info" sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="body2">
                Need help? Contact our support team if your deposit doesn't appear within 2 business days.
              </Typography>
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
