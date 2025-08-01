/**
 * Web-Hunter Orchestration Workflow Routes
 * Handles workflow management, execution control, and analytics
 */

const express = require('express');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');
const {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
  getExecutionStatus,
  controlExecution,
  getWorkflowAnalytics,
  searchWorkflows
} = require('../../controllers/webhunter/workflowController');

const router = express.Router();

// GET /api/v1/webhunter/workflows - Get all workflows with filtering
router.get('/', validateRequest({
  query: {
    page: { type: 'number', min: 1, default: 1 },
    limit: { type: 'number', min: 1, max: 100, default: 20 },
    search: { type: 'string', minLength: 2 },
    status: { type: 'string', enum: ['idle', 'scheduled', 'running', 'paused', 'completed', 'failed', 'cancelled'] },
    type: { type: 'string', enum: ['data_collection', 'data_processing', 'analytics', 'monitoring', 'integration'] },
    owner: { type: 'string' },
    businessFunction: { type: 'string' },
    sortBy: { type: 'string', default: 'createdAt' },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
  }
}), getAllWorkflows);

// GET /api/v1/webhunter/workflows/search - Search workflows
router.get('/search', validateRequest({
  query: {
    q: { type: 'string', minLength: 2, required: true },
    filters: { type: 'object' }
  }
}), searchWorkflows);

// GET /api/v1/webhunter/workflows/:workflowId - Get workflow by ID
router.get('/:workflowId', validateRequest({
  params: {
    workflowId: { type: 'string', required: true }
  },
  query: {
    include: { type: 'string' }
  }
}), getWorkflowById);

// POST /api/v1/webhunter/workflows - Create new workflow (Admin/Manager only)
router.post('/', requireAdmin, validateRequest({
  body: {
    name: { type: 'string', required: true, minLength: 2 },
    displayName: { type: 'string', required: true, minLength: 2 },
    description: { type: 'string', required: true, minLength: 10 },
    classification: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['data_collection', 'data_processing', 'analytics', 'monitoring', 'integration'], required: true },
        businessFunction: { type: 'string', required: true },
        complexity: { type: 'string', enum: ['simple', 'moderate', 'complex', 'enterprise'], required: true },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' }
      },
      required: true
    },
    configuration: {
      type: 'object',
      properties: {
        providers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              providerId: { type: 'string', required: true },
              role: { type: 'string', enum: ['primary', 'backup', 'validator'], required: true },
              weight: { type: 'number', min: 0, max: 100, required: true }
            }
          },
          minItems: 1,
          required: true
        },
        dataFlow: {
          type: 'object',
          properties: {
            input: {
              type: 'object',
              properties: {
                sources: { type: 'array', items: { type: 'string' }, required: true },
                format: { type: 'string', required: true },
                validation: { type: 'object' }
              },
              required: true
            },
            processing: {
              type: 'object',
              properties: {
                steps: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', required: true },
                      type: { type: 'string', required: true },
                      config: { type: 'object' }
                    }
                  },
                  minItems: 1,
                  required: true
                },
                parallelExecution: { type: 'boolean', default: false },
                retryPolicy: { type: 'object' }
              },
              required: true
            },
            output: {
              type: 'object',
              properties: {
                destinations: { type: 'array', items: { type: 'string' }, required: true },
                format: { type: 'string', required: true },
                storage: { type: 'object' }
              },
              required: true
            }
          },
          required: true
        },
        scheduling: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean', default: false },
            type: { type: 'string', enum: ['cron', 'interval', 'event_driven'] },
            expression: { type: 'string' },
            timezone: { type: 'string', default: 'UTC' }
          }
        }
      },
      required: true
    }
  }
}), createWorkflow);

// PUT /api/v1/webhunter/workflows/:workflowId - Update workflow (Admin/Manager only)
router.put('/:workflowId', requireAdmin, validateRequest({
  params: {
    workflowId: { type: 'string', required: true }
  },
  body: {
    name: { type: 'string', minLength: 2 },
    displayName: { type: 'string', minLength: 2 },
    description: { type: 'string', minLength: 10 },
    classification: { type: 'object' },
    configuration: { type: 'object' },
    execution: { type: 'object' }
  }
}), updateWorkflow);

// DELETE /api/v1/webhunter/workflows/:workflowId - Delete workflow (Admin only)
router.delete('/:workflowId', requireAdmin, validateRequest({
  params: {
    workflowId: { type: 'string', required: true }
  }
}), deleteWorkflow);

// POST /api/v1/webhunter/workflows/:workflowId/execute - Execute workflow
router.post('/:workflowId/execute', validateRequest({
  params: {
    workflowId: { type: 'string', required: true }
  },
  body: {
    parameters: { type: 'object', default: {} },
    inputs: { type: 'object', default: {} },
    priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    tags: { type: 'array', items: { type: 'string' } }
  }
}), executeWorkflow);

// GET /api/v1/webhunter/workflows/:workflowId/executions/:executionId - Get execution status
router.get('/:workflowId/executions/:executionId', validateRequest({
  params: {
    workflowId: { type: 'string', required: true },
    executionId: { type: 'string', required: true }
  },
  query: {
    includeDetails: { type: 'boolean', default: false },
    includeLogs: { type: 'boolean', default: false }
  }
}), getExecutionStatus);

// PATCH /api/v1/webhunter/workflows/:workflowId/executions/:executionId - Control execution
router.patch('/:workflowId/executions/:executionId', requireAdmin, validateRequest({
  params: {
    workflowId: { type: 'string', required: true },
    executionId: { type: 'string', required: true }
  },
  body: {
    action: { type: 'string', enum: ['pause', 'resume', 'cancel'], required: true },
    reason: { type: 'string', minLength: 5 },
    force: { type: 'boolean', default: false }
  }
}), controlExecution);

// GET /api/v1/webhunter/workflows/:workflowId/analytics - Get workflow analytics
router.get('/:workflowId/analytics', validateRequest({
  params: {
    workflowId: { type: 'string', required: true }
  },
  query: {
    period: { type: 'string', enum: ['last_24h', 'last_7d', 'last_30_days', 'last_90_days'], default: 'last_30_days' },
    metrics: { type: 'string', default: 'performance,cost,quality,reliability' },
    granularity: { type: 'string', enum: ['hour', 'day', 'week'], default: 'day' }
  }
}), getWorkflowAnalytics);

// GET /api/v1/webhunter/workflows/:workflowId/executions - Get execution history
router.get('/:workflowId/executions', validateRequest({
  params: {
    workflowId: { type: 'string', required: true }
  },
  query: {
    page: { type: 'number', min: 1, default: 1 },
    limit: { type: 'number', min: 1, max: 100, default: 20 },
    status: { type: 'string', enum: ['running', 'completed', 'failed', 'cancelled', 'paused'] },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    sortBy: { type: 'string', enum: ['startTime', 'endTime', 'duration', 'status'], default: 'startTime' },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
  }
}), (req, res) => {
  // This would be implemented in the controller to get execution history
  res.json({
    success: true,
    message: 'Execution history retrieved successfully',
    data: [],
    pagination: {
      total: 0,
      pages: 0,
      page: 1,
      limit: 20
    }
  });
});

module.exports = router;