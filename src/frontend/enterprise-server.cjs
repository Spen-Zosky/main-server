#!/usr/bin/env node

/**
 * ENTERPRISE-GRADE FRONTEND SERVER
 * Zero external dependencies - Pure Node.js built-in modules only
 * Truly robust, unattended, error-free platform
 * 
 * Features:
 * - Environment-aware dual configuration
 * - Enterprise-grade error handling
 * - Security headers and CORS
 * - Health monitoring
 * - Graceful shutdown
 * - Complete static file serving
 * - Zero dependency conflicts
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const os = require('os');

// Environment detection
const NODE_ENV = process.env.NODE_ENV || 'development';
const isTestEnvironment = NODE_ENV === 'test';
const currentEnv = isTestEnvironment ? 'test' : 'production';

// Configuration
const CONFIG = {
  production: {
    port: parseInt(process.env.PORT || process.env.FRONTEND_PORT || '5173'),
    host: process.env.HOST || '0.0.0.0',
    name: 'frontend-prod',
    backend: { port: 3000 },
    servePath: path.join(__dirname, 'dist'),
    fallbackPath: path.join(__dirname, 'public')
  },
  test: {
    port: parseInt(process.env.PORT || process.env.FRONTEND_PORT || '5174'),
    host: process.env.HOST || '0.0.0.0',
    name: 'frontend-test',
    backend: { port: 3001 },
    servePath: path.join(__dirname, 'dist'),
    fallbackPath: path.join(__dirname, 'public')
  }
};

const config = CONFIG[currentEnv];

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Security headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Environment': currentEnv.toUpperCase(),
  'X-Server-Type': 'enterprise-nodejs-builtin',
  'X-Frontend-Version': '3.0.0-enterprise'
};

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Environment',
  'Access-Control-Expose-Headers': 'X-Environment, X-Server-Type, X-Frontend-Version'
};

// Simple logging utility
const logger = {
  info: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} [INFO] ${message}`, data);
  },
  error: (message, error = {}) => {
    const timestamp = new Date().toISOString();
    console.error(`${timestamp} [ERROR] ${message}`, error);
  },
  warn: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`${timestamp} [WARN] ${message}`, data);
  }
};

// Utility functions
const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
};

const setHeaders = (res, additionalHeaders = {}) => {
  // Set security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // Set CORS headers
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // Set additional headers
  Object.entries(additionalHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

// File serving utility
const serveFile = (filePath, res, fallbackPath = null) => {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    if (fallbackPath && fs.existsSync(fallbackPath)) {
      return serveFile(fallbackPath, res);
    }
    return serve404(res);
  }

  // Get file stats
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch (error) {
    logger.error('Error getting file stats:', { filePath, error: error.message });
    return serve500(res, 'File access error');
  }

  // Don't serve directories
  if (stats.isDirectory()) {
    return serve404(res);
  }

  // Read and serve file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      logger.error('Error reading file:', { filePath, error: error.message });
      return serve500(res, 'File read error');
    }

    const contentType = getContentType(filePath);
    const cacheControl = filePath.endsWith('.html') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600';
    
    setHeaders(res, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'Cache-Control': cacheControl,
      'Last-Modified': stats.mtime.toUTCString(),
      'ETag': `"${stats.size.toString(16)}-${stats.mtime.getTime().toString(16)}"`
    });

    res.writeHead(200);
    res.end(content);
  });
};

// Error responses
const serve404 = (res) => {
  const errorPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #e74c3c; margin-bottom: 20px; }
        .env-badge { background: ${isTestEnvironment ? '#ff9800' : '#2196f3'}; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - Page Not Found</h1>
        <div class="env-badge">${currentEnv.toUpperCase()} ENVIRONMENT</div>
        <p>The requested resource was not found on this server.</p>
        <p><a href="/">Back to Home</a></p>
    </div>
</body>
</html>`;

  setHeaders(res, { 'Content-Type': 'text/html; charset=utf-8' });
  res.writeHead(404);
  res.end(errorPage);
};

const serve500 = (res, message = 'Internal Server Error') => {
  const errorPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Server Error</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #e74c3c; margin-bottom: 20px; }
        .env-badge { background: ${isTestEnvironment ? '#ff9800' : '#2196f3'}; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>500 - Server Error</h1>
        <div class="env-badge">${currentEnv.toUpperCase()} ENVIRONMENT</div>
        <p>${message}</p>
        <p><a href="/">Back to Home</a></p>
    </div>
</body>
</html>`;

  setHeaders(res, { 'Content-Type': 'text/html; charset=utf-8' });
  res.writeHead(500);
  res.end(errorPage);
};

// Health check endpoint
const serveHealth = async (res) => {
  try {
    // Test backend connectivity
    let backendHealth = null;
    try {
      const backendUrl = `http://localhost:${config.backend.port}/health`;
      const response = await testBackendHealth(backendUrl);
      backendHealth = response;
    } catch (error) {
      backendHealth = { error: 'Backend unreachable', details: error.message };
    }

    const healthData = {
      success: true,
      message: `${isTestEnvironment ? '🧪 TEST' : '🚀 PRODUCTION'} Enterprise Frontend Server - Healthy`,
      timestamp: new Date().toISOString(),
      version: '3.0.0-enterprise',
      serverType: 'enterprise-nodejs-builtin',
      environment: {
        current: currentEnv,
        isTest: isTestEnvironment,
        nodeEnv: NODE_ENV
      },
      server: {
        name: config.name,
        port: config.port,
        host: config.host,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        workingDir: process.cwd(),
        servingFrom: config.servePath,
        fallbackPath: config.fallbackPath
      },
      backend: {
        connectivity: backendHealth && !backendHealth.error ? 'connected' : 'disconnected',
        port: config.backend.port,
        health: backendHealth
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        memory: os.totalmem(),
        freeMemory: os.freemem(),
        loadAverage: os.loadavg()
      },
      features: {
        dependencies: 'zero-external-dependencies',
        security: 'enterprise-headers',
        cors: 'enabled',
        compression: 'none-required',
        errorHandling: 'comprehensive'
      }
    };

    setHeaders(res, { 'Content-Type': 'application/json; charset=utf-8' });
    res.writeHead(200);
    res.end(JSON.stringify(healthData, null, 2));
  } catch (error) {
    logger.error('Health check error:', error);
    const errorData = {
      success: false,
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: error.message,
      environment: currentEnv,
      serverType: 'enterprise-nodejs-builtin'
    };

    setHeaders(res, { 'Content-Type': 'application/json; charset=utf-8' });
    res.writeHead(503);
    res.end(JSON.stringify(errorData, null, 2));
  }
};

// Simple backend health test using built-in http
const testBackendHealth = (url) => {
  return new Promise((resolve, reject) => {
    const { hostname, port, pathname } = new URL(url);
    
    const options = {
      hostname,
      port,
      path: pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve({ data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.setTimeout(5000);
    req.end();
  });
};

// Environment info endpoint
const serveEnvironment = (res) => {
  const envData = {
    environment: currentEnv,
    isTest: isTestEnvironment,
    nodeEnv: NODE_ENV,
    config: config,
    serverType: 'enterprise-nodejs-builtin',
    timestamp: new Date().toISOString(),
    ports: {
      frontend: config.port,
      backend: config.backend.port
    }
  };

  setHeaders(res, { 'Content-Type': 'application/json; charset=utf-8' });
  res.writeHead(200);
  res.end(JSON.stringify(envData, null, 2));
};

// Main request handler
const handleRequest = (req, res) => {
  const startTime = Date.now();
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Request logging
  logger.info(`${method} ${pathname}`, {
    userAgent: req.headers['user-agent']?.substring(0, 100),
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  });

  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    setHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle special endpoints
  if (pathname === '/health') {
    return serveHealth(res);
  }

  if (pathname === '/api/environment') {
    return serveEnvironment(res);
  }

  // Block other API requests (they should go to backend)
  if (pathname.startsWith('/api/')) {
    const apiError = {
      success: false,
      error: 'API endpoint not found',
      message: 'This is the frontend server. API requests should go to the backend server.',
      backend: `http://localhost:${config.backend.port}`,
      timestamp: new Date().toISOString()
    };

    setHeaders(res, { 'Content-Type': 'application/json; charset=utf-8' });
    res.writeHead(404);
    res.end(JSON.stringify(apiError, null, 2));
    return;
  }

  // Serve static files
  let filePath;
  
  if (pathname === '/') {
    // Serve environment-specific index file
    if (isTestEnvironment) {
      const testIndexPath = path.join(config.servePath, 'index-test.html');
      if (fs.existsSync(testIndexPath)) {
        filePath = testIndexPath;
      } else {
        filePath = path.join(config.servePath, 'index.html');
      }
    } else {
      filePath = path.join(config.servePath, 'index.html');
    }
  } else {
    // Serve requested file
    filePath = path.join(config.servePath, pathname);
  }

  // Security: prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(config.servePath) && !normalizedPath.startsWith(config.fallbackPath)) {
    return serve404(res);
  }

  // Serve file with SPA fallback
  if (!fs.existsSync(filePath)) {
    // SPA fallback - serve appropriate index file
    let indexFile = 'index.html';
    if (isTestEnvironment && fs.existsSync(path.join(config.servePath, 'index-test.html'))) {
      indexFile = 'index-test.html';
    }
    
    const fallbackPath = path.join(config.servePath, indexFile);
    serveFile(fallbackPath, res);
  } else {
    serveFile(filePath, res);
  }

  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${method} ${pathname} - ${res.statusCode} - ${duration}ms`);
  });
};

// Create and configure server
const server = http.createServer(handleRequest);

// Server startup
const startServer = () => {
  // Ensure directories exist
  [config.servePath, config.fallbackPath].forEach(dir => {
    if (!fs.existsSync(dir)) {
      logger.warn(`Directory does not exist: ${dir}. Creating...`);
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (error) {
        logger.error(`Error creating directory ${dir}:`, error);
      }
    }
  });

  server.listen(config.port, config.host, () => {
    const envBanner = isTestEnvironment ? '🧪 TEST FRONTEND' : '🚀 PRODUCTION FRONTEND';
    logger.info(`${envBanner} - Enterprise Server Started`);
    logger.info(`📍 Environment: ${currentEnv.toUpperCase()}`);
    logger.info(`🏗️ Process: ${config.name}`);
    logger.info(`🌐 Server: http://${config.host}:${config.port}`);
    logger.info(`📁 Serving from: ${config.servePath}`);
    logger.info(`📁 Fallback path: ${config.fallbackPath}`);
    logger.info(`🔒 Security: Enterprise-grade headers enabled`);
    logger.info(`🛡️ Dependencies: Zero external dependencies`);
    logger.info(`💓 Health check: http://${config.host}:${config.port}/health`);
    logger.info(`🔗 Backend: http://localhost:${config.backend.port}`);
    logger.info(`📊 Environment info: http://${config.host}:${config.port}/api/environment`);
    
    if (isTestEnvironment) {
      logger.info('🧪 TEST ENVIRONMENT ACTIVE - Development features enabled');
      logger.info('🔄 Serving test-specific HTML files when available');
      logger.info('🌐 Production URL: http://79.72.47.188:5173');
    } else {
      logger.info('🚀 PRODUCTION ENVIRONMENT ACTIVE - Optimized for performance');
      logger.info('🔄 Serving production-optimized files');
      logger.info('🧪 Test URL: http://79.72.47.188:5174');
    }
    
    logger.info('✅ Enterprise Frontend Server startup completed successfully');
  });
};

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  const envBanner = isTestEnvironment ? '🧪 TEST FRONTEND' : '🚀 PRODUCTION FRONTEND';
  logger.info(`🛑 ${envBanner} - Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    logger.info(`✅ ${envBanner} - Server closed successfully`);
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Error handling
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception in enterprise frontend server:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection in enterprise frontend server:', { reason, promise });
  gracefulShutdown('unhandledRejection');
});

// Start the server
startServer();

module.exports = server;