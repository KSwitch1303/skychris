"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  Divider,
  Chip,
} from '@mui/material';
import { 
  FiCreditCard, 
  FiPlus, 
  FiAlertCircle,
  FiTrash2,
  FiRefreshCw
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function CardsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch user's saved cards on component mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Fetch cards from the API
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/signin');
          return;
        }

        const response = await fetch('/api/cards', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        setCards(data.cards || []);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load your cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Simulate data fetch with setTimeout for demo purposes
    setTimeout(() => {
      // Demo data for UI preview
      setCards([
        {
          id: '1',
          cardType: 'visa',
          lastFour: '4242',
          expiryMonth: '12',
          expiryYear: '2025',
          cardholderName: 'John Doe',
          isDefault: true,
        },
        {
          id: '2',
          cardType: 'mastercard',
          lastFour: '5678',
          expiryMonth: '10',
          expiryYear: '2026',
          cardholderName: 'John Doe',
          isDefault: false,
        }
      ]);
      setLoading(false);
    }, 1500);

    // Uncomment to fetch real data
    // fetchCards();
  }, [router]);

  const handleAddCard = () => {
    setSnackbarMessage('Please go to the Deposits page to add a new card.');
    setOpenSnackbar(true);
  };

  const handleRemoveCard = (cardId: string) => {
    // In a real implementation, this would call the API to remove the card
    setCards(cards.filter(card => card.id !== cardId));
    setSnackbarMessage('Card removed successfully.');
    setOpenSnackbar(true);
  };

  const handleMakeDefault = (cardId: string) => {
    // In a real implementation, this would call the API to set default card
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    setSnackbarMessage('Default card updated.');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getCardIcon = (cardType: string) => {
    // In a real implementation, you might use different card brand logos
    return <FiCreditCard size={24} />;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ 
        mb: { xs: 3, md: 4 }, 
        fontWeight: 600,
        fontSize: { xs: '1.75rem', md: '2.125rem' }
      }}>
        Cards
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Card sx={{ 
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Saved Cards
              </Typography>
              <Button 
                variant="contained"
                startIcon={<FiPlus />}
                onClick={handleAddCard}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                Add Card
              </Button>
            </Box>

            {loading ? (
              // Loading skeleton
              <Grid container spacing={3}>
                {[1, 2].map((index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Skeleton variant="rectangular" height={40} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : error ? (
              // Error state
              <Alert 
                severity="error" 
                icon={<FiAlertCircle />}
                sx={{ 
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  color: '#f44336',
                  '& .MuiAlert-icon': { color: '#f44336' }
                }}
              >
                {error}
                <Button 
                  startIcon={<FiRefreshCw />} 
                  variant="text" 
                  sx={{ ml: 2 }}
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </Alert>
            ) : cards.length === 0 ? (
              // No cards state
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.02)'
                }}
              >
                <FiCreditCard size={48} color="rgba(255,255,255,0.2)" />
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                  No Cards Added Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                  You haven't added any cards to your account. Add a card to make deposits and payments easier.
                </Typography>
                <Button 
                  variant="contained"
                  startIcon={<FiPlus />}
                  onClick={handleAddCard}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                    borderRadius: 2,
                  }}
                >
                  Add Your First Card
                </Button>
              </Box>
            ) : (
              // Card list
              <Grid container spacing={3}>
                {cards.map((card) => (
                  <Grid item xs={12} sm={6} key={card.id}>
                    <Card sx={{ 
                      borderRadius: 2, 
                      border: '1px solid rgba(255,255,255,0.05)',
                      position: 'relative',
                      overflow: 'visible',
                    }}>
                      {card.isDefault && (
                        <Chip 
                          label="Default" 
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: -10, 
                            right: 16, 
                            bgcolor: theme.palette.primary.main,
                            color: '#fff',
                            fontSize: '0.75rem',
                            height: 20,
                          }}
                        />
                      )}
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            alignItems: 'center'
                          }}>
                            <Box sx={{ 
                              width: 48,
                              height: 32,
                              borderRadius: 1,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {getCardIcon(card.cardType)}
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                {card.cardType}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                •••• {card.lastFour}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Expires: {card.expiryMonth}/{card.expiryYear}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {card.cardholderName}
                        </Typography>
                        
                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {!card.isDefault && (
                            <Button 
                              size="small" 
                              variant="text" 
                              sx={{ fontSize: '0.75rem' }}
                              onClick={() => handleMakeDefault(card.id)}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button 
                            size="small" 
                            variant="text" 
                            sx={{ fontSize: '0.75rem', color: '#f44336' }}
                            startIcon={<FiTrash2 size={14} />}
                            onClick={() => handleRemoveCard(card.id)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Card sx={{ 
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Adding a New Card
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              To add a new card to your account, please go to the Deposits page and select the "Save this card" option when making a deposit.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Saved cards can be used for future deposits and payments without having to re-enter your card information.
            </Typography>
            <Button 
              variant="outlined"
              onClick={() => router.push('/dashboard/deposits')}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  bgcolor: 'rgba(46, 204, 113, 0.08)',
                },
                borderRadius: 2,
                mt: 1
              }}
            >
              Go to Deposits
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        ContentProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'text.primary',
          }
        }}
      />
    </Box>
  );
}
