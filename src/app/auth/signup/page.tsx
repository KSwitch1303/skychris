'use client';

import React, { useState } from 'react';
import { 
  Alert,
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  FormControl, 
  IconButton, 
  InputAdornment, 
  Step,
  StepLabel,
  Stepper,
  TextField, 
  Typography, 
  useTheme
} from '@mui/material';
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiPhone, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight,
  FiArrowLeft,
  FiCheck
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const steps = ['Personal Information', 'Contact Details', 'Security'];

export default function SignUp() {
  const router = useRouter();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
  
  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (step === 0) {
      // Validate first and last name
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
        isValid = false;
      } else {
        newErrors.firstName = '';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
        isValid = false;
      } else {
        newErrors.lastName = '';
      }
    }
    
    if (step === 1) {
      // Validate email and phone
      if (!formData.email) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      } else {
        newErrors.email = '';
      }
      
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      } else if (formData.phone.length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      } else {
        newErrors.phone = '';
      }
    }
    
    if (step === 2) {
      // Validate password and confirmation
      if (!formData.password) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else {
        newErrors.password = '';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      } else {
        newErrors.confirmPassword = '';
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setIsLoading(false);
      } else {
        // Save token and user in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message
        setSuccess('Registration successful! Redirecting to dashboard...');
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiUser color={theme.palette.text.secondary} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </FormControl>
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiUser color={theme.palette.text.secondary} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </FormControl>
          </>
        );
      case 1:
        return (
          <>
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
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
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
          </>
        );
      case 2:
        return (
          <>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
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
            </FormControl>
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </FormControl>
          </>
        );
      default:
        return <></>;
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
              Create Your Account
            </Typography>
            
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}
            
            <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {renderStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<FiArrowLeft />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'text.primary',
                    visibility: activeStep === 0 ? 'hidden' : 'visible',
                  }}
                >
                  Back
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    endIcon={<FiCheck />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      bgcolor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {isLoading ? 'Creating Account...' : 'Complete'}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<FiArrowRight />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      bgcolor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
            
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
              Already have an account?{' '}
              <Typography
                component={Link}
                href="/auth/signin"
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
                Sign In
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
