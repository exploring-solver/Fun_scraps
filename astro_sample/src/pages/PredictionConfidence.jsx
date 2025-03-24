import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Paper, 
  Slider, Chip, Divider, List, ListItem, ListItemText, 
  ListItemIcon, IconButton, Tooltip, LinearProgress,
  Button, Menu, MenuItem, Switch, FormControlLabel
} from '@mui/material';
import { 
  InsertChart as ChartIcon,
  Psychology as AIIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  BarChart as BarChartIcon,
  BubbleChart as BubbleChartIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon,
  Work as WorkIcon,
  School as EducationIcon,
  LocalHospital as HealthIcon,
  AccountBalance as WealthIcon,
  Home as FamilyIcon,
  Star as SpiritualityIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

// Sample prediction data with ML model confidence scores
const predictionData = {
  timestamp: new Date().toISOString(),
  user_id: "user123",
  lifeAreas: [
    {
      area: "Career",
      icon: <WorkIcon />,
      prediction: "Favorable period for career growth with potential for leadership role",
      confidence: 87,
      models: [
        { name: "Random Forest", confidence: 92, weight: 0.4 },
        { name: "XGBoost", confidence: 79, weight: 0.35 },
        { name: "Neural Network", confidence: 88, weight: 0.25 }
      ],
      features: [
        { name: "Saturn in 10th House", importance: 0.32 },
        { name: "Jupiter Aspect on 10th lord", importance: 0.28 },
        { name: "Career Dasha Period", importance: 0.22 },
        { name: "Current Transit", importance: 0.18 }
      ]
    },
    {
      area: "Relationships",
      icon: <FavoriteIcon />,
      prediction: "Challenging period for romantic relationships, focus on communication",
      confidence: 75,
      models: [
        { name: "Random Forest", confidence: 82, weight: 0.35 },
        { name: "XGBoost", confidence: 70, weight: 0.45 },
        { name: "Neural Network", confidence: 72, weight: 0.2 }
      ],
      features: [
        { name: "Venus in 8th House", importance: 0.35 },
        { name: "Mars-Venus aspect", importance: 0.29 },
        { name: "7th House Lord Position", importance: 0.21 },
        { name: "Moon Nakshatra", importance: 0.15 }
      ]
    },
    {
      area: "Health",
      icon: <HealthIcon />,
      prediction: "Pay attention to digestive health and stress management",
      confidence: 82,
      models: [
        { name: "Random Forest", confidence: 84, weight: 0.3 },
        { name: "XGBoost", confidence: 80, weight: 0.5 },
        { name: "Neural Network", confidence: 83, weight: 0.2 }
      ],
      features: [
        { name: "Saturn aspect on 6th house", importance: 0.38 },
        { name: "Moon-Saturn relationship", importance: 0.25 },
        { name: "Ascendant lord strength", importance: 0.22 },
        { name: "Previous health reports", importance: 0.15 }
      ]
    },
    {
      area: "Wealth",
      icon: <WealthIcon />,
      prediction: "Favorable period for investments in technology and innovation",
      confidence: 79,
      models: [
        { name: "Random Forest", confidence: 76, weight: 0.4 },
        { name: "XGBoost", confidence: 81, weight: 0.3 },
        { name: "Neural Network", confidence: 80, weight: 0.3 }
      ],
      features: [
        { name: "Jupiter in 11th House", importance: 0.34 },
        { name: "2nd House Lord Position", importance: 0.23 },
        { name: "Venus-Mercury Conjunction", importance: 0.21 },
        { name: "Previous financial patterns", importance: 0.22 }
      ]
    },
    {
      area: "Education",
      icon: <EducationIcon />,
      prediction: "Good period for advanced studies and intellectual pursuits",
      confidence: 85,
      models: [
        { name: "Random Forest", confidence: 89, weight: 0.35 },
        { name: "XGBoost", confidence: 81, weight: 0.35 },
        { name: "Neural Network", confidence: 86, weight: 0.3 }
      ],
      features: [
        { name: "Mercury in 9th House", importance: 0.4 },
        { name: "Jupiter-Mercury aspect", importance: 0.3 },
        { name: "5th House Lord Position", importance: 0.2 },
        { name: "Previous learning patterns", importance: 0.1 }
      ]
    },
    {
      area: "Family",
      icon: <FamilyIcon />,
      prediction: "Harmony in family relationships, possible family gatherings",
      confidence: 80,
      models: [
        { name: "Random Forest", confidence: 83, weight: 0.4 },
        { name: "XGBoost", confidence: 78, weight: 0.3 },
        { name: "Neural Network", confidence: 79, weight: 0.3 }
      ],
      features: [
        { name: "Moon position in 4th House", importance: 0.35 },
        { name: "4th House Lord Position", importance: 0.25 },
        { name: "Venus aspect on 4th lord", importance: 0.22 },
        { name: "Previous family patterns", importance: 0.18 }
      ]
    },
  ],
  reinforcementLearning: {
    explorationRate: 0.15,
    exploitationRate: 0.85,
    learningRate: 0.03,
    rewardHistory: [0.65, 0.72, 0.78, 0.81, 0.80],
    lastUpdated: "12 hours ago"
  },
  feedbackUtilization: {
    totalFeedbackPoints: 127,
    accuracyImprovement: "12%",
    adaptationSpeed: "Medium",
    userSatisfactionTrend: "Increasing"
  }
};

// Individual prediction card component
const PredictionCard = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Function to get color based on confidence score
  const getConfidenceColor = (score) => {
    if (score >= 85) return "success";
    if (score >= 70) return "primary";
    if (score >= 50) return "warning";
    return "error";
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Card elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ bgcolor: expanded ? 'primary.main' : 'primary.light' }}>
              {data.icon}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{data.area}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {data.prediction}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Confidence:</Typography>
              <LinearProgress 
                variant="determinate" 
                value={data.confidence} 
                color={getConfidenceColor(data.confidence)}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                {data.confidence}%
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <IconButton onClick={toggleExpanded}>
              <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </IconButton>
          </Grid>
        </Grid>
        
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              ML Model Contributions
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {data.models.map((model, idx) => (
                <Grid item xs={12} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: '140px' }}>
                      {model.name}:
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={model.confidence} 
                      color={getConfidenceColor(model.confidence)}
                      sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                    />
                    <Tooltip title={`Model weight: ${model.weight * 100}%`}>
                      <Typography variant="caption" sx={{ ml: 1, width: '40px' }}>
                        {model.confidence}%
                      </Typography>
                    </Tooltip>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="subtitle2" gutterBottom>
              Feature Importance
            </Typography>
            <Grid container spacing={1}>
              {data.features.map((feature, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {feature.name}
                    </Typography>
                    <Chip 
                      label={`${Math.round(feature.importance * 100)}%`}
                      size="small"
                      color={idx === 0 ? "primary" : "default"}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Main component for ML prediction confidence visualization
const PredictionConfidence = () => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [selectedView, setSelectedView] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleViewMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleViewMenuClose = (view) => {
    if (view && typeof view === 'string') {
      setSelectedView(view);
    }
    setAnchorEl(null);
  };
  
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">AI Prediction Insights</Typography>
        </Box>
        
        <Box>
          <Button 
            size="small" 
            startIcon={<BarChartIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={handleViewMenuOpen}
          >
            View: {selectedView === 'all' ? 'All Predictions' : 
                   selectedView === 'top' ? 'Top Confidence' :
                   selectedView === 'low' ? 'Low Confidence' : selectedView}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleViewMenuClose()}
          >
            <MenuItem onClick={() => handleViewMenuClose('all')}>All Predictions</MenuItem>
            <MenuItem onClick={() => handleViewMenuClose('top')}>Top Confidence</MenuItem>
            <MenuItem onClick={() => handleViewMenuClose('low')}>Low Confidence</MenuItem>
          </Menu>
          
          <Tooltip title="Toggle technical ML details">
            <FormControlLabel
              control={
                <Switch 
                  checked={showTechnicalDetails}
                  onChange={(e) => setShowTechnicalDetails(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography variant="caption">Technical Details</Typography>}
              sx={{ ml: 2 }}
            />
          </Tooltip>
        </Box>
      </Box>
      
      {/* Last update info */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Predictions generated on: {new Date(predictionData.timestamp).toLocaleString()}
        </Typography>
        <Button 
          size="small" 
          startIcon={<RefreshIcon />}
          variant="outlined"
        >
          Update Predictions
        </Button>
      </Box>
      
      {showTechnicalDetails && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" gutterBottom>
            How Our AI Prediction System Works
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <ChartIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hybrid Prediction System" 
                    secondary="Combines traditional astrology rules with machine learning models"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BubbleChartIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ensemble Model Architecture" 
                    secondary="Random Forest, XGBoost & Neural Networks working together"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Reinforcement Learning" 
                    secondary={`Exploration rate: ${predictionData.reinforcementLearning.explorationRate}, Learning rate: ${predictionData.reinforcementLearning.learningRate}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Continuous Learning" 
                    secondary={`Trained on ${predictionData.feedbackUtilization.totalFeedbackPoints} feedback points, ${predictionData.feedbackUtilization.accuracyImprovement} accuracy improvement`}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Prediction cards */}
      <Box>
        {predictionData.lifeAreas
          .filter(area => {
            if (selectedView === 'all') return true;
            if (selectedView === 'top') return area.confidence >= 80;
            if (selectedView === 'low') return area.confidence < 80;
            return true;
          })
          .map((area, index) => (
            <PredictionCard key={index} data={area} />
          ))
        }
      </Box>
    </Paper>
  );
};

// Helper Avatar component (since it was missing)
const Avatar = ({ children, sx = {} }) => {
  return (
    <Box 
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default PredictionConfidence;