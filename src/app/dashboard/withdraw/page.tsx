'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { CurrencyDisplay, ColoredCurrencyDisplay } from '@/components/common/CurrencyDisplay';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Divider,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  FiDollarSign, 
  FiAlertCircle, 
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const steps = ['Enter Amount', 'Tax Code Verification', 'Confirmation'];

export default function WithdrawPage() {
  const theme = useTheme();
  const router = useRouter();
  const { currency } = useCurrency();
  const formatter = useCurrencyFormatter();
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [withdrawalId, setWithdrawalId] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Pre-fill tax code if available
        if (userData.taxCode) {
          setTaxCode(userData.taxCode);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount greater than zero.');
        return;
      }
      
      if (user && numAmount > user.balance) {
        setError('Insufficient funds in your account.');
        return;
      }

      setError('');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      // Validate tax code (simple validation for now)
      if (!taxCode.trim() || taxCode.length < 6) {
        setError('Please enter a valid tax code (minimum 6 characters).');
        return;
      }

      setError('');
      handleSubmitWithdrawal();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleSubmitWithdrawal = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          taxCode: taxCode,
        })
      });

      const data = await response.json();

      if (data.success) {
        setWithdrawalId(data.withdrawalId);
        setSuccess(true);
        setActiveStep(2);
        setSuccessDialogOpen(true);
      } else {
        setError(data.message || 'Failed to process withdrawal. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    // Optionally navigate to the transactions page to see the pending withdrawal
    router.push('/dashboard');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Enter Withdrawal Amount
            </Typography>
            <TextField
              fullWidth
              label={`Amount (${currency.symbol})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span>{currency.symbol}</span>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, mt: 1 }}
            />
            {user && (
              <Typography variant="body2" color="text.secondary">
                Available Balance: <CurrencyDisplay amount={user.balance || 0} />
              </Typography>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tax Code Verification
            </Typography>
            <Paper elevation={0} sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                For security purposes and to comply with financial regulations, please enter your Tax Identification Code to proceed with this withdrawal.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your tax code will be verified before the withdrawal can be processed.
              </Typography>
            </Paper>
            
            <TextField
              fullWidth
              label="Tax Code"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              placeholder="Enter your tax identification code"
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1.5,
              bgcolor: 'rgba(6, 214, 160, 0.05)',
              border: '1px solid rgba(6, 214, 160, 0.2)',
              borderRadius: 1
            }}>
              <FiAlertCircle size={20} color={theme.palette.primary.main} style={{ marginRight: '8px' }} />
              <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                Your withdrawal will be placed in pending status until tax verification is complete.
              </Typography>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Withdrawal Amount: {currency.symbol}{parseFloat(amount).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box sx={{ 
              width: 70, 
              height: 70, 
              borderRadius: '50%', 
              bgcolor: 'rgba(6, 214, 160, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <FiClock size={32} color={theme.palette.primary.main} />
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Withdrawal Request Submitted
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your withdrawal request for {currency.symbol}{parseFloat(amount).toFixed(2)} has been submitted and is now pending tax code verification.
            </Typography>
            
            {withdrawalId && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Reference ID: {withdrawalId}
              </Typography>
            )}
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 1,
              mt: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                You will be notified once your withdrawal has been processed. This typically takes 1-2 business days.
              </Typography>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
          Withdraw Funds
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Request a withdrawal from your account
        </Typography>
      </Box>
      
      <Card sx={{ 
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && activeStep < 2 && (
              <Button
                color="inherit"
                disabled={loading}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            )}
            
            {activeStep < 2 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                {activeStep === 1 ? 'Submit' : 'Next'}
                {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
              </Button>
            )}
            
            {activeStep === 2 && (
              <Button
                variant="contained"
                onClick={() => router.push('/dashboard')}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Return to Dashboard
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      
      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle>Withdrawal Request Submitted</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Your withdrawal request has been submitted successfully and is now pending tax code verification. You can track the status of your withdrawal in the transactions page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} autoFocus color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
