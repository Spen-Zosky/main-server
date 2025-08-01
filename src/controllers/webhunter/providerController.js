/**
 * Web-Hunter Provider Integration Controller
 * Manages external data mining provider relationships and integrations
 */

const { ProviderIntegration } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get all providers with filtering and pagination
 * @route GET /api/v1/webhunter/providers
 */
const getAllProviders = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    tier,
    category,
    status,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = buildFilter({
    'classification.tier': tier,
    'classification.category': category,
    'status.connection': status,
    'classification.priority': priority,
    search: search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { providerId: { $regex: search, $options: 'i' } }
      ]
    } : null
  });

  // Pagination options
  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
  };

  const result = await paginate(ProviderIntegration, filter, options);

  logger.info('Providers retrieved', {
    userId: req.user.id,
    count: result.docs.length,
    totalDocs: result.totalDocs,
    filter
  });

  res.json({
    success: true,
    message: 'Providers retrieved successfully',
    data: result.docs,
    pagination: {
      total: result.totalDocs,
      pages: result.totalPages,
      page: result.page,
      limit: result.limit,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage
    }
  });
});

/**
 * Get provider by ID
 * @route GET /api/v1/webhunter/providers/:providerId
 */
const getProviderById = handleAsync(async (req, res) => {
  const { providerId } = req.params;

  const provider = await ProviderIntegration.findOne({ providerId });

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  logger.info('Provider retrieved', {
    providerId,
    userId: req.user.id,
    action: 'view_provider'
  });

  res.json({
    success: true,
    message: 'Provider retrieved successfully',
    data: provider
  });
});

/**
 * Create new provider
 * @route POST /api/v1/webhunter/providers
 */
const createProvider = handleAsync(async (req, res) => {
  const providerData = {
    ...req.body,
    providerId: await ProviderIntegration.generateProviderId(),
    'audit.createdBy': req.user.id
  };

  const provider = new ProviderIntegration(providerData);
  await provider.save();

  logger.info('Provider created', {
    providerId: provider.providerId,
    userId: req.user.id,
    name: provider.name
  });

  res.status(201).json({
    success: true,
    message: 'Provider created successfully',
    data: provider
  });
});

/**
 * Update provider
 * @route PUT /api/v1/webhunter/providers/:providerId
 */
const updateProvider = handleAsync(async (req, res) => {
  const { providerId } = req.params;
  const updates = {
    ...req.body,
    'audit.updatedBy': req.user.id
  };

  const provider = await ProviderIntegration.findOneAndUpdate(
    { providerId },
    updates,
    { new: true, runValidators: true }
  );

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  logger.info('Provider updated', {
    providerId,
    userId: req.user.id,
    updatedFields: Object.keys(req.body)
  });

  res.json({
    success: true,
    message: 'Provider updated successfully',
    data: provider
  });
});

/**
 * Delete provider
 * @route DELETE /api/v1/webhunter/providers/:providerId
 */
const deleteProvider = handleAsync(async (req, res) => {
  const { providerId } = req.params;

  const provider = await ProviderIntegration.findOneAndDelete({ providerId });

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  logger.info('Provider deleted', {
    providerId,
    userId: req.user.id,
    name: provider.name
  });

  res.json({
    success: true,
    message: 'Provider deleted successfully'
  });
});

/**
 * Update provider connection status
 * @route PATCH /api/v1/webhunter/providers/:providerId/status
 */
const updateProviderStatus = handleAsync(async (req, res) => {
  const { providerId } = req.params;
  const { connection, health } = req.body;

  const updateData = {
    'audit.updatedBy': req.user.id
  };

  if (connection) {
    updateData['status.connection'] = connection;
  }

  if (health) {
    updateData['status.health'] = {
      ...health,
      lastCheck: new Date()
    };
  }

  const provider = await ProviderIntegration.findOneAndUpdate(
    { providerId },
    updateData,
    { new: true }
  );

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  logger.info('Provider status updated', {
    providerId,
    userId: req.user.id,
    connection,
    health: health ? 'updated' : 'unchanged'
  });

  res.json({
    success: true,
    message: 'Provider status updated successfully',
    data: {
      providerId,
      status: provider.status
    }
  });
});

/**
 * Test provider connection
 * @route POST /api/v1/webhunter/providers/:providerId/test-connection
 */
const testProviderConnection = handleAsync(async (req, res) => {
  const { providerId } = req.params;

  const provider = await ProviderIntegration.findOne({ providerId });

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  // Simulate connection test (in real implementation, this would make actual API calls)
  const connectionTest = {
    providerId,
    timestamp: new Date(),
    status: 'success', // or 'failed'
    responseTime: Math.floor(Math.random() * 500) + 100, // Simulated response time
    error: null
  };

  // Update provider health metrics
  const healthUpdate = {
    lastCheck: new Date(),
    metrics: {
      avgResponseTime: connectionTest.responseTime,
      successRate: connectionTest.status === 'success' ? 100 : 0,
      errorRate: connectionTest.status === 'failed' ? 100 : 0
    }
  };

  await ProviderIntegration.findOneAndUpdate(
    { providerId },
    {
      'status.health': healthUpdate,
      'status.connection': connectionTest.status === 'success' ? 'connected' : 'disconnected',
      'audit.updatedBy': req.user.id
    }
  );

  logger.info('Provider connection tested', {
    providerId,
    userId: req.user.id,
    status: connectionTest.status,
    responseTime: connectionTest.responseTime
  });

  res.json({
    success: true,
    message: 'Provider connection tested successfully',
    data: connectionTest
  });
});

