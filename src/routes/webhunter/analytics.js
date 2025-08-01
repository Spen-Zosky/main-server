/**
 * Web-Hunter Analytics Routes
 * Handles advanced analytics, business intelligence, and reporting
 */

const express = require('express');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');
const {
  getAllAnalytics,
  getAnalyticsById,
  generateSystemOverview,
  generateProviderPerformance,
  generateCostAnalysis,
  getRealTimeMetrics,
  executeCustomQuery,
  getAnalyticsByDateRange
} = require('../../controllers/webhunter/analyticsController');

const router = express.Router();

// GET /api/v1/webhunter/analytics - Get all analytics reports with filtering
router.get('/', validateRequest({
  query: {
    page: { type: 'number', min: 1, default: 1 },
    limit: { type: 'number', min: 1, max: 100, default: 20 },
    search: { type: 'string', minLength: 2 },
    reportType: { type: 'string', enum: ['system_overview', 'provider_performance', 'cost_analysis', 'quality_trends', 'usage_analytics'] },
    periodType: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    sortBy: { type: 'string', default: 'report.generatedAt' },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
  }
}), getAllAnalytics);

// GET /api/v1/webhunter/analytics/real-time - Get real-time metrics
router.get('/real-time', validateRequest({
  query: {
    refresh: { type: 'number', min: 5, max: 300, default: 30 },
    includeAlerts: { type: 'boolean', default: true },
    scope: { type: 'string', enum: ['system', 'providers', 'workflows', 'quality'], default: 'system' }
  }
}), getRealTimeMetrics);

// GET /api/v1/webhunter/analytics/range - Get analytics by date range
router.get('/range', validateRequest({
  query: {
    startDate: { type: 'string', required: true },
    endDate: { type: 'string', required: true },
    reportType: { type: 'string', enum: ['system_overview', 'provider_performance', 'cost_analysis', 'quality_trends', 'usage_analytics'] },
    aggregation: { type: 'string', enum: ['daily', 'weekly', 'monthly'], default: 'daily' }
  }
}), getAnalyticsByDateRange);

// GET /api/v1/webhunter/analytics/:analyticsId - Get analytics report by ID
router.get('/:analyticsId', validateRequest({
  params: {
    analyticsId: { type: 'string', required: true }
  },
  query: {
    format: { type: 'string', enum: ['json', 'summary'], default: 'json' },
    includeRawData: { type: 'boolean', default: false }
  }
}), getAnalyticsById);

// POST /api/v1/webhunter/analytics/system-overview - Generate system overview report
router.post('/system-overview', requireAdmin, validateRequest({
  body: {
    period: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly'], default: 'monthly' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        granularity: { type: 'string', enum: ['hour', 'day', 'week'], default: 'day' }
      }
    },
    scope: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['global', 'provider', 'workflow', 'source'], required: true },
              id: { type: 'string' },
              included: { type: 'boolean', default: true }
            }
          },
          default: [{ type: 'global', included: true }]
        },
        filters: {
          type: 'object',
          properties: {
            minQualityScore: { type: 'number', min: 0, max: 100, default: 70 },
            statuses: { type: 'array', items: { type: 'string' }, default: ['active'] },
            providers: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    includeMetrics: {
      type: 'array',
      items: { type: 'string', enum: ['system_health', 'provider_performance', 'cost_analysis', 'quality_trends', 'usage_patterns'] },
      default: ['system_health', 'provider_performance', 'cost_analysis', 'quality_trends']
    },
    options: {
      type: 'object',
      properties: {
        includeForecasts: { type: 'boolean', default: false },
        includeRecommendations: { type: 'boolean', default: true },
        detailLevel: { type: 'string', enum: ['summary', 'detailed', 'comprehensive'], default: 'detailed' }
      }
    }
  }
}), generateSystemOverview);

// POST /api/v1/webhunter/analytics/provider-performance - Generate provider performance report
router.post('/provider-performance', requireAdmin, validateRequest({
  body: {
    period: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        granularity: { type: 'string', enum: ['hour', 'day'], default: 'hour' }
      }
    },
    providerId: { type: 'string' },
    scope: {
      type: 'object',
      properties: {
        includeAll: { type: 'boolean', default: false },
        specificProviders: { type: 'array', items: { type: 'string' } },
        filterByTier: { type: 'string', enum: ['tier_1_enterprise', 'specialized_solutions', 'intelligence_specialists'] },
        minPerformanceScore: { type: 'number', min: 0, max: 100 }
      }
    },
    metrics: {
      type: 'array',
      items: { type: 'string', enum: ['response_time', 'success_rate', 'cost_efficiency', 'data_quality', 'reliability'] },
      default: ['response_time', 'success_rate', 'cost_efficiency', 'data_quality']
    },
    comparison: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: true },
        type: { type: 'string', enum: ['peer_comparison', 'historical_trend', 'benchmark'], default: 'peer_comparison' },
        baselineProvider: { type: 'string' }
      }
    }
  }
}), generateProviderPerformance);

