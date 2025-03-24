import React, { useState } from 'react';
import {
  Box, Paper, Typography, Stepper, Step, StepLabel, StepContent,
  Button, TextField, Grid, RadioGroup, Radio, FormControlLabel,
  FormControl, FormLabel, Autocomplete, Chip, Card, CardContent,
  CircularProgress, Alert, Divider, InputAdornment, IconButton
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Help as HelpIcon,
  ArrowForward as ArrowForwardIcon,
  Psychology as AIIcon,
  Favorite as HeartIcon,
  WorkOutline as WorkIcon,
  School as EducationIcon,
  LocalHospital as HealthIcon,
  AttachMoney as WealthIcon,
  Home as FamilyIcon,
  Celebration as HappinessIcon
} from '@mui/icons-material';
// import { TimePicker, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// List of major cities for autocomplete
const majorCities = [
  { name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867 },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
];

// Life areas for interest selection
const lifeAreas = [
  { id: 'career', name: 'Career & Work', icon: <WorkIcon />, color: '#5e35b1' },
  { id: 'relationships', name: 'Relationships', icon: <HeartIcon />, color: '#e91e63' },
  { id: 'education', name: 'Education & Learning', icon: <EducationIcon />, color: '#2196f3' },
  { id: 'health', name: 'Health & Wellness', icon: <HealthIcon />, color: '#4caf50' },
  { id: 'wealth', name: 'Wealth & Finance', icon: <WealthIcon />, color: '#ff9800' },
  { id: 'family', name: 'Family & Home', icon: <FamilyIcon />, color: '#795548' },
  { id: 'happiness', name: 'Personal Happiness', icon: <HappinessIcon />, color: '#00bcd4' },
];

// Astrology knowledge levels
const knowledgeLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to Hindu astrology and want to learn the basics' },
  { value: 'intermediate', label: 'Intermediate', description: 'Familiar with basic concepts like houses and planets' },
  { value: 'advanced', label: 'Advanced', description: 'Understand dashas, transits, and advanced concepts' }
];

