// Test Backend Server - Port 3001
// Simplified backend for test environment

const express = require('express');
const cors = require('cors');
const path = require('path');

// Simple service manager routes for test environment
const serviceManagerRoutes = express.Router();

// Basic service manager endpoints for test
serviceManagerRoutes.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Service Manager Test API',
    services: {
      frontend: 'running',
      backend: 'running'
    }
  });
});

serviceManagerRoutes.get('/info', (req, res) => {
  res.json({
    success: true,
    version: '1.0.0-test',
    environment: 'test',
    uptime: process.uptime()
  });
});

// Create Express app
const app = express();
const PORT = process.env.PORT || process.env.TEST_PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// CORS configuration for test environment
const corsOptions = {
  origin: [
    'http://localhost:5174',
    'http://79.72.47.188:5174',
    'http://127.0.0.1:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  const env = process.env.NODE_ENV || 'test';
  res.json({
    success: true,
    message: `${env.charAt(0).toUpperCase() + env.slice(1)} Backend Server is running`,
    timestamp: new Date().toISOString(),
    version: env === 'production' ? '1.0.0-prod' : '1.0.0-test',
    status: 'healthy',
    port: PORT,
    environment: env
  });
});

// Service Manager routes
app.use('/api/v1/service-manager', serviceManagerRoutes);

// API documentation endpoint
app.get('/api/v1/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Test Backend API Documentation',
    version: '1.0.0-test',
    endpoints: {
      health: '/health',
      serviceManager: '/api/v1/service-manager/*'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/health',
      '/api/v1/docs',
      '/api/v1/service-manager/*'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: error.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test Backend Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check available at: http://0.0.0.0:${PORT}/health`);
  console.log(`📚 API documentation at: http://0.0.0.0:${PORT}/api/v1/docs`);
  console.log(`🌐 Environment: test`);
});