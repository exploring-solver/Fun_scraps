import React, { useState } from 'react';
import { 
  Paper, Typography, Box, Tabs, Tab, Grid, 
  Chip, Tooltip, IconButton, Divider, Card, CardContent 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Mock data for the chart
const mockKundaliData = {
  ascendant: "Libra",
  houses: [
    { number: 1, sign: "Libra", planets: [] },
    { number: 2, sign: "Scorpio", planets: ["Venus"] },
    { number: 3, sign: "Sagittarius", planets: [] },
    { number: 4, sign: "Capricorn", planets: ["Saturn"] },
    { number: 5, sign: "Aquarius", planets: [] },
    { number: 6, sign: "Pisces", planets: [] },
    { number: 7, sign: "Aries", planets: ["Mars"] },
    { number: 8, sign: "Taurus", planets: [] },
    { number: 9, sign: "Gemini", planets: ["Mercury", "Sun"] },
    { number: 10, sign: "Cancer", planets: ["Moon"] },
    { number: 11, sign: "Leo", planets: [] },
    { number: 12, sign: "Virgo", planets: ["Rahu", "Jupiter"] }
  ],
  aspects: [
    { from: "Mars", to: "Saturn", type: "Square", strength: "Strong", effect: "Challenging" },
    { from: "Moon", to: "Venus", type: "Trine", strength: "Medium", effect: "Favorable" },
    { from: "Sun", to: "Jupiter", type: "Opposition", strength: "Strong", effect: "Mixed" }
  ],
  dashas: {
    mahadasha: "Saturn",
    mahaStart: "2018-05-15",
    mahaEnd: "2037-05-15",
    antardasha: "Mercury",
    antarStart: "2023-01-10",
    antarEnd: "2025-10-18"
  }
};

// Planet symbols and colors
const planetSymbols = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇"
};

const planetColors = {
  Sun: "#FFA500", // Orange
  Moon: "#SILVER", // Silver
  Mercury: "#32CD32", // Green
  Venus: "#FF69B4", // Pink
  Mars: "#FF0000", // Red
  Jupiter: "#FFD700", // Gold
  Saturn: "#4682B4", // Steel Blue
  Rahu: "#800080", // Purple
  Ketu: "#8B4513", // Brown
  Uranus: "#00FFFF", // Cyan
  Neptune: "#6A5ACD", // Slate Blue
  Pluto: "#8B0000"  // Dark Red
};

const zodiacColors = {
  Aries: "#FF5733",
  Taurus: "#33FF57",
  Gemini: "#5733FF",
  Cancer: "#33FFF5",
  Leo: "#F5FF33",
  Virgo: "#FF33F5",
  Libra: "#33C4FF",
  Scorpio: "#FF3333",
  Sagittarius: "#33FF9E",
  Capricorn: "#BD33FF",
  Aquarius: "#33FFE6",
  Virgo: "#F0FF33"
};