// Main Onboarding component
const OnboardingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [birthDetails, setBirthDetails] = useState({
    name: '',
    date: null,
    time: null,
    isTimeKnown: 'yes',
    place: null,
    gender: ''
  });
  const [interests, setInterests] = useState([]);
  const [knowledgeLevel, setKnowledgeLevel] = useState('beginner');
  const [notificationPrefs, setNotificationPrefs] = useState({
    dailyPredictions: true,
    majorEvents: true,
    transits: true,
    remedies: false
  });

  const handleNext = () => {
    if (activeStep === 3) {
      // Final submission - would normally submit to server
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Navigate to dashboard or show success screen
      }, 2000);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInterestToggle = (areaId) => {
    if (interests.includes(areaId)) {
      setInterests(interests.filter(id => id !== areaId));
    } else {
      setInterests([...interests, areaId]);
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0: // Birth Details
        return Boolean(
          birthDetails.name && 
          birthDetails.date && 
          (birthDetails.isTimeKnown === 'no' || birthDetails.time) && 
          birthDetails.place &&
          birthDetails.gender
        );
      case 1: // Interests
        return interests.length > 0;
      case 2: // Knowledge & Preferences
        return true; // These have defaults so always complete
      case 3: // Review & Finish
        return true; // Just a review, always complete
      default:
        return false;
    }
  };

  return (
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Begin Your Astrological Journey
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Complete your profile to receive personalized predictions powered by AI and Hindu astrology
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Birth Details */}
          <Step completed={isStepComplete(0)}>
            <StepLabel>
              <Typography variant="subtitle1">Birth Details</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Your birth details are used to generate your Kundali chart, which is the foundation of all predictions.
                </Alert>
                
                <TextField
                  label="Full Name"
                  value={birthDetails.name}
                  onChange={(e) => setBirthDetails({ ...birthDetails, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                
                <DatePicker
                  label="Birth Date"
                  value={birthDetails.date}
                  onChange={(newValue) => setBirthDetails({ ...birthDetails, date: newValue })}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      margin="normal" 
                      required
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">Do you know your birth time?</FormLabel>
                  <RadioGroup
                    row
                    value={birthDetails.isTimeKnown}
                    onChange={(e) => setBirthDetails({ ...birthDetails, isTimeKnown: e.target.value })}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
                
                {birthDetails.isTimeKnown === 'yes' && (
                  <TimePicker
                    label="Birth Time"
                    value={birthDetails.time}
                    onChange={(newValue) => setBirthDetails({ ...birthDetails, time: newValue })}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        margin="normal" 
                        required
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <TimeIcon />
                            </InputAdornment>
                          )
                        }}
                        helperText="Exact birth time increases prediction accuracy"
                      />
                    )}
                  />
                )}
                
                <Autocomplete
                  options={majorCities}
                  getOptionLabel={(option) => `${option.name}, ${option.country}`}
                  value={birthDetails.place}
                  onChange={(event, newValue) => {
                    setBirthDetails({ ...birthDetails, place: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Birth Place"
                      margin="normal"
                      required
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocationIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
                
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    value={birthDetails.gender}
                    onChange={(e) => setBirthDetails({ ...birthDetails, gender: e.target.value })}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Box>
              
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepComplete(0)}
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue
                </Button>
              </Box>
            </StepContent>
          </Step>
          
          {/* Step 2: Life Areas of Interest */}
          <Step completed={isStepComplete(1)}>
            <StepLabel>
              <Typography variant="subtitle1">Areas of Interest</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" paragraph>
                Select the life areas you're most interested in receiving predictions about:
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {lifeAreas.map((area) => (
                  <Grid item xs={12} sm={6} key={area.id}>
                    <Card 
                      variant="outlined" 
                      onClick={() => handleInterestToggle(area.id)}
                      sx={{
                        cursor: 'pointer',
                        borderColor: interests.includes(area.id) ? area.color : 'divider',
                        backgroundColor: interests.includes(area.id) ? `${area.color}10` : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: area.color,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              mr: 2, 
                              color: 'white', 
                              bgcolor: area.color, 
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {area.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">{area.name}</Typography>
                          </Box>
                          {interests.includes(area.id) && (
                            <CheckIcon sx={{ color: area.color }} />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepComplete(1)}
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue
                </Button>
              </Box>
            </StepContent>
          </Step>
          
          {/* Step 3: Knowledge Level & Preferences */}
          <Step completed={isStepComplete(2)}>
            <StepLabel>
              <Typography variant="subtitle1">Knowledge & Preferences</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" paragraph>
                Tell us about your familiarity with astrology and how you'd like to receive insights:
              </Typography>
              
              <FormControl component="fieldset" fullWidth margin="normal">
                <FormLabel component="legend">Your knowledge of Hindu astrology</FormLabel>
                <RadioGroup
                  value={knowledgeLevel}
                  onChange={(e) => setKnowledgeLevel(e.target.value)}
                >
                  {knowledgeLevels.map((level) => (
                    <FormControlLabel 
                      key={level.value}
                      value={level.value} 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="subtitle2">{level.label}</Typography>
                          <Typography variant="body2" color="text.secondary">{level.description}</Typography>
                        </Box>
                      } 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                Notification Preferences
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPrefs.dailyPredictions}
                        onChange={(e) => setNotificationPrefs({...notificationPrefs, dailyPredictions: e.target.checked})}
                      />
                    }
                    label="Daily Predictions"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPrefs.majorEvents}
                        onChange={(e) => setNotificationPrefs({...notificationPrefs, majorEvents: e.target.checked})}
                      />
                    }
                    label="Major Life Events"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPrefs.transits}
                        onChange={(e) => setNotificationPrefs({...notificationPrefs, transits: e.target.checked})}
                      />
                    }
                    label="Important Transits"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPrefs.remedies}
                        onChange={(e) => setNotificationPrefs({...notificationPrefs, remedies: e.target.checked})}
                      />
                    }
                    label="Remedial Suggestions"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue
                </Button>
              </Box>
            </StepContent>
          </Step>
          
          {/* Step 4: Review & Complete */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1">Review & Complete</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" paragraph>
                Review your information before we generate your personalized astrology profile:
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Birth Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Name:</Typography>
                      <Typography variant="body1">{birthDetails.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Date of Birth:</Typography>
                      <Typography variant="body1">
                        {birthDetails.date ? birthDetails.date.toLocaleDateString() : 'Not provided'}
                      </Typography>
                    </Grid>
                    {birthDetails.isTimeKnown === 'yes' && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Time of Birth:</Typography>
                        <Typography variant="body1">
                          {birthDetails.time ? birthDetails.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not provided'}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Place of Birth:</Typography>
                      <Typography variant="body1">
                        {birthDetails.place ? `${birthDetails.place.name}, ${birthDetails.place.country}` : 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Gender:</Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {birthDetails.gender}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Areas of Interest
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {interests.map((interestId) => {
                      const area = lifeAreas.find(a => a.id === interestId);
                      return (
                        <Chip 
                          key={interestId} 
                          label={area.name} 
                          icon={area.icon} 
                          sx={{ bgcolor: `${area.color}30`, borderColor: area.color }}
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Knowledge & Preferences
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Knowledge Level:</Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {knowledgeLevel}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Notifications:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {Object.entries(notificationPrefs).map(([key, value]) => (
                          value && (
                            <Chip 
                              key={key} 
                              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Based on your birth details, our AI system will:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                  <li>Generate your Vedic birth chart (Kundali)</li>
                  <li>Calculate planetary positions and dasha periods</li>
                  <li>Create personalized predictions for your selected life areas</li>
                  <li>Provide daily guidance based on planetary transits</li>
                </Box>
              </Alert>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Our AI combines traditional Hindu astrology with machine learning for accurate predictions
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                  {loading ? 'Processing...' : 'Complete Profile'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        
        {/* Success message after completion - would show after submission */}
        {activeStep === 4 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Profile Created Successfully!
            </Typography>
            <Typography variant="body1" paragraph>
              Your personalized astrology journey begins now. We're generating your Kundali chart and initial predictions.
            </Typography>
            <Button variant="contained" color="primary">
              Go to Dashboard
            </Button>
          </Box>
        )}
      </Paper>
  );
};

export default OnboardingFlow;