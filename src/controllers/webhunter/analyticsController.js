/**
 * Web-Hunter Analytics Controller
 * Advanced analytics and business intelligence for the Web-Hunter ecosystem
 */

const { WebHunterAnalytics } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get all analytics reports with filtering and pagination
 * @route GET /api/v1/webhunter/analytics
 */
const getAllAnalytics = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    reportType,
    periodType,
    startDate,
    endDate,
    sortBy = 'report.generatedAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = buildFilter({
    reportType,
    'period.type': periodType,
    'period.startDate': startDate ? { $gte: new Date(startDate) } : null,
    'period.endDate': endDate ? { $lte: new Date(endDate) } : null,
    search: search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { analyticsId: { $regex: search, $options: 'i' } }
      ]
    } : null
  });

  // Pagination options
  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    populate: [
      {
        path: 'security.owner',
        select: 'profile.firstName profile.lastName email'
      }
    ]
  };

  const result = await paginate(WebHunterAnalytics, filter, options);

  logger.info('Analytics reports retrieved', {
    userId: req.user.id,
    count: result.docs.length,
    totalDocs: result.totalDocs,
    filter
  });

  res.json({
    success: true,
    message: 'Analytics reports retrieved successfully',
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
 * Get analytics report by ID
 * @route GET /api/v1/webhunter/analytics/:analyticsId
 */
const getAnalyticsById = handleAsync(async (req, res) => {
  const { analyticsId } = req.params;

  const analytics = await WebHunterAnalytics.findOne({ analyticsId })
    .populate('security.owner', 'profile.firstName profile.lastName email');

  if (!analytics) {
    throw new ApiError(404, 'Analytics report not found');
  }

  logger.info('Analytics report retrieved', {
    analyticsId,
    userId: req.user.id,
    action: 'view_analytics'
  });

  res.json({
    success: true,
    message: 'Analytics report retrieved successfully',
    data: analytics
  });
});

/**
 * Generate system overview report
 * @route POST /api/v1/webhunter/analytics/system-overview
 */
const generateSystemOverview = handleAsync(async (req, res) => {
  const {
    period = {
      type: 'monthly',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      granularity: 'day'
    },
    scope = {
      entities: [{ type: 'global', included: true }],
      filters: { minQualityScore: 70, statuses: ['active'] }
    },
    includeMetrics = ['system_health', 'provider_performance', 'cost_analysis', 'quality_trends']
  } = req.body;

  // Generate analytics ID
  const analyticsId = await WebHunterAnalytics.generateAnalyticsId();

  // Simulate system overview data generation
  const systemOverview = {
    analyticsId,
    reportType: 'system_overview',
    name: `System Overview - ${new Date().toISOString().split('T')[0]}`,
    description: 'Comprehensive system performance and usage analytics',
    period: {
      type: period.type,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
      granularity: period.granularity,
      timezone: 'UTC'
    },
    scope,
    
    // System metrics
    systemMetrics: {
      health: {
        overallScore: Math.floor(Math.random() * 20) + 80, // 80-100
        providers: Math.floor(Math.random() * 15) + 85, // 85-100
        workflows: Math.floor(Math.random() * 20) + 80, // 80-100
        dataQuality: Math.floor(Math.random() * 25) + 75, // 75-100
        compliance: Math.floor(Math.random() * 15) + 85, // 85-100
        trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)]
      },
      performance: {
        avgResponseTime: Math.floor(Math.random() * 200) + 150, // 150-350ms
        p95ResponseTime: Math.floor(Math.random() * 400) + 600, // 600-1000ms
        requestsPerSecond: Math.floor(Math.random() * 50) + 25, // 25-75
        errorRate: Math.random() * 3, // 0-3%
        performanceTrend: 'stable',
        reliability: Math.random() * 2 + 98 // 98-100%
      }
    },

    // Provider metrics (simulated)
    providerMetrics: [
      {
        providerId: 'PROV000001',
        providerName: 'Bright Data',
        performance: {
          totalRequests: Math.floor(Math.random() * 10000) + 10000,
          successfulRequests: Math.floor(Math.random() * 9500) + 9500,
          failedRequests: Math.floor(Math.random() * 500) + 100,
          successRate: Math.random() * 5 + 95, // 95-100%
          avgResponseTime: Math.floor(Math.random() * 100) + 150, // 150-250ms
          uptime: Math.random() * 2 + 98, // 98-100%
          dataQualityScore: Math.floor(Math.random() * 20) + 80 // 80-100
        },
        costs: {
          totalCost: Math.floor(Math.random() * 1000) + 1000,
          costPerRequest: Math.random() * 0.05 + 0.05,
          currency: 'USD'
        }
      }
    ],

    // Cost metrics
    costMetrics: {
      summary: {
        totalCost: Math.floor(Math.random() * 2000) + 2000,
        currency: 'USD',
        providerCosts: Math.floor(Math.random() * 1500) + 1500,
        infrastructureCosts: Math.floor(Math.random() * 300) + 200,
        operationalCosts: Math.floor(Math.random() * 200) + 100,
        costPerRecord: Math.random() * 0.03 + 0.02
      },
      optimization: {
        opportunities: [
          {
            type: 'provider_switching',
            description: 'Switch to lower-cost provider for batch operations',
            potentialSaving: Math.floor(Math.random() * 300) + 200,
            effort: 'low'
          },
          {
            type: 'schedule_optimization',
            description: 'Optimize workflow scheduling for off-peak hours',
            potentialSaving: Math.floor(Math.random() * 200) + 100,
            effort: 'medium'
          }
        ]
      }
    },

    // Business intelligence
    businessIntelligence: {
      kpis: [
        {
          name: 'Data Processing Efficiency',
          value: Math.floor(Math.random() * 20) + 80,
          unit: 'percentage',
          target: 90,
          trend: 'improving'
        },
        {
          name: 'Cost Per Record',
          value: Math.random() * 0.03 + 0.02,
          unit: 'USD',
          target: 0.03,
          trend: 'stable'
        }
      ],
      insights: [
        {
          type: 'opportunity',
          priority: 'high',
          title: 'Cost Optimization Opportunity',
          description: 'Switching 30% of traffic to Provider B could save $500/month',
          confidence: 0.85,
          actions: [
            {
              action: 'Configure load-balancing rules',
              effort: 'medium',
              impact: 'high',
              timeframe: '1-2 weeks'
            }
          ]
        }
      ]
    },

    // Report metadata
    report: {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      generation: {
        automated: false,
        dataSources: ['providers', 'workflows', 'quality_monitors'],
        aggregationLevel: 'daily',
        includeForecasts: false,
        includeRecommendations: true
      },
      status: 'completed'
    },

    // Security settings
    security: {
      owner: req.user.id,
      visibility: 'organization'
    }
  };

  // Save analytics report
  const analytics = new WebHunterAnalytics(systemOverview);
  await analytics.save();

  await analytics.populate('security.owner', 'profile.firstName profile.lastName email');

  logger.info('System overview report generated', {
    analyticsId,
    userId: req.user.id,
    period: period.type,
    overallScore: systemOverview.systemMetrics.health.overallScore
  });

  res.status(201).json({
    success: true,
    message: 'System overview report generated successfully',
    data: analytics
  });
});

