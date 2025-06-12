'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 4 }, 
        pb: { xs: 1, sm: 2 },
        bgcolor: theme.palette.background.default,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          mb: subtitle ? 1 : 0
        }}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography 
          variant="body1" 
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default DashboardHeader;
