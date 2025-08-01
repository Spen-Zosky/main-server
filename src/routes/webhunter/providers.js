/**
 * Web-Hunter Provider Integration Routes
 * Handles provider management, health checks, and configuration
 */

const express = require('express');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');
const {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  testProviderConnection,
  getProviderHealth,
  getProviderCostAnalysis,
  searchProviders
} = require('../../controllers/webhunter/providerController');

const router = express.Router();

// GET /api/v1/webhunter/providers - Get all providers with filtering
router.get('/', validateRequest({
  query: {
    page: { type: 'number', min: 1, default: 1 },
    limit: { type: 'number', min: 1, max: 100, default: 20 },
    search: { type: 'string', minLength: 2 },
    tier: { type: 'string', enum: ['tier_1_enterprise', 'specialized_solutions', 'intelligence_specialists'] },
    status: { type: 'string', enum: ['active', 'inactive', 'maintenance', 'error'] },
    category: { type: 'string' },
    sortBy: { type: 'string', default: 'createdAt' },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
  }
}), getAllProviders);

// GET /api/v1/webhunter/providers/search - Search providers
router.get('/search', validateRequest({
  query: {
    q: { type: 'string', minLength: 2, required: true },
    filters: { type: 'object' }
  }
}), searchProviders);

// GET /api/v1/webhunter/providers/:providerId - Get provider by ID
router.get('/:providerId', validateRequest({
  params: {
    providerId: { type: 'string', required: true }
  },
  query: {
    include: { type: 'string' }
  }
}), getProviderById);

// POST /api/v1/webhunter/providers - Create new provider (Admin/Manager only)
router.post('/', requireAdmin, validateRequest({
  body: {
    name: { type: 'string', required: true, minLength: 2 },
    displayName: { type: 'string', required: true, minLength: 2 },
    description: { type: 'string', required: true, minLength: 10 },
    classification: {
      type: 'object',
      properties: {
        tier: { type: 'string', enum: ['tier_1_enterprise', 'specialized_solutions', 'intelligence_specialists'], required: true },
        category: { type: 'string', required: true },
        specializations: { type: 'array', items: { type: 'string' } },
        targetMarkets: { type: 'array', items: { type: 'string' } }
      },
      required: true
    },
    capabilities: {
      type: 'object',
      properties: {
        dataTypes: { type: 'array', items: { type: 'string' }, required: true },
        regions: { type: 'array', items: { type: 'string' }, required: true },
        methods: { type: 'array', items: { type: 'string' }, required: true },
        features: { type: 'array', items: { type: 'string' } }
      },
      required: true
    },
    pricing: {
      type: 'object',
      properties: {
        model: { type: 'string', enum: ['per_request', 'subscription', 'volume_based', 'custom'], required: true },
        baseCost: { type: 'number', min: 0, required: true },
        currency: { type: 'string', default: 'USD' }
      },
      required: true
    }
  }
}), createProvider);

// PUT /api/v1/webhunter/providers/:providerId - Update provider (Admin/Manager only)
router.put('/:providerId', requireAdmin, validateRequest({
  params: {
    providerId: { type: 'string', required: true }
  },
  body: {
    name: { type: 'string', minLength: 2 },
    displayName: { type: 'string', minLength: 2 },
    description: { type: 'string', minLength: 10 },
    classification: { type: 'object' },
    capabilities: { type: 'object' },
    pricing: { type: 'object' },
    configuration: { type: 'object' }
  }
}), updateProvider);

// DELETE /api/v1/webhunter/providers/:providerId - Delete provider (Admin only)
router.delete('/:providerId', requireAdmin, validateRequest({
  params: {
    providerId: { type: 'string', required: true }
  }
}), deleteProvider);

// POST /api/v1/webhunter/providers/:providerId/test-connection - Test provider connection
router.post('/:providerId/test-connection', validateRequest({
  params: {
    providerId: { type: 'string', required: true }
  },
  body: {
    testType: { type: 'string', enum: ['basic', 'full', 'performance'], default: 'basic' },
    timeout: { type: 'number', min: 5000, max: 60000, default: 30000 }
  }
}), testProviderConnection);

// GET /api/v1/webhunter/providers/:providerId/health - Get provider health status
router.get('/:providerId/health', validateRequest({
  params: {
    providerId: { type: 'string', required: true }
  },
  query: {
    detailed: { type: 'boolean', default: false },
    period: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' }
  }
}), getProviderHealth);

// GET /api/v1/webhunter/providers/:providerId/cost-analysis - Get cost analysis
router.get('/:providerId/cost-analysis', requireAdmin, validateRequest({
  params: {
    providerId: { type: 'string', required: true }
  },
  query: {
    period: { type: 'string', enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
    includeProjections: { type: 'boolean', default: false }
  }
}), getProviderCostAnalysis);

module.exports = router;