/**
 * Generate provider performance report
 * @route POST /api/v1/webhunter/analytics/provider-performance
 */
const generateProviderPerformance = handleAsync(async (req, res) => {
  const {
    period = { type: 'weekly', startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), endDate: new Date() },
    providerId
  } = req.body;

  const analyticsId = await WebHunterAnalytics.generateAnalyticsId();

  const providerPerformance = {
    analyticsId,
    reportType: 'provider_performance',
    name: `Provider Performance Report - ${new Date().toISOString().split('T')[0]}`,
    period: {
      type: period.type,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
      granularity: 'hour'
    },
    
    // Focused provider metrics
    providerMetrics: [
      {
        providerId: providerId || 'PROV000001',
        providerName: 'Sample Provider',
        performance: {
          totalRequests: Math.floor(Math.random() * 50000) + 25000,
          successfulRequests: Math.floor(Math.random() * 47500) + 24000,
          successRate: Math.random() * 8 + 92,
          avgResponseTime: Math.floor(Math.random() * 150) + 100,
          dataQualityScore: Math.floor(Math.random() * 25) + 75
        },
        trends: {
          performanceTrend: 'improving',
          costTrend: 'stable',
          usageTrend: 'increasing',
          qualityTrend: 'improving'
        }
      }
    ],

    report: {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      status: 'completed'
    },

    security: {
      owner: req.user.id,
      visibility: 'team'
    }
  };

  const analytics = new WebHunterAnalytics(providerPerformance);
  await analytics.save();

  res.status(201).json({
    success: true,
    message: 'Provider performance report generated successfully',
    data: analytics
  });
});

/**
 * Generate cost analysis report
 * @route POST /api/v1/webhunter/analytics/cost-analysis
 */
const generateCostAnalysis = handleAsync(async (req, res) => {
  const {
    period = { type: 'monthly', startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate: new Date() }
  } = req.body;

  const analyticsId = await WebHunterAnalytics.generateAnalyticsId();

  const costAnalysis = {
    analyticsId,
    reportType: 'cost_analysis',
    name: `Cost Analysis Report - ${new Date().toISOString().split('T')[0]}`,
    period: {
      type: period.type,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
      granularity: 'day'
    },

    costMetrics: {
      summary: {
        totalCost: Math.floor(Math.random() * 5000) + 3000,
        currency: 'USD',
        costPerRecord: Math.random() * 0.05 + 0.02,
        budgetUsed: Math.floor(Math.random() * 30) + 60
      },
      trends: {
        monthly: Array.from({ length: 6 }, (_, i) => ({
          month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7),
          cost: Math.floor(Math.random() * 1000) + 2000,
          records: Math.floor(Math.random() * 50000) + 100000,
          costPerRecord: Math.random() * 0.03 + 0.02
        }))
      },
      optimization: {
        opportunities: [
          {
            type: 'provider_switching',
            description: 'Switch non-critical operations to cost-effective providers',
            potentialSaving: Math.floor(Math.random() * 500) + 300,
            effort: 'medium',
            impact: 'high'
          }
        ]
      }
    },

    report: {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      status: 'completed'
    },

    security: {
      owner: req.user.id,
      visibility: 'organization'
    }
  };

  const analytics = new WebHunterAnalytics(costAnalysis);
  await analytics.save();

  res.status(201).json({
    success: true,
    message: 'Cost analysis report generated successfully',
    data: analytics
  });
});

