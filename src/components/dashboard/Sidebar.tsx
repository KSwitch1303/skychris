'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Divider, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { 
  FiHome, 
  FiCreditCard, 
  FiDollarSign, 
  FiSend, 
  FiSettings, 
  FiUser, 
  FiHelpCircle, 
  FiPhone,
  FiLogOut,
  FiTarget
} from 'react-icons/fi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Fetch user data from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    } else {
      // Redirect to login if no user data found
      router.push('/auth/signin');
    }
  }, [router]);

  const mainNavItems = [
    { text: 'Dashboard', icon: <FiHome size={20} />, path: '/dashboard' },
    { text: 'Deposits', icon: <FiDollarSign size={20} />, path: '/dashboard/deposits' },
    { text: 'Transfers', icon: <FiSend size={20} />, path: '/dashboard/transfers' },
    { text: 'Cards', icon: <FiCreditCard size={20} />, path: '/dashboard/cards' },
    // { text: 'Loans', icon: <FiDollarSign size={20} />, path: '/dashboard/loans' },
    // { text: 'Investments', icon: <FiTarget size={20} />, path: '/dashboard/investments' },
  ];
  
  const secondaryNavItems = [
    { text: 'Profile', icon: <FiUser size={20} />, path: '/dashboard/profile' },
    // { text: 'Settings', icon: <FiSettings size={20} />, path: '/dashboard/settings' },
    { text: 'Help & Support', icon: <FiHelpCircle size={20} />, path: '/dashboard/support' },
  ];

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home
    router.push('/');
  };

  const drawer = (
    <>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          Swift <Box component="span" sx={{ color: theme.palette.primary.main }}>Mint Flow</Box>
        </Typography>
        {user && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {user.firstName} {user.lastName}
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      
      <List sx={{ px: 2 }}>
        {mainNavItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              component={Link}
              href={item.path}
              sx={{
                borderRadius: 1.5,
                backgroundColor: pathname === item.path ? 'rgba(6, 214, 160, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                py: 1,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: pathname === item.path ? 600 : 400,
                  color: pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mt: 1, mb: 1 }} />
      
      <Typography variant="caption" color="text.secondary" sx={{ px: 3, py: 1, display: 'block' }}>
        Support
      </Typography>
      
      <List sx={{ px: 2 }}>
        {secondaryNavItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              component={Link}
              href={item.path}
              sx={{
                borderRadius: 1.5,
                backgroundColor: pathname === item.path ? 'rgba(6, 214, 160, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                py: 1,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: pathname === item.path ? 600 : 400,
                  color: pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <List sx={{ px: 2, mt: 'auto' }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              py: 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
              <FiLogOut size={20} />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: 14,
                color: theme.palette.error.main,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile version - temporary drawer that closes when clicking away */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: theme.palette.background.default,
            borderRight: '1px solid rgba(255, 255, 255, 0.08)'
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop version - permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: theme.palette.background.default,
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
