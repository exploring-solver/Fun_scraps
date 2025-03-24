import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Grid, Paper, Button, 
  TextField, Card, CardContent, CardActions, CardHeader, 
  Stepper, Step, StepLabel, CircularProgress, Tabs, Tab, 
  Box, Avatar, List, ListItem, ListItemText, ListItemIcon,
  Chip, Divider, IconButton, LinearProgress, Accordion,
  AccordionSummary, AccordionDetails, BottomNavigation, BottomNavigationAction
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Brightness7 as SunIcon,
  Brightness2 as MoonIcon,
  Stars as StarsIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Favorite as FavoriteIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Healing as HealthIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Timeline as TimelineIcon,
  CloudUpload as CloudUploadIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock data for demo purposes
const dailyPredictions = [
  { category: 'Overall', prediction: 'Today is generally favorable for new beginnings and social activities.', score: 80 },
  { category: 'Career', prediction: 'Be cautious with workplace communications today. Mars in your 10th house might create tension.', score: 60 },
  { category: 'Relationships', prediction: 'A good day to resolve conflicts. Venus supports harmonious conversations.', score: 85 },
  { category: 'Health', prediction: 'Focus on mental wellbeing. Meditation will be particularly effective today.', score: 75 },
  { category: 'Finance', prediction: 'Avoid major purchases today. Saturn suggests delayed returns on investments.', score: 50 },
];