/**
 * Get real-time metrics
 * @route GET /api/v1/webhunter/analytics/real-time
 */
const getRealTimeMetrics = handleAsync(async (req, res) => {
  // Simulate real-time metrics
  const realTimeMetrics = {
    timestamp: new Date(),
    metrics: {
      activeProviders: Math.floor(Math.random() * 3) + 5, // 5-8
      runningWorkflows: Math.floor(Math.random() * 8) + 10, // 10-18
      queuedJobs: Math.floor(Math.random() * 20) + 5, // 5-25
      avgResponseTime: Math.floor(Math.random() * 100) + 200, // 200-300ms
      errorRate: Math.random() * 2, // 0-2%
      throughput: Math.floor(Math.random() * 30) + 40, // 40-70 req/sec
      qualityScore: Math.floor(Math.random() * 15) + 85, // 85-100
      hourlyCost: Math.random() * 2 + 1.5, // $1.5-3.5/hour
      cumulativeCost: Math.random() * 500 + 1000, // $1000-1500
      activeUsers: Math.floor(Math.random() * 50) + 25, // 25-75
      apiCalls: Math.floor(Math.random() * 1000) + 2000, // 2000-3000
      dataVolume: Math.floor(Math.random() * 1000000000) + 5000000000 // 5-6GB
    },
    alerts: [
      {
        type: 'performance',
        severity: 'medium',
        message: 'Provider PROV000002 response time above threshold',
        timestamp: new Date()
      }
    ].filter(() => Math.random() > 0.7) // 30% chance of alerts
  };

  res.json({
    success: true,
    message: 'Real-time metrics retrieved successfully',
    data: realTimeMetrics
  });
});

/**
 * Execute custom analytics query
 * @route POST /api/v1/webhunter/analytics/custom-query
 */
const executeCustomQuery = handleAsync(async (req, res) => {
  const { operation, collection, pipeline, query } = req.body;

  if (!operation || !collection) {
    throw new ApiError(400, 'Operation and collection are required');
  }

  // Simulate custom query execution (in real implementation, this would execute against the database)
  let results = [];

  switch (operation) {
    case 'aggregate':
      // Simulate aggregation results
      results = [
        {
          providerId: 'PROV000001',
          name: 'Bright Data',
          avgCost: 0.08,
          totalRequests: 15000
        },
        {
          providerId: 'PROV000002',
          name: 'Apify',
          avgCost: 0.06,
          totalRequests: 12000
        }
      ];
      break;
    
    case 'find':
      // Simulate find results
      results = [
        {
          _id: '507f1f77bcf86cd799439011',
          providerId: 'PROV000001',
          status: 'connected',
          healthScore: 95
        }
      ];
      break;
    
    default:
      throw new ApiError(400, 'Unsupported operation');
  }

  logger.info('Custom analytics query executed', {
    userId: req.user.id,
    operation,
    collection,
    resultsCount: results.length
  });

  res.json({
    success: true,
    message: 'Custom query executed successfully',
    data: {
      operation,
      collection,
      results,
      executedAt: new Date(),
      resultCount: results.length
    }
  });
});

/**
 * Get analytics by date range
 * @route GET /api/v1/webhunter/analytics/range
 */
const getAnalyticsByDateRange = handleAsync(async (req, res) => {
  const { startDate, endDate, reportType } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(400, 'Start date and end date are required');
  }

  const filter = {
    'period.startDate': { $gte: new Date(startDate) },
    'period.endDate': { $lte: new Date(endDate) }
  };

  if (reportType) {
    filter.reportType = reportType;
  }

  const analytics = await WebHunterAnalytics.find(filter)
    .populate('security.owner', 'profile.firstName profile.lastName email')
    .sort({ 'report.generatedAt': -1 });

  res.json({
    success: true,
    message: 'Analytics reports retrieved successfully',
    data: analytics,
    count: analytics.length,
    dateRange: { startDate, endDate }
  });
});

module.exports = {
  getAllAnalytics,
  getAnalyticsById,
  generateSystemOverview,
  generateProviderPerformance,
  generateCostAnalysis,
  getRealTimeMetrics,
  executeCustomQuery,
  getAnalyticsByDateRange
};