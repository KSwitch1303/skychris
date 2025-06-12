"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { 
  FiUser, 
  FiLock, 
  FiMail, 
  FiPhone, 
  FiMap, 
  FiCreditCard,
  FiShield,
  FiCamera
} from 'react-icons/fi';

// Tab panel component
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

export default function ProfilePage() {
  const router = useRouter();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/signin');
          return;
        }

        // Fetch user data from API
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setUserData(data.data);
        
        // Pre-fill form data
        setFormData(prevFormData => ({
          ...prevFormData,
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          city: data.data.city || '',
          state: data.data.state || '',
          zipCode: data.data.zipCode || '',
          country: data.data.country || '',
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      // Update user data state
      setUserData((prev: any) => ({
        ...prev,
        ...data.data
      }));
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setSuccess('Password changed successfully');
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setError(err.message || 'An error occurred while changing password');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ mb: { xs: 3, md: 4 }, fontWeight: 600, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        My Profile
      </Typography>

      {/* Profile Header */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 2, sm: 3 }
        }}>
          <Avatar
            src={userData?.profileImage || ''}
            alt={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              bgcolor: theme.palette.primary.main,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              position: 'relative',
            }}
          >
            {!userData?.profileImage && (userData?.firstName?.charAt(0) || 'U')}
            <Box 
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: theme.palette.background.paper,
                borderRadius: '50%',
                p: 0.5,
                border: `2px solid ${theme.palette.background.paper}`,
                cursor: 'pointer',
                '&:hover': { bgcolor: theme.palette.grey[700] }
              }}
              title="Upload new picture"
            >
              <FiCamera size={16} />
            </Box>
          </Avatar>

          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {userData?.firstName || ''} {userData?.lastName || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {userData?.email || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Account #: {userData?.accountNumber || ''}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ mt: { xs: 2, sm: 3 }, color: theme.palette.primary.main, fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {userData?.role === 'admin' ? 'Administrator' : 'Customer'}
            </Typography>
          </Box>

          <Box sx={{ ml: { xs: 0, sm: 'auto' }, mt: { xs: 2, sm: 0 } }}>
            <Button 
              variant="outlined" 
              sx={{ borderRadius: 1.5 }} 
              startIcon={<FiShield size={16} />}
            >
              Verify Identity
            </Button>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          overflowX: { xs: 'auto', sm: 'visible' },
          '& .MuiTabs-scrollButtons': {
            display: { xs: 'flex', sm: 'none' }
          }
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '0.925rem' },
                fontWeight: 500,
                minHeight: { xs: 42, sm: 48 },
                minWidth: { xs: 'auto', sm: 160 },
                px: { xs: 1, sm: 2 },
              },
              '.MuiTabs-scrollButtons.Mui-disabled': {
                opacity: 0.3,
              }
            }}
          >
            <Tab label="Personal Information" />
            <Tab label="Security" />
            <Tab label="Cards" />
            <Tab label="Notifications" />
          </Tabs>
        </Box>
      </Card>

      {/* Personal Information Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card 
          sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            <Box 
              component="form" 
              onSubmit={handlePersonalInfoSubmit}
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: { xs: 1.5, sm: 2 },
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            >
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: <FiUser style={{ marginRight: 8 }} />
                }}
              />

              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: <FiUser style={{ marginRight: 8 }} />
                }}
              />

              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formData.email}
                disabled
                variant="outlined"
                InputProps={{
                  startAdornment: <FiMail style={{ marginRight: 8 }} />
                }}
              />

              <TextField
                fullWidth
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="+234 123 456 7890"
                InputProps={{
                  startAdornment: <FiPhone style={{ marginRight: 8 }} />
                }}
              />

              <TextField
                fullWidth
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ gridColumn: { sm: '1 / 3' } }}
                InputProps={{
                  startAdornment: <FiMap style={{ marginRight: 8 }} />
                }}
              />

              <TextField
                fullWidth
                name="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
                variant="outlined"
              />

              <TextField
                fullWidth
                name="state"
                label="State/Province"
                value={formData.state}
                onChange={handleInputChange}
                variant="outlined"
              />

              <TextField
                fullWidth
                name="zipCode"
                label="ZIP/Postal Code"
                value={formData.zipCode}
                onChange={handleInputChange}
                variant="outlined"
              />

              <TextField
                fullWidth
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleInputChange}
                variant="outlined"
              />

              {error && (
                <Alert severity="error" sx={{ gridColumn: { sm: '1 / 3' }, mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ gridColumn: { sm: '1 / 3' }, mt: { xs: 1, sm: 2 }, textAlign: { xs: 'center', sm: 'right' } }}>
                <Button 
                  variant="contained" 
                  type="submit" 
                  disabled={loading}
                  sx={{ px: 4, borderRadius: 1.5 }}
                  startIcon={loading && <CircularProgress size={16} color="inherit" />}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card 
          sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            p: { xs: 0, sm: 0 }
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Change Password
            </Typography>

            <Box 
              component="form" 
              onSubmit={handlePasswordChange}
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr' },
                gap: 2,
                maxWidth: 500
              }}
            >
              <TextField
                fullWidth
                name="currentPassword"
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: <FiLock style={{ marginRight: 8 }} />
                }}
              />

              <TextField
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: <FiLock style={{ marginRight: 8 }} />
                }}
              />

              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: <FiLock style={{ marginRight: 8 }} />
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button 
                  variant="contained" 
                  type="submit" 
                  disabled={loading}
                  sx={{ px: 4, borderRadius: 1.5 }}
                  startIcon={loading && <CircularProgress size={16} color="inherit" />}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Cards Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card 
          sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                My Cards
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ borderRadius: 1.5 }}
                onClick={() => router.push('/dashboard/cards')}
                startIcon={<FiCreditCard size={16} />}
              >
                Manage Cards
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              View and manage your saved payment cards on the Cards page.
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card 
          sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Notification Preferences
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Notification settings will be available soon.
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Success notification */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
