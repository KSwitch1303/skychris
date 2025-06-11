"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  InputAdornment,
  CircularProgress,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import {
  FiUser,
  FiDollarSign,
  FiSend,
  FiBriefcase,
  FiPhone,
  FiCreditCard,
} from 'react-icons/fi';

// Tab Panel Component
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
      id={`transfer-tabpanel-${index}`}
      aria-labelledby={`transfer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function TransfersPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Transfer to Bank form fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [filteredBanks, setFilteredBanks] = useState<string[]>([]);

  // Transfer to Swift Mint Flow form fields
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [swiftMintFlowAmount, setSwiftMintFlowAmount] = useState('');
  const [swiftMintFlowNarration, setSwiftMintFlowNarration] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBankTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is a UI demo, so we'll just simulate a successful transfer
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleSwiftMintFlowTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is a UI demo, so we'll just simulate a successful transfer
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSwiftMintFlowAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setSwiftMintFlowAmount(value);
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setAccountNumber(value.slice(0, 10));
    }
  };

  const handleRecipientAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setRecipientAccountNumber(value.slice(0, 10));
    }
  };
  
  // List of Israeli banks
  const israeliBanks = [
    "Bank Hapoalim",
    "Bank Leumi",
    "Israel Discount Bank",
    "Mercantile Discount Bank",
    "First International Bank of Israel",
    "Bank Massad",
    "Jerusalem Bank",
    "Bank of Israel",
    "Bank of Jerusalem",
    "Bank Otsar Ha-Hayal",
    "Bank Poaley Agudat Israel",
    "Bank Yahav",
    "Mizrahi Tefahot Bank",
    "Poalim Capital Market Investment Bank",
    "Postal Bank of Israel Post",
    "UBank",
    "Union Bank of Israel",
    "Yashir Leumi"
  ];
  
  // Initialize and filter banks based on search input
  useEffect(() => {
    if (bankSearch.trim() === "") {
      setFilteredBanks(israeliBanks);
    } else {
      const filtered = israeliBanks.filter(bank => 
        bank.toLowerCase().includes(bankSearch.toLowerCase())
      );
      setFilteredBanks(filtered);
    }
  }, [bankSearch]);
  
  // Initialize banks list when component loads
  useEffect(() => {
    setFilteredBanks(israeliBanks);
  }, []);

  // Quick amount buttons
  const quickAmounts = [5000, 10000, 20000, 50000];

  // Recent beneficiaries mock data
  const recentBeneficiaries = [
    { id: 1, name: 'John Doe', accountNumber: '1234567890', bank: 'GTBank', avatar: '' },
    { id: 2, name: 'Sarah Williams', accountNumber: '2345678901', bank: 'Swift Mint Flow', avatar: '' },
    { id: 3, name: 'Michael Chen', accountNumber: '3456789012', bank: 'First Bank', avatar: '' },
    { id: 4, name: 'Amara Okafor', accountNumber: '4567890123', bank: 'Access Bank', avatar: '' },
  ];

  // Transaction history mock data
  const recentTransactions = [
    { id: 1, name: 'John Doe', type: 'sent', amount: 25000, date: '2025-06-08' },
    { id: 2, name: 'Sarah Williams', type: 'sent', amount: 50000, date: '2025-06-05' },
    { id: 3, name: 'Michael Chen', type: 'received', amount: 15000, date: '2025-06-01' },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ 
        mb: { xs: 3, md: 4 }, 
        fontWeight: 600,
        fontSize: { xs: '1.75rem', md: '2.125rem' }
      }}>
        Transfers
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left column - Transfer form */}
        <Box sx={{ flex: '1 1 60%' }}>
          <Card sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: '100%',
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleChange} 
                variant="fullWidth" 
                aria-label="transfer tabs"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '0.925rem' },
                    fontWeight: 500,
                    minHeight: { xs: 48, sm: 56 },
                  }
                }}
              >
                <Tab 
                  label="Other Banks" 
                  icon={<FiBriefcase />} 
                  iconPosition="start" 
                />
                <Tab 
                  label="Swift Mint Flow" 
                  icon={<FiSend />} 
                  iconPosition="start" 
                />
              </Tabs>
            </Box>

            {/* Transfer to Other Banks */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleBankTransfer} sx={{ px: { xs: 1, sm: 2 } }}>
                <TextField
                  fullWidth
                  label="Search Banks"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Type to search banks"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiCreditCard />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Select Bank"
                  select
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiCreditCard />
                      </InputAdornment>
                    ),
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  
                  {filteredBanks.map((bank, index) => (
                    <option key={index} value={bank.toLowerCase().replace(/\s+/g, '')}>
                      {bank}
                    </option>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Account Number"
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="Enter 10-digit account number"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUser />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Account Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Account name will appear here"
                  margin="normal"
                  disabled={!accountNumber || accountNumber.length < 10}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUser />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Amount ($)"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  type="text"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiDollarSign />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Quick Amount Buttons */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 2 }}>
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outlined"
                      size="small"
                      onClick={() => setAmount(quickAmount.toString())}
                      sx={{
                        borderRadius: 1,
                        color: theme.palette.grey[400],
                        borderColor: theme.palette.grey[700],
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                        }
                      }}
                    >
                      ${quickAmount.toLocaleString()}
                    </Button>
                  ))}
                </Box>

                <TextField
                  fullWidth
                  label="Narration"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="What's this transfer for? (optional)"
                  margin="normal"
                  multiline
                  rows={2}
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || !bankName || !accountNumber || !accountName || !amount || parseFloat(amount) <= 0}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 1.5,
                    py: 1.5,
                  }}
                >
                  {loading ? 'Processing...' : 'Transfer to Bank'}
                </Button>
              </Box>
            </TabPanel>

            {/* Transfer to Swift Mint Flow */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleSwiftMintFlowTransfer} sx={{ px: { xs: 1, sm: 2 } }}>
                <TextField
                  fullWidth
                  label="Swift Mint Flow Account Number"
                  value={recipientAccountNumber}
                  onChange={handleRecipientAccountNumberChange}
                  placeholder="Enter 10-digit account number"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUser />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Recipient Name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient name will appear here"
                  margin="normal"
                  disabled={!recipientAccountNumber || recipientAccountNumber.length < 10}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUser />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Amount ($)"
                  value={swiftMintFlowAmount}
                  onChange={handleSwiftMintFlowAmountChange}
                  placeholder="Enter amount"
                  type="text"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiDollarSign />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Quick Amount Buttons */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 2 }}>
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outlined"
                      size="small"
                      onClick={() => setSwiftMintFlowAmount(quickAmount.toString())}
                      sx={{
                        borderRadius: 1,
                        color: theme.palette.grey[400],
                        borderColor: theme.palette.grey[700],
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                        }
                      }}
                    >
                      ${quickAmount.toLocaleString()}
                    </Button>
                  ))}
                </Box>

                <TextField
                  fullWidth
                  label="Narration"
                  value={swiftMintFlowNarration}
                  onChange={(e) => setSwiftMintFlowNarration(e.target.value)}
                  placeholder="What's this transfer for? (optional)"
                  margin="normal"
                  multiline
                  rows={2}
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || !recipientAccountNumber || !recipientName || !swiftMintFlowAmount || parseFloat(swiftMintFlowAmount) <= 0}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 1.5,
                    py: 1.5,
                  }}
                >
                  {loading ? 'Processing...' : 'Transfer to Swift Mint Flow Account'}
                </Button>
              </Box>
            </TabPanel>
          </Card>
        </Box>
        {/* Right column - Recent beneficiaries & information */}
        <Box sx={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Recent Beneficiaries */}
          <Card sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Beneficiaries
              </Typography>

              {/* {recentBeneficiaries.map((beneficiary) => (
                <Box 
                  key={beneficiary.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'rgba(255,255,255,0.05)',
                    '&:last-child': {
                      borderBottom: 0
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {beneficiary.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {beneficiary.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {beneficiary.bank} • {beneficiary.accountNumber.substring(0, 6)}****
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderRadius: 1.5,
                      minWidth: 80,
                      borderColor: theme.palette.grey[700],
                      color: theme.palette.grey[300],
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                      }
                    }}
                  >
                    Send
                  </Button>
                </Box>
              ))} */}
              
              <Button 
                fullWidth 
                variant="text" 
                sx={{ 
                  mt: 2, 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(46, 204, 113, 0.05)'
                  }
                }}
              >
                View All Beneficiaries
              </Button>
            </CardContent>
          </Card>

          {/* Transfer Information */}
          <Card sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Transfer Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(46, 204, 113, 0.1)'
                  }}>
                    <FiDollarSign size={18} color={theme.palette.primary.main} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      No Transfer Fees
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All transfers between Swift Mint Flow accounts are completely free.
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(46, 204, 113, 0.1)'
                  }}>
                    <FiCreditCard size={18} color={theme.palette.primary.main} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Instant Transfers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Swift Mint Flow to Swift Mint Flow transfers are processed instantly.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(46, 204, 113, 0.1)'
                  }}>
                    <FiBriefcase size={18} color={theme.palette.primary.main} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Other banks: $5,000/day & $30,000/month
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transfers to other banks are completed within 1-2 hours during business days.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Success notification */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Transfer initiated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
