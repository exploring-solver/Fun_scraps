import React from 'react';
import {
  Box, Grid, Card, CardContent, CardActions,
  Typography, Button, CardMedia, Paper, Chip,
  useTheme, alpha
} from '@mui/material';
import {
  Star as StarIcon,
  Psychology as AIIcon,
  Timeline as TimelineIcon,
  Healing as HealingIcon,
  Timelapse as TimelapseIcon,
  BarChart as ChartIcon,
  DonutLarge as DonutIcon,
  Favorite as HeartIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  FlashOn as FlashOnIcon,
  Fingerprint as FingerprintIcon
} from '@mui/icons-material';

// FeatureNavigationCards component
const FeatureNavigationCards = ({ onNavigate }) => {
  const theme = useTheme();
  
  // Define feature cards
  const features = [
    {
      title: 'Daily Predictions',
      description: 'AI-powered daily guidance based on planetary transits and your birth chart.',
      icon: <TimelapseIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      image: 'https://source.unsplash.com/random/400x200/?stars',
      action: 'Explore Daily Insights',
      route: 'dashboard',
      stats: [
        { label: 'Accuracy', value: '92%' },
        { label: 'Personalization', value: 'High' }
      ],
      highlight: 'Today\'s Top Insight: Focus on financial planning as Mercury enters your 2nd house.',
      tags: ['AI-Enhanced', 'Personalized']
    },
    {
      title: 'Birth Chart Analysis',
      description: 'Interactive Kundali chart with detailed planetary positions and aspects.',
      icon: <DonutIcon sx={{ fontSize: 40 }} />,
      color: '#8e24aa',
      image: 'https://source.unsplash.com/random/400x200/?astrology',
      action: 'View Your Chart',
      route: 'birthchart',
      stats: [
        { label: 'Detail Level', value: 'Extensive' },
        { label: 'Vedic System', value: 'Yes' }
      ],
      highlight: 'Your ascendant in Libra gives you a diplomatic and balanced approach to life.',
      tags: ['Interactive', 'Vedic Astrology']
    },
    {
      title: 'Life Event Predictions',
      description: 'ML-powered forecasts of significant events in your career, relationships, and more.',
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      color: '#00897b',
      image: 'https://source.unsplash.com/random/400x200/?future',
      action: 'Discover Your Timeline',
      route: 'predictions',
      stats: [
        { label: 'Prediction Range', value: '3 Years' },
        { label: 'ML Confidence', value: '87%' }
      ],
      highlight: 'Career opportunity detected between August-October 2025.',
      tags: ['Machine Learning', 'Timeline']
    },
    {
      title: 'Remedial Suggestions',
      description: 'AI-curated remedies to balance challenging planetary influences in your chart.',
      icon: <HealingIcon sx={{ fontSize: 40 }} />,
      color: '#d81b60',
      image: 'https://source.unsplash.com/random/400x200/?meditation',
      action: 'Explore Remedies',
      route: 'remedies',
      stats: [
        { label: 'Custom Fit', value: '95%' },
        { label: 'Remedy Types', value: 'Multiple' }
      ],
      highlight: 'Your Saturn remedies have helped 83% of users with similar charts.',
      tags: ['Personalized', 'Scientific']
    },
    {
      title: 'AI Insights',
      description: 'Deep learning analysis of your chart, comparing patterns with thousands of similar charts.',
      icon: <AIIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      image: 'https://source.unsplash.com/random/400x200/?artificial intelligence',
      action: 'Unlock Insights',
      route: 'insights',
      stats: [
        { label: 'Data Points', value: '100K+' },
        { label: 'Update Frequency', value: 'Daily' }
      ],
      highlight: 'AI detected correlations between your Jupiter position and learning abilities.',
      tags: ['Deep Learning', 'Pattern Recognition']
    },
    {
      title: 'Compatibility Analysis',
      description: 'Check your astrological compatibility for relationships, business, and more.',
      icon: <HeartIcon sx={{ fontSize: 40 }} />,
      color: '#e53935',
      image: 'https://source.unsplash.com/random/400x200/?relationship',
      action: 'Check Compatibility',
      route: 'compatibility',
      stats: [
        { label: 'Factors Analyzed', value: '27' },
        { label: 'Match Score', value: 'Detailed' }
      ],
      highlight: 'Your relationship compatibility with fire signs is exceptionally strong.',
      tags: ['Relationships', 'Business']
    }
  ];
  
  // Hero section content
  const heroContent = {
    title: 'Your AI-Powered Vedic Astrology Guide',
    subtitle: 'Harnessing Artificial Intelligence to unlock the ancient wisdom of Hindu astrology',
    description: 'AstroAI combines traditional Vedic astrology with advanced machine learning to provide personalized predictions and guidance tailored to your unique birth chart.',
    stats: [
      { icon: <FingerprintIcon />, label: 'Personalized', value: '100%' },
      { icon: <AIIcon />, label: 'AI-Powered', value: 'Advanced ML' },
      { icon: <FlashOnIcon />, label: 'Daily Updates', value: 'Real-time' },
      { icon: <TrendingUpIcon />, label: 'Accuracy', value: '92%' }
    ]
  };
  
  return (
    <Box sx={{ py: 2 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          position: 'relative'
        }}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          opacity: 0.1,
          backgroundImage: 'url(https://source.unsplash.com/random/1200x400/?galaxy)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        
        <Box sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 700 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {heroContent.title}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {heroContent.subtitle}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              {heroContent.description}
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {heroContent.stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    p: 2,
                    borderRadius: 2
                  }}>
                    {stat.icon}
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'center' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                onClick={() => onNavigate('dashboard')}
              >
                Today's Predictions
              </Button>
              <Button 
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'white' }}
                size="large"
                onClick={() => onNavigate('birthchart')}
              >
                View Birth Chart
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Feature Cards */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Explore Key Features
      </Typography>
      
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={feature.image}
                  alt={feature.title}
                />
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(to bottom, transparent 0%, ${alpha(feature.color, 0.8)} 100%)`,
                  }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    bgcolor: 'white',
                    color: feature.color,
                    borderRadius: '50%',
                    p: 1,
                    boxShadow: theme.shadows[4]
                  }}
                >
                  {feature.icon}
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 1 }}>
                  {feature.tags.map((tag, idx) => (
                    <Chip 
                      key={idx}
                      label={tag}
                      size="small"
                      sx={{ 
                        mr: 0.5, 
                        mb: 0.5, 
                        bgcolor: alpha(feature.color, 0.1),
                        color: feature.color,
                        fontWeight: 'medium'
                      }}
                    />
                  ))}
                </Box>
                
                <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    mb: 2, 
                    bgcolor: alpha(feature.color, 0.05),
                    borderColor: alpha(feature.color, 0.2)
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LightbulbIcon sx={{ color: feature.color, mr: 1, fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Insight Preview
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {feature.highlight}
                  </Typography>
                </Paper>
                
                <Grid container spacing={1}>
                  {feature.stats.map((stat, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {stat.label}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => onNavigate(feature.route)}
                  sx={{ 
                    color: feature.color,
                    borderColor: feature.color,
                    '&:hover': {
                      bgcolor: alpha(feature.color, 0.1)
                    }
                  }}
                  variant="outlined"
                >
                  {feature.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* AI Technology Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mt: 4, 
          borderRadius: 2, 
          background: `linear-gradient(45deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <AIIcon color="primary" sx={{ fontSize: 40, mr: 2, mt: 1 }} />
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Powered by Advanced Artificial Intelligence
            </Typography>
            <Typography variant="body1" paragraph>
              AstroAI uses a hybrid system combining rule-based astrological calculations with machine learning models
              trained on thousands of birth charts and life outcomes. Our system continuously learns from user feedback
              to improve prediction accuracy and relevance.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => onNavigate('insights')}
            >
              Explore AI Technology
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FeatureNavigationCards;