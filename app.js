/**
 * Main Server Platform - Enterprise Application Server
 * Universal Clean Architecture with Complete Framework Integration
 * Version: 3.0.0-universal
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import utilities and middleware
const logger = require('./src/utils/logger');
const { errorHandler } = require('./src/utils/errorHandler');

// Import routes
const hrmsRoutes = require('./src/routes/hrms');
const noseRoutes = require('./src/routes/nose');
const webHunterRoutes = require('./src/routes/webhunter');

// Import authentication middleware
const { authenticateToken } = require('./src/middleware/auth');

// Create Express app
const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from same origin and configured origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://79.72.47.188:5173',
      'http://79.72.47.188:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];

    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/main-server-platform';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Health check endpoint
app.get('/health', async (req, res) => {
  const env = process.env.NODE_ENV || 'development';
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    success: true,
    message: `${env.charAt(0).toUpperCase() + env.slice(1)} Enterprise Server is running`,
    timestamp: new Date().toISOString(),
    version: '3.0.0-universal',
    status: 'healthy',
    port: PORT,
    environment: env,
    database: {
      status: mongoStatus,
      name: mongoose.connection.name || 'unknown'
    },
    frameworks: {
      'ai-hrms': 'active',
      'nose-research': 'active',
      'web-hunter': 'pending'
    },
    services: {
      authentication: 'active',
      validation: 'active',
      logging: 'active',
      security: 'active'
    }
  });
});

// API Routes
app.use('/api/v1/hrms', hrmsRoutes);
app.use('/api/v1/nose', noseRoutes);
app.use('/api/v1/webhunter', webHunterRoutes);

// API Status endpoint
app.get('/api/v1/status', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Enterprise API Status',
    version: '3.0.0-universal',
    frameworks: {
      'AI-HRMS': {
        status: 'active',
        endpoints: '/api/v1/hrms/*',
        description: 'Human Resources Management System'
      },
      'NOSE Research': {
        status: 'active',
        endpoints: '/api/v1/nose/*',
        description: 'Academic Research Project Management'
      },
      'Web-Hunter': {
        status: 'pending',
        endpoints: '/api/v1/web-hunter/*',
        description: 'Data Mining and Analytics Platform'
      }
    },
    user: {
      id: req.user.id,
      email: req.user.email,
      frameworks: req.user.frameworks
    },
    timestamp: new Date().toISOString()
  });
});

// API Documentation endpoint
app.get('/api/v1/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Enterprise API Documentation',
    version: '3.0.0-universal',
    baseUrl: `http://localhost:${PORT}/api/v1`,
    authentication: {
      type: 'JWT Bearer Token',
      endpoint: '/api/v1/auth/login',
      required: true
    },
    frameworks: {
      'AI-HRMS': {
        baseUrl: '/api/v1/hrms',
        endpoints: {
          employees: 'GET/POST /employees',
          analytics: 'GET /analytics/*'
        }
      },
      'NOSE Research': {
        baseUrl: '/api/v1/nose',
        endpoints: {
          projects: 'GET/POST /projects',
          publications: 'GET/POST /projects/:id/publications',
          analytics: 'GET /analytics/*'
        }
      }
    },
    support: {
      documentation: 'https://docs.main-server-platform.com',
      issues: 'https://github.com/main-server-platform/issues'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Main Server Platform - Enterprise API',
    version: '3.0.0-universal',
    description: 'Universal Clean Architecture with MCP Ecosystem Integration',
    status: 'operational',
    frameworks: ['AI-HRMS', 'NOSE Research', 'Web-Hunter (pending)'],
    endpoints: {
      health: '/health',
      api: '/api/v1/*',
      docs: '/api/v1/docs',
      status: '/api/v1/status'
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/api/v1/hrms/*',
      '/api/v1/nose/*',
      '/api/v1/docs',
      '/api/v1/status'
    ],
    documentation: '/api/v1/docs'
  });
});

// Global 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    message: 'The requested resource was not found on this server',
    availableEndpoints: [
      '/',
      '/health',
      '/api/v1/*'
    ]
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('🛑 SIGTERM received, shutting down gracefully');
  
  // Close MongoDB connection
  await mongoose.connection.close();
  logger.info('💾 MongoDB connection closed');
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('🛑 SIGINT received, shutting down gracefully');
  
  // Close MongoDB connection
  await mongoose.connection.close();
  logger.info('💾 MongoDB connection closed');
  
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('🚫 Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('🚫 Uncaught Exception:', err);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  const env = process.env.NODE_ENV || 'development';
  
  logger.info(`🚀 Enterprise Server started successfully`);
  logger.info(`🌐 Environment: ${env}`);
  logger.info(`📡 Server running on: http://0.0.0.0:${PORT}`);
  logger.info(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
  logger.info(`📚 API docs: http://0.0.0.0:${PORT}/api/v1/docs`);
  logger.info(`🔐 Authentication: JWT Bearer Token required`);
  logger.info(`📊 Frameworks: AI-HRMS ✅, NOSE Research ✅, Web-Hunter ⏳`);
  logger.info(`💾 Database: MongoDB ${mongoose.connection.readyState === 1 ? '✅' : '❌'}`);
  
  console.log('\n🎯 Enterprise Main Server Platform');
  console.log('═'.repeat(50));
  console.log(`📡 Server URL: http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/health`);
  console.log(`📚 API Documentation: http://0.0.0.0:${PORT}/api/v1/docs`);
  console.log(`🔧 Environment: ${env}`);
  console.log(`⚡ Version: 3.0.0-universal`);
  console.log('═'.repeat(50));
});

module.exports = app;