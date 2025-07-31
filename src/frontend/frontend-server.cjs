#!/usr/bin/env node

/**
 * UNIFIED PROFESSIONAL FRONTEND SERVER
 * Single Express.js server with dual environment support, security headers, and complete middleware stack
 * Replaces all patch servers with professional implementation
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');

// Core dependencies
let helmet, compression, cors;

// Import with graceful fallback for security middleware
try {
  helmet = require('helmet');
} catch (error) {
  console.warn('Helmet not available, using fallback security headers');
  helmet = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  };
}

try {
  compression = require('compression');
} catch (error) {
  console.warn('Compression middleware not available, using fallback');
  compression = (req, res, next) => next();
}

try {
  cors = require('cors');
} catch (error) {
  console.warn('CORS middleware not available, using fallback');
  cors = (options) => (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  };
}

// Import PathResolver for universal path resolution
let PathResolver;
try {
  PathResolver = require('../../tools/core/PathResolver.js');
} catch (error) {
  console.warn('PathResolver not available, using fallback path resolution');
  PathResolver = {
    getWorkingDirectory: () => process.cwd(),
    getLogPath: (name) => path.join(process.cwd(), 'logs', `${name}.log`)
  };
}

// Import dual environment configuration
let DualEnvironmentConfig;
try {
  const { DualEnvironmentConfig: DualEnvConfig } = require('../backend/src/config/dualEnvironmentConfig');
  DualEnvironmentConfig = DualEnvConfig;
} catch (error) {
  console.warn('DualEnvironmentConfig not available, using fallback configuration');
  DualEnvironmentConfig = class {
    getCurrentEnvironment() {
      return process.env.NODE_ENV === 'test' ? 'test' : 'production';
    }
    
    isTestEnvironment() {
      return this.getCurrentEnvironment() === 'test';
    }
    
    getEnvironmentConfig(env) {
      const base = {
        frontend: {
          port: env === 'test' ? 5174 : 5173,
          host: '0.0.0.0',
          processName: `frontend-${env}`,
          workingDir: process.cwd(),
          apiUrl: `http://79.72.47.188:${env === 'test' ? 3001 : 3000}/api/v1`,
          buildMode: env === 'test' ? 'development' : 'production',
          maxMemory: '200M'
        },
        backend: {
          port: env === 'test' ? 3001 : 3000,
          host: '0.0.0.0'
        }
      };
      return base;
    }
  };
}

// Import logger with fallback
let logger;
try {
  logger = require('../backend/src/utils/logger');
} catch (error) {
  console.warn('Logger not available, using console fallback');
  logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug
  };
}

// Initialize dual environment configuration
const dualEnvConfig = new DualEnvironmentConfig();
const currentEnv = dualEnvConfig.getCurrentEnvironment();
const envConfig = dualEnvConfig.getEnvironmentConfig(currentEnv);

// Create Express app
const app = express();
const PORT = process.env.FRONTEND_PORT || process.env.PORT || envConfig.frontend.port;
const HOST = process.env.HOST || envConfig.frontend.host;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Professional security configuration
const helmetConfig = typeof helmet === 'function' ? helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:*", "http://79.72.47.188:*", "https://79.72.47.188:*"]
    }
  },
  crossOriginEmbedderPolicy: false
}) : helmet;

// Compression configuration
const compressionConfig = compression();

// Environment-specific CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from any origin in test environment for development
    if (dualEnvConfig.isTestEnvironment()) {
      callback(null, true);
      return;
    }
    
    // Production environment - more restrictive
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://79.72.47.188:3000',
      'http://79.72.47.188:5173',
      'http://79.72.47.188:3001',
      'http://79.72.47.188:5174',
      'https://79.72.47.188:3000',
      'https://79.72.47.188:5173'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Environment',
    'X-Frontend-Version'
  ],
  exposedHeaders: ['X-Environment', 'X-Frontend-Version']
};

// Apply security middleware stack
app.use(helmetConfig);
app.use(compressionConfig);
app.use(cors(corsOptions));

// Add environment headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Environment', currentEnv.toUpperCase());
  res.setHeader('X-Frontend-Version', '2.0.0-unified');
  res.setHeader('X-Frontend-Process', envConfig.frontend.processName);
  res.setHeader('X-Server-Type', 'unified-professional');
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
});

// Environment-specific frontend static files directory
let frontendDistPath;
if (dualEnvConfig.isTestEnvironment()) {
  // For test environment, serve from public directory (HTML files)
  frontendDistPath = path.join(__dirname, 'public');
} else {
  // For production, try dist first, fallback to public if dist doesn't exist
  const distPath = path.join(__dirname, 'dist');
  const publicPath = path.join(__dirname, 'public');
  
  if (fs.existsSync(distPath)) {
    frontendDistPath = distPath;
  } else {
    logger.warn(`Production dist directory not found: ${distPath}. Using public directory as fallback.`);
    frontendDistPath = publicPath;
  }
}

// Ensure directory exists
if (!fs.existsSync(frontendDistPath)) {
  logger.warn(`Frontend directory does not exist: ${frontendDistPath}. Creating fallback...`);
  // Create fallback directory structure
  fs.mkdirSync(frontendDistPath, { recursive: true });
  
  // Create basic index.html as fallback
  const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Main Server Platform - ${currentEnv.toUpperCase()}</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .env-badge { background: ${dualEnvConfig.isTestEnvironment() ? '#ff9800' : '#2196f3'}; color: white; padding: 10px 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Main Server Platform</h1>
        <div class="env-badge">${currentEnv.toUpperCase()} Environment</div>
        <p>Frontend server is running successfully!</p>
        <p>Server Type: Unified Professional Express.js Server</p>
        <p>Health Check: <a href="/health">/health</a></p>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(frontendDistPath, 'index.html'), fallbackHTML);
  if (dualEnvConfig.isTestEnvironment()) {
    fs.writeFileSync(path.join(frontendDistPath, 'index-test.html'), fallbackHTML.replace('Main Server Platform', 'Main Server Platform - TEST'));
  }
}

// Serve static files with professional configuration
app.use(express.static(frontendDistPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1h' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Security headers for HTML files
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    
    // Content type optimization
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Environment indicator
const getEnvironmentBanner = () => {
  const isTest = dualEnvConfig.isTestEnvironment();
  return isTest ? '🧪 TEST FRONTEND' : '🚀 PRODUCTION FRONTEND';
};

// Professional health check endpoint
app.get('/health', async (req, res) => {
  try {
    const envBanner = getEnvironmentBanner();
    const isTest = dualEnvConfig.isTestEnvironment();
    
    // Test backend connectivity
    let backendHealth = null;
    try {
      // Use node-fetch or fallback to basic http
      let fetch;
      try {
        fetch = require('node-fetch');
      } catch (error) {
        // Fallback to basic HTTP request
        const http = require('http');
        fetch = (url, options = {}) => {
          return new Promise((resolve, reject) => {
            const req = http.get(url, (res) => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => {
                resolve({
                  ok: res.statusCode >= 200 && res.statusCode < 300,
                  json: () => Promise.resolve(JSON.parse(data))
                });
              });
            });
            req.on('error', reject);
            req.setTimeout(options.timeout || 5000, () => {
              req.destroy();
              reject(new Error('Request timeout'));
            });
          });
        };
      }
      
      const backendUrl = `http://${envConfig.backend.host}:${envConfig.backend.port}/health`;
      const response = await fetch(backendUrl, { timeout: 5000 });
      if (response.ok) {
        backendHealth = await response.json();
      }
    } catch (error) {
      backendHealth = { error: 'Backend unreachable', details: error.message };
    }
    
    res.json({
      success: true,
      message: `${envBanner} server is healthy`,
      timestamp: new Date().toISOString(),
      version: '2.0.0-unified',
      serverType: 'unified-professional-express',
      environment: {
        current: currentEnv,
        isTest: isTest,
        processEnv: process.env.NODE_ENV || 'development'
      },
      server: {
        name: envConfig.frontend.processName,
        port: PORT,
        host: HOST,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        workingDir: envConfig.frontend.workingDir,
        servingFrom: frontendDistPath
      },
      backend: {
        connectivity: backendHealth && !backendHealth.error ? 'connected' : 'disconnected',
        port: envConfig.backend.port,
        health: backendHealth
      },
      security: {
        helmet: typeof helmet === 'function' ? 'active' : 'fallback',
        compression: 'active',
        cors: 'configured',
        https: process.env.HTTPS === 'true'
      },
      configuration: {
        apiUrl: envConfig.frontend.apiUrl,
        buildMode: envConfig.frontend.buildMode,
        maxMemory: envConfig.frontend.maxMemory
      },
      ...(isTest && {
        testFeatures: {
          autoRestart: true,
          enhancedLogging: true,
          mockDataAvailable: true,
          debugMode: true
        }
      })
    });
  } catch (error) {
    logger.error('Frontend health check error:', error);
    res.status(503).json({
      success: false,
      message: 'Frontend health check failed',
      timestamp: new Date().toISOString(),
      error: error.message,
      environment: currentEnv,
      serverType: 'unified-professional-express'
    });
  }
});

// API endpoint for environment information
app.get('/api/environment', (req, res) => {
  res.json({
    environment: currentEnv,
    isTest: dualEnvConfig.isTestEnvironment(),
    config: envConfig,
    serverType: 'unified-professional-express',
    timestamp: new Date().toISOString()
  });
});

// SPA fallback with environment-specific index files
app.get('*', (req, res) => {
  // Determine which index file to serve based on environment
  let indexFileName = 'index.html';
  if (dualEnvConfig.isTestEnvironment()) {
    // Check if index-test.html exists, otherwise fall back to index.html
    const testIndexPath = path.join(frontendDistPath, 'index-test.html');
    if (fs.existsSync(testIndexPath)) {
      indexFileName = 'index-test.html';
    }
  }
  
  const indexPath = path.join(frontendDistPath, indexFileName);
  
  logger.info(`Serving SPA route: ${req.path} -> ${indexFileName}`, {
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    indexFile: indexFileName
  });
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      logger.error('Error serving index.html:', err);
      res.status(500).json({ 
        success: false, 
        error: 'Frontend loading error',
        message: 'Unable to load the application interface',
        serverType: 'unified-professional-express'
      });
    }
  });
});

// Professional error handling middleware
app.use((err, req, res, next) => {
  logger.error('Frontend server error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    timestamp: new Date().toISOString(),
    serverType: 'unified-professional-express'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: 'This is the frontend server. API requests should go to the backend server.',
    backend: `http://${envConfig.backend.host}:${envConfig.backend.port}`,
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = createServer(app);

server.listen(PORT, HOST, () => {
  const envBanner = getEnvironmentBanner();
  logger.info(`${envBanner} - Unified Professional Server Started`);
  logger.info(`📍 Environment: ${currentEnv.toUpperCase()}`);
  logger.info(`🏗️ Process: ${envConfig.frontend.processName}`);
  logger.info(`🌐 Server: http://${HOST}:${PORT}`);
  logger.info(`📁 Serving from: ${frontendDistPath}`);
  logger.info(`🔒 Security: Professional Express.js with complete middleware stack`);
  logger.info(`🛡️ Headers: Helmet (${typeof helmet === 'function' ? 'active' : 'fallback'}) + CORS + Compression`);
  logger.info(`💓 Health check: http://${HOST}:${PORT}/health`);
  logger.info(`🔗 API Backend: ${envConfig.frontend.apiUrl}`);
  logger.info(`📊 Build Mode: ${envConfig.frontend.buildMode}`);
  logger.info(`💾 Max Memory: ${envConfig.frontend.maxMemory}`);
  
  if (dualEnvConfig.isTestEnvironment()) {
    logger.info('🧪 TEST ENVIRONMENT ACTIVE - Development features enabled');
    logger.info('🔄 Serving test-specific HTML files when available');
    logger.info('🌐 Production URL: http://79.72.47.188:5173');
  } else {
    logger.info('🚀 PRODUCTION ENVIRONMENT ACTIVE - Optimized for performance');
    logger.info('🔄 Serving built distribution files');
    logger.info('🧪 Test URL: http://79.72.47.188:5174');
  }
  
  logger.info('✅ Unified Professional Frontend Server startup completed successfully');
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  const envBanner = getEnvironmentBanner();
  logger.info(`🛑 ${envBanner} - Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    logger.info(`✅ ${envBanner} - Server closed`);
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

// Handle unhandled errors
process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception in frontend server:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection in frontend server:', { reason, promise });
  gracefulShutdown('unhandledRejection');
});

module.exports = app;