'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { FiSearch, FiFilter, FiPlus, FiMinus, FiDownload, FiClock, FiAlertCircle } from 'react-icons/fi';

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
      id={`transactions-tabpanel-${index}`}
      aria-labelledby={`transactions-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Transaction {
  id: string;
  reference: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  recipient?: string;
  category?: string;
}

export default function TransactionsPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Handle tab change
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Empty transactions array to be populated from API
  const mockTransactions: Transaction[] = [];

  // Initialize transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Check if we have a token in localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }
        
        // Fetch transactions from the API
        const response = await fetch('/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.transactions)) {
          // Map API data to our Transaction interface
          const formattedTransactions: Transaction[] = data.transactions.map((t: any) => ({
            id: t._id,
            reference: t.reference,
            type: t.type,
            amount: t.amount,
            description: t.description,
            status: t.status,
            date: new Date(t.createdAt).toISOString().split('T')[0],
            recipient: t.recipient?.name || t.recipient?.accountNumber || '-',
            category: t.category || 'General'
          }));
          
          setTransactions(formattedTransactions);
          setFilteredTransactions(formattedTransactions);
        } else {
          // If no transactions or error, set to empty array
          setTransactions([]);
          setFilteredTransactions([]);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setTransactions([]);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); 

  // Filter transactions based on search query and tab
  useEffect(() => {
    if (searchQuery) {
      const filtered = transactions.filter(
        transaction => 
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      // Filter based on tab selection
      if (tabValue === 0) {
        setFilteredTransactions(transactions); // All transactions
      } else if (tabValue === 1) {
        setFilteredTransactions(transactions.filter(t => t.type === 'credit')); // Income
      } else if (tabValue === 2) {
        setFilteredTransactions(transactions.filter(t => t.type === 'debit')); // Expenses
      } else if (tabValue === 3) {
        setFilteredTransactions(transactions.filter(t => t.status === 'pending')); // Pending
      }
    }
  }, [searchQuery, transactions, tabValue]);

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bgcolor: 'success.main',
          color: 'white',
        };
      case 'pending':
        return {
          bgcolor: 'warning.main',
          color: 'white',
        };
      case 'failed':
        return {
          bgcolor: 'error.main',
          color: 'white',
        };
      default:
        return {
          bgcolor: 'text.disabled',
          color: 'white',
        };
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ 
        mb: { xs: 3, md: 4 },
        fontWeight: 600,
        fontSize: { xs: '1.75rem', md: '2.125rem' }
      }}>
        Transactions
      </Typography>

      {/* Transaction summary cards */}
      <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        <Paper sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Total Income
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
              <CircularProgress size={20} sx={{ color: '#06D6A0' }} />
            </Box>
          ) : (
            <Typography variant="h5" sx={{ color: '#06D6A0', fontWeight: 600 }}>
              ${transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ color: '#06D6A0', display: 'flex', alignItems: 'center', mr: 0.5 }}>
              <FiPlus size={14} />
            </Box>
            {transactions.filter(t => t.type === 'credit').length} transactions
          </Typography>
        </Paper>

        <Paper sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Total Expenses
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
              <CircularProgress size={20} sx={{ color: '#FF6B6B' }} />
            </Box>
          ) : (
            <Typography variant="h5" sx={{ color: '#FF6B6B', fontWeight: 600 }}>
              ${transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ color: '#FF6B6B', display: 'flex', alignItems: 'center', mr: 0.5 }}>
              <FiMinus size={14} />
            </Box>
            {transactions.filter(t => t.type === 'debit').length} transactions
          </Typography>
        </Paper>

        <Paper sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Pending
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
              <CircularProgress size={20} sx={{ color: theme.palette.warning.main }} />
            </Box>
          ) : (
            <Typography variant="h5" sx={{ color: theme.palette.warning.main, fontWeight: 600 }}>
              ${transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FiClock size={14} /> {transactions.filter(t => t.status === 'pending').length} pending
            </Box>
          </Typography>
        </Paper>

        <Paper sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Net Balance
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <Typography variant="h5" sx={{ 
              color: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0) - 
                    transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0) > 0 
                    ? '#06D6A0' : (transactions.length === 0 ? theme.palette.text.primary : '#FF6B6B'), 
              fontWeight: 600 
            }}>
              ${(
                transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0) - 
                transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)
              ).toLocaleString()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Last 30 days
          </Typography>
        </Paper>
      </Box>

      {/* Filters, search and actions */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between',
        gap: 2
      }}>
        <TextField
          placeholder="Search transactions"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ 
            flexGrow: 1,
            maxWidth: { sm: '400px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<FiFilter />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary
            }}
          >
            Filter
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FiDownload />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Transaction tabs */}
      <Paper sx={{ 
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <Tabs 
          value={tabValue}
          onChange={handleChange}
          aria-label="transaction tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minHeight: { xs: 48, sm: 56 },
              fontSize: '0.9rem',
            }
          }}
        >
          <Tab label={loading ? "All" : `All (${transactions.length})`} />
          <Tab label={loading ? "Income" : `Income (${transactions.filter(t => t.type === 'credit').length})`} />
          <Tab label={loading ? "Expenses" : `Expenses (${transactions.filter(t => t.type === 'debit').length})`} />
          <Tab label={loading ? "Pending" : `Pending (${transactions.filter(t => t.status === 'pending').length})`} />
        </Tabs>

        <Divider />

        <TabPanel value={tabValue} index={0}>
          <TransactionsTable />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TransactionsTable />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TransactionsTable />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <TransactionsTable />
        </TabPanel>
      </Paper>
    </Box>
  );

  function TransactionsTable() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#06D6A0' }} />
        </Box>
      );
    }
    
    if (transactions.length === 0) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, px: 2, textAlign: 'center' }}>
          <Box sx={{ p: 2, mb: 2, bgcolor: 'rgba(6, 214, 160, 0.1)', borderRadius: '50%' }}>
            <FiAlertCircle size={40} color="#06D6A0" />
          </Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            No Transactions Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
            Your transaction history will appear here when you make transfers, receive funds, or perform other financial activities.
          </Typography>
          <Button 
            variant="contained"
            href="/dashboard/transfers"
            sx={{ 
              textTransform: 'none', 
              borderRadius: 2,
              bgcolor: '#06D6A0',
              '&:hover': {
                bgcolor: 'rgba(6, 214, 160, 0.8)',
              }
            }}
          >
            Make a Transfer
          </Button>
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.background.default }}>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  sx={{
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell sx={{ color: theme.palette.primary.main }}>
                    {transaction.reference}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.recipient}</TableCell>
                  <TableCell>
                    {transaction.category && (
                      <Chip 
                        label={transaction.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          fontSize: '0.75rem'
                        }} 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} 
                      size="small" 
                      sx={{ 
                        ...getStatusColor(transaction.status),
                        fontSize: '0.75rem',
                        minWidth: '80px'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600, 
                    color: transaction.type === 'credit' ? '#06D6A0' : '#FF6B6B' 
                  }}>
                    {transaction.type === 'credit' ? '+' : '-'} ${transaction.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box sx={{ color: theme.palette.text.secondary }}>
                    {transactions.length === 0 ? 'No transactions found' : 'No matching transactions found'}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
