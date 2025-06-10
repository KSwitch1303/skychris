'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { FiRefreshCw, FiDollarSign, FiUser, FiCreditCard, FiAlertCircle } from 'react-icons/fi';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openBalanceDialog, setOpenBalanceDialog] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-key': 'skyrick2244'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch user data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/cards', {
        headers: {
          'x-admin-key': 'skyrick2244'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }

      const data = await response.json();
      setCards(data);
    } catch (err) {
      setError('Failed to fetch card data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBalanceDialog = (user: any) => {
    setSelectedUser(user);
    setNewBalance(user.balance.toString());
    setOpenBalanceDialog(true);
  };

  const handleCloseBalanceDialog = () => {
    setOpenBalanceDialog(false);
  };

  const updateUserBalance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'skyrick2244'
        },
        body: JSON.stringify({
          balance: parseFloat(newBalance)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update balance');
      }

      const updatedUser = await response.json();
      
      // Update the users list with the updated user
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));

      setSnackbarSeverity('success');
      setSnackbarMessage(`Balance for ${updatedUser.firstName} ${updatedUser.lastName} updated successfully to $${updatedUser.balance.toFixed(2)}`);
      setOpenSnackbar(true);
      handleCloseBalanceDialog();
    } catch (err: any) {
      setSnackbarSeverity('error');
      setSnackbarMessage(err.message || 'Failed to update balance');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchUsers();
    } else if (tabValue === 1) {
      fetchCards();
    }
  }, [tabValue]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
            Swift <span style={{ color: theme.palette.primary.main }}>Mint Flow</span>
          </Typography>
        </Box>

        <Card sx={{ 
          mb: 4, 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
          overflow: 'hidden' 
        }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                bgcolor: theme.palette.background.paper,
                '& .MuiTab-root': { py: 2 }
              }}
            >
              <Tab 
                icon={<FiUser />} 
                iconPosition="start" 
                label="Users" 
                sx={{ textTransform: 'none' }} 
              />
              <Tab 
                icon={<FiCreditCard />} 
                iconPosition="start" 
                label="Cards" 
                sx={{ textTransform: 'none' }} 
              />
            </Tabs>

            {error && (
              <Box sx={{ p: 3 }}>
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      startIcon={<FiRefreshCw />}
                      onClick={tabValue === 0 ? fetchUsers : fetchCards}
                    >
                      Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </Box>
            )}

            {loading && (
              <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}

            {/* Users Tab */}
            <TabPanel value={tabValue} index={0}>
              {!loading && users.length > 0 && (
                <TableContainer component={Paper} sx={{ bgcolor: theme.palette.background.default }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Account Number</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.firstName} {user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.accountNumber}</TableCell>
                          <TableCell>${user.balance.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<FiDollarSign />}
                              onClick={() => handleOpenBalanceDialog(user)}
                              sx={{ borderRadius: 1 }}
                            >
                              Update Balance
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {!loading && users.length === 0 && !error && (
                <Box sx={{ p: 5, textAlign: 'center' }}>
                  <FiAlertCircle size={40} style={{ marginBottom: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="h6">No users found</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    There are no users registered in the system yet.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    startIcon={<FiRefreshCw />}
                    onClick={fetchUsers}
                  >
                    Refresh
                  </Button>
                </Box>
              )}
            </TabPanel>

            {/* Cards Tab */}
            <TabPanel value={tabValue} index={1}>
              {!loading && cards.length > 0 && (
                <TableContainer component={Paper} sx={{ bgcolor: theme.palette.background.default }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Card Number</TableCell>
                        <TableCell>Card Type</TableCell>
                        <TableCell>CVC</TableCell>
                        <TableCell>Expiry</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cards.map((card) => (
                        <TableRow key={card._id}>
                          <TableCell>{card.cardNumber}</TableCell>
                          <TableCell>{card.cardType}</TableCell>
                          <TableCell><Typography variant="body2" color="error">{card.cvc}</Typography></TableCell>
                          <TableCell>{card.expiryDate}</TableCell>
                          <TableCell>{card.userId?.firstName} {card.userId?.lastName}</TableCell>
                          <TableCell>{card.isDefault ? 'Default' : (card.isActive ? 'Active' : 'Inactive')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {!loading && cards.length === 0 && !error && (
                <Box sx={{ p: 5, textAlign: 'center' }}>
                  <FiAlertCircle size={40} style={{ marginBottom: 16, color: theme.palette.text.secondary }} />
                  <Typography variant="h6">No cards found</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    There are no cards saved in the system yet.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    startIcon={<FiRefreshCw />}
                    onClick={fetchCards}
                  >
                    Refresh
                  </Button>
                </Box>
              )}
            </TabPanel>
          </CardContent>
        </Card>
      </Container>

      {/* Update Balance Dialog */}
      <Dialog open={openBalanceDialog} onClose={handleCloseBalanceDialog}>
        <DialogTitle>Update User Balance</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update balance for {selectedUser?.firstName} {selectedUser?.lastName}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Balance"
            type="number"
            fullWidth
            variant="outlined"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 1 }}>
                  $
                </Box>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBalanceDialog}>Cancel</Button>
          <Button 
            onClick={updateUserBalance} 
            color="primary" 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
