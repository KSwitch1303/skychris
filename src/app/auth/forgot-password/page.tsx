'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  TextField, 
  Typography, 
  InputAdornment, 
  Alert,
  useTheme
} from '@mui/material';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const router = useRouter();
  const theme = useTheme();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };
  
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please enter your email address');
      return false;
    } else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call to request password reset
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage(`Password reset instructions have been sent to ${email}. Please check your inbox.`);
        
        // In a real implementation, this would be an API call:
        // const response = await fetch('/api/auth/forgot-password', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ email }),
        // });
        // const data = await response.json();
        // if (!response.ok) {
        //   setError(data.message || 'Password reset failed');
        // } else {
        //   setSuccessMessage(`Password reset instructions have been sent to ${email}. Please check your inbox.`);
        // }
      }, 1500);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 5,
        bgcolor: theme.palette.background.default,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(/images/banner-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(18, 18, 18, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 700, 
                mb: 1,
                textAlign: 'center',
                background: 'linear-gradient(45deg, #06D6A0, #0CCEA9)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 4px 12px rgba(6, 214, 160, 0.2)'
              }}>
                Swift Mint Flow
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: 3 }}>
                Forgot Your Password?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}>
                Enter your email address below and we'll send you instructions to reset your password.
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {successMessage ? (
              <>
                <Alert severity="success" sx={{ mb: 3 }}>
                  {successMessage}
                </Alert>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    component={Link}
                    href="/auth/signin"
                    startIcon={<FiArrowLeft />}
                    variant="outlined"
                    color="primary"
                    sx={{ px: 3, py: 1 }}
                  >
                    Back to Sign In
                  </Button>
                </Box>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  margin="normal"
                  placeholder="Enter your email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMail />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 1,
                    background: 'linear-gradient(45deg, #06D6A0, #0CCEA9)',
                    boxShadow: '0 4px 10px rgba(6, 214, 160, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #06D6A0, #0CCEA9)',
                      boxShadow: '0 6px 15px rgba(6, 214, 160, 0.4)',
                    },
                  }}
                >
                  {isLoading ? 'Sending...' : 'Reset Password'}
                </Button>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography 
                    variant="body2" 
                    component={Link}
                    href="/auth/signin"
                    sx={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    <FiArrowLeft size={14} style={{ marginRight: '4px' }} />
                    Back to Sign In
                  </Typography>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>
        
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ 
              color: theme.palette.primary.main, 
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}>
              Sign up
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1, fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} Swift Mint Flow. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
