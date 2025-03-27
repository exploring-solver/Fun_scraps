import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, createTheme, 
  CssBaseline, Box, Container,
  AppBar, Toolbar, Typography, 
  IconButton, Avatar, Drawer, 
  List, ListItem, ListItemIcon, 
  ListItemText, Divider, Paper,
  Fab, useMediaQuery, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Timelapse as TimelapseIcon,
  BarChart as ChartIcon,
  Healing as HealingIcon,
  Psychology as AIIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Public as PublicIcon
} from '@mui/icons-material';

// Import components
import OnboardingFlow from './pages/OnboardingFlow';
import FeatureNavigationCards from './components/FeatureNavigationCards';
import AstrologyApp from './pages/AstrologyApp';
import KundaliChart from './pages/NorthIndianChart';
import PredictionConfidence from './pages/PredictionConfidence';
import RemedialRecommendations from './pages/RemedialRecommendations';

// Create theme
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#5e35b1', // Deep purple for mystical feel
    },
    secondary: {
      main: '#ff9800', // Orange for energy
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

// Main App component
const App = () => {
  const [themeMode, setThemeMode] = useState('light');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(true); // Set to false to see onboarding
  
  const theme = getTheme(themeMode);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Toggle theme
  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Change view with loading indicator
  const changeView = (viewName) => {
    setLoading(true);
    setTimeout(() => {
      setActiveView(viewName);
      setLoading(false);
      setDrawerOpen(false);
    }, 500);
  };
  
  // Show notification
  const showNotification = (message, severity = 'info') => {
    setNotification({ message, severity });
  };
  
  // Close notification
  const closeNotification = () => {
    setNotification(null);
  };
  
  // Complete onboarding
  const completeOnboarding = () => {
    setLoading(true);
    setTimeout(() => {
      setIsOnboarded(true);
      setActiveView('dashboard');
      setLoading(false);
      showNotification('Profile created successfully!', 'success');
    }, 1500);
  };
  
  // Menu items for navigation drawer
  const menuItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', view: 'dashboard' },
    { icon: <StarIcon />, text: 'Birth Chart', view: 'birthchart' },
    { icon: <TimelapseIcon />, text: 'Predictions', view: 'predictions' },
    { icon: <HealingIcon />, text: 'Remedies', view: 'remedies' },
    { icon: <ChartIcon />, text: 'AI Insights', view: 'insights' },
    { icon: <PublicIcon />, text: 'Transits', view: 'transits' },
  ];
  
  // Render active view content
  const renderContent = () => {
    if (!isOnboarded) {
      return <OnboardingFlow onComplete={completeOnboarding} />;
    }
    
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
          <CircularProgress />
        </Box>
      );
    }
    
    switch (activeView) {
      case 'home':
        return <FeatureNavigationCards onNavigate={changeView} />;
      case 'dashboard':
        return <AstrologyApp />;
      case 'birthchart':
        return <KundaliChart />;
      case 'predictions':
        return <PredictionConfidence />;
      case 'remedies':
        return <RemedialRecommendations />;
      case 'insights':
        return (
          <Paper sx={{ p: 4, m: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AIIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h5">AI Insights</Typography>
            </Box>
            <Typography paragraph>
              This section would contain detailed AI insights about your astrological chart.
            </Typography>
          </Paper>
        );
      default:
        return <FeatureNavigationCards onNavigate={changeView} />;
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AstroAI
            </Typography>
            <IconButton color="inherit" onClick={() => showNotification('New prediction available!', 'info')}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleTheme}>
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={() => changeView('profile')}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
            {/* Toggle Onboarding Button */}
            <IconButton
              color="inherit"
              onClick={() => setIsOnboarded((prev) => !prev)}
              sx={{ ml: 2 }}
            >
              <Typography variant="button">
                {isOnboarded ? 'Show Onboarding' : 'Skip Onboarding'}
              </Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
        
        {/* Navigation Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <StarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">AstroAI</Typography>
            </Box>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text} 
                  onClick={() => changeView(item.view)}
                  selected={activeView === item.view}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: activeView === item.view ? 'primary.main' : 'inherit' 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: activeView === item.view ? 'bold' : 'regular' 
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              <ListItem button onClick={() => changeView('settings')}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, pt: 8, pb: 2 }}>
          <Container maxWidth="lg">
            {renderContent()}
          </Container>
        </Box>
        
        {/* Floating Action Button - Mobile only */}
        {isMobile && isOnboarded && (
          <Fab 
            color="secondary" 
            aria-label="daily predictions"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => showNotification('Daily prediction updated!', 'success')}
          >
            <AddIcon />
          </Fab>
        )}
        
        {/* Notification Snackbar */}
        <Snackbar 
          open={notification !== null} 
          autoHideDuration={6000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {notification && (
            <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;