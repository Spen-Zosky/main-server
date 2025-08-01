/**
 * Web-Hunter Data Quality Monitor Routes
 * Handles quality monitoring, compliance reporting, and alert management
 */

const express = require('express');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');
const {
  getAllMonitors,
  getMonitorById,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  runQualityAssessment,
  getQualityAlerts,
  acknowledgeAlert,
  getComplianceReport,
  searchMonitors
} = require('../../controllers/webhunter/qualityController');

const router = express.Router();

// GET /api/v1/webhunter/quality-monitors - Get all quality monitors with filtering
router.get('/', validateRequest({
  query: {
    page: { type: 'number', min: 1, default: 1 },
    limit: { type: 'number', min: 1, max: 100, default: 20 },
    search: { type: 'string', minLength: 2 },
    targetType: { type: 'string', enum: ['data_source', 'provider', 'workflow', 'system'] },
    status: { type: 'string', enum: ['active', 'inactive', 'maintenance'] },
    grade: { type: 'string', enum: ['A+', 'A', 'B', 'C', 'D', 'F'] },
    owner: { type: 'string' },
    sortBy: { type: 'string', default: 'createdAt' },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
  }
}), getAllMonitors);

// GET /api/v1/webhunter/quality-monitors/search - Search quality monitors
router.get('/search', validateRequest({
  query: {
    q: { type: 'string', minLength: 2, required: true },
    filters: { type: 'object' }
  }
}), searchMonitors);

// GET /api/v1/webhunter/quality-monitors/:monitorId - Get quality monitor by ID
router.get('/:monitorId', validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  },
  query: {
    includeHistory: { type: 'boolean', default: false },
    includeAlerts: { type: 'boolean', default: true }
  }
}), getMonitorById);

// POST /api/v1/webhunter/quality-monitors - Create new quality monitor (Admin/Manager only)
router.post('/', requireAdmin, validateRequest({
  body: {
    name: { type: 'string', required: true, minLength: 2 },
    description: { type: 'string', required: true, minLength: 10 },
    scope: {
      type: 'object',
      properties: {
        target: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['data_source', 'provider', 'workflow', 'system'], required: true },
            id: { type: 'string', required: true },
            name: { type: 'string', required: true }
          },
          required: true
        },
        coverage: {
          type: 'object',
          properties: {
            dataTypes: { type: 'array', items: { type: 'string' }, required: true },
            timeRange: { type: 'string', enum: ['real_time', 'daily', 'weekly', 'monthly'], required: true },
            sampleSize: { type: 'number', min: 1, max: 100000, default: 1000 }
          },
          required: true
        }
      },
      required: true
    },
    qualityRules: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', required: true },
          dimension: { type: 'string', enum: ['completeness', 'accuracy', 'consistency', 'validity'], required: true },
          type: { type: 'string', enum: ['threshold', 'pattern', 'statistical', 'business_rule'], required: true },
          thresholds: {
            type: 'object',
            properties: {
              excellent: { type: 'number', min: 0, max: 100, required: true },
              target: { type: 'number', min: 0, max: 100, required: true },
              warning: { type: 'number', min: 0, max: 100, required: true },
              critical: { type: 'number', min: 0, max: 100, required: true }
            },
            required: true
          },
          weight: { type: 'number', min: 0.1, max: 10, default: 1 },
          enabled: { type: 'boolean', default: true }
        }
      },
      minItems: 1,
      required: true
    },
    schedule: {
      type: 'object',
      properties: {
        frequency: { type: 'string', enum: ['continuous', 'hourly', 'daily', 'weekly'], required: true },
        time: { type: 'string' },
        timezone: { type: 'string', default: 'UTC' },
        enabled: { type: 'boolean', default: true }
      },
      required: true
    },
    compliance: {
      type: 'object',
      properties: {
        frameworks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', enum: ['GDPR', 'CCPA', 'SOX', 'HIPAA', 'PCI_DSS'], required: true },
              requirements: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    requirementId: { type: 'string', required: true },
                    name: { type: 'string', required: true },
                    mandatory: { type: 'boolean', default: true }
                  }
                },
                minItems: 1
              }
            }
          }
        }
      }
    }
  }
}), createMonitor);

