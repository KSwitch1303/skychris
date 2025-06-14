'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  FormControlLabel,
  Switch
} from '@mui/material';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiRefreshCw, FiPlus, FiMinus, FiSave, FiKey } from 'react-icons/fi';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export default function AdminPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [currency, setCurrency] = useState({ symbol: '$', code: 'USD', name: 'US Dollar' });
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Authentication check
  useEffect(() => {
    // Check for cookie instead of localStorage
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    const adminAuth = getCookie('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Simple password for demo purposes
    if (password === 'swiftmintadmin123') {
      // Set cookie instead of localStorage
      document.cookie = 'adminAuth=true; path=/; max-age=3600'; // expires in 1 hour
      setIsAuthenticated(true);
    } else {
      setError('Invalid admin password');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  const handleOpenEditDialog = (item) => {
    setEditItem(JSON.parse(JSON.stringify(item))); // Deep copy
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditItem(null);
    setChangePassword(false);
    setNewPassword('');
    setShowPassword(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem({
        ...editItem,
        [name]: value
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    
    setLoading(true);
    try {
      let collection;
      if (tabValue === 0) collection = 'users';
      else if (tabValue === 1) collection = 'cards';
      else if (tabValue === 2) collection = 'withdrawals';
      
      // Create updates object - for users, handle password specially
      let updates = { ...editItem };
      
      // If changing password for a user
      if (tabValue === 0 && changePassword && newPassword.trim() !== '') {
        updates.password = newPassword.trim();
      }
      
      const response = await fetch(`/api/admin/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Add credentials to include cookies
        body: JSON.stringify({
          collection,
          id: editItem._id,
          updates
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update item');
      }

      // Update local state based on collection
      if (collection === 'users') {
        setUsers(users.map(user => user._id === editItem._id ? editItem : user));
      } else if (collection === 'cards') {
        setCards(cards.map(card => card._id === editItem._id ? editItem : card));
      } else if (collection === 'withdrawals') {
        setWithdrawals(withdrawals.map(withdrawal => withdrawal._id === editItem._id ? editItem : withdrawal));
      }
      
      setSuccess('Item updated successfully');
      handleCloseEditDialog();
    } catch (err) {
      setError(err.message || 'An error occurred while updating');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        let collection;
        if (tabValue === 0) collection = 'users';
        else if (tabValue === 1) collection = 'cards';
        else if (tabValue === 2) collection = 'withdrawals';
        
        const response = await fetch(`/api/admin/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Add credentials to include cookies
          body: JSON.stringify({
            collection,
            id
          }),
        });

        const data = await response.json();
      
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete item');
        }

        // Update local state
        if (collection === 'users') {
          setUsers(users.filter(user => user._id !== id));
        } else if (collection === 'cards') {
          setCards(cards.filter(card => card._id !== id));
        } else if (collection === 'withdrawals') {
          setWithdrawals(withdrawals.filter(withdrawal => withdrawal._id !== id));
        }

        setSuccess('Item deleted successfully');
      } catch (err) {
        setError(err.message || 'An error occurred while deleting');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleEditUser = (user) => {
    handleOpenEditDialog(user);
  };

  const handleEditCard = (card) => {
    handleOpenEditDialog(card);
  };

  const handleEditWithdrawal = (withdrawal) => {
    handleOpenEditDialog(withdrawal);
  };
  
  // Function to verify a tax code
  const handleVerifyTaxCode = async (withdrawalId) => {
    if (!window.confirm('Do you want to verify this tax code as valid?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/verify-tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Add credentials to include cookies
        body: JSON.stringify({
          withdrawalId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the withdrawal in the local state
        setWithdrawals(prev => 
          prev.map(w => 
            w._id === withdrawalId 
              ? { ...w, taxVerified: true } 
              : w
          )
        );
        setSuccess('Tax code verified successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to verify tax code');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while verifying tax code');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning.main';
      case 'completed':
        return 'success.main';
      case 'rejected':
        return 'error.main';
      case 'verified':
        return 'info.main';
      default:
        return 'text.secondary';
    }
  };

  // Fetch data from backend
  // Function to fetch currency settings
  const fetchCurrency = async () => {
    try {
      const res = await fetch('/api/currency', { credentials: 'include' });
      const data = await res.json();
      
      if (data.success && data.data) {
        setCurrency(data.data);
      }
    } catch (error) {
      console.error('Error fetching currency settings:', error);
      setError('Failed to load currency settings');
    }
  };

  // Function to update currency settings
  const updateCurrency = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(currency),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Currency settings updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to update currency settings');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while updating currency');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    setCurrency(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    console.log('Starting fetchData for admin page');
    try {
      // Fetch users
      console.log('Fetching users...');
      const usersRes = await fetch('/api/admin/users', { credentials: 'include' });
      console.log('Users response status:', usersRes.status);
      const usersData = await usersRes.json();
      console.log('Users data:', usersData);
      if (usersData.success) {
        setUsers(usersData.data);
      } else {
        console.error('Failed to load users:', usersData.message);
        setUsers([]);
      }
      
      // Fetch cards
      const cardsRes = await fetch('/api/admin/cards', { credentials: 'include' });
      const cardsData = await cardsRes.json();
      if (cardsData.success) {
        setCards(cardsData.data);
      } else {
        setCards([]);
      }
      
      // Fetch withdrawals
      const withdrawalsRes = await fetch('/api/admin/withdrawals', { credentials: 'include' });
      const withdrawalsData = await withdrawalsRes.json();
      if (withdrawalsData.success) {
        setWithdrawals(withdrawalsData.data);
      } else {
        setWithdrawals([]);
      }

      // Fetch transactions
      const transactionsRes = await fetch('/api/admin/transactions', { credentials: 'include' });
      const transactionsData = await transactionsRes.json();
      if (transactionsData.success) {
        setTransactions(transactionsData.data);
      } else {
        setTransactions([]);
      }
      
      setSuccess('Data refreshed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      fetchCurrency(); // Also fetch currency settings
    }
  }, [isAuthenticated]);

  // Filter data based on search query
  const filteredUsers = users.filter(user => 
    JSON.stringify(user).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCards = cards.filter(card => 
    JSON.stringify(card).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWithdrawals = withdrawals.filter(withdrawal => 
    JSON.stringify(withdrawal).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction => 
    JSON.stringify(transaction).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography variant="h4" gutterBottom>Admin Login</Typography>
          <form onSubmit={handleAdminLogin} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Admin Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </form>
          {error && <Typography color="error">{error}</Typography>}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
        <Button 
          startIcon={<FiRefreshCw />}
          variant="outlined"
          onClick={fetchData}
          disabled={loading}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
        >
          Refresh Data
        </Button>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', overflowX: 'auto' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="admin tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 },
            minHeight: { xs: '42px', sm: '48px' },
          }}
        >
          <Tab label="Users" {...a11yProps(0)} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
          <Tab label="Cards" {...a11yProps(1)} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
          <Tab label="Withdrawals" {...a11yProps(2)} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
          <Tab label="Transactions" {...a11yProps(3)} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
          <Tab label="Currency" {...a11yProps(4)} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
        </Tabs>
      </Box>
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Users Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell align="right">Balance ($)</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>{user.accountNumber}</TableCell>
                    <TableCell align="right">${user.balance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{user.bankName || 'Swift Mint'}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditUser(user)} color="primary">
                        <FiEdit2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {loading ? 'Loading...' : 'No users found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      {/* Cards Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="cards table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Card Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Balance ($)</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <TableRow
                    key={card._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {card.user?.firstName || 'Unknown'} {card.user?.lastName || 'User'}
                    </TableCell>
                    <TableCell>
                      {card.cardNumber?.substr(0, 4) + ' **** **** ' + card.cardNumber?.substr(-4)}
                    </TableCell>
                    <TableCell>{card.type || 'Virtual'}</TableCell>
                    <TableCell>{card.status || 'Active'}</TableCell>
                    <TableCell align="right">${card.balance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{card.expiryMonth + '/' + card.expiryYear}</TableCell>
                    <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditCard(card)} color="primary">
                        <FiEdit2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {loading ? 'Loading...' : 'No cards found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Withdrawals Tab */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="withdrawals table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Amount ($)</TableCell>
                <TableCell>Tax Code</TableCell>
                <TableCell>Tax Verified</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((withdrawal) => (
                  <TableRow
                    key={withdrawal._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {withdrawal.user?.firstName || 'Unknown'} {withdrawal.user?.lastName || 'User'}
                    </TableCell>
                    <TableCell>{withdrawal.reference}</TableCell>
                    <TableCell align="right">${withdrawal.amount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{withdrawal.taxCode || 'N/A'}</TableCell>
                    <TableCell>
                      {withdrawal.taxVerified ? (
                        <Typography color="success.main">Verified ✓</Typography>
                      ) : (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="warning"
                          onClick={() => handleVerifyTaxCode(withdrawal._id)}
                        >
                          Verify
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography color={getStatusColor(withdrawal.status || 'pending')}>
                        {withdrawal.status || 'Pending'}
                      </Typography>
                    </TableCell>
                    <TableCell>{new Date(withdrawal.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditWithdrawal(withdrawal)} color="primary">
                        <FiEdit2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {loading ? 'Loading...' : 'No withdrawals found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Transactions Tab */}
      <TabPanel value={tabValue} index={3}>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.reference || 'N/A'}</TableCell>
                    <TableCell>{transaction.type || 'N/A'}</TableCell>
                    <TableCell>
                      {currency.symbol}{parseFloat(transaction.amount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ color: getStatusColor(transaction.status) }}>
                        {transaction.status || 'Pending'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.description || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Currency Tab */}
      <TabPanel value={tabValue} index={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Currency Settings</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure the currency symbol and code used throughout the application.
          </Typography>
          
          <Box component="form" onSubmit={updateCurrency} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                label="Currency Symbol"
                name="symbol"
                value={currency.symbol}
                onChange={handleCurrencyChange}
                sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}
              />
              <TextField
                label="Currency Code"
                name="code"
                value={currency.code}
                onChange={handleCurrencyChange}
                sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}
              />
              <TextField
                label="Currency Name"
                name="name"
                value={currency.name}
                onChange={handleCurrencyChange}
                sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}
              />
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>Common Currencies</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {[
                { symbol: '$', code: 'USD', name: 'US Dollar' },
                { symbol: '€', code: 'EUR', name: 'Euro' },
                { symbol: '£', code: 'GBP', name: 'British Pound' },
                { symbol: '₦', code: 'NGN', name: 'Nigerian Naira' },
                { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
                { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
                { symbol: '₱', code: 'PHP', name: 'Philippine Peso' },
                { symbol: '₽', code: 'RUB', name: 'Russian Ruble' },
                { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' },
              ].map((curr) => (
                <Button 
                  key={curr.code}
                  variant={currency.code === curr.code ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setCurrency(curr)}
                  sx={{ mb: 1 }}
                >
                  {curr.symbol} {curr.code}
                </Button>
              ))}
            </Box>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              startIcon={<FiSave />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Currency Settings'}
            </Button>
          </Box>
        </Paper>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit {tabValue === 0 ? 'User' : tabValue === 1 ? 'Card' : 'Withdrawal'}</DialogTitle>
        <DialogContent>
          {editItem && (
            <Box sx={{ pt: 2 }}>
              {/* Edit User */}
              {tabValue === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={editItem.firstName || ''}
                      onChange={handleEditChange}
                      fullWidth
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={editItem.lastName || ''}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  </Box>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={editItem.email || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    value={editItem.phone || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                  <TextField
                    label="Account Number"
                    name="accountNumber"
                    value={editItem.accountNumber || ''}
                    onChange={handleEditChange}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="Balance"
                    name="balance"
                    type="number"
                    value={editItem.balance || 0}
                    onChange={handleEditChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={changePassword}
                        onChange={(e) => setChangePassword(e.target.checked)}
                        name="changePassword"
                      />
                    }
                    label="Change Password"
                  />
                  {changePassword && (
                    <TextField
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        ),
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Edit Card */}
              {tabValue === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={editItem.cardNumber || ''}
                    onChange={handleEditChange}
                    fullWidth
                    disabled
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Card Type"
                      name="type"
                      value={editItem.type || 'Virtual'}
                      onChange={handleEditChange}
                      fullWidth
                    />
                    <TextField
                      label="Status"
                      name="status"
                      value={editItem.status || 'Active'}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Expiry Month"
                      name="expiryMonth"
                      type="number"
                      value={editItem.expiryMonth || ''}
                      onChange={handleEditChange}
                      fullWidth
                    />
                    <TextField
                      label="Expiry Year"
                      name="expiryYear"
                      type="number"
                      value={editItem.expiryYear || ''}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  </Box>
                  <TextField
                    label="Balance"
                    name="balance"
                    type="number"
                    value={editItem.balance || 0}
                    onChange={handleEditChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                </Box>
              )}

              {/* Edit Withdrawal */}
              {tabValue === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Reference"
                    name="reference"
                    value={editItem.reference || ''}
                    onChange={handleEditChange}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={editItem.amount || 0}
                    onChange={handleEditChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                  <TextField
                    label="Tax Code"
                    name="taxCode"
                    value={editItem.taxCode || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editItem.taxVerified || false}
                        onChange={(e) => setEditItem({...editItem, taxVerified: e.target.checked})}
                        name="taxVerified"
                      />
                    }
                    label="Tax Verified"
                  />
                  <TextField
                    label="Status"
                    name="status"
                    value={editItem.status || 'Pending'}
                    onChange={handleEditChange}
                    select
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </TextField>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary" startIcon={<FiSave />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