/**
 * Get provider health status with historical data
 * @route GET /api/v1/webhunter/providers/:providerId/health
 */
const getProviderHealth = handleAsync(async (req, res) => {
  const { providerId } = req.params;
  const { detailed = false, period = '24h' } = req.query;

  const provider = await ProviderIntegration.findOne({ providerId });

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  // Simulate health metrics (in real implementation, this would come from monitoring data)
  const healthData = {
    providerId,
    providerName: provider.name,
    currentStatus: provider.status.connection,
    lastChecked: new Date(),
    uptime: {
      percentage: Math.floor(Math.random() * 5) + 95, // 95-100%
      period: period
    },
    responseTime: {
      average: Math.floor(Math.random() * 500) + 100, // 100-600ms
      percentile95: Math.floor(Math.random() * 800) + 200
    },
    errorRate: {
      percentage: Math.random() * 2, // 0-2%
      period: period
    },
    throughput: {
      requestsPerMinute: Math.floor(Math.random() * 1000) + 100,
      period: period
    }
  };

  if (detailed) {
    healthData.historical = {
      period: period,
      dataPoints: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        responseTime: Math.floor(Math.random() * 500) + 100,
        errorRate: Math.random() * 3,
        throughput: Math.floor(Math.random() * 1000) + 100
      }))
    };
  }

  logger.info('Provider health status retrieved', {
    providerId,
    userId: req.user.id,
    detailed,
    status: healthData.currentStatus
  });

  res.json({
    success: true,
    message: 'Provider health status retrieved successfully',
    data: healthData
  });
});

/**
 * Get provider cost analysis
 * @route GET /api/v1/webhunter/providers/:providerId/cost-analysis
 */
const getProviderCostAnalysis = handleAsync(async (req, res) => {
  const { providerId } = req.params;
  const { period = 'monthly', startDate, endDate } = req.query;

  const provider = await ProviderIntegration.findOne({ providerId });

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  // Simulate cost analysis (in real implementation, this would aggregate from analytics)
  const costAnalysis = {
    providerId,
    providerName: provider.name,
    period: {
      type: period,
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date()
    },
    costs: {
      totalCost: Math.floor(Math.random() * 5000) + 1000,
      costPerRequest: Math.random() * 0.1,
      currency: 'USD',
      breakdown: {
        usage: Math.floor(Math.random() * 3000) + 500,
        subscription: Math.floor(Math.random() * 1000) + 200,
        overage: Math.floor(Math.random() * 500)
      }
    },
    usage: {
      totalRequests: Math.floor(Math.random() * 100000) + 10000,
      successfulRequests: Math.floor(Math.random() * 95000) + 9500,
      failedRequests: Math.floor(Math.random() * 5000) + 100
    },
    trends: {
      costTrend: 'increasing',
      usageTrend: 'stable',
      efficiencyTrend: 'improving'
    }
  };

  logger.info('Provider cost analysis generated', {
    providerId,
    userId: req.user.id,
    period,
    totalCost: costAnalysis.costs.totalCost
  });

  res.json({
    success: true,
    message: 'Cost analysis retrieved successfully',
    data: costAnalysis
  });
});

/**
 * Get provider performance metrics
 * @route GET /api/v1/webhunter/providers/:providerId/performance
 */
const getProviderPerformance = handleAsync(async (req, res) => {
  const { providerId } = req.params;
  const { period = '7d' } = req.query;

  const provider = await ProviderIntegration.findOne({ providerId });

  if (!provider) {
    throw new ApiError(404, 'Provider not found');
  }

  // Simulate performance metrics
  const performance = {
    providerId,
    providerName: provider.name,
    period,
    metrics: {
      availability: Math.random() * 5 + 95, // 95-100%
      avgResponseTime: Math.floor(Math.random() * 300) + 100, // 100-400ms
      successRate: Math.random() * 5 + 95, // 95-100%
      errorRate: Math.random() * 5, // 0-5%
      throughput: Math.floor(Math.random() * 1000) + 100 // requests/minute
    },
    trends: {
      availability: 'stable',
      responseTime: 'improving',
      successRate: 'stable',
      errorRate: 'decreasing'
    },
    lastUpdated: new Date()
  };

  res.json({
    success: true,
    message: 'Performance metrics retrieved successfully',
    data: performance
  });
});

/**
 * Get providers by tier
 * @route GET /api/v1/webhunter/providers/tier/:tier
 */
const getProvidersByTier = handleAsync(async (req, res) => {
  const { tier } = req.params;
  const { status = 'connected' } = req.query;

  const providers = await ProviderIntegration.find({
    'classification.tier': tier,
    'status.connection': status
  }).sort({ 'classification.priority': 1, name: 1 });

  res.json({
    success: true,
    message: `${tier} providers retrieved successfully`,
    data: providers,
    count: providers.length
  });
});

/**
 * Search providers
 * @route GET /api/v1/webhunter/search/providers
 */
const searchProviders = handleAsync(async (req, res) => {
  const { q, filters = {} } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const searchFilter = {
    $text: { $search: q },
    ...buildFilter(filters)
  };

  const providers = await ProviderIntegration.find(searchFilter)
    .select('providerId name displayName classification status')
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);

  res.json({
    success: true,
    message: 'Search completed successfully',
    data: providers,
    count: providers.length
  });
});

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  updateProviderStatus,
  testProviderConnection,
  getProviderHealth,
  getProviderCostAnalysis,
  getProviderPerformance,
  getProvidersByTier,
  searchProviders
};