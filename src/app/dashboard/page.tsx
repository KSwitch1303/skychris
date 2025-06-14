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
  Grid, 
  Typography, 
  Divider,
  Paper,
  useTheme,
  CircularProgress,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiEye, 
  FiEyeOff,
  FiCreditCard,
  FiRefreshCw,
  FiPlus
} from 'react-icons/fi';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const theme = useTheme();
  const { currency } = useCurrency();
  const formatter = useCurrencyFormatter();
  const [user, setUser] = useState<any>(null);
  const [balanceHidden, setBalanceHidden] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<{
    labels: string[],
    data: number[]
  }>({ labels: [], data: [] });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        // Get the basic user data from localStorage first for immediate display
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }

        // Then fetch fresh user data from API
        const userResponse = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = await userResponse.json();
        
        if (userData.success && userData.user) {
          // Update state with fresh data from database
          setUser(userData.user);
          
          // Also update localStorage with the latest user data
          localStorage.setItem('user', JSON.stringify(userData.user));
        } else {
          console.error('Failed to fetch user data:', userData.message);
        }

        // Fetch transaction history and balance history
        const txnResponse = await fetch('/api/transactions?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const txnData = await txnResponse.json();
        
        if (txnData.success && txnData.data) {
          // Update transactions and balance history
          setTransactions(txnData.data.transactions || []);
          setBalanceHistory(txnData.data.balanceHistory || { labels: [], data: [] });
        } else {
          console.error('Failed to fetch transaction data:', txnData.message);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format currency using the current currency settings
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    })
    .format(amount)
    // Replace the auto-generated currency symbol with our custom one from settings
    .replace(/^[\p{Sc}\$€£¥]/u, currency.symbol);
  };

  // Chart data for balance history, using real data from API
  const balanceData = {
    labels: balanceHistory.labels.length > 0 ? balanceHistory.labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Account Balance',
        data: balanceHistory.data.length > 0 ? balanceHistory.data : [0, 0, 0, 0, 0, user?.balance || 0],
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(6, 214, 160, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  // Recent transaction sample data
  const recentTransactions = [
    { 
      id: 1, 
      type: 'credit', 
      amount: 5000, 
      sender: 'John Doe', 
      description: 'Money Transfer', 
      date: '2025-06-09' 
    },
    { 
      id: 2, 
      type: 'debit', 
      amount: 2500, 
      recipient: 'Netflix', 
      description: 'Subscription', 
      date: '2025-06-07' 
    },
    { 
      id: 3, 
      type: 'credit', 
      amount: 15000, 
      sender: 'ABC Company', 
      description: 'Salary Payment', 
      date: '2025-06-05' 
    },
    { 
      id: 4, 
      type: 'debit', 
      amount: 3000, 
      recipient: 'Jumia', 
      description: 'Online Purchase', 
      date: '2025-06-03' 
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
          Welcome back, {user?.firstName || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's a summary of your financial activities
        </Typography>
      </Box>

      {/* Account Balance Card */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
        <Box gridColumn={{ xs: 'span 12', md: 'span 6', lg: 'span 4' }}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              bgcolor: 'rgba(6, 214, 160, 0.05)', 
              transform: 'translate(30%, -30%)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              bgcolor: 'rgba(6, 214, 160, 0.03)', 
              transform: 'translate(-30%, 30%)'
            }} />
            
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Balance
                </Typography>
                <IconButton size="small" onClick={() => setBalanceVisible(!balanceVisible)} sx={{ p: 0.5 }}>
                  {balanceVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </IconButton>
              </Box>
              
              {balanceVisible ? (
                <ColoredCurrencyDisplay
                  amount={user?.balance || 0}
                  variant="h4"
                  fontWeight={700}
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ••••••••••
                </Typography>
              )}
              
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Account Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.accountNumber || '••••••••••'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Bank Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.bankName || 'Swift Mint Flow'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  component={Link}
                  href="/dashboard/withdraw"
                  startIcon={<FiArrowUpRight size={16} />}
                  sx={{
                    flex: 1,
                    fontSize: '0.8rem',
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Withdraw
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  href="/dashboard/deposits"
                  startIcon={<FiArrowDownLeft size={16} />}
                  sx={{
                    flex: 1,
                    fontSize: '0.8rem',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  Deposit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* Quick Access Card */}
        <Box gridColumn={{ xs: 'span 12', md: 'span 6', lg: 'span 4' }}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Quick Access
              </Typography>
              
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                {[
                  { icon: <FiArrowUpRight size={18} />, label: 'Wire Transfer', path: '/dashboard/transfers?type=wire' },
                  { icon: <FiArrowUpRight size={18} />, label: 'Local Transfer', path: '/dashboard/transfers?type=local' },
                  { icon: <FiArrowUpRight size={18} />, label: 'Internal Transfer', path: '/dashboard/transfers?type=internal' },
                  // { icon: <FiPlus size={18} />, label: 'Buy Crypto', path: '/dashboard/crypto' },
                  { icon: <FiCreditCard size={18} />, label: 'Pay Bills', path: '/dashboard/bills' },
                ].map((item, index) => (
                  <Box key={index}>
                    <Paper
                      component={Link}
                      href={item.path}
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textDecoration: 'none',
                        '&:hover': {
                          bgcolor: 'rgba(6, 214, 160, 0.05)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          bgcolor: 'rgba(6, 214, 160, 0.1)',
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* Transactions Card */}
        <Box gridColumn={{ xs: 'span 12', md: 'span 6', lg: 'span 4' }}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Recent Transactions
                </Typography>
                <Typography 
                  variant="caption" 
                  component={Link}
                  href="/dashboard/transactions"
                  sx={{ 
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  View All
                </Typography>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
                </Box>
              ) : transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <Box
                    key={transaction._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1.5,
                      borderBottom: index < transactions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: transaction.type === 'debit' ? 'error.dark' : 'success.dark',
                          color: 'white',
                          fontSize: '0.9rem',
                          mr: 1.5,
                        }}
                      >
                        {transaction.type === 'debit' ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {transaction.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <ColoredCurrencyDisplay
                      amount={transaction.type === 'debit' ? -transaction.amount : transaction.amount}
                      variant="body2"
                      fontWeight={500}
                      showPositiveSign={true}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No transactions found
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
        
        {/* Balance Chart */}
        <Box gridColumn="span 12">
          <Card sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Balance History
              </Typography>
              
              <Box sx={{ height: 300 }}>
                <Line options={chartOptions} data={balanceData} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}