// PUT /api/v1/webhunter/quality-monitors/:monitorId - Update quality monitor (Admin/Manager only)
router.put('/:monitorId', requireAdmin, validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  },
  body: {
    name: { type: 'string', minLength: 2 },
    description: { type: 'string', minLength: 10 },
    scope: { type: 'object' },
    qualityRules: { type: 'array' },
    schedule: { type: 'object' },
    compliance: { type: 'object' },
    notifications: { type: 'object' }
  }
}), updateMonitor);

// DELETE /api/v1/webhunter/quality-monitors/:monitorId - Delete quality monitor (Admin only)
router.delete('/:monitorId', requireAdmin, validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  }
}), deleteMonitor);

// POST /api/v1/webhunter/quality-monitors/:monitorId/assess - Run quality assessment
router.post('/:monitorId/assess', validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  },
  body: {
    assessmentType: { type: 'string', enum: ['immediate', 'scheduled', 'comprehensive'], default: 'immediate' },
    scope: { type: 'object' },
    includeRecommendations: { type: 'boolean', default: true }
  }
}), runQualityAssessment);

// GET /api/v1/webhunter/quality-monitors/:monitorId/alerts - Get quality alerts
router.get('/:monitorId/alerts', validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  },
  query: {
    status: { type: 'string', enum: ['active', 'acknowledged', 'resolved', 'all'], default: 'active' },
    severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
    limit: { type: 'number', min: 1, max: 200, default: 50 },
    startDate: { type: 'string' },
    endDate: { type: 'string' }
  }
}), getQualityAlerts);

// PATCH /api/v1/webhunter/quality-monitors/:monitorId/alerts/:alertId - Acknowledge alert
router.patch('/:monitorId/alerts/:alertId', validateRequest({
  params: {
    monitorId: { type: 'string', required: true },
    alertId: { type: 'string', required: true }
  },
  body: {
    status: { type: 'string', enum: ['acknowledged', 'resolved', 'false_positive'], required: true },
    notes: { type: 'string', minLength: 5 },
    assignedTo: { type: 'string' },
    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
  }
}), acknowledgeAlert);

// GET /api/v1/webhunter/quality-monitors/:monitorId/compliance - Get compliance report
router.get('/:monitorId/compliance', requireAdmin, validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  },
  query: {
    framework: { type: 'string', enum: ['GDPR', 'CCPA', 'SOX', 'HIPAA', 'PCI_DSS'] },
    detailed: { type: 'boolean', default: false },
    period: { type: 'string', enum: ['current', 'last_30_days', 'last_90_days', 'yearly'], default: 'current' }
  }
}), getComplianceReport);

// GET /api/v1/webhunter/quality-monitors/:monitorId/history - Get assessment history
router.get('/:monitorId/history', validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  },
  query: {
    page: { type: 'number', min: 1, default: 1 },
    limit: { type: 'number', min: 1, max: 100, default: 20 },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    minScore: { type: 'number', min: 0, max: 100 },
    grade: { type: 'string', enum: ['A+', 'A', 'B', 'C', 'D', 'F'] }
  }
}), (req, res) => {
  // This would be implemented in the controller to get assessment history
  res.json({
    success: true,
    message: 'Assessment history retrieved successfully',
    data: [],
    pagination: {
      total: 0,
      pages: 0,
      page: 1,
      limit: 20
    }
  });
});

// GET /api/v1/webhunter/quality-monitors/:monitorId/trends - Get quality trends
router.get('/:monitorId/trends', validateRequest({
  params: {
    monitorId: { type: 'string', required: true }
  },
  query: {
    period: { type: 'string', enum: ['24h', '7d', '30d', '90d'], default: '30d' },
    dimensions: { type: 'string', default: 'completeness,accuracy,consistency,validity' },
    granularity: { type: 'string', enum: ['hour', 'day', 'week'], default: 'day' }
  }
}), (req, res) => {
  // This would be implemented in the controller to get quality trends
  res.json({
    success: true,
    message: 'Quality trends retrieved successfully',
    data: {
      period: req.query.period,
      dimensions: req.query.dimensions.split(','),
      trends: []
    }
  });
});

module.exports = router;