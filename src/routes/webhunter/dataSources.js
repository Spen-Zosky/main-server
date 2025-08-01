/**
 * Web-Hunter Data Source Catalog Routes
 * Handles data source management, quality assessments, and provider mappings
 */

const express = require('express');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');
const {
  getAllSources,
  getSourceById,
  createSource,
  updateSource,
  deleteSource,
  updateSourceProvider,
  performQualityCheck,
  getSourcesByType,
  getSourceProviderPerformance,
  searchSources
} = require('../../controllers/webhunter/dataSourceController');

const router = express.Router();

// GET /api/v1/webhunter/sources - Get all data sources with filtering
router.get('/', validateRequest({
  query: {
    page: { type: 'number', min: 1, default: 1 },
    limit: { type: 'number', min: 1, max: 100, default: 20 },
    search: { type: 'string', minLength: 2 },
    type: { type: 'string', enum: ['web_scraping', 'api_data', 'database_export', 'file_feeds', 'real_time_streams'] },
    category: { type: 'string' },
    industry: { type: 'string' },
    provider: { type: 'string' },
    qualityMin: { type: 'number', min: 0, max: 100 },
    geographic: { type: 'string' },
    sortBy: { type: 'string', default: 'createdAt' },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
  }
}), getAllSources);

// GET /api/v1/webhunter/sources/search - Search data sources
router.get('/search', validateRequest({
  query: {
    q: { type: 'string', minLength: 2, required: true },
    filters: { type: 'object' }
  }
}), searchSources);

// GET /api/v1/webhunter/sources/type/:type - Get sources by type
router.get('/type/:type', validateRequest({
  params: {
    type: { type: 'string', enum: ['web_scraping', 'api_data', 'database_export', 'file_feeds', 'real_time_streams'], required: true }
  },
  query: {
    category: { type: 'string' },
    qualityMin: { type: 'number', min: 0, max: 100, default: 70 }
  }
}), getSourcesByType);

// GET /api/v1/webhunter/sources/:sourceId - Get data source by ID
router.get('/:sourceId', validateRequest({
  params: {
    sourceId: { type: 'string', required: true }
  },
  query: {
    include: { type: 'string' }
  }
}), getSourceById);

// POST /api/v1/webhunter/sources - Create new data source (Admin/Manager only)
router.post('/', requireAdmin, validateRequest({
  body: {
    name: { type: 'string', required: true, minLength: 2 },
    displayName: { type: 'string', required: true, minLength: 2 },
    description: { type: 'string', required: true, minLength: 10 },
    classification: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['web_scraping', 'api_data', 'database_export', 'file_feeds', 'real_time_streams'], required: true },
        category: { type: 'string', required: true },
        industry: { type: 'array', items: { type: 'string' }, required: true },
        complexity: { type: 'string', enum: ['low', 'medium', 'high', 'enterprise'], required: true }
      },
      required: true
    },
    content: {
      type: 'object',
      properties: {
        dataTypes: { type: 'array', items: { type: 'string' }, required: true },
        updatefrequency: { type: 'string', enum: ['real_time', 'hourly', 'daily', 'weekly', 'monthly'], required: true },
        geographic: {
          type: 'object',
          properties: {
            regions: { type: 'array', items: { type: 'string' }, required: true },
            countries: { type: 'array', items: { type: 'string' } }
          },
          required: true
        }
      },
      required: true
    },
    providers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          providerId: { type: 'string', required: true },
          providerName: { type: 'string', required: true },
          accessMethod: { type: 'string', enum: ['api', 'scraping', 'bulk_download', 'streaming'], required: true },
          priority: { type: 'number', min: 1, max: 10, required: true },
          recommended: { type: 'boolean', default: false },
          status: { type: 'string', enum: ['active', 'inactive', 'testing'], default: 'active' }
        }
      },
      minItems: 1,
      required: true
    }
  }
}), createSource);

// PUT /api/v1/webhunter/sources/:sourceId - Update data source (Admin/Manager only)
router.put('/:sourceId', requireAdmin, validateRequest({
  params: {
    sourceId: { type: 'string', required: true }
  },
  body: {
    name: { type: 'string', minLength: 2 },
    displayName: { type: 'string', minLength: 2 },
    description: { type: 'string', minLength: 10 },
    classification: { type: 'object' },
    content: { type: 'object' },
    providers: { type: 'array' },
    status: { type: 'object' }
  }
}), updateSource);

// DELETE /api/v1/webhunter/sources/:sourceId - Delete data source (Admin only)
router.delete('/:sourceId', requireAdmin, validateRequest({
  params: {
    sourceId: { type: 'string', required: true }
  }
}), deleteSource);

// PUT /api/v1/webhunter/sources/:sourceId/providers/:providerId - Update provider mapping
router.put('/:sourceId/providers/:providerId', requireAdmin, validateRequest({
  params: {
    sourceId: { type: 'string', required: true },
    providerId: { type: 'string', required: true }
  },
  body: {
    providerName: { type: 'string' },
    accessMethod: { type: 'string', enum: ['api', 'scraping', 'bulk_download', 'streaming'] },
    priority: { type: 'number', min: 1, max: 10 },
    recommended: { type: 'boolean' },
    status: { type: 'string', enum: ['active', 'inactive', 'testing'] },
    configuration: { type: 'object' },
    costFactors: { type: 'object' }
  }
}), updateSourceProvider);

// POST /api/v1/webhunter/sources/:sourceId/quality-check - Perform quality assessment
router.post('/:sourceId/quality-check', validateRequest({
  params: {
    sourceId: { type: 'string', required: true }
  },
  body: {
    checkType: { type: 'string', enum: ['basic', 'comprehensive', 'sample'], default: 'basic' },
    sampleSize: { type: 'number', min: 10, max: 10000, default: 100 }
  }
}), performQualityCheck);

// GET /api/v1/webhunter/sources/:sourceId/provider-performance - Get provider performance data
router.get('/:sourceId/provider-performance', validateRequest({
  params: {
    sourceId: { type: 'string', required: true }
  },
  query: {
    period: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' },
    includeMetrics: { type: 'boolean', default: true }
  }
}), getSourceProviderPerformance);

module.exports = router;