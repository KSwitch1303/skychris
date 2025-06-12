'use client';

import React, { useState, useEffect, ReactNode } from 'react';
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
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiRefreshCw, FiPlus, FiMinus, FiSave, FiKey, FiCheckCircle } from 'react-icons/fi';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  accountNumber: string;
  balance: number;
  bankName: string;
  [key: string]: any;
}

interface Card {
  _id: string;
  cardNumber: string;
  cardName?: string;
  cardholderName?: string;
  expiryDate: string;
  cardType: string;
  isActive: boolean;
  [key: string]: any;
}

interface Transaction {
  _id: string;
  reference: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

interface Withdrawal {
  _id: string;
  user: string | User;
  amount: number;
  taxCode: string;
  taxVerified: boolean;
  status: string;
  reference: string;
  createdAt: string;
  completedAt?: string;
  [key: string]: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export default function AdminPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<User | Card | Transaction | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [filterCollection, setFilterCollection] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [errorAuth, setErrorAuth] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Authentication check
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use a simple password for demo purposes
    // In production, you would use a secure admin authentication method
    if (password === 'swiftmintadmin123') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid admin password');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  const handleOpenEditDialog = (item: any) => {
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Update local state with proper type casting
      if (collection === 'users') {
        setUsers(users.map(user => user._id === editItem._id ? editItem as User : user));
      } else if (collection === 'cards') {
        setCards(cards.map(card => card._id === editItem._id ? editItem as Card : card));
      } else if (collection === 'transactions') {
        setTransactions(transactions.map(transaction => transaction._id === editItem._id ? editItem as Transaction : transaction));
      }
      
      setSuccess('Item updated successfully');
      handleCloseEditDialog();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        let collection;
        if (tabValue === 0) collection = 'users';
        else if (tabValue === 1) collection = 'cards';
        else if (tabValue === 2) collection = 'transactions';
        
        const response = await fetch(`/api/admin/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      } else {
        setCards(cards.filter(card => card._id !== id));
      }

      setSuccess('Item deleted successfully');
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting');
    } finally {
      setLoading(false);
    }
    }
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Fetch users data
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.data);
      } else {
        setUsers([]);
      }
      
      // Fetch cards data
      const cardsRes = await fetch('/api/admin/cards');
      const cardsData = await cardsRes.json();
      if (cardsData.success) {
        setCards(cardsData.data);
      } else {
        setCards([]);
      }
      
      // Fetch withdrawals data
      const withdrawalsRes = await fetch('/api/admin/withdrawals');
      const withdrawalsData = await withdrawalsRes.json();
      if (withdrawalsData.success) {
        setWithdrawals(withdrawalsData.data);
      } else {
        setWithdrawals([]);
      }
      
      // Success
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

  // Function to verify a tax code
  const handleVerifyTaxCode = async (withdrawalId: string) => {
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
    } catch (error: any) {
      setError(error.message || 'An error occurred while verifying tax code');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const filteredUsers = users.filter(user => 
    JSON.stringify(user).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCards = cards.filter(card => 
    JSON.stringify(card).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWithdrawals = withdrawals.filter(withdrawal => 
    JSON.stringify(withdrawal).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: theme.palette.background.default
      }}>
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            width: '100%',
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
            Swift Mint Flow Admin
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleAdminLogin}>
            <TextField
              fullWidth
              label="Admin Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, py: 1.5 }}
            >
              Access Admin Panel
            </Button>
          </form>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      p: { xs: 2, sm: 4 },
      bgcolor: theme.palette.background.default
    }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Swift Mint Flow Admin Panel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage users, cards, and other database collections
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FiRefreshCw />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>
      
      <Paper sx={{ 
        borderRadius: 2,
        mb: 4,
        bgcolor: theme.palette.background.paper,
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Box sx={{ 
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <TextField
            label="Search"
            placeholder="Search in any field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Box>
      </Paper>
      
      <Paper sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin tabs"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                fontWeight: 500,
                textTransform: 'none'
              }
            }}
          >
            <Tab label={`Users (${users.length})`} {...a11yProps(0)} />
            <Tab label={`Cards (${cards.length})`} {...a11yProps(1)} />
            <Tab label={`Withdrawals (${withdrawals.length})`} {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Account #</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell align="center">Password</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.accountNumber}</TableCell>
                        <TableCell align="right">${user.balance.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: 'info.main',
                              color: 'white',
                              fontSize: '0.75rem',
                            }}
                          >
                            <FiKey size={12} style={{ marginRight: '4px' }} />
                            Encrypted
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleOpenEditDialog(user)}>
                            <FiEdit2 />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteItem(user._id)}>
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {users.length === 0 ? 'No users found' : 'No results match your search'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Card Number</TableCell>
                    <TableCell>Cardholder Name</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Card Type</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCards.length > 0 ? (
                    filteredCards.map((card) => (
                      <TableRow key={card._id}>
                        <TableCell>{card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}</TableCell>
                        <TableCell>{card.cardholderName}</TableCell>
                        <TableCell>{card.expiryDate}</TableCell>
                        <TableCell>{card.cardType}</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: card.isActive ? 'success.main' : 'error.main',
                              color: 'white',
                              fontSize: '0.75rem',
                            }}
                          >
                            {card.isActive ? 'Active' : 'Inactive'}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleOpenEditDialog(card)}>
                            <FiEdit2 />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteItem(card._id)}>
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {cards.length === 0 ? 'No cards found' : 'No results match your search'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Tax Code</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Verification</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWithdrawals.length > 0 ? (
                    filteredWithdrawals.map((withdrawal) => {
                      // Format the date
                      const formattedDate = new Date(withdrawal.createdAt).toLocaleString();
                      const userId = typeof withdrawal.user === 'string' ? withdrawal.user : withdrawal.user._id;
                      const userName = typeof withdrawal.user === 'string' 
                        ? 'Unknown User' 
                        : `${withdrawal.user.firstName} ${withdrawal.user.lastName}`;
                      
                      return (
                        <TableRow key={withdrawal._id}>
                          <TableCell>{withdrawal.reference}</TableCell>
                          <TableCell>{userName}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {withdrawal.taxCode}
                              </Typography>
                              {withdrawal.taxVerified ? (
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: 'success.main',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  <FiCheckCircle size={12} style={{ marginRight: 4 }} />
                                  Verified
                                </Box>
                              ) : null}
                            </Box>
                          </TableCell>
                          <TableCell align="right">${withdrawal.amount.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: getStatusColor(withdrawal.status),
                                color: 'white',
                                fontSize: '0.75rem',
                              }}
                            >
                              {withdrawal.status}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {withdrawal.taxVerified ? (
                              <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                disabled
                              >
                                Verified
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                onClick={() => handleVerifyTaxCode(withdrawal._id)}
                              >
                                Verify Now
                              </Button>
                            )}
                          </TableCell>
                          <TableCell align="center">{formattedDate}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleOpenEditDialog(withdrawal)}>
                              <FiEdit2 />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No withdrawals found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Paper>
      
      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Edit {tabValue === 0 ? 'User' : 'Card'}
        </DialogTitle>
        <DialogContent dividers>
          {editItem && (
            <Box component="form" sx={{ display: 'grid', gap: 2 }}>
              {/* If it's a user, add password management UI */}
              {tabValue === 0 && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(6, 214, 160, 0.1)', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#06D6A0' }}>
                    Password Management
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Current Password Status:
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: 'info.main',
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    >
                      <FiKey size={12} style={{ marginRight: '4px' }} />
                      Encrypted (Cannot be viewed)
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={changePassword} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChangePassword(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Set New Password"
                    />
                    
                    {changePassword && (
                      <TextField
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </IconButton>
                          ),
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}
              
              {/* Regular fields */}
              {Object.keys(editItem)
                .filter(key => key !== '_id' && key !== 'password') // Don't show password field
                .map((key) => (
                <TextField
                  key={key}
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={editItem[key] || ''}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  type={key.includes('pin') ? 'password' : 'text'} // Keep PIN fields as password type
                  disabled={key === 'createdAt'} // Don't allow editing timestamps
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            color="primary"
            startIcon={<FiSave />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbars for feedback */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
