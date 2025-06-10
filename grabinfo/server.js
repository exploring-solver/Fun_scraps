const express = require('express');
const sqlite3 = require('sqlite3').verbose();
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

// Initialize SQLite database
const db = new sqlite3.Database('./cybersec_logs.db');

// Create tables
db.serialize(() => {
  // System information table
  db.run(`CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    browser_name TEXT,
    browser_version TEXT,
    os_name TEXT,
    os_version TEXT,
    device_type TEXT,
    device_vendor TEXT,
    device_model TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    referrer TEXT,
    session_id TEXT,
    fingerprint TEXT
  )`);

  // Security events table
  db.run(`CREATE TABLE IF NOT EXISTS security_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    event_type TEXT,
    severity TEXT,
    description TEXT,
    user_agent TEXT,
    session_id TEXT
  )`);

  // Network information table
  db.run(`CREATE TABLE IF NOT EXISTS network_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    connection_type TEXT,
    downlink REAL,
    effective_type TEXT,
    rtt INTEGER,
    session_id TEXT
  )`);
});

// Schedule database cleanup at 12 AM IST daily
cron.schedule('0 0 * * *', () => {
  console.log('Starting scheduled database cleanup at 12 AM IST...');
  
  // Clear all tables
  db.serialize(() => {
    db.run('DELETE FROM system_logs', (err) => {
      if (err) {
        console.error('Error clearing system_logs:', err);
      } else {
        console.log('System logs cleared successfully');
      }
    });
    
    db.run('DELETE FROM security_events', (err) => {
      if (err) {
        console.error('Error clearing security_events:', err);
      } else {
        console.log('Security events cleared successfully');
      }
    });
    
    db.run('DELETE FROM network_info', (err) => {
      if (err) {
        console.error('Error clearing network_info:', err);
      } else {
        console.log('Network info cleared successfully');
      }
    });
    
    // Reset auto-increment counters
    db.run('DELETE FROM sqlite_sequence WHERE name IN ("system_logs", "security_events", "network_info")', (err) => {
      if (err) {
        console.error('Error resetting auto-increment:', err);
      } else {
        console.log('Auto-increment counters reset successfully');
      }
    });
  });
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
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .login-container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
            }
            h2 {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                color: #555;
            }
            input[type="text"], input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
                box-sizing: border-box;
            }
            button {
                width: 100%;
                padding: 12px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
            }
            button:hover {
                background: #0056b3;
            }
            .error {
                color: red;
                text-align: center;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h2>🔒 Dashboard Login</h2>
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
                ${req.query.error ? '<div class="error">Invalid credentials</div>' : ''}
            </form>
        </div>
    </body>
    </html>
  `);
});

// Login handler
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === "admin" && 
      password == "password123") { // Use bcrypt in production) {
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

      // Monitor for security events
      const securityEvents = {
        // Multiple failed login attempts
        loginAttempts: 0,
        
        // Suspicious navigation patterns
        rapidNavigation: {
          count: 0,
          lastTime: Date.now()
        }
      };

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
        
        if (navigationCount > 10 && timeSpent < 30000) { // 10+ navigations in 30 seconds
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
app.post('/api/log-system', (req, res) => {
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
  const fingerprint = require('crypto')
    .createHash('md5')
    .update(userAgent + screenResolution + timezone + language)
    .digest('hex');

  // Insert system log
  db.run(`INSERT INTO system_logs (
    ip_address, user_agent, browser_name, browser_version, 
    os_name, os_version, device_type, device_vendor, device_model,
    screen_resolution, timezone, language, referrer, session_id, fingerprint
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    ipAddress,
    userAgent,
    uaResult.browser.name || 'Unknown',
    uaResult.browser.version || 'Unknown',
    uaResult.os.name || 'Unknown',
    uaResult.os.version || 'Unknown',
    uaResult.device.type || 'desktop',
    uaResult.device.vendor || 'Unknown',
    uaResult.device.model || 'Unknown',
    screenResolution,
    timezone,
    language,
    referrer,
    sessionId,
    fingerprint
  ]);

  // Insert network info if available
  if (networkInfo) {
    db.run(`INSERT INTO network_info (
      ip_address, connection_type, downlink, effective_type, rtt, session_id
    ) VALUES (?, ?, ?, ?, ?, ?)`, [
      ipAddress,
      networkInfo.connectionType,
      networkInfo.downlink,
      networkInfo.effectiveType,
      networkInfo.rtt,
      sessionId
    ]);
  }

  res.json({ status: 'logged', sessionId });
});

// API endpoint to log security events
app.post('/api/log-event', (req, res) => {
  const { sessionId, eventType, severity, description } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown';

  db.run(`INSERT INTO security_events (
    ip_address, event_type, severity, description, user_agent, session_id
  ) VALUES (?, ?, ?, ?, ?, ?)`, [
    ipAddress,
    eventType,
    severity,
    description,
    userAgent,
    sessionId
  ], function (err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  });

  res.json({ status: 'event_logged' });
});

// Database download endpoint
app.get('/api/download-db', requireAuth, (req, res) => {
  const dbPath = path.join(__dirname, 'cybersec_logs.db');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `cybersec_logs_${timestamp}.db`;
  
  res.download(dbPath, filename, (err) => {
    if (err) {
      console.error('Error downloading database:', err);
      res.status(500).json({ error: 'Error downloading database' });
    }
  });
});

