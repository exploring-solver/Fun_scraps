const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const UAParser = require('ua-parser-js');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cron = require('node-cron');
const fs = require('fs');

const app = express();
const port = 3000;

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'cybersec_monitoring_db';
const COLLECTION_PREFIX = 'cybersec_';

// Collection names with unique identifiers
const COLLECTIONS = {
  SYSTEM_LOGS: `${COLLECTION_PREFIX}system_logs_${Date.now()}`,
  SECURITY_EVENTS: `${COLLECTION_PREFIX}security_events_${Date.now()}`,
  NETWORK_INFO: `${COLLECTION_PREFIX}network_info_${Date.now()}`
};

// Global MongoDB client
let mongoClient;
let db;

// Initialize MongoDB connection
async function initializeDatabase() {
  try {
    mongoClient = new MongoClient("mongodb+srv://maniacexplores:aman1234abcd@cluster0.akyne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    await mongoClient.connect();
    db = mongoClient.db(DATABASE_NAME);
    
    console.log('✅ Connected to MongoDB successfully');
    // console.log(`📊 Database: ${DATABASE_NAME}`);
    // console.log(`📋 Collections:`);
    // console.log(`   - System Logs: ${COLLECTIONS.SYSTEM_LOGS}`);
    // console.log(`   - Security Events: ${COLLECTIONS.SECURITY_EVENTS}`);
    // console.log(`   - Network Info: ${COLLECTIONS.NETWORK_INFO}`);
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Create database indexes
async function createIndexes() {
  try {
    // System logs indexes
    await db.collection(COLLECTIONS.SYSTEM_LOGS).createIndex({ timestamp: -1 });
    await db.collection(COLLECTIONS.SYSTEM_LOGS).createIndex({ ip_address: 1 });
    await db.collection(COLLECTIONS.SYSTEM_LOGS).createIndex({ session_id: 1 });
    
    // Security events indexes
    await db.collection(COLLECTIONS.SECURITY_EVENTS).createIndex({ timestamp: -1 });
    await db.collection(COLLECTIONS.SECURITY_EVENTS).createIndex({ ip_address: 1 });
    await db.collection(COLLECTIONS.SECURITY_EVENTS).createIndex({ event_type: 1 });
    await db.collection(COLLECTIONS.SECURITY_EVENTS).createIndex({ severity: 1 });
    
    // Network info indexes
    await db.collection(COLLECTIONS.NETWORK_INFO).createIndex({ timestamp: -1 });
    await db.collection(COLLECTIONS.NETWORK_INFO).createIndex({ ip_address: 1 });
    
    console.log('📈 Database indexes created successfully');
  } catch (error) {
    console.error('⚠️ Error creating indexes:', error);
  }
}

// Dashboard credentials (in production, store these securely)
const DASHBOARD_CREDENTIALS = {
  username: 'admin',
  password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // 'password123'
};

// Session configuration
app.use(session({
  secret: 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Security middleware with custom CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for dashboard
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(cors({
  origin: '*',         // Allow all origins
  credentials: false   // Cannot be true with origin '*'
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Trust proxy for accurate IP detection
app.set('trust proxy', true);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Schedule database cleanup at 12 AM IST daily
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Starting scheduled database cleanup at 12 AM IST...');
  
  try {
    // Clear all collections
    const systemResult = await db.collection(COLLECTIONS.SYSTEM_LOGS).deleteMany({});
    console.log(`✅ System logs cleared: ${systemResult.deletedCount} documents`);
    
    const eventsResult = await db.collection(COLLECTIONS.SECURITY_EVENTS).deleteMany({});
    console.log(`✅ Security events cleared: ${eventsResult.deletedCount} documents`);
    
    const networkResult = await db.collection(COLLECTIONS.NETWORK_INFO).deleteMany({});
    console.log(`✅ Network info cleared: ${networkResult.deletedCount} documents`);
    
    console.log('🎉 Database cleanup completed successfully');
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
  }
}, {
  timezone: "Asia/Kolkata"
});

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Utility function to generate session ID
function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Dashboard Login</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .login-container {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
                border: 1px solid rgba(255, 255, 255, 0.18);
            }
            h2 {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
                font-weight: 600;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                color: #555;
                font-weight: 500;
            }
            input[type="text"], input[type="password"] {
                width: 100%;
                padding: 12px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
                transition: border-color 0.3s ease;
            }
            input[type="text"]:focus, input[type="password"]:focus {
                outline: none;
                border-color: #667eea;
            }
            button {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            button:hover {
                transform: translateY(-2px);
            }
            .error {
                color: #e74c3c;
                text-align: center;
                margin-top: 15px;
                font-weight: 500;
            }
            .db-info {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
                background: rgba(102, 126, 234, 0.1);
                padding: 10px;
                border-radius: 6px;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h2>🔒 Cybersecurity Dashboard</h2>
            <form method="POST" action="/login">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
                ${req.query.error ? '<div class="error">❌ Invalid credentials</div>' : ''}
            </form>
            <div class="db-info">
                🗄️ Connected to MongoDB<br>
                📊 Database: ${DATABASE_NAME}
            </div>
        </div>
    </body>
    </html>
  `);
});

// Login handler
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === "admin" && password === "password123") {
    req.session.authenticated = true;
    res.redirect('/dashboard');
  } else {
    res.redirect('/login?error=1');
  }
});

// Logout handler
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

// Client-side monitoring script endpoint
app.get('/monitor.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    (function() {
      const sessionId = sessionStorage.getItem('cybersec_session') || 
                       '${generateSessionId()}';
      sessionStorage.setItem('cybersec_session', sessionId);

      // Basic system information
      const systemInfo = {
        sessionId: sessionId,
        screenResolution: screen.width + 'x' + screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        referrer: document.referrer || 'direct'
      };

      // Network information (if available)
      if ('connection' in navigator) {
        systemInfo.networkInfo = {
          connectionType: navigator.connection.type || 'unknown',
          downlink: navigator.connection.downlink || 0,
          effectiveType: navigator.connection.effectiveType || 'unknown',
          rtt: navigator.connection.rtt || 0
        };
      }

      // Send initial system info
      fetch('/api/log-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemInfo)
      }).catch(err => console.warn('Monitoring error:', err));

      // Monitor page visibility changes (potential tab switching)
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          fetch('/api/log-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: sessionId,
              eventType: 'page_hidden',
              severity: 'info',
              description: 'User switched tabs or minimized window'
            })
          }).catch(err => console.warn('Event logging error:', err));
        }
      });

      // Monitor for rapid navigation (potential bot behavior)
      let navigationCount = 0;
      const startTime = Date.now();
      
      window.addEventListener('beforeunload', function() {
        navigationCount++;
        const timeSpent = Date.now() - startTime;
        
        if (navigationCount > 10 && timeSpent < 30000) {
          fetch('/api/log-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: sessionId,
              eventType: 'rapid_navigation',
              severity: 'warning',
              description: \`Rapid navigation detected: \${navigationCount} navigations in \${timeSpent}ms\`
            })
          }).catch(err => console.warn('Event logging error:', err));
        }
      });

      // Monitor for developer tools (basic detection)
      let devtools = {open: false, orientation: null};
      const threshold = 160;
      
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            fetch('/api/log-event', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: sessionId,
                eventType: 'devtools_opened',
                severity: 'warning',
                description: 'Developer tools may have been opened'
              })
            }).catch(err => console.warn('Event logging error:', err));
          }
        } else {
          devtools.open = false;
        }
      }, 500);

    })();
  `);
});

// API endpoint to log system information
app.post('/api/log-system', async (req, res) => {
  try {
    const {
      sessionId,
      screenResolution,
      timezone,
      language,
      platform,
      cookieEnabled,
      onlineStatus,
      referrer,
      networkInfo
    } = req.body;

    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const uaResult = parser.getResult();

    // Generate browser fingerprint
    const crypto = require('crypto');
    const fingerprint = crypto
      .createHash('md5')
      .update(userAgent + screenResolution + timezone + language)
      .digest('hex');

    // System log document
    const systemLogDoc = {
      timestamp: new Date(),
      ip_address: ipAddress,
      user_agent: userAgent,
      browser_name: uaResult.browser.name || 'Unknown',
      browser_version: uaResult.browser.version || 'Unknown',
      os_name: uaResult.os.name || 'Unknown',
      os_version: uaResult.os.version || 'Unknown',
      device_type: uaResult.device.type || 'desktop',
      device_vendor: uaResult.device.vendor || 'Unknown',
      device_model: uaResult.device.model || 'Unknown',
      screen_resolution: screenResolution,
      timezone: timezone,
      language: language,
      referrer: referrer,
      session_id: sessionId,
      fingerprint: fingerprint,
      platform: platform,
      cookie_enabled: cookieEnabled,
      online_status: onlineStatus
    };

    // Insert system log
    await db.collection(COLLECTIONS.SYSTEM_LOGS).insertOne(systemLogDoc);

    // Insert network info if available
    if (networkInfo) {
      const networkDoc = {
        timestamp: new Date(),
        ip_address: ipAddress,
        connection_type: networkInfo.connectionType,
        downlink: networkInfo.downlink,
        effective_type: networkInfo.effectiveType,
        rtt: networkInfo.rtt,
        session_id: sessionId
      };
      
      await db.collection(COLLECTIONS.NETWORK_INFO).insertOne(networkDoc);
    }

    res.json({ status: 'logged', sessionId });
  } catch (error) {
    console.error('Error logging system information:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// API endpoint to log security events
app.post('/api/log-event', async (req, res) => {
  try {
    const { sessionId, eventType, severity, description } = req.body;
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const eventDoc = {
      timestamp: new Date(),
      ip_address: ipAddress,
      event_type: eventType,
      severity: severity,
      description: description,
      user_agent: userAgent,
      session_id: sessionId
    };

    await db.collection(COLLECTIONS.SECURITY_EVENTS).insertOne(eventDoc);
    res.json({ status: 'event_logged' });
  } catch (error) {
    console.error('Error logging security event:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Database export endpoint (exports to JSON)
app.get('/api/download-db', requireAuth, async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cybersec_data_${timestamp}.json`;
    
    // Fetch all data from collections
    const systemLogs = await db.collection(COLLECTIONS.SYSTEM_LOGS).find({}).toArray();
    const securityEvents = await db.collection(COLLECTIONS.SECURITY_EVENTS).find({}).toArray();
    const networkInfo = await db.collection(COLLECTIONS.NETWORK_INFO).find({}).toArray();
    
    const exportData = {
      export_timestamp: new Date().toISOString(),
      database_name: DATABASE_NAME,
      collections: {
        system_logs: {
          collection_name: COLLECTIONS.SYSTEM_LOGS,
          count: systemLogs.length,
          data: systemLogs
        },
        security_events: {
          collection_name: COLLECTIONS.SECURITY_EVENTS,
          count: securityEvents.length,
          data: securityEvents
        },
        network_info: {
          collection_name: COLLECTIONS.NETWORK_INFO,
          count: networkInfo.length,
          data: networkInfo
        }
      },
      total_documents: systemLogs.length + securityEvents.length + networkInfo.length
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    console.error('Error exporting database:', error);
    res.status(500).json({ error: 'Error exporting database' });
  }
});

// Serve dashboard CSS
app.get('/dashboard.css', requireAuth, (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.send(`
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 30px;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header h1 { 
      margin: 0; 
      color: #2c3e50;
      font-weight: 600;
    }
    .header-buttons { 
      display: flex; 
      gap: 12px; 
    }
    .stats { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
      gap: 25px; 
    }
    .card { 
      background: white;
      padding: 25px; 
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }
    .card:hover {
      transform: translateY(-2px);
    }
    .card h3 { 
      margin-top: 0; 
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 15px; 
    }
    th, td { 
      border: 1px solid #e1e5e9; 
      padding: 12px 8px; 
      text-align: left; 
      font-size: 14px;
    }
    th { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
    }
    .severity-high { color: #e74c3c; font-weight: bold; }
    .severity-warning { color: #f39c12; font-weight: bold; }
    .severity-info { color: #3498db; font-weight: bold; }
    .btn { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; 
      border: none; 
      padding: 12px 20px; 
      border-radius: 8px; 
      cursor: pointer; 
      text-decoration: none;
      display: inline-block;
      font-weight: 600;
      transition: transform 0.2s ease;
    }
    .btn:hover { 
      transform: translateY(-2px);
    }
    .btn-success { 
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    }
    .btn-danger { 
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
    .db-status {
      background: rgba(46, 204, 113, 0.1);
      border: 1px solid #2ecc71;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
      color: #27ae60;
      font-weight: 600;
    }
  `);
});

// Serve dashboard JavaScript
app.get('/dashboard.js', requireAuth, (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    function loadDashboardData() {
      fetch('/api/dashboard-data')
        .then(response => response.json())
        .then(data => {
          // System logs
          const systemLogsHtml = data.systemLogs.length > 0 ? 
            '<table><tr><th>IP</th><th>Browser</th><th>OS</th><th>Device</th><th>Time</th></tr>' +
            data.systemLogs.map(log => 
              \`<tr><td>\${log.ip_address}</td><td>\${log.browser_name} \${log.browser_version}</td><td>\${log.os_name}</td><td>\${log.device_type}</td><td>\${new Date(log.timestamp).toLocaleString()}</td></tr>\`
            ).join('') + '</table>' : '<p>📝 No system logs yet.</p>';
          document.getElementById('systemLogs').innerHTML = systemLogsHtml;
          
          // Security events
          const securityEventsHtml = data.securityEvents.length > 0 ?
            '<table><tr><th>Event</th><th>Severity</th><th>Description</th><th>Time</th></tr>' +
            data.securityEvents.map(event => 
              \`<tr><td>\${event.event_type}</td><td class="severity-\${event.severity}">\${event.severity}</td><td>\${event.description}</td><td>\${new Date(event.timestamp).toLocaleString()}</td></tr>\`
            ).join('') + '</table>' : '<p>🛡️ No security events recorded.</p>';
          document.getElementById('securityEvents').innerHTML = securityEventsHtml;
          
          // Network info
          const networkInfoHtml = data.networkInfo.length > 0 ?
            '<table><tr><th>IP</th><th>Connection</th><th>Speed</th><th>RTT</th><th>Time</th></tr>' +
            data.networkInfo.map(info => 
              \`<tr><td>\${info.ip_address}</td><td>\${info.connection_type}</td><td>\${info.downlink || 'N/A'} Mbps</td><td>\${info.rtt || 'N/A'}ms</td><td>\${new Date(info.timestamp).toLocaleString()}</td></tr>\`
            ).join('') + '</table>' : '<p>🌐 No network information available.</p>';
          document.getElementById('networkInfo').innerHTML = networkInfoHtml;
          
          // Update stats
          document.getElementById('statsInfo').innerHTML = \`
            📊 Total Records: <strong>\${data.totalRecords}</strong> | 
            🖥️ System Logs: <strong>\${data.systemLogs.length}</strong> | 
            ⚠️ Security Events: <strong>\${data.securityEvents.length}</strong> | 
            🌐 Network Info: <strong>\${data.networkInfo.length}</strong>
          \`;
        })
        .catch(error => {
          console.error('Error loading dashboard data:', error);
          document.getElementById('systemLogs').innerHTML = '<p>❌ Error loading data.</p>';
          document.getElementById('securityEvents').innerHTML = '<p>❌ Error loading data.</p>';
          document.getElementById('networkInfo').innerHTML = '<p>❌ Error loading data.</p>';
        });
    }

    function downloadDatabase() {
      window.open('/api/download-db', '_blank');
    }

    function logout() {
      if (confirm('Are you sure you want to logout?')) {
        fetch('/logout', { method: 'POST' })
          .then(() => {
            window.location.href = '/login';
          })
          .catch(error => {
            console.error('Logout error:', error);
            window.location.href = '/login';
          });
      }
    }

    // Load data when page loads
    document.addEventListener('DOMContentLoaded', function() {
      loadDashboardData();
      
      // Auto-refresh every 30 seconds
      setInterval(loadDashboardData, 30000);
    });
  `);
});

// Dashboard endpoint to view collected data
app.get('/dashboard', requireAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Cybersecurity Dashboard - MongoDB</title>
        <link rel="stylesheet" href="/dashboard.css">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <div class="db-status">
          🗄️ Connected to MongoDB Database: <strong>${DATABASE_NAME}</strong>
          <div id="statsInfo" style="margin-top: 10px;">Loading statistics...</div>
        </div>
        
        <div class="header">
            <h1>🔒 Cybersecurity Monitoring Dashboard</h1>
            <div class="header-buttons">
                <button class="btn" onclick="loadDashboardData()">🔄 Refresh Data</button>
                <button class="btn btn-success" onclick="downloadDatabase()">📥 Export Data (JSON)</button>
                <button class="btn btn-danger" onclick="logout()">🚪 Logout</button>
            </div>
        </div>
        
        <div class="stats">
            <div class="card">
                <h3>📊 Recent System Logs</h3>
                <small>Collection: ${COLLECTIONS.SYSTEM_LOGS}</small>
                <div id="systemLogs">Loading...</div>
            </div>
            <div class="card">
                <h3>⚠️ Security Events</h3>
                <small>Collection: ${COLLECTIONS.SECURITY_EVENTS}</small>
                <div id="securityEvents">Loading...</div>
            </div>
            <div class="card">
                <h3>🌐 Network Information</h3>
                <small>Collection: ${COLLECTIONS.NETWORK_INFO}</small>
                <div id="networkInfo">Loading...</div>
            </div>
        </div>
        
        <script src="/dashboard.js"></script>
    </body>
    </html>
  `);
});

// API endpoint for dashboard data
app.get('/api/dashboard-data', requireAuth, async (req, res) => {
  try {
    // Get recent documents from each collection
    const systemLogs = await db.collection(COLLECTIONS.SYSTEM_LOGS)
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
      
    const securityEvents = await db.collection(COLLECTIONS.SECURITY_EVENTS)
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
      
    const networkInfo = await db.collection(COLLECTIONS.NETWORK_INFO)
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    const totalRecords = systemLogs.length + securityEvents.length + networkInfo.length;

    res.json({
      systemLogs,
      securityEvents,
      networkInfo,
      totalRecords,
      collections: COLLECTIONS
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Simple test page
app.get('/welcome', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Radhe Radhe 🙏</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #fdf6e3 0%, #f4d03f 100%);
                color: #333;
                text-align: center;
                padding: 50px;
                min-height: 100vh;
                margin: 0;
            }
            h1 {
                font-size: 3em;
                color: #b22222;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .gif-container {
                margin: 30px auto;
                max-width: 400px;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            }
            img {
                width: 100%;
                border-radius: 12px;
            }
            .message {
                margin-top: 30px;
                font-size: 1.4em;
                color: #555;
                background: rgba(255, 255, 255, 0.8);
                padding: 20px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            .db-info {
                margin-top: 30px;
                padding: 15px;
                background: rgba(46, 204, 113, 0.1);
                border: 1px solid #2ecc71;
                border-radius: 8px;
                color: #27ae60;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <h1>🌸 Radhe Radhe 🌸</h1>
        
        <div class="gif-container">
            <img src="https://media.giphy.com/media/HUkOv6BNWc1HO/giphy.gif" alt="Radhe Radhe meme">
        </div>

        <div class="message">
            Welcome! May your day be filled with peace and joy. 🌼✨
        </div>
      
        
        <!-- Load the monitoring script -->
        <script src="/monitor.js"></script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    await db.admin().ping();
    
    // Get collection stats
    const systemLogsCount = await db.collection(COLLECTIONS.SYSTEM_LOGS).countDocuments();
    const securityEventsCount = await db.collection(COLLECTIONS.SECURITY_EVENTS).countDocuments();
    const networkInfoCount = await db.collection(COLLECTIONS.NETWORK_INFO).countDocuments();
    
    res.json({
      status: 'healthy',
      database: {
        connected: true,
        name: DATABASE_NAME,
        collections: {
          system_logs: {
            name: COLLECTIONS.SYSTEM_LOGS,
            count: systemLogsCount
          },
          security_events: {
            name: COLLECTIONS.SECURITY_EVENTS,
            count: securityEventsCount
          },
          network_info: {
            name: COLLECTIONS.NETWORK_INFO,
            count: networkInfoCount
          }
        },
        total_documents: systemLogsCount + securityEventsCount + networkInfoCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to get collection statistics
app.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const stats = await Promise.all([
      db.collection(COLLECTIONS.SYSTEM_LOGS).countDocuments(),
      db.collection(COLLECTIONS.SECURITY_EVENTS).countDocuments(),
      db.collection(COLLECTIONS.NETWORK_INFO).countDocuments(),
      
      // Get today's data
      db.collection(COLLECTIONS.SYSTEM_LOGS).countDocuments({
        timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      db.collection(COLLECTIONS.SECURITY_EVENTS).countDocuments({
        timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      
      // Get unique IPs today
      db.collection(COLLECTIONS.SYSTEM_LOGS).distinct('ip_address', {
        timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      
      // Get security events by severity
      db.collection(COLLECTIONS.SECURITY_EVENTS).aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]).toArray()
    ]);
    
    res.json({
      total: {
        system_logs: stats[0],
        security_events: stats[1],
        network_info: stats[2],
        all_documents: stats[0] + stats[1] + stats[2]
      },
      today: {
        system_logs: stats[3],
        security_events: stats[4],
        unique_ips: stats[5].length
      },
      security_events_by_severity: stats[6],
      collections: COLLECTIONS
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(port, () => {
      console.log('🚀 Cybersecurity monitoring platform started successfully!');
      console.log(`📍 Server running at http://localhost:${port}`);
      console.log(`🔒 Dashboard: http://localhost:${port}/dashboard`);
      console.log(`🚪 Login: http://localhost:${port}/login`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
      console.log(`📊 Statistics: http://localhost:${port}/api/stats`);
      console.log(`🌐 Test page: http://localhost:${port}/welcome`);
      console.log(`📝 Monitoring script: http://localhost:${port}/monitor.js`);
      console.log('');
      console.log('🔐 Default credentials:');
      console.log('   Username: admin');
      console.log('   Password: password123');
      console.log('');
      console.log('🗄️ MongoDB Configuration:');
      console.log(`   Database: ${DATABASE_NAME}`);
      console.log(`   System Logs: ${COLLECTIONS.SYSTEM_LOGS}`);
      console.log(`   Security Events: ${COLLECTIONS.SECURITY_EVENTS}`);
      console.log(`   Network Info: ${COLLECTIONS.NETWORK_INFO}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('✅ MongoDB connection closed');
    }
    console.log('👋 Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();