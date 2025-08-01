/**
 * Web-Hunter Routes - Main Router
 * Central routing for all Web-Hunter framework endpoints
 */

const express = require('express');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');
const { rateLimiter } = require('../../middleware/rateLimiter');

// Import route modules
const providerRoutes = require('./providers');
const dataSourceRoutes = require('./dataSources');
const workflowRoutes = require('./workflows');
const qualityRoutes = require('./quality');
const analyticsRoutes = require('./analytics');

const router = express.Router();

// Apply authentication to all Web-Hunter routes
router.use(authenticateToken);

// Apply rate limiting to Web-Hunter endpoints
router.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many Web-Hunter API requests, please try again later'
}));

// Web-Hunter API health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Web-Hunter API is healthy',
    timestamp: new Date(),
    version: '1.0.0',
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

// Mount route modules
router.use('/providers', providerRoutes);
router.use('/sources', dataSourceRoutes);
router.use('/workflows', workflowRoutes);
router.use('/quality-monitors', qualityRoutes);
router.use('/analytics', analyticsRoutes);

// Global search endpoint
router.get('/search', validateRequest({
  query: {
    q: { type: 'string', minLength: 2, required: true },
    type: { type: 'string', enum: ['providers', 'sources', 'workflows', 'quality-monitors', 'all'] },
    limit: { type: 'number', min: 1, max: 100, default: 50 }
  }
}), async (req, res) => {
  const { q, type = 'all', limit = 50 } = req.query;

  try {
    const results = {
      query: q,
      searchType: type,
      results: {},
      totalResults: 0
    };

    // Import controllers for search
    const { searchProviders } = require('../../controllers/webhunter/providerController');
    const { searchSources } = require('../../controllers/webhunter/dataSourceController');
    const { searchWorkflows } = require('../../controllers/webhunter/workflowController');
    const { searchMonitors } = require('../../controllers/webhunter/qualityController');

    // Execute searches based on type
    if (type === 'all' || type === 'providers') {
      try {
        req.query.limit = Math.ceil(limit / 4); // Distribute limit across search types
        const mockRes = {
          json: (data) => data,
          status: () => mockRes
        };
        const providerResults = await searchProviders(req, mockRes);
        results.results.providers = providerResults.data;
        results.totalResults += providerResults.count;
      } catch (error) {
        results.results.providers = [];
      }
    }

    if (type === 'all' || type === 'sources') {
      try {
        req.query.limit = Math.ceil(limit / 4);
        const mockRes = {
          json: (data) => data,
          status: () => mockRes
        };
        const sourceResults = await searchSources(req, mockRes);
        results.results.sources = sourceResults.data;
        results.totalResults += sourceResults.count;
      } catch (error) {
        results.results.sources = [];
      }
    }

    if (type === 'all' || type === 'workflows') {
      try {
        req.query.limit = Math.ceil(limit / 4);
        const mockRes = {
          json: (data) => data,
          status: () => mockRes
        };
        const workflowResults = await searchWorkflows(req, mockRes);
        results.results.workflows = workflowResults.data;
        results.totalResults += workflowResults.count;
      } catch (error) {
        results.results.workflows = [];
      }
    }

    if (type === 'all' || type === 'quality-monitors') {
      try {
        req.query.limit = Math.ceil(limit / 4);
        const mockRes = {
          json: (data) => data,
          status: () => mockRes
        };
        const qualityResults = await searchMonitors(req, mockRes);
        results.results.qualityMonitors = qualityResults.data;
        results.totalResults += qualityResults.count;
      } catch (error) {
        results.results.qualityMonitors = [];
      }
    }

    res.json({
      success: true,
      message: 'Global search completed successfully',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// System statistics endpoint
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const { ProviderIntegration, DataSourceCatalog, OrchestrationWorkflow, DataQualityMonitor, WebHunterAnalytics } = require('../../models');

    const stats = {
      providers: {
        total: await ProviderIntegration.countDocuments(),
        connected: await ProviderIntegration.countDocuments({ 'status.connection': 'connected' }),
        byTier: await ProviderIntegration.aggregate([
          { $group: { _id: '$classification.tier', count: { $sum: 1 } } }
        ])
      },
      sources: {
        total: await DataSourceCatalog.countDocuments(),
        active: await DataSourceCatalog.countDocuments({ 'status.overall': 'active' }),
        byType: await DataSourceCatalog.aggregate([
          { $group: { _id: '$classification.type', count: { $sum: 1 } } }
        ])
      },
      workflows: {
        total: await OrchestrationWorkflow.countDocuments(),
        running: await OrchestrationWorkflow.countDocuments({ 'execution.status': 'running' }),
        scheduled: await OrchestrationWorkflow.countDocuments({ 'execution.status': 'scheduled' })
      },
      qualityMonitors: {
        total: await DataQualityMonitor.countDocuments(),
        active: await DataQualityMonitor.countDocuments({ 'status.overall': 'active' }),
        byGrade: await DataQualityMonitor.aggregate([
          { $group: { _id: '$currentStatus.grade', count: { $sum: 1 } } }
        ])
      },
      analytics: {
        total: await WebHunterAnalytics.countDocuments(),
        byType: await WebHunterAnalytics.aggregate([
          { $group: { _id: '$reportType', count: { $sum: 1 } } }
        ])
      },
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      message: 'System statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system statistics',
      error: error.message
    });
  }
});

module.exports = router;