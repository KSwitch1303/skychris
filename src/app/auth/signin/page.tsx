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
  IconButton,
  FormControl,
  FormHelperText,
  Alert,
  useTheme
} from '@mui/material';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    loginWithPhone: false
  });
  
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const toggleLoginMethod = () => {
    setFormData(prev => ({
      ...prev,
      loginWithPhone: !prev.loginWithPhone,
      email: '',
      phone: ''
    }));
    setErrors(prev => ({
      ...prev,
      email: '',
      phone: ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Email/Phone validation
    if (formData.loginWithPhone) {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      } else {
        newErrors.phone = '';
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      } else {
        newErrors.email = '';
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      newErrors.password = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.loginWithPhone ? undefined : formData.email,
          phone: formData.loginWithPhone ? formData.phone : undefined,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Authentication failed');
        setIsLoading(false);
      } else {
        // Save token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      }
    } catch (error) {
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
        bgcolor: theme.palette.background.default,
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Swift <span style={{ color: theme.palette.primary.main }}>Mint Flow</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Banking Made Simple
          </Typography>
        </Box>
        
        <Card sx={{ 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Sign In to Your Account
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              {formData.loginWithPhone ? (
                <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FiPhone color={theme.palette.text.secondary} />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </FormControl>
              ) : (
                <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                  <TextField
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FiMail color={theme.palette.text.secondary} />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </FormControl>
              )}
              
              <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Typography 
                    variant="body2" 
                    component={Link}
                    href=""
                    sx={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>
              </FormControl>
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  mb: 2
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <Button
                type="button"
                variant="text"
                fullWidth
                onClick={toggleLoginMethod}
                sx={{
                  mb: 3,
                  color: theme.palette.primary.main,
                }}
              >
                {formData.loginWithPhone 
                  ? 'Use Email Address Instead' 
                  : 'Use Phone Number Instead'
                }
              </Button>
              
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Typography
                  component={Link}
                  href="/auth/signup"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign Up
                </Typography>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
