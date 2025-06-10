'use client';

import React, { useState, ReactNode } from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <CssBaseline />
      
      {/* Sidebar/Navigation */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - 240px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar handleDrawerToggle={handleDrawerToggle} />
        <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
