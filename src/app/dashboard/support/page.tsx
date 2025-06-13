"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  MenuItem,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { 
  FiHelpCircle, 
  FiPhone, 
  FiMessageSquare,
  FiChevronDown,
  FiUser,
  FiCreditCard,
  FiLock,
  FiDollarSign,
  FiSend,
  FiMail,
  FiCheck
} from 'react-icons/fi';

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`support-tabpanel-${index}`}
      aria-labelledby={`support-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SupportPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactType, setContactType] = useState('general');
  
  // FAQ data
  const faqs = [
    {
      id: 'faq1',
      question: 'How do I deposit money into my Swift Mint Flow account?',
      answer: 'You can deposit funds by linking your bank account, debit card, or through bank transfers to your Swift Mint Flow account number. You can also deposit at any of our partner banks across the United States.'
    },
    {
      id: 'faq2',
      question: 'How long does it take for transfers to process?',
      answer: 'Transfers between Swift Mint Flow accounts are instant. Transfers to other banks typically process within 1-2 hours during business days, but may take up to 24 hours depending on the receiving bank.'
    },
    {
      id: 'faq3',
      question: 'How do I change my password?',
      answer: 'You can change your password by navigating to your Profile page, selecting the Security tab, and following the password change instructions. You\'ll need your current password to set a new one.'
    },
    {
      id: 'faq4',
      question: 'Is there a limit on transfers?',
      answer: 'Yes, there are daily and monthly limits on transfers. Standard accounts can transfer up to $10,000 per day and $50,000 per month. You can request a limit increase by verifying your identity with additional documentation.'
    },
    {
      id: 'faq5',
      question: 'How do I report a suspicious transaction?',
      answer: 'If you notice any suspicious activity on your account, please contact our support team immediately through the Help & Support section or call our 24/7 helpline at +1-800-SWIFTMINT.'
    }
  ];
  
  // Support categories
  const supportCategories = [
    { icon: <FiUser />, title: 'Account', description: 'Account creation and management issues' },
    { icon: <FiCreditCard />, title: 'Cards', description: 'Card registration, usage, and issues' },
    { icon: <FiSend />, title: 'Transfers', description: 'Money transfer issues and inquiries' },
    { icon: <FiDollarSign />, title: 'Deposits', description: 'Deposit issues and questions' },
    { icon: <FiLock />, title: 'Security', description: 'Account security and protection' }
  ];
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is just UI demo, in real app would submit to API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setContactType('general');
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ 
        mb: { xs: 3, md: 4 }, 
        fontWeight: 600,
        fontSize: { xs: '1.75rem', md: '2.125rem' }
      }}>
        Help & Support
      </Typography>

      <Card sx={{ 
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        mb: 3
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '0.925rem' },
                fontWeight: 500,
                minHeight: { xs: 42, sm: 48 },
              }
            }}
          >
            <Tab icon={<FiHelpCircle />} iconPosition="start" label="FAQs" />
            <Tab icon={<FiMessageSquare />} iconPosition="start" label="Contact Us" />
            <Tab icon={<FiPhone />} iconPosition="start" label="Live Chat" />
          </Tabs>
        </Box>
        
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* FAQs Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Frequently Asked Questions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Find quick answers to common questions about using Swift Mint Flow.
              </Typography>
              
              <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
                {faqs.map((faq) => (
                  <Accordion 
                    key={faq.id}
                    expanded={expanded === faq.id}
                    onChange={handleAccordionChange(faq.id)}
                    sx={{
                      bgcolor: 'transparent',
                      boxShadow: 'none',
                      '&:before': { display: 'none' },
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<FiChevronDown />}
                      aria-controls={`${faq.id}-content`}
                      id={`${faq.id}-header`}
                      sx={{ px: 0 }}
                    >
                      <Typography fontWeight={500} sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
            
            <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
            
            {/* <Box>
              <Typography variant="h6" gutterBottom>
                Support Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a category to find more specific help articles.
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
                mt: 3
              }}>
                {supportCategories.map((category, index) => (
                  <Card 
                    key={index} 
                    sx={{ 
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid rgba(255,255,255,0.05)',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{ 
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: 'rgba(46, 204, 113, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {React.cloneElement(category.icon, { 
                          color: theme.palette.primary.main,
                          size: 18
                        })}
                      </Box>
                      <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        {category.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      {category.description}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box> */}
          </TabPanel>
          
          {/* Contact Us Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Contact Swift Mint Flow Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We're here to help! Fill out the form below and our support team will respond within 24 hours.
              </Typography>
              
              {success && (
                <Alert 
                  icon={<FiCheck />}
                  severity="success"
                  sx={{ 
                    mb: 3,
                    alignItems: 'center',
                    bgcolor: 'rgba(46, 204, 113, 0.1)',
                    color: theme.palette.primary.main,
                    '& .MuiAlert-icon': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  Thank you for contacting us! We've received your message and will respond within 24 hours.
                </Alert>
              )}
              
              <Box 
                component="form"
                onSubmit={handleSubmitContact}
                sx={{ 
                  mt: { xs: 1.5, md: 2 }, 
                  display: 'grid', 
                  gap: { xs: 2, md: 2.5 },
                  gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' },
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }
                }}
              >
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'span 1' } }}
                />
                
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'span 1' } }}
                />
                
                <TextField
                  select
                  label="Contact Type"
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value)}
                  fullWidth
                  required
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'span 1' } }}
                >
                  <MenuItem value="general">General Inquiry</MenuItem>
                  <MenuItem value="account">Account Issues</MenuItem>
                  <MenuItem value="transaction">Transaction Problems</MenuItem>
                  <MenuItem value="technical">Technical Support</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                </TextField>
                
                <TextField
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  required
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'span 1' } }}
                />
                
                <TextField
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={6}
                  sx={{ gridColumn: 'span 2' }}
                />
                
                <Box sx={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !name || !email || !subject || !message}
                    sx={{
                      py: 1.2,
                      px: 3,
                      bgcolor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(46, 204, 113, 0.3)',
                      }
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FiMail />}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ 
                mt: 6, 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 3
              }}>
                <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(46, 204, 113, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <FiPhone size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontSize="1rem" gutterBottom>
                    Phone Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +1-800-SWIFTMINT<br />
                    Available 24/7
                  </Typography>
                </Card>
                
                <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(46, 204, 113, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <FiMail size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontSize="1rem" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@swiftmintflow.com<br />
                    Responses within 24 hours
                  </Typography>
                </Card>
                
                <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(46, 204, 113, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <FiMessageSquare size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontSize="1rem" gutterBottom>
                    Live Chat
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chat with our team<br />
                    Available 8am-10pm ET
                  </Typography>
                </Card>
              </Box>
            </Box>
          </TabPanel>
          
          {/* Live Chat Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Live Chat Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Chat with our support agents in real-time for immediate assistance with your Swift Mint Flow account.
              </Typography>
              
              <Card sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: '1px solid rgba(255,255,255,0.05)',
                height: '400px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Chat Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  pb: 2,
                  borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(46, 204, 113, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiMessageSquare size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={500}>
                      Swift Mint Flow Support
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.primary.main,
                          display: 'inline-block'
                        }}
                      />
                      Online now
                    </Typography>
                  </Box>
                </Box>
                
                {/* Chat Messages Area */}
                <Box sx={{ 
                  flex: 1, 
                  py: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  overflowY: 'auto'
                }}>
                  {/* Support Message */}
                  <Box sx={{ display: 'flex', gap: 1.5, maxWidth: '80%' }}>
                    <Box sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'rgba(46, 204, 113, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.5
                    }}>
                      <FiUser size={16} color={theme.palette.primary.main} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Support Agent • 1m ago
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        p: 1.5, 
                        borderRadius: '4px 16px 16px 16px',
                        mt: 0.5
                      }}>
                        <Typography variant="body2">
                          Hello! Welcome to Swift Mint Flow support. How can I assist you today?
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* User Message */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 1.5, 
                    maxWidth: '80%', 
                    alignSelf: 'flex-end'
                  }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
                        You • Just now
                      </Typography>
                      <Box sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        p: 1.5, 
                        borderRadius: '16px 4px 16px 16px',
                        mt: 0.5,
                        color: '#fff'
                      }}>
                        <Typography variant="body2">
                          I need help with setting up my account.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                {/* Chat Input Area */}
                <Box sx={{ 
                  pt: 2, 
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  gap: 1
                }}>
                  <TextField
                    placeholder="Type your message here..."
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    sx={{
                      borderRadius: 2,
                      minWidth: '44px',
                      p: 1,
                      bgcolor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      }
                    }}
                  >
                    <FiSend size={18} />
                  </Button>
                </Box>
              </Card>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Live Chat Hours
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our live chat support is available from 8:00 AM to 10:00 PM ET (Eastern Time), seven days a week.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  During off-hours, please use the contact form or email support@swiftmintflow.com for assistance.
                </Typography>
              </Box>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
