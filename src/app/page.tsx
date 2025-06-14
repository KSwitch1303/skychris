'use client';

import { 
  AppBar,
  Box, 
  Button, 
  Container, 
  Grid,
  IconButton, 
  Menu,
  MenuItem,
  Paper, 
  Toolbar,
  Typography, 
  useTheme,
  useMediaQuery,
  Stack,
  TextField
} from '@mui/material';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  FiShield, 
  FiSmartphone, 
  FiCreditCard, 
  FiArrowRight, 
  FiMenu, 
  FiHome, 
  FiDollarSign, 
  FiHelpCircle,
  FiBarChart2,
  FiLock,
  FiPhone,
  FiUsers,
  FiDownload,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMapPin,
  FiMail
} from 'react-icons/fi';

// Scroll to section functionality
const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export default function Home() {
  const theme = useTheme();
  const { currency } = useCurrency();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Function to handle scroll to section when clicking links
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, elementId: string) => {
    e.preventDefault();
    scrollToSection(elementId);
  };
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Added section refs
  const productsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      {/* Navigation */}
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ 
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        bgcolor: 'background.paper'
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                {/* <Box 
                  component="span" 
                  sx={{ 
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(6, 214, 160, 0.1)',
                  }}
                >
                  <FiDollarSign size={20} color={theme.palette.primary.main} />
                </Box> */}
                Swift<Box component="span" sx={{ color: 'primary.main' }}>Mint Flow</Box>
              </Typography>
            </Box>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  onClick={() => scrollToSection('products')}
                  sx={{ 
                    mx: 1.5, 
                    color: 'text.primary',
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  Products
                </Button>
                <Button 
                  onClick={() => scrollToSection('services')}
                  sx={{ 
                    mx: 1.5, 
                    color: 'text.primary',
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  Services
                </Button>
                <Button 
                  onClick={() => scrollToSection('business')}
                  sx={{ 
                    mx: 1.5, 
                    color: 'text.primary',
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  Business
                </Button>
                {/* <Button 
                  onClick={() => scrollToSection('about')}
                  sx={{ 
                    mx: 1.5, 
                    color: 'text.primary',
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  About Us
                </Button> */}
                <Button 
                  component={Link as any}
                  href="/auth/signin"
                  variant="outlined"
                  sx={{ 
                    ml: 2, 
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'text.primary',
                    '&:hover': { borderColor: theme.palette.primary.main }
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={Link as any}
                  href="/auth/signup"
                  variant="contained"
                  sx={{ 
                    ml: 2,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
            
            {/* Mobile Menu */}
            {isMobile && (
              <Box>
                <IconButton
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <FiMenu />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    sx: { bgcolor: 'background.paper', width: 200 }
                  }}
                >
                  <MenuItem onClick={() => { handleCloseMenu(); scrollToSection('products'); }}>Products</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(); scrollToSection('services'); }}>Services</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(); scrollToSection('business'); }}>Business</MenuItem>
                  <MenuItem onClick={() => { handleCloseMenu(); scrollToSection('about'); }}>About Us</MenuItem>
                  <MenuItem component={Link as any} href="/auth/signin" onClick={handleCloseMenu}>Login</MenuItem>
                  <MenuItem 
                    component={Link as any} 
                    href="/auth/signup" 
                    onClick={handleCloseMenu}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Sign Up
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {/* Hero Section */}
      <Box sx={{ 
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'center'
          }}>
            {/* Hero Text Content */}
            <Box sx={{
              textAlign: { xs: 'center', md: 'left' },
              order: { xs: 2, md: 1 }
            }}>
              <Box sx={{ 
                display: 'inline-block', 
                px: 2, 
                py: 0.5, 
                mb: 2,
                borderRadius: 1,
                bgcolor: 'rgba(6, 214, 160, 0.1)',
              }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    letterSpacing: 0.5
                  }}
                >
                  LICENSED ONLINE BANK
                </Typography>
              </Box>
              
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Swift <Box component="span" sx={{ color: 'primary.main' }}>Mint Flow</Box> <br />
                Banking, Simplified
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}
              >
                Experience secure, fast, and convenient banking services designed for the modern world.
                Send money, pay bills, save, and grow your wealth with features designed for worldwide users.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: { xs: 'center', md: 'flex-start' },
                mb: 4
              }}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link as any}
                  href="/auth/signup"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': { bgcolor: theme.palette.primary.dark },
                    fontWeight: 600,
                    borderRadius: '8px'
                  }}
                >
                  Open an Account
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  component={Link as any}
                  href="/auth/signin"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'text.primary',
                    fontWeight: 600,
                    borderRadius: '8px',
                    '&:hover': { borderColor: theme.palette.primary.main }
                  }}
                >
                  Sign In
                </Button>
              </Box>
              
              {/* Trust indicators */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 3, 
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiLock size={18} color={theme.palette.primary.main} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    256-bit Encryption
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiShield size={18} color={theme.palette.primary.main} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    Federally Regulated
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiShield size={18} color={theme.palette.primary.main} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    FDIC Insured
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Hero Image/Illustration */}
            <Box sx={{ 
              order: { xs: 1, md: 2 },
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Box sx={{ 
                position: 'relative',
                width: '100%',
                maxWidth: 500,
                aspectRatio: '1 / 1',
                borderRadius: '24px',
                overflow: 'hidden',
                bgcolor: 'rgba(6, 214, 160, 0.05)',
                border: '1px solid rgba(6, 214, 160, 0.2)',
                p: 3
              }}>
                {/* Phone mockup with app interface */}
                <Box sx={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '20px',
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.1)',
                  p: 2,
                  boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* App header */}
                  <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>SwiftMint</Typography>
                      <Box sx={{ display: 'flex' }}>
                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.primary.main, mx: 0.5 }} />
                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', mx: 0.5 }} />
                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', mx: 0.5 }} />
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', md: '0.9rem' } }}>Welcome back, Alex</Typography>
                  </Box>
                  
                  {/* Balance card */}
                  <Box sx={{ 
                    mt: 2, 
                    p: 2,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(6,214,160,0.2) 0%, rgba(6,214,160,0.1) 100%)',
                    border: '1px solid rgba(6,214,160,0.3)'
                  }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Available Balance</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, my: 1, color: theme.palette.primary.main }}>{currency.symbol}1,287,452.63</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>6223 **** **** 5019</Typography>
                      <FiBarChart2 size={16} color={theme.palette.primary.main} />
                    </Box>
                  </Box>
                  
                  {/* Action buttons */}
                  <Box sx={{ 
                    mt: 2,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 1
                  }}>
                    {['Send', 'Request', 'Bills', 'Invest'].map(action => (
                      <Box key={action} sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: 'background.default',
                      }}>
                        <Box sx={{ 
                          width: { xs: 28, md: 36 }, 
                          height: { xs: 28, md: 36 }, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(6, 214, 160, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: 1
                        }}>
                          <FiArrowRight size={16} color={theme.palette.primary.main} />
                        </Box>
                        <Typography variant="caption">{action}</Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Transactions */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>Recent Transactions</Typography>
                    <Box sx={{ 
                      py: 1.5, 
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ 
                          width: { xs: 24, md: 32 }, 
                          height: { xs: 24, md: 32 }, 
                          borderRadius: '8px', 
                          bgcolor: 'rgba(6, 214, 160, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mr: 1.5
                        }}>
                          <FiSmartphone size={14} color={theme.palette.primary.main} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Bill Payment</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Electricity</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>- {currency.symbol}2,000</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Products Section */}
      <Box id="products" sx={{ 
        py: { xs: 6, md: 10 },
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Banking <Box component="span" sx={{ color: 'primary.main' }}>Products</Box>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' }
              }}
            >
              Our comprehensive suite of financial products designed to meet all your banking needs
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 4
          }}>
            {/* Savings Account */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                height: '100%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderColor: 'rgba(6, 214, 160, 0.3)'
                }
              }}
            >
              <Box sx={{ 
                width: 60, 
                height: 60,
                borderRadius: '12px',
                bgcolor: 'rgba(6, 214, 160, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <FiBarChart2 size={28} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>Savings Account</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                High-yield savings accounts with competitive interest rates. Watch your money grow while enjoying easy access to your funds.
              </Typography>
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 2, 
                borderRadius: 1.5,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Interest Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Up to 8% p.a.</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Minimum Balance</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{currency.symbol}1,000</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Withdrawal Limit</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Unlimited</Typography>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  mt: 2, 
                  borderColor: 'rgba(6, 214, 160, 0.5)',
                  color: theme.palette.primary.main,
                  '&:hover': { borderColor: theme.palette.primary.main, bgcolor: 'rgba(6, 214, 160, 0.05)' }
                }}
              >
                Learn More
              </Button>
            </Paper>
            
            {/* Loans */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                height: '100%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderColor: 'rgba(6, 214, 160, 0.3)'
                }
              }}
            >
              <Box sx={{ 
                width: 60, 
                height: 60,
                borderRadius: '12px',
                bgcolor: 'rgba(6, 214, 160, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <FiDollarSign size={28} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>Quick Loans</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Access instant loans with competitive rates and flexible repayment options. No collateral required for eligible customers.
              </Typography>
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 2, 
                borderRadius: 1.5,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Interest Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>From 2.5% monthly</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Loan Amount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Up to {currency.symbol}5 million</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Approval Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>As fast as 5 minutes</Typography>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  mt: 2, 
                  borderColor: 'rgba(6, 214, 160, 0.5)',
                  color: theme.palette.primary.main,
                  '&:hover': { borderColor: theme.palette.primary.main, bgcolor: 'rgba(6, 214, 160, 0.05)' }
                }}
              >
                Apply Now
              </Button>
            </Paper>
            
            {/* Virtual Cards */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                height: '100%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderColor: 'rgba(6, 214, 160, 0.3)'
                }
              }}
            >
              <Box sx={{ 
                width: 60, 
                height: 60,
                borderRadius: '12px',
                bgcolor: 'rgba(6, 214, 160, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <FiCreditCard size={28} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>Virtual Cards</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Generate virtual cards for secure online payments. Control spending limits and track all transactions in real-time.
              </Typography>
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 2, 
                borderRadius: 1.5,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Card Types</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Local Currency & Dollar</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Security</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>3D Secure</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Creation Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Free</Typography>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  mt: 2, 
                  borderColor: 'rgba(6, 214, 160, 0.5)',
                  color: theme.palette.primary.main,
                  '&:hover': { borderColor: theme.palette.primary.main, bgcolor: 'rgba(6, 214, 160, 0.05)' }
                }}
              >
                Get Started
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Our <Box component="span" sx={{ color: 'primary.main' }}>Services</Box>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' }
              }}
            >
              We offer a wide range of services designed to make banking easier and more convenient
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4
          }}>
            {/* Left column services */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Money Transfer */}
              <Box sx={{ 
                display: 'flex', 
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { borderColor: 'rgba(6, 214, 160, 0.3)' }
              }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50,
                  borderRadius: '10px',
                  bgcolor: 'rgba(6, 214, 160, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}>
                  <FiArrowRight size={22} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>Money Transfer</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Send money instantly to any bank account worldwide. Enjoy zero transfer fees to SwiftMint accounts and competitive rates for other banks.
                  </Typography>
                </Box>
              </Box>
              
              {/* Bill Payments */}
              <Box sx={{ 
                display: 'flex', 
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { borderColor: 'rgba(6, 214, 160, 0.3)' }
              }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50,
                  borderRadius: '10px',
                  bgcolor: 'rgba(6, 214, 160, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}>
                  <FiSmartphone size={22} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>Bill Payments</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Pay all your bills in one place - electricity, water, cable TV, internet subscription, and more. Get instant confirmations and receipts.
                  </Typography>
                </Box>
              </Box>
              
              {/* Airtime & Data */}
              <Box sx={{ 
                display: 'flex', 
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { borderColor: 'rgba(6, 214, 160, 0.3)' }
              }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50,
                  borderRadius: '10px',
                  bgcolor: 'rgba(6, 214, 160, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}>
                  <FiPhone size={22} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>Airtime & Data</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Purchase airtime and data for all major networks at discounted rates. Set up auto-recharge for never running out of data or airtime.
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Right column services */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Crypto Trading */}
              {/* <Box sx={{ 
                display: 'flex', 
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { borderColor: 'rgba(6, 214, 160, 0.3)' }
              }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50,
                  borderRadius: '10px',
                  bgcolor: 'rgba(6, 214, 160, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}>
                  <FiBarChart2 size={22} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>Crypto Trading</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Buy, sell, and store cryptocurrencies securely. Access competitive exchange rates and instant settlement to your account.
                  </Typography>
                </Box>
              </Box> */}
              
              {/* Investment Plans */}
              <Box sx={{ 
                display: 'flex', 
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { borderColor: 'rgba(6, 214, 160, 0.3)' }
              }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50,
                  borderRadius: '10px',
                  bgcolor: 'rgba(6, 214, 160, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}>
                  <FiDollarSign size={22} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>Investment Plans</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Grow your wealth with our various investment options. Choose from fixed deposits, mutual funds, and goal-based saving plans.
                  </Typography>
                </Box>
              </Box>
              
              {/* Customer Support */}
              <Box sx={{ 
                display: 'flex', 
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { borderColor: 'rgba(6, 214, 160, 0.3)' }
              }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50,
                  borderRadius: '10px',
                  bgcolor: 'rgba(6, 214, 160, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}>
                  <FiHelpCircle size={22} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>24/7 Support</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Get assistance anytime via in-app chat, email, or phone. Our dedicated support team is available round the clock to help you.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Business Section */}
      <Box id="business" sx={{ 
        py: { xs: 6, md: 10 },
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 6,
            alignItems: 'center'
          }}>
            {/* Business content */}
            <Box>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                <Box component="span" sx={{ color: 'primary.main' }}>Business</Box> Banking
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.125rem' }
                }}
              >
                Powerful financial tools for businesses of all sizes. From startups to established enterprises, 
                our business solutions help you manage finances efficiently.
              </Typography>
              
              {/* Business benefits */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {[
                  {
                    title: 'Business Accounts',
                    description: 'Dedicated business accounts with higher transaction limits and multiple user access.'
                  },
                  {
                    title: 'Payment Collection',
                    description: 'Generate custom payment links and QR codes to accept payments from customers.'
                  },
                  {
                    title: 'Business Loans',
                    description: 'Access working capital and expansion loans with flexible repayment terms.'
                  },
                  {
                    title: 'Financial Reports',
                    description: 'Comprehensive reports and analytics to track your business performance.'
                  }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: 'rgba(6, 214, 160, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      mt: 0.5
                    }}>
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 10, 
                          height: 10, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.primary.main 
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5 }}>{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Button 
                variant="contained"
                size="large"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  bgcolor: theme.palette.primary.main,
                  '&:hover': { bgcolor: theme.palette.primary.dark },
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Open Business Account
              </Button>
            </Box>
            
            {/* Business graphic */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <Box sx={{ 
                position: 'relative',
                width: '100%',
                maxWidth: 450,
                aspectRatio: '4/3',
                borderRadius: '24px',
                overflow: 'hidden',
                bgcolor: 'rgba(6, 214, 160, 0.03)',
                border: '1px solid rgba(6, 214, 160, 0.1)',
                p: 3
              }}>
                {/* Business dashboard mockup */}
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  p: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Dashboard header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    mb: 2
                  }}>
                    <Typography sx={{ fontWeight: 600 }}>Business Dashboard</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Swift Electronics Ltd</Typography>
                  </Box>
                  
                  {/* Financial summary */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    mb: 2
                  }}>
                    {[
                      { label: 'Balance', value: `${currency.symbol}3,457,892.45` },
                      { label: 'Pending', value: `${currency.symbol}245,000.00` },
                      { label: 'Total Sales', value: `${currency.symbol}12.4M` },
                      { label: 'Customers', value: '1,245' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ 
                        p: 1.5, 
                        borderRadius: 1.5, 
                        bgcolor: 'background.default',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.label}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Recent transactions */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>Recent Transactions</Typography>
                    {[
                      { name: 'Inventory Payment', type: 'Outflow', amount: `-${currency.symbol}450,000` },
                      { name: 'Customer Payment', type: 'Inflow', amount: `+${currency.symbol}275,000` },
                      { name: 'Utility Bills', type: 'Outflow', amount: `-${currency.symbol}35,420` }
                    ].map((transaction, index) => (
                      <Box key={index} sx={{ 
                        py: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{transaction.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{transaction.type}</Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.8rem',
                            color: transaction.type === 'Inflow' ? theme.palette.primary.main : 'text.primary'
                          }}
                        >
                          {transaction.amount}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ mb: 6, fontWeight: 700, textAlign: 'center' }}>
            Why Choose Swift Mint Flow?
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {/* Feature 1 */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  '&:hover': { borderColor: theme.palette.primary.main },
                  transition: 'border-color 0.3s'
                }}
              >
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: 'rgba(6, 214, 160, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <FiShield size={24} color={theme.palette.primary.main} />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Secure Banking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bank with confidence using state-of-the-art security measures.
                  Two-factor authentication and PIN verification for all transactions.
                </Typography>
              </Paper>
            </Box>

            {/* Feature 2 */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  '&:hover': { borderColor: theme.palette.primary.main },
                  transition: 'border-color 0.3s'
                }}
              >
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: 'rgba(6, 214, 160, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <FiSmartphone size={24} color={theme.palette.primary.main} />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Easy Mobile Banking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your finances anytime, anywhere with our intuitive mobile banking.
                  Send money, buy airtime, and pay bills in just a few taps.
                </Typography>
              </Paper>
            </Box>

            {/* Feature 3 */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  '&:hover': { borderColor: theme.palette.primary.main },
                  transition: 'border-color 0.3s'
                }}
              >
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: 'rgba(6, 214, 160, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <FiCreditCard size={24} color={theme.palette.primary.main} />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Instant Transfers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send money instantly. Same-bank transfers are
                  processed immediately with zero fees.
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              component={Link as any}
              href="/auth/signup"
              endIcon={<FiArrowRight />}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderColor: 'rgba(255,255,255,0.2)',
                color: theme.palette.primary.main
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          pt: 8,
          pb: 4, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <Container maxWidth="lg">
          {/* Main Footer Content */}
          <Grid component="div" container spacing={4} sx={{ mb: 6 }}>
            {/* Company Info */}
            <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                {/* <FiDollarSign size={28} color={theme.palette.primary.main} /> */}
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                  SwiftMint Flow
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Modern banking solutions for individuals and businesses worldwide. Secure, fast, and convenient.
              </Typography>
              
            </Grid>
            
            {/* Quick Links */}
            <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {[
                  { name: 'Personal Banking', href: '#products' },
                  { name: 'Business Banking', href: '#business' },
                  { name: 'Loans', href: '#products' },
                  { name: 'Investments', href: '#services' },
                  { name: 'Crypto', href: '#services' }
                ].map((link, index) => (
                  <MuiLink 
                    key={index} 
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href.substring(1))}
                    underline="hover"
                    sx={{ color: 'text.secondary', '&:hover': { color: theme.palette.primary.main } }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>
            
            {/* Legal */}
            {/* <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                {[
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Cookie Policy', href: '/cookies' },
                  { name: 'Security', href: '/security' },
                  { name: 'Compliance', href: '/compliance' }
                ].map((link, index) => (
                  <Link 
                    key={index} 
                    href={link.href}
                    underline="hover"
                    sx={{ color: 'text.secondary', '&:hover': { color: theme.palette.primary.main } }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid> */}
            
            {/* Contact */}
            <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Us
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiMapPin size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                  <Typography variant="body2" color="text.secondary">
                    123 Financial District, Suite 100
                    <br />New York, NY 10001
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiMail size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                  <Typography variant="body2" color="text.secondary">
                    support@swiftmintflow.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiPhone size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                  <Typography variant="body2" color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          
          {/* Download App Section */}
          <Box sx={{ 
            py: 4,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            mb: 4
          }}>
            
          </Box>
          
          {/* Copyright & Secondary Links */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'center' },
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
              © {new Date().getFullYear()} SwiftMint. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
            
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
