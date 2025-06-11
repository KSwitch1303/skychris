'use client';

import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  useTheme 
} from '@mui/material';
import Link from 'next/link';
import { FiShield, FiSmartphone, FiCreditCard, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const theme = useTheme();
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      {/* Hero Section */}
      <Box sx={{ 
        py: { xs: 6, md: 10 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' } 
            }}
          >
            Swift <Box component="span" sx={{ color: 'primary.main' }}>Mint Flow</Box>
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 400,
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: 'text.secondary'
            }}
          >
            Banking Made Simple
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Box sx={{ width: { xs: '100%', sm: '83.33%', md: '66.66%' }, px: 1.5 }}>
              <Typography variant="body1" sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                Experience secure, fast, and convenient banking services designed for the modern world.
                Send money, pay bills, save, and grow your wealth with Swift Mint Flow.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link as any}
                  href="/auth/signup"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  Get Started
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
                    color: 'text.primary'
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
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
          py: 4, 
          bgcolor: 'background.default', 
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <Container>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Swift Mint Flow. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