const lifeEventPredictions = [
  { event: 'Career Peak', timing: '2025-2027', probability: 85, description: 'Jupiter transit through your 10th house indicates career advancement' },
  { event: 'Relationship Milestone', timing: 'Late 2026', probability: 70, description: 'Venus-Mars conjunction suggests significant relationship developments' },
  { event: 'Financial Growth', timing: '2027-2028', probability: 80, description: 'Saturn in 11th house indicates stable financial growth period' },
];

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1', // Deep purple for mystical feel
    },
    secondary: {
      main: '#ff9800', // Orange for energy
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Main component
const AstrologyApp = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [birthDate, setBirthDate] = useState(null);
  const [birthPlace, setBirthPlace] = useState('');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, onboarding, profile, insights

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOnboardingNext = () => {
    setOnboardingStep(onboardingStep + 1);
    if (onboardingStep === 2) {
      // Completed onboarding
      setCurrentView('dashboard');
    }
  };

  const renderOnboarding = () => (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Personalized Astrology Journey
        </Typography>
        <Stepper activeStep={onboardingStep} sx={{ my: 4 }}>
          <Step>
            <StepLabel>Birth Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Life Goals</StepLabel>
          </Step>
          <Step>
            <StepLabel>Connect</StepLabel>
          </Step>
        </Stepper>

        {onboardingStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Enter Your Birth Details</Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              We'll use this information to generate your Kundali chart and personalized predictions.
            </Typography>
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
              
            {/* </LocalizationProvider> */}
            <TextField
              label="Birth Place"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              fullWidth
              margin="normal"
              helperText="Enter city, state, country"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOnboardingNext}
                disabled={!birthDate || !birthPlace}
                fullWidth
              >
                Next: Your Life Goals
              </Button>
            </Box>
          </Box>
        )}

        {onboardingStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>What matters most to you?</Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              This helps our AI focus on aspects that are most relevant to your journey.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {['Career', 'Relationships', 'Health', 'Wealth', 'Spirituality', 'Family'].map((area) => (
                <Grid item xs={6} key={area}>
                  <Chip
                    label={area}
                    clickable
                    color="primary"
                    variant="outlined"
                    onClick={() => {}}
                    sx={{ width: '100%', height: 40 }}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={() => setOnboardingStep(0)}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOnboardingNext}
                sx={{ ml: 1 }}
              >
                Next: Connect
              </Button>
            </Box>
          </Box>
        )}

        {onboardingStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>How you'll receive insights</Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Our AI system will analyze your Kundali and provide personalized guidance.
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="subtitle2">Daily Predictions</Typography>
                  <Typography variant="body2">
                    Customized guidance based on planetary transits relative to your birth chart
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'secondary.light' }}>
                  <Typography variant="subtitle2">Life Event Forecasts</Typography>
                  <Typography variant="body2">
                    Long-term predictions for major life events, relationships, and career
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'info.light', color: 'white' }}>
                  <Typography variant="subtitle2">AI-Enhanced Learning</Typography>
                  <Typography variant="body2">
                    Our system learns from your feedback to improve future predictions
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={() => setOnboardingStep(1)}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOnboardingNext}
                sx={{ ml: 1 }}
              >
                Complete Setup
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );

  const renderDashboard = () => (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* User greeting */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.light', color: 'white' }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar sx={{ bgcolor: 'primary.dark', width: 56, height: 56 }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5">Namaste, User</Typography>
                <Typography variant="body2">
                  Saturn's transit brings focus to your career today
                </Typography>
              </Grid>
              <Grid item>
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Today's planetary influences */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Today's Planetary Influences</Typography>
            <Grid container spacing={2}>
              {['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].map((planet) => (
                <Grid item xs={4} sm={2.4} key={planet}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: planet === 'Sun' ? 'orange' : 
                                   planet === 'Moon' ? 'grey' : 
                                   planet === 'Mercury' ? 'purple' : 
                                   planet === 'Venus' ? 'pink' : 'red',
                                   margin: '0 auto' }}>
                      {planet === 'Sun' ? <SunIcon /> : <StarsIcon />}
                    </Avatar>
                    <Typography variant="body2" sx={{ mt: 1 }}>{planet}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Daily predictions */}
        <Grid item xs={12}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Today's Predictions" 
              subheader="Based on your Kundali and current transits"
            />
            <CardContent>
              {dailyPredictions.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar sx={{ 
                        bgcolor: item.category === 'Career' ? 'primary.light' : 
                                 item.category === 'Relationships' ? 'secondary.light' : 
                                 item.category === 'Health' ? 'success.light' : 
                                 item.category === 'Finance' ? 'warning.light' : 'info.light'
                      }}>
                        {item.category === 'Career' ? <WorkIcon /> : 
                         item.category === 'Relationships' ? <FavoriteIcon /> : 
                         item.category === 'Health' ? <HealthIcon /> : 
                         item.category === 'Finance' ? <MoneyIcon /> : <StarsIcon />}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1">{item.category}</Typography>
                      <Typography variant="body2" color="textSecondary">{item.prediction}</Typography>
                    </Grid>
                    <Grid item>
                      <CircularProgress 
                        variant="determinate" 
                        value={item.score} 
                        color={item.score > 70 ? "success" : item.score > 50 ? "warning" : "error"}
                        size={36}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="caption" color="textSecondary" sx={{ mr: 2 }}>
                      Was this prediction helpful?
                    </Typography>
                    <IconButton size="small" color="primary">
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {index < dailyPredictions.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" endIcon={<ChevronRightIcon />}>
                View Detailed Analysis
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Life event timeline */}
        <Grid item xs={12}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Life Event Predictions" 
              subheader="AI-powered forecasts based on your Kundali"
              action={
                <IconButton>
                  <TimelineIcon />
                </IconButton>
              }
            />
            <CardContent>
              {lifeEventPredictions.map((event, index) => (
                <Accordion key={index} elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">{event.event}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Chip label={event.timing} size="small" color="primary" variant="outlined" />
                      </Grid>
                      <Grid item xs={3}>
                        <LinearProgress 
                          variant="determinate" 
                          value={event.probability} 
                          color="secondary"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="textSecondary">
                      {event.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Confidence: {event.probability}% • Based on traditional Kundali analysis and AI predictions
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Learning Section */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>How Our AI Learns From You</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', margin: '0 auto', width: 56, height: 56 }}>
                    <CloudUploadIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Your Data</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Birth details, feedback, and interactions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', margin: '0 auto', width: 56, height: 56 }}>
                    <AssessmentIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>AI Analysis</Typography>
                  <Typography variant="body2" color="textSecondary">
                    ML models process your unique patterns
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', margin: '0 auto', width: 56, height: 56 }}>
                    <StarsIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Better Predictions</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Personalized insights improve over time
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  const renderNavigation = () => (
    <BottomNavigation
      value={activeTab}
      onChange={handleTabChange}
      showLabels
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }}
    >
      <BottomNavigationAction label="Today" icon={<SunIcon />} />
      <BottomNavigationAction label="Chart" icon={<DonutLargeIcon />} />
      <BottomNavigationAction label="Predictions" icon={<TimelineIcon />} />
      <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
    </BottomNavigation>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, pb: 7 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AstroAI
            </Typography>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        {currentView === 'onboarding' && renderOnboarding()}
        {currentView === 'dashboard' && renderDashboard()}
        
        {renderNavigation()}
      </Box>
    </ThemeProvider>
  );
};

// Helper components
const DonutLargeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M11 5.08V2c-5 .5-9 4.81-9 10s4 9.5 9 10v-3.08c-3-.48-6-3.4-6-6.92s3-6.44 6-6.92zM18.97 11H22c-.47-5-4-8.53-9-9v3.08C16 5.51 18.54 8 18.97 11zM13 18.92V22c5-.47 8.53-4 9-9h-3.03c-.43 3-2.97 5.49-5.97 5.92z"/>
  </svg>
);

export default AstrologyApp;