// POST /api/v1/webhunter/analytics/cost-analysis - Generate cost analysis report
router.post('/cost-analysis', requireAdmin, validateRequest({
  body: {
    period: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        granularity: { type: 'string', enum: ['day', 'week', 'month'], default: 'day' }
      }
    },
    scope: {
      type: 'object',
      properties: {
        includeProviders: { type: 'array', items: { type: 'string' } },
        includeWorkflows: { type: 'array', items: { type: 'string' } },
        costCategories: { 
          type: 'array', 
          items: { type: 'string', enum: ['provider_costs', 'infrastructure_costs', 'operational_costs', 'compliance_costs'] },
          default: ['provider_costs', 'infrastructure_costs', 'operational_costs']
        }
      }
    },
    analysis: {
      type: 'object',
      properties: {
        includeOptimization: { type: 'boolean', default: true },
        includeTrends: { type: 'boolean', default: true },
        includeForecasting: { type: 'boolean', default: false },
        benchmarkPeriod: { type: 'string', enum: ['previous_period', 'same_period_last_year', 'budget'] }
      }
    },
    reporting: {
      type: 'object',
      properties: {
        currency: { type: 'string', default: 'USD' },
        includeBreakdown: { type: 'boolean', default: true },
        includeROI: { type: 'boolean', default: true }
      }
    }
  }
}), generateCostAnalysis);

// POST /api/v1/webhunter/analytics/custom-query - Execute custom analytics query
router.post('/custom-query', requireAdmin, validateRequest({
  body: {
    operation: { type: 'string', enum: ['aggregate', 'find', 'count', 'distinct'], required: true },
    collection: { type: 'string', enum: ['providers', 'sources', 'workflows', 'quality_monitors', 'analytics'], required: true },
    query: { type: 'object' },
    pipeline: { type: 'array' },
    options: {
      type: 'object',
      properties: {
        limit: { type: 'number', min: 1, max: 10000, default: 1000 },
        sort: { type: 'object' },
        projection: { type: 'object' },
        timeout: { type: 'number', min: 1000, max: 300000, default: 30000 }
      }
    },
    metadata: {
      type: 'object',
      properties: {
        queryName: { type: 'string', required: true },
        description: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        saveResults: { type: 'boolean', default: false }
      }
    }
  }
}), executeCustomQuery);

// GET /api/v1/webhunter/analytics/dashboard/:dashboardType - Get dashboard data
router.get('/dashboard/:dashboardType', validateRequest({
  params: {
    dashboardType: { type: 'string', enum: ['executive', 'operational', 'technical', 'financial'], required: true }
  },
  query: {
    period: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' },
    refresh: { type: 'boolean', default: false },
    widgets: { type: 'string' },
    timezone: { type: 'string', default: 'UTC' }
  }
}), (req, res) => {
  // This would be implemented in the controller to get dashboard data
  const { dashboardType } = req.params;
  const { period, widgets } = req.query;

  res.json({
    success: true,
    message: `${dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} dashboard data retrieved successfully`,
    data: {
      dashboardType,
      period,
      widgets: widgets ? widgets.split(',') : [],
      lastUpdated: new Date(),
      metrics: {}
    }
  });
});

// GET /api/v1/webhunter/analytics/export/:reportId - Export analytics report
router.get('/export/:reportId', requireAdmin, validateRequest({
  params: {
    reportId: { type: 'string', required: true }
  },
  query: {
    format: { type: 'string', enum: ['json', 'csv', 'excel', 'pdf'], default: 'json' },
    sections: { type: 'string' },
    includeCharts: { type: 'boolean', default: false }
  }
}), (req, res) => {
  // This would be implemented in the controller to export reports
  const { reportId } = req.params;
  const { format } = req.query;

  res.json({
    success: true,
    message: `Report exported successfully in ${format} format`,
    data: {
      reportId,
      exportFormat: format,
      downloadUrl: `/api/v1/webhunter/analytics/downloads/${reportId}.${format}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  });
});

module.exports = router;