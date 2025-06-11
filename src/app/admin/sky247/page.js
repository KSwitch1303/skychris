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
  useTheme
} from '@mui/material';
import { FiEdit2, FiTrash2, FiEye, FiRefreshCw, FiPlus, FiMinus, FiSave } from 'react-icons/fi';

function TabPanel(props) {
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

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export default function AdminDashboard() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCollection, setFilterCollection] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorAuth, setErrorAuth] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Authentication check
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth === 'true') {
        setIsAuthenticated(true);
        fetchData();
      }
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Use a simple password for demo purposes
    // In production, you would use a secure admin authentication method
    if (password === 'swiftmintadmin123') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminAuth', 'true');
      }
      fetchData();
    } else {
      setErrorAuth('Invalid password');
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
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      let collection;
      if (tabValue === 0) collection = 'users';
      else if (tabValue === 1) collection = 'cards';
      else if (tabValue === 2) collection = 'transactions';
      
      const response = await fetch(`/api/admin/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection,
          id: editItem._id,
          updates: editItem
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update item');
      }

      // Update local state
      if (collection === 'users') {
        setUsers(users.map(user => user._id === editItem._id ? editItem : user));
      } else if (collection === 'cards') {
        setCards(cards.map(card => card._id === editItem._id ? editItem : card));
      } else if (collection === 'transactions') {
        setTransactions(transactions.map(transaction => transaction._id === editItem._id ? editItem : transaction));
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
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      const collection = tabValue === 0 ? 'users' : 'cards';
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
    } catch (err) {
      setError(err.message || 'An error occurred while deleting');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch users
      const usersResponse = await fetch('/api/admin/data?collection=users');
      const usersData = await usersResponse.json();
      
      if (!usersResponse.ok) {
        throw new Error(usersData.message || 'Failed to fetch users');
      }
      
      setUsers(usersData.data);
      
      // Fetch cards
      const cardsResponse = await fetch('/api/admin/data?collection=cards');
      const cardsData = await cardsResponse.json();
      
      if (!cardsResponse.ok) {
        throw new Error(cardsData.message || 'Failed to fetch cards');
      }
      
      setCards(cardsData.data);
      
      // Fetch transactions
      const transactionsResponse = await fetch('/api/admin/data?collection=transactions');
      const transactionsData = await transactionsResponse.json();
      
      if (!transactionsResponse.ok) {
        throw new Error(transactionsData.message || 'Failed to fetch transactions');
      }
      
      setTransactions(transactionsData.data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
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
  
  const filteredTransactions = transactions.filter(transaction => 
    JSON.stringify(transaction).toLowerCase().includes(searchQuery.toLowerCase())
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
            <Tab label={`Transactions (${transactions.length})`} {...a11yProps(2)} />
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
                    <TableCell>Account Number</TableCell>
                    <TableCell align="right">Balance ($)</TableCell>
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
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => {
                      const date = new Date(transaction.createdAt);
                      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                      return (
                        <TableRow key={transaction._id}>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              {transaction.type === 'credit' ? 
                                <Box sx={{ color: '#06D6A0' }}><FiPlus size={16} /></Box> : 
                                <Box sx={{ color: '#FF6B6B' }}><FiMinus size={16} /></Box>
                              }
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ 
                              fontWeight: 600, 
                              color: transaction.type === 'credit' ? '#06D6A0' : '#FF6B6B' 
                            }}>
                              ${transaction.amount?.toFixed(2) || transaction.amount}
                            </Box>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: 
                                  transaction.status === 'completed' ? 'success.main' : 
                                  transaction.status === 'pending' ? 'warning.main' : 'error.main',
                                color: 'white',
                                fontSize: '0.75rem',
                              }}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Box>
                          </TableCell>
                          <TableCell>{formattedDate}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleOpenEditDialog(transaction)}>
                              <FiEdit2 />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteItem(transaction._id)}>
                              <FiTrash2 />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {transactions.length === 0 ? 'No transactions found' : 'No results match your search'}
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
        <DialogTitle>
          Edit {tabValue === 0 ? 'User' : tabValue === 1 ? 'Card' : 'Transaction'}
        </DialogTitle>
        <DialogContent dividers>
          {editItem && (
            <Box component="form" sx={{ display: 'grid', gap: 2 }}>
              {Object.keys(editItem).filter(key => key !== '_id').map((key) => (
                <TextField
                  key={key}
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={editItem[key] || ''}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  type={key.includes('password') ? 'password' : 'text'}
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