// Serve dashboard CSS
app.get('/dashboard.css', requireAuth, (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.send(`
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header h1 { margin: 0; }
    .header-buttons { display: flex; gap: 10px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
    .card h3 { margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .severity-high { color: red; font-weight: bold; }
    .severity-warning { color: orange; font-weight: bold; }
    .severity-info { color: blue; }
    .btn { 
      background: #007bff; 
      color: white; 
      border: none; 
      padding: 10px 20px; 
      border-radius: 4px; 
      cursor: pointer; 
      text-decoration: none;
      display: inline-block;
    }
    .btn:hover { background: #0056b3; }
    .btn-success { background: #28a745; }
    .btn-success:hover { background: #218838; }
    .btn-danger { background: #dc3545; }
    .btn-danger:hover { background: #c82333; }
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
            ).join('') + '</table>' : '<p>No system logs yet.</p>';
          document.getElementById('systemLogs').innerHTML = systemLogsHtml;
          
          // Security events
          const securityEventsHtml = data.securityEvents.length > 0 ?
            '<table><tr><th>Event</th><th>Severity</th><th>Description</th><th>Time</th></tr>' +
            data.securityEvents.map(event => 
              \`<tr><td>\${event.event_type}</td><td class="severity-\${event.severity}">\${event.severity}</td><td>\${event.description}</td><td>\${new Date(event.timestamp).toLocaleString()}</td></tr>\`
            ).join('') + '</table>' : '<p>No security events.</p>';
          document.getElementById('securityEvents').innerHTML = securityEventsHtml;
          
          // Network info
          const networkInfoHtml = data.networkInfo.length > 0 ?
            '<table><tr><th>IP</th><th>Connection</th><th>Speed</th><th>RTT</th><th>Time</th></tr>' +
            data.networkInfo.map(info => 
              \`<tr><td>\${info.ip_address}</td><td>\${info.connection_type}</td><td>\${info.downlink || 'N/A'} Mbps</td><td>\${info.rtt || 'N/A'}ms</td><td>\${new Date(info.timestamp).toLocaleString()}</td></tr>\`
            ).join('') + '</table>' : '<p>No network information.</p>';
          document.getElementById('networkInfo').innerHTML = networkInfoHtml;
        })
        .catch(error => {
          console.error('Error loading dashboard data:', error);
          document.getElementById('systemLogs').innerHTML = '<p>Error loading data.</p>';
          document.getElementById('securityEvents').innerHTML = '<p>Error loading data.</p>';
          document.getElementById('networkInfo').innerHTML = '<p>Error loading data.</p>';
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

// Dashboard endpoint to view collected data (now requires authentication)
app.get('/dashboard', requireAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Cybersecurity Dashboard</title>
        <link rel="stylesheet" href="/dashboard.css">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <div class="header">
            <h1>🔒 Cybersecurity Monitoring Dashboard</h1>
            <div class="header-buttons">
                <button class="btn" id="refreshBtn">🔄 Refresh Data</button>
                <a href="http://localhost:3000/api/download-db" class="btn btn-success" id="downloadDbBtn">📥 Download Database</a>
                <a href="http://localhost:3000/logout" class="btn btn-danger" id="logoutBtn">🚪 Logout</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="card">
                <h3>📊 Recent System Logs</h3>
                <div id="systemLogs">Loading...</div>
            </div>
            <div class="card">
                <h3>⚠️ Security Events</h3>
                <div id="securityEvents">Loading...</div>
            </div>
            <div class="card">
                <h3>🌐 Network Information</h3>
                <div id="networkInfo">Loading...</div>
            </div>
        </div>
        
        <script src="/dashboard.js"></script>
    </body>
    </html>
  `);
});

// API endpoint for dashboard data (now requires authentication)
app.get('/api/dashboard-data', requireAuth, (req, res) => {
  const data = { systemLogs: [], securityEvents: [], networkInfo: [] };

  // Get recent system logs
  db.all("SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 50", (err, rows) => {
    if (!err) data.systemLogs = rows;

    // Get recent security events
    db.all("SELECT * FROM security_events ORDER BY timestamp DESC LIMIT 50", (err, rows) => {
      if (!err) data.securityEvents = rows;

      // Get recent network info
      db.all("SELECT * FROM network_info ORDER BY timestamp DESC LIMIT 50", (err, rows) => {
        if (!err) data.networkInfo = rows;
        res.json(data);
      });
    });
  });
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
                background: #fdf6e3;
                color: #333;
                text-align: center;
                padding: 50px;
            }
            h1 {
                font-size: 3em;
                color: #b22222;
            }
            .gif-container {
                margin: 30px auto;
                max-width: 400px;
            }
            img {
                width: 100%;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .message {
                margin-top: 30px;
                font-size: 1.4em;
                color: #555;
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

app.listen(port, () => {
  console.log(`Cybersecurity monitoring platform running at http://localhost:${port}`);
  console.log(`Dashboard available at http://localhost:${port}/dashboard`);
  console.log(`Login page available at http://localhost:${port}/login`);
  console.log(`Monitoring script available at http://localhost:${port}/monitor.js`);
  console.log(`Default credentials - Username: admin, Password: password123`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nClosing database connection...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});