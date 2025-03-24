import React, { useState } from 'react';
import {
  Box, Paper, Typography, Card, CardContent, CardActions, Grid,
  Chip, Button, Avatar, List, ListItem, ListItemText, Divider,
  IconButton, Tooltip, LinearProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, Tabs, Tab
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircleOutline as CheckIcon,
  InfoOutlined as InfoIcon,
  Psychology as AIIcon,
  Healing as HealingIcon,
  Spa as SpaIcon,
  Timer as TimerIcon,
  AddCircleOutline as AddIcon,
  Favorite as HeartIcon,
  Work as WorkIcon,
  LocalHospital as HealthIcon,
  AccountBalance as WealthIcon,
  School as EducationIcon,
  Home as FamilyIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Mock data for remedial recommendations
const mockRemedies = [
  {
    id: 1,
    title: "Saturn Remediation",
    description: "Saturn's position in your 10th house is creating career obstacles. These remedies can help mitigate challenges.",
    concern: "Career Obstacles",
    severity: 75,
    planetaryInfluence: [
      { planet: "Saturn", strength: "Strong", nature: "Challenging" }
    ],
    remedies: [
      { 
        type: "Gemstone", 
        name: "Blue Sapphire (Neelam)", 
        instructions: "Wear a 3-5 carat Blue Sapphire set in silver on the middle finger of the right hand on Saturday during Shukla Paksha.",
        effectiveness: 85,
        timeframe: "3-6 months",
        caution: "Should be worn after proper testing and consultation with an experienced astrologer."
      },
      { 
        type: "Mantra", 
        name: "Saturn Beej Mantra", 
        instructions: "Recite 'Om Praam Preem Praum Sah Shanaye Namah' 108 times on Saturday mornings.",
        effectiveness: 75,
        timeframe: "Consistent practice for min. 40 days",
        caution: "None"
      },
      { 
        type: "Charity", 
        name: "Helping the elderly", 
        instructions: "Donate black items like sesame, blankets, or iron to elderly or underprivileged people on Saturdays.",
        effectiveness: 70,
        timeframe: "Ongoing",
        caution: "Should be done with genuine intent of service"
      }
    ],
    aiInsights: "Our AI system detected a pattern in your Saturn dasha periods that correlates with career challenges. Historical data shows these remedies have helped 78% of users with similar planetary positions."
  },
  {
    id: 2,
    title: "Venus Enhancement",
    description: "Strengthening Venus will help improve relationship harmony and financial prosperity.",
    concern: "Relationship Harmony",
    severity: 60,
    planetaryInfluence: [
      { planet: "Venus", strength: "Moderate", nature: "Beneficial but weakened" }
    ],
    remedies: [
      { 
        type: "Gemstone", 
        name: "Diamond or White Sapphire", 
        instructions: "Wear a natural diamond or white sapphire of at least 1 carat on the ring finger of the right hand on Friday morning.",
        effectiveness: 80,
        timeframe: "2-4 months",
        caution: "If diamond is not affordable, white sapphire is a good alternative."
      },
      { 
        type: "Mantra", 
        name: "Venus Beej Mantra", 
        instructions: "Chant 'Om Draam Dreem Draum Sah Shukraya Namah' 108 times on Friday mornings.",
        effectiveness: 75,
        timeframe: "Consistent practice for min. 40 days",
        caution: "None"
      },
      { 
        type: "Lifestyle", 
        name: "Wear white on Fridays", 
        instructions: "Wear white clothes and eat white foods like rice, milk, or yogurt on Fridays.",
        effectiveness: 65,
        timeframe: "Ongoing",
        caution: "None"
      }
    ],
    aiInsights: "Based on your relationship patterns during Venus transits and the current Mahadasha, our AI predicts a 72% improvement in relationship satisfaction with consistent application of these remedies."
  },
  {
    id: 3,
    title: "Mars Pacification",
    description: "Mars in the 8th house is creating health issues and impulsive decision-making. These remedies will help balance its energy.",
    concern: "Health & Impulsivity",
    severity: 80,
    planetaryInfluence: [
      { planet: "Mars", strength: "Strong", nature: "Challenging" }
    ],
    remedies: [
      { 
        type: "Gemstone", 
        name: "Red Coral (Moonga)", 
        instructions: "Wear a 5-7 carat Red Coral set in gold or copper on the ring finger of the right hand on Tuesday morning.",
        effectiveness: 85,
        timeframe: "2-3 months",
        caution: "Not recommended for those with high blood pressure or inflammatory conditions."
      },
      { 
        type: "Mantra", 
        name: "Mars Beej Mantra", 
        instructions: "Recite 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 108 times on Tuesday mornings.",
        effectiveness: 80,
        timeframe: "Consistent practice for min. 40 days",
        caution: "None"
      },
      { 
        type: "Charity", 
        name: "Donate red lentils", 
        instructions: "Donate red lentils (masoor dal) or jaggery to those in need on Tuesdays.",
        effectiveness: 70,
        timeframe: "Ongoing",
        caution: "Should be done with genuine intent"
      }
    ],
    aiInsights: "Our AI analysis shows that Mars-related health issues often manifest as inflammation or accidents. 83% of users with similar Mars positions reported reduced impulsivity and fewer health incidents after following these remedies."
  }
];

// Component for a single remedy card
const RemedyCard = ({ remedy, onViewDetails }) => {
  const getSeverityColor = (severity) => {
    if (severity >= 75) return "error";
    if (severity >= 50) return "warning";
    return "success";
  };

  const getIcon = (planet) => {
    switch(planet) {
      case "Saturn": return "♄";
      case "Venus": return "♀";
      case "Mars": return "♂";
      case "Jupiter": return "♃";
      case "Mercury": return "☿";
      case "Sun": return "☉";
      case "Moon": return "☽";
      case "Rahu": return "☊";
      case "Ketu": return "☋";
      default: return "★";
    }
  };
  
  const getPlanetColor = (planet) => {
    switch(planet) {
      case "Saturn": return "#5C6BC0"; // Indigo
      case "Venus": return "#EC407A"; // Pink
      case "Mars": return "#EF5350"; // Red
      case "Jupiter": return "#FFA726"; // Orange
      case "Mercury": return "#66BB6A"; // Green
      case "Sun": return "#FDD835"; // Yellow
      case "Moon": return "#B0BEC5"; // Silver
      case "Rahu": return "#7E57C2"; // Purple
      case "Ketu": return "#8D6E63"; // Brown
      default: return "#78909C"; // Blue Grey
    }
  };

  const getRemedyTypeIcon = (type) => {
    switch(type) {
      case "Gemstone": return <StarIcon />;
      case "Mantra": return <SpaIcon />;
      case "Charity": return <HeartIcon />;
      case "Lifestyle": return <TimerIcon />;
      default: return <HealingIcon />;
    }
  };
  
  return (
    <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {remedy.title}
              </Typography>
              <Chip 
                label={`Severity: ${remedy.severity}%`}
                color={getSeverityColor(remedy.severity)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {remedy.description}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Planetary Influence
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
              {remedy.planetaryInfluence.map((inf, idx) => (
                <Tooltip 
                  key={idx}
                  title={`${inf.planet}: ${inf.strength}, ${inf.nature}`}
                >
                  <Chip
                    avatar={
                      <Avatar sx={{ bgcolor: getPlanetColor(inf.planet), color: 'white' }}>
                        {getIcon(inf.planet)}
                      </Avatar>
                    }
                    label={inf.planet}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Recommended Remedies
            </Typography>
            <List dense>
              {remedy.remedies.slice(0, 2).map((rem, idx) => (
                <ListItem key={idx}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getRemedyTypeIcon(rem.type)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {rem.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                          Effectiveness:
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={rem.effectiveness}
                          color="primary"
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {rem.effectiveness}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {remedy.remedies.length > 2 && (
                <Typography variant="caption" color="primary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  +{remedy.remedies.length - 2} more remedies
                </Typography>
              )}
            </List>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AIIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              AI-powered recommendation
            </Typography>
          </Box>
          <Button 
            size="small" 
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => onViewDetails(remedy)}
          >
            View Details
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

// Dialog to show detailed information about a remedy
const RemedyDetailsDialog = ({ open, remedy, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  if (!remedy) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HealingIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">{remedy.title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText paragraph>
          {remedy.description}
        </DialogContentText>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Remedies" />
            <Tab label="Analysis" />
            <Tab label="Implementation" />
          </Tabs>
        </Box>
        
        {/* Remedies Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {remedy.remedies.map((rem, idx) => (
              <Grid item xs={12} key={idx}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                        {getRemedyTypeIcon(rem.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{rem.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {rem.type} • {rem.timeframe} • {rem.effectiveness}% effective
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      <strong>Instructions:</strong> {rem.instructions}
                    </Typography>
                    
                    {rem.caution !== "None" && (
                      <Typography variant="body2" color="error">
                        <strong>Caution:</strong> {rem.caution}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Effectiveness:
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={rem.effectiveness}
                        color="primary"
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                        {rem.effectiveness}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Analysis Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Astrological Analysis
            </Typography>
            <Typography variant="body2" paragraph>
              The {remedy.planetaryInfluence[0].planet} in your chart is creating challenges related to {remedy.concern.toLowerCase()}.
              This is due to its {remedy.planetaryInfluence[0].strength.toLowerCase()} influence and {remedy.planetaryInfluence[0].nature.toLowerCase()} nature.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              AI Insights
            </Typography>
            <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex' }}>
                  <AIIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {remedy.aiInsights}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Typography variant="subtitle1" gutterBottom>
              Success Probability
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ width: 200 }}>
                  Overall improvement:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={85}
                  color="success"
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', width: 50 }}>
                  85%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ width: 200 }}>
                  Issue resolution time:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={70}
                  color="primary"
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', width: 50 }}>
                  70%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ width: 200 }}>
                  Long-term benefits:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={90}
                  color="secondary"
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', width: 50 }}>
                  90%
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        {/* Implementation Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Implementation Guide
            </Typography>
            <Typography variant="body2" paragraph>
              Follow these steps to effectively implement the recommended remedies:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Step 1: Choose your preferred remedy" 
                  secondary="Select the remedy that resonates with you and that you can consistently follow."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Step 2: Prepare the necessary items" 
                  secondary="Gather all required materials and prepare according to the instructions."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Step 3: Follow the auspicious timing" 
                  secondary="Implement during the recommended day and time for maximum benefit."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Step 4: Maintain consistency" 
                  secondary="Regular practice is key to seeing results. Follow the remedies for the recommended time period."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Step 5: Track your progress" 
                  secondary="Note any improvements or changes in the area of concern in the app."
                />
              </ListItem>
            </List>
            
            <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1, mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Progress Tracking
              </Typography>
              <Typography variant="body2">
                Our AI will help you track the effectiveness of the remedies based on your feedback and life events.
                Regular updates will help refine predictions and remedial suggestions.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={onClose}
        >
          Add to My Remedies
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper function for remedy type icons
const getRemedyTypeIcon = (type) => {
  switch(type) {
    case "Gemstone": return <StarIcon />;
    case "Mantra": return <SpaIcon />;
    case "Charity": return <HeartIcon />;
    case "Lifestyle": return <TimerIcon />;
    default: return <HealingIcon />;
  }
};

// Main Remedial Recommendations component
const RemedialRecommendations = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  
  const handleViewDetails = (remedy) => {
    setSelectedRemedy(remedy);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Filter remedies based on the active filter
  const filteredRemedies = mockRemedies.filter(remedy => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'severe') return remedy.severity >= 70;
    return remedy.concern.toLowerCase().includes(activeFilter.toLowerCase());
  });
  
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <HealingIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Remedial Recommendations
        </Typography>
        <Button 
          size="small" 
          color="primary" 
          variant="outlined"
          startIcon={<InfoIcon />}
        >
          Learn More
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Based on your birth chart analysis and current planetary positions, our AI system has generated 
        personalized remedial recommendations to help balance challenging planetary influences.
      </Typography>
      
      {/* Filter chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Chip 
          label="All Remedies" 
          onClick={() => handleFilterChange('all')}
          color={activeFilter === 'all' ? 'primary' : 'default'}
          variant={activeFilter === 'all' ? 'filled' : 'outlined'}
        />
        <Chip 
          label="Severe Issues" 
          onClick={() => handleFilterChange('severe')}
          color={activeFilter === 'severe' ? 'primary' : 'default'}
          variant={activeFilter === 'severe' ? 'filled' : 'outlined'}
        />
        <Chip 
          label="Career" 
          icon={<WorkIcon />}
          onClick={() => handleFilterChange('career')}
          color={activeFilter === 'career' ? 'primary' : 'default'}
          variant={activeFilter === 'career' ? 'filled' : 'outlined'}
        />
        <Chip 
          label="Relationships" 
          icon={<HeartIcon />}
          onClick={() => handleFilterChange('relationship')}
          color={activeFilter === 'relationship' ? 'primary' : 'default'}
          variant={activeFilter === 'relationship' ? 'filled' : 'outlined'}
        />
        <Chip 
          label="Health" 
          icon={<HealthIcon />}
          onClick={() => handleFilterChange('health')}
          color={activeFilter === 'health' ? 'primary' : 'default'}
          variant={activeFilter === 'health' ? 'filled' : 'outlined'}
        />
        <Chip 
          label="Wealth" 
          icon={<WealthIcon />}
          onClick={() => handleFilterChange('wealth')}
          color={activeFilter === 'wealth' ? 'primary' : 'default'}
          variant={activeFilter === 'wealth' ? 'filled' : 'outlined'}
        />
      </Box>
      
      {/* AI Info card */}
      <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.50' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
          <Box>
            <Typography variant="subtitle1">AI-Enhanced Recommendations</Typography>
            <Typography variant="body2">
              Our advanced AI analyzes thousands of similar birth charts and feedback data to recommend 
              the most effective remedies for your specific astrological configuration.
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Remedies list */}
      <Box>
        {filteredRemedies.length > 0 ? (
          filteredRemedies.map(remedy => (
            <RemedyCard 
              key={remedy.id} 
              remedy={remedy} 
              onViewDetails={handleViewDetails} 
            />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No remedies match the current filter.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => handleFilterChange('all')}
              sx={{ mt: 2 }}
            >
              View All Remedies
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Custom remedy button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<AddIcon />}
        >
          Request Custom Remedy
        </Button>
      </Box>
      
      {/* Remedy details dialog */}
      <RemedyDetailsDialog 
        open={dialogOpen}
        remedy={selectedRemedy}
        onClose={handleCloseDialog}
      />
    </Paper>
  );
};

export default RemedialRecommendations;