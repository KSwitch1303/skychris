'use client';

import React, { useState } from 'react';
import { 
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Switch,
  Divider,
  FormControl,
  FormControlLabel,
  Avatar,
  IconButton,
  Alert,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { 
  FiUser, 
  FiLock, 
  FiBell, 
  FiUpload,
  FiShield,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiMoon,
  FiSun
} from 'react-icons/fi';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function Settings() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@swiftmintflow.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    receiveEmailNotifications: true,
    receivePushNotifications: true,
    receiveSmsNotifications: false,
    twoFactorAuth: true,
    darkMode: true
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Account Settings
      </Typography>
      
      <Card sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                textTransform: 'none',
                py: 2
              }
            }}
          >
            <Tab icon={<FiUser />} iconPosition="start" label="Profile" {...a11yProps(0)} />
            <Tab icon={<FiLock />} iconPosition="start" label="Security" {...a11yProps(1)} />
            <Tab icon={<FiBell />} iconPosition="start" label="Notifications" {...a11yProps(2)} />
            <Tab icon={<FiMoon />} iconPosition="start" label="Appearance" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {saveSuccess && (
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
            >
              Your changes have been saved successfully!
            </Alert>
          )}
          
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2,
                  border: `2px solid ${theme.palette.primary.main}` 
                }}
                alt="Profile Picture"
                src="/images/avatar-placeholder.jpg"
              />
              <Button
                variant="outlined"
                startIcon={<FiUpload />}
                size="small"
              >
                Upload New Photo
              </Button>
            </Box>
            
            <form onSubmit={handleSaveChanges}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSaving}
                  sx={{ px: 4 }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            
            <form onSubmit={handleSaveChanges}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500 }}>
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.twoFactorAuth}
                      onChange={handleSwitchChange}
                      name="twoFactorAuth"
                      color="primary"
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSaving}
                  sx={{ px: 4 }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            
            <form onSubmit={handleSaveChanges}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.receiveEmailNotifications}
                      onChange={handleSwitchChange}
                      name="receiveEmailNotifications"
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.receivePushNotifications}
                      onChange={handleSwitchChange}
                      name="receivePushNotifications"
                      color="primary"
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.receiveSmsNotifications}
                      onChange={handleSwitchChange}
                      name="receiveSmsNotifications"
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                />
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSaving}
                  sx={{ px: 4 }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Theme Settings
            </Typography>
            
            <form onSubmit={handleSaveChanges}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.darkMode}
                      onChange={handleSwitchChange}
                      name="darkMode"
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSaving}
                  sx={{ px: 4 }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
