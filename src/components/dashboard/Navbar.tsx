'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { 
  FiBell, 
  FiMenu, 
  FiUser, 
  FiSettings, 
  FiHelpCircle, 
  FiLogOut
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  handleDrawerToggle: () => void;
}

export default function Navbar({ handleDrawerToggle }: NavbarProps) {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/dashboard/profile');
    handleCloseUserMenu();
  };

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
    handleCloseUserMenu();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: theme.palette.background.default, 
        boxShadow: 'none', 
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <Toolbar>
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <FiMenu />
        </IconButton>
        
        {/* Page title - can be dynamic based on current route */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            display: { xs: 'none', sm: 'block' },
            fontWeight: 600 
          }}
        >
          Dashboard
        </Typography>
        
        {/* Mobile logo */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Swift <span style={{ color: theme.palette.primary.main }}>Mint Flow</span>
          </Typography>
        </Box>

        {/* Notification icon */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Tooltip title="Notifications">
            <IconButton 
              onClick={handleOpenNotificationsMenu} 
              sx={{ mx: 1 }}
            >
              <Badge badgeContent={3} color="primary">
                <FiBell />
              </Badge>
            </IconButton>
          </Tooltip>
           */}
          {/* Notifications menu */}
          <Menu
            sx={{ mt: '45px' }}
            id="notifications-menu"
            anchorEl={anchorElNotifications}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
          >
            <Box sx={{ width: 320, maxHeight: 400, p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Notifications
              </Typography>
              
              {/* Sample notifications */}
              {[
                { title: 'Money received', message: 'NGN 5,000 received from John Doe', time: '5 mins ago' },
                { title: 'Account verified', message: 'Your account has been verified successfully', time: '1 hour ago' },
                { title: 'Security alert', message: 'New login detected from Lagos', time: 'Yesterday' },
              ].map((notification, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 1.5, 
                    mb: 1, 
                    borderRadius: 1, 
                    bgcolor: 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {notification.time}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    cursor: 'pointer',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  View all notifications
                </Typography>
              </Box>
            </Box>
          </Menu>

          {/* User avatar and menu */}
          <Box sx={{ ml: 1 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={user ? `${user.firstName} ${user.lastName}` : 'User'} 
                  src="/static/images/avatar/2.jpg" 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 32, 
                    height: 32 
                  }}
                >
                  {user ? user.firstName[0] : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user && (
                <Box sx={{ px: 2, py: 1, minWidth: 180 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {user.email}
                  </Typography>
                </Box>
              )}
              
              <MenuItem onClick={handleProfileClick}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <FiUser size={16} style={{ marginRight: 8 }} />
                  <Typography textAlign="center">Profile</Typography>
                </Box>
              </MenuItem>
              
              <MenuItem onClick={handleSettingsClick}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <FiSettings size={16} style={{ marginRight: 8 }} />
                  <Typography textAlign="center">Settings</Typography>
                </Box>
              </MenuItem>
              
              <MenuItem onClick={handleCloseUserMenu}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <FiHelpCircle size={16} style={{ marginRight: 8 }} />
                  <Typography textAlign="center">Help</Typography>
                </Box>
              </MenuItem>
              
              <MenuItem onClick={handleLogout}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: theme.palette.error.main }}>
                  <FiLogOut size={16} style={{ marginRight: 8 }} />
                  <Typography textAlign="center">Logout</Typography>
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