// Component for North Indian Style Kundali Chart
const NorthIndianChart = ({ data }) => {
  return (
    <Box sx={{ aspectRatio: '1/1', position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
      {/* Outer square */}
      <Box sx={{ border: '2px solid #000', height: '100%', position: 'relative' }}>
        {/* Diagonal lines */}
        <Box sx={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          top: 0, 
          left: 0,
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '140%',
            height: '1px',
            backgroundColor: '#000',
            top: '50%',
            left: '-20%',
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '140%',
            height: '1px',
            backgroundColor: '#000',
            top: '50%',
            left: '-20%',
            transform: 'rotate(-45deg)',
            transformOrigin: 'center',
          }
        }} />
        
        {/* Horizontal and vertical divider lines */}
        <Divider sx={{ position: 'absolute', width: '100%', top: '50%' }} />
        <Divider orientation="vertical" sx={{ position: 'absolute', height: '100%', left: '50%' }} />
        
        {/* House 1 (top-left) */}
        <Box sx={{ position: 'absolute', top: '25%', left: '25%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <Tooltip title={`House 1: ${data.houses[0].sign}`}>
            <Box>
              <Typography variant="caption" display="block">{data.houses[0].number}</Typography>
              {data.houses[0].planets.map((planet, i) => (
                <Chip 
                  key={i}
                  label={`${planetSymbols[planet]} ${planet}`}
                  size="small"
                  sx={{ 
                    margin: '2px', 
                    backgroundColor: planetColors[planet], 
                    color: '#fff' 
                  }}
                />
              ))}
            </Box>
          </Tooltip>
        </Box>
        
        {/* House 2 (top) */}
        <Box sx={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <Tooltip title={`House 2: ${data.houses[1].sign}`}>
            <Box>
              <Typography variant="caption" display="block">{data.houses[1].number}</Typography>
              {data.houses[1].planets.map((planet, i) => (
                <Chip 
                  key={i}
                  label={`${planetSymbols[planet]} ${planet}`}
                  size="small"
                  sx={{ 
                    margin: '2px', 
                    backgroundColor: planetColors[planet], 
                    color: '#fff' 
                  }}
                />
              ))}
            </Box>
          </Tooltip>
        </Box>
        
        {/* House 3 (top-right) */}
        <Box sx={{ position: 'absolute', top: '25%', left: '75%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <Tooltip title={`House 3: ${data.houses[2].sign}`}>
            <Box>
              <Typography variant="caption" display="block">{data.houses[2].number}</Typography>
              {data.houses[2].planets.map((planet, i) => (
                <Chip 
                  key={i}
                  label={`${planetSymbols[planet]} ${planet}`}
                  size="small"
                  sx={{ 
                    margin: '2px', 
                    backgroundColor: planetColors[planet], 
                    color: '#fff' 
                  }}
                />
              ))}
            </Box>
          </Tooltip>
        </Box>
        
        {/* House 4 (right) */}
        <Box sx={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <Tooltip title={`House 4: ${data.houses[3].sign}`}>
            <Box>
              <Typography variant="caption" display="block">{data.houses[3].number}</Typography>
              {data.houses[3].planets.map((planet, i) => (
                <Chip 
                  key={i}
                  label={`${planetSymbols[planet]} ${planet}`}
                  size="small"
                  sx={{ 
                    margin: '2px', 
                    backgroundColor: planetColors[planet], 
                    color: '#fff' 
                  }}
                />
              ))}
            </Box>
          </Tooltip>
        </Box>
        
        {/* Continue for all 12 houses... */}
        {/* I'm showing houses 1-4 for brevity, but the full implementation would include all 12 */}
        
        {/* Center area with ascendant info */}
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '5px',
          borderRadius: '4px'
        }}>
          <Typography variant="subtitle2">Ascendant</Typography>
          <Typography variant="body2">{data.ascendant}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Component for South Indian Style Kundali Chart
const SouthIndianChart = ({ data }) => {
  return (
    <Box sx={{ aspectRatio: '1/1', position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
      <Grid container sx={{ height: '100%', border: '2px solid #000' }}>
        {/* Create a 3x3 grid for the chart */}
        {[...Array(3)].map((_, row) => (
          [...Array(3)].map((_, col) => {
            // Skip center cell
            if (row === 1 && col === 1) {
              return (
                <Grid item xs={4} key={`${row}-${col}`} sx={{ 
                  height: '33.33%', 
                  border: '1px solid #000',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 1
                }}>
                  <Typography variant="subtitle2" align="center">
                    Rāśi Kundalī<br/>
                    <Typography variant="caption" color="text.secondary">
                      Birth: {new Date().toLocaleDateString()}
                    </Typography>
                  </Typography>
                </Grid>
              );
            }
            
            // Map grid positions to house numbers (South Indian style)
            const houseMap = [
              [11, 0, 1],
              [10, '', 2],
              [9, 8, 7]
            ];
            
            const houseIdx = houseMap[row][col];
            if (houseIdx === '') return null;
            
            const house = data.houses[houseIdx];
            
            return (
              <Grid item xs={4} key={`${row}-${col}`} sx={{ 
                height: '33.33%', 
                border: '1px solid #000',
                padding: 1,
                backgroundColor: house.planets.length > 0 ? 'rgba(173, 216, 230, 0.2)' : 'transparent'
              }}>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                  {house.sign}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
                  {house.planets.map((planet, i) => (
                    <Tooltip key={i} title={planet}>
                      <Typography 
                        sx={{ 
                          mr: 0.5, 
                          color: planetColors[planet], 
                          fontWeight: 'bold' 
                        }}
                      >
                        {planetSymbols[planet]}
                      </Typography>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
            );
          })
        ))}
      </Grid>
    </Box>
  );
};

// Planet positions component
const PlanetaryPositions = ({ data }) => {
  // Extract all planets from houses
  const allPlanets = data.houses.flatMap(house => 
    house.planets.map(planet => ({ 
      planet, 
      house: house.number, 
      sign: house.sign 
    }))
  );
  
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Planetary Positions</Typography>
        <Grid container spacing={2}>
          {allPlanets.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography 
                  sx={{ 
                    mr: 1, 
                    color: planetColors[item.planet], 
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}
                >
                  {planetSymbols[item.planet]}
                </Typography>
                <Box>
                  <Typography variant="subtitle2">{item.planet}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.sign} (House {item.house})
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Aspects component
const PlanetaryAspects = ({ aspects }) => {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Planetary Aspects</Typography>
        <Grid container spacing={2}>
          {aspects.map((aspect, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 1, 
                borderRadius: 1,
                bgcolor: aspect.effect === 'Favorable' ? 'rgba(76, 175, 80, 0.1)' : 
                         aspect.effect === 'Challenging' ? 'rgba(244, 67, 54, 0.1)' : 
                         'rgba(255, 152, 0, 0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: planetColors[aspect.from], fontWeight: 'bold', mr: 0.5 }}>
                    {planetSymbols[aspect.from]}
                  </Typography>
                  <Typography variant="body2">{aspect.from}</Typography>
                </Box>
                
                <Typography sx={{ mx: 1 }}>—</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: planetColors[aspect.to], fontWeight: 'bold', mr: 0.5 }}>
                    {planetSymbols[aspect.to]}
                  </Typography>
                  <Typography variant="body2">{aspect.to}</Typography>
                </Box>
                
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={aspect.type} 
                    size="small"
                    sx={{ 
                      mr: 1,
                      bgcolor: aspect.effect === 'Favorable' ? '#4caf50' : 
                               aspect.effect === 'Challenging' ? '#f44336' : 
                               '#ff9800',
                      color: 'white'
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {aspect.strength}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Dasha periods component
const DashaPeriods = ({ dashas }) => {
  // Calculate time remaining in dasha
  const mahaEndDate = new Date(dashas.mahaEnd);
  const antarEndDate = new Date(dashas.antarEnd);
  const now = new Date();
  
  const mahaRemainingMs = mahaEndDate - now;
  const antarRemainingMs = antarEndDate - now;
  
  const mahaRemainingYears = Math.floor(mahaRemainingMs / (1000 * 60 * 60 * 24 * 365.25));
  const antarRemainingMonths = Math.floor(antarRemainingMs / (1000 * 60 * 60 * 24 * 30.44));
  
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Current Dasha Periods</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1">Mahadasha</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography sx={{ color: planetColors[dashas.mahadasha], fontWeight: 'bold', fontSize: '2rem', mr: 2 }}>
                  {planetSymbols[dashas.mahadasha]}
                </Typography>
                <Box>
                  <Typography variant="h6">{dashas.mahadasha}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(dashas.mahaStart).toLocaleDateString()} - {new Date(dashas.mahaEnd).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {mahaRemainingYears} years remaining
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1">Antardasha</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography sx={{ color: planetColors[dashas.antardasha], fontWeight: 'bold', fontSize: '2rem', mr: 2 }}>
                  {planetSymbols[dashas.antardasha]}
                </Typography>
                <Box>
                  <Typography variant="h6">{dashas.antardasha}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(dashas.antarStart).toLocaleDateString()} - {new Date(dashas.antarEnd).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {antarRemainingMonths} months remaining
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Main KundaliChart component
const KundaliChart = () => {
  const [chartStyle, setChartStyle] = useState('north');
  const [currentTab, setCurrentTab] = useState(0);
  
  const handleChartStyleChange = (event, newValue) => {
    setChartStyle(newValue);
  };
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Birth Chart Analysis
        </Typography>
        <Tooltip title="This chart is generated based on your birth details using Vedic astrology principles">
          <IconButton size="small">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Chart style selection */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={chartStyle} onChange={handleChartStyleChange} centered>
          <Tab value="north" label="North Indian" />
          <Tab value="south" label="South Indian" />
        </Tabs>
      </Box>
      
      {/* Chart visualization */}
      <Box sx={{ mb: 3 }}>
        {chartStyle === 'north' ? (
          <NorthIndianChart data={mockKundaliData} />
        ) : (
          <SouthIndianChart data={mockKundaliData} />
        )}
      </Box>
      
      {/* Chart details tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="chart details tabs">
            <Tab label="Planets" />
            <Tab label="Aspects" />
            <Tab label="Dashas" />
          </Tabs>
        </Box>
        <Box sx={{ py: 2 }}>
          {currentTab === 0 && <PlanetaryPositions data={mockKundaliData} />}
          {currentTab === 1 && <PlanetaryAspects aspects={mockKundaliData.aspects} />}
          {currentTab === 2 && <DashaPeriods dashas={mockKundaliData.dashas} />}
        </Box>
      </Box>
    </Paper>
  );
};

export default KundaliChart;