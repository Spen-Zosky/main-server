/**
 * Web-Hunter Orchestration Workflow Controller
 * Manages complex multi-provider data orchestration workflows
 */

const { OrchestrationWorkflow } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get all workflows with filtering and pagination
 * @route GET /api/v1/webhunter/workflows
 */
const getAllWorkflows = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    type,
    owner,
    businessFunction,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = buildFilter({
    'execution.status': status,
    'classification.type': type,
    'security.owner': owner,
    'classification.businessFunction': businessFunction,
    search: search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { workflowId: { $regex: search, $options: 'i' } }
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

  const result = await paginate(OrchestrationWorkflow, filter, options);

  logger.info('Workflows retrieved', {
    userId: req.user.id,
    count: result.docs.length,
    totalDocs: result.totalDocs,
    filter
  });

  res.json({
    success: true,
    message: 'Workflows retrieved successfully',
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
 * Get workflow by ID
 * @route GET /api/v1/webhunter/workflows/:workflowId
 */
const getWorkflowById = handleAsync(async (req, res) => {
  const { workflowId } = req.params;
  const { include } = req.query;

  let query = OrchestrationWorkflow.findOne({ workflowId })
    .populate('security.owner', 'profile.firstName profile.lastName email');

  // Handle include parameter for related data
  if (include && include.includes('execution_history')) {
    // Include execution history details
  }

  if (include && include.includes('dependencies')) {
    // Include workflow dependencies
  }

  const workflow = await query;

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found');
  }

  logger.info('Workflow retrieved', {
    workflowId,
    userId: req.user.id,
    action: 'view_workflow'
  });

  res.json({
    success: true,
    message: 'Workflow retrieved successfully',
    data: workflow
  });
});

/**
 * Create new workflow
 * @route POST /api/v1/webhunter/workflows
 */
const createWorkflow = handleAsync(async (req, res) => {
  const workflowData = {
    ...req.body,
    workflowId: await OrchestrationWorkflow.generateWorkflowId(),
    'security.owner': req.user.id,
    'audit.createdBy': req.user.id
  };

  const workflow = new OrchestrationWorkflow(workflowData);
  await workflow.save();

  await workflow.populate('security.owner', 'profile.firstName profile.lastName email');

  logger.info('Workflow created', {
    workflowId: workflow.workflowId,
    userId: req.user.id,
    name: workflow.name
  });

  res.status(201).json({
    success: true,
    message: 'Workflow created successfully',
    data: workflow
  });
});

/**
 * Update workflow
 * @route PUT /api/v1/webhunter/workflows/:workflowId
 */
const updateWorkflow = handleAsync(async (req, res) => {
  const { workflowId } = req.params;
  const updates = {
    ...req.body,
    'audit.updatedBy': req.user.id
  };

  const workflow = await OrchestrationWorkflow.findOneAndUpdate(
    { workflowId },
    updates,
    { new: true, runValidators: true }
  ).populate('security.owner', 'profile.firstName profile.lastName email');

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found');
  }

  logger.info('Workflow updated', {
    workflowId,
    userId: req.user.id,
    updatedFields: Object.keys(req.body)
  });

  res.json({
    success: true,
    message: 'Workflow updated successfully',
    data: workflow
  });
});

/**
 * Delete workflow
 * @route DELETE /api/v1/webhunter/workflows/:workflowId
 */
const deleteWorkflow = handleAsync(async (req, res) => {
  const { workflowId } = req.params;

  const workflow = await OrchestrationWorkflow.findOneAndDelete({ workflowId });

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found');
  }

  logger.info('Workflow deleted', {
    workflowId,
    userId: req.user.id,
    name: workflow.name
  });

  res.json({
    success: true,
    message: 'Workflow deleted successfully'
  });
});

/**
 * Execute workflow
 * @route POST /api/v1/webhunter/workflows/:workflowId/execute
 */
const executeWorkflow = handleAsync(async (req, res) => {
  const { workflowId } = req.params;
  const { parameters = {}, inputs = {} } = req.body;

  const workflow = await OrchestrationWorkflow.findOne({ workflowId });

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found');
  }

  if (workflow.execution.status === 'running') {
    throw new ApiError(409, 'Workflow is already running');
  }

  // Generate execution ID and start execution
  const executionId = `exec_${Date.now()}`;
  const startTime = new Date();

  // Update workflow status
  workflow.execution.status = 'running';
  workflow.execution.currentExecution = {
    executionId,
    startTime,
    parameters,
    inputs,
    status: 'running'
  };

  // Add to execution history
  workflow.execution.history.push({
    executionId,
    startTime,
    status: 'running',
    metrics: {
      recordsProcessed: 0,
      dataQualityScore: 0,
      totalCost: 0
    }
  });

  await workflow.save();

  // Simulate workflow execution (in real implementation, this would trigger actual execution)
  setTimeout(async () => {
    try {
      // Simulate execution completion
      const endTime = new Date();
      const duration = endTime - startTime;
      const metrics = {
        recordsProcessed: Math.floor(Math.random() * 10000) + 1000,
        dataQualityScore: Math.floor(Math.random() * 20) + 80,
        totalCost: Math.random() * 50 + 10
      };

      await OrchestrationWorkflow.findOneAndUpdate(
        { workflowId },
        {
          'execution.status': 'completed',
          'execution.currentExecution.status': 'completed',
          'execution.currentExecution.endTime': endTime,
          'execution.currentExecution.duration': duration,
          'execution.currentExecution.metrics': metrics,
          'execution.statistics.totalExecutions': workflow.execution.statistics.totalExecutions + 1,
          'execution.statistics.successfulExecutions': workflow.execution.statistics.successfulExecutions + 1,
          $push: {
            'execution.history': {
              executionId,
              startTime,
              endTime,
              duration,
              status: 'completed',
              metrics
            }
          }
        }
      );

      logger.info('Workflow execution completed', {
        workflowId,
        executionId,
        duration,
        metrics
      });
    } catch (error) {
      logger.error('Workflow execution failed', {
        workflowId,
        executionId,
        error: error.message
      });
    }
  }, 5000); // Simulate 5 second execution

  logger.info('Workflow execution started', {
    workflowId,
    executionId,
    userId: req.user.id,
    parameters,
    inputs
  });

  res.json({
    success: true,
    message: 'Workflow execution started successfully',
    data: {
      executionId,
      workflowId,
      status: 'running',
      startTime,
      estimatedDuration: 30000, // 30 seconds estimate
      progress: {
        currentStep: workflow.configuration.dataFlow.processing.steps[0]?.name || 'initializing',
        completedSteps: 0,
        totalSteps: workflow.configuration.dataFlow.processing.steps.length,
        percentage: 0
      }
    }
  });
});

/**
 * Get workflow execution status
 * @route GET /api/v1/webhunter/workflows/:workflowId/executions/:executionId
 */
const getExecutionStatus = handleAsync(async (req, res) => {
  const { workflowId, executionId } = req.params;

  const workflow = await OrchestrationWorkflow.findOne({ workflowId });

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found');
  }

  // Find execution in history
  const execution = workflow.execution.history.find(h => h.executionId === executionId) ||
                   (workflow.execution.currentExecution?.executionId === executionId ? 
                    workflow.execution.currentExecution : null);

  if (!execution) {
    throw new ApiError(404, 'Execution not found');
  }

  res.json({
    success: true,
    message: 'Execution status retrieved successfully',
    data: execution
  });
});

/**
 * Pause/Resume/Cancel workflow execution
 * @route PATCH /api/v1/webhunter/workflows/:workflowId/executions/:executionId
 */
const controlExecution = handleAsync(async (req, res) => {
  const { workflowId, executionId } = req.params;
  const { action } = req.body; // pause, resume, cancel

  const workflow = await OrchestrationWorkflow.findOne({ workflowId });

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found');
  }

  if (!workflow.execution.currentExecution || 
      workflow.execution.currentExecution.executionId !== executionId) {
    throw new ApiError(404, 'Active execution not found');
  }

  let newStatus;
  switch (action) {
    case 'pause':
      newStatus = 'paused';
      break;
    case 'resume':
      newStatus = 'running';
      break;
    case 'cancel':
      newStatus = 'cancelled';
      break;
    default:
      throw new ApiError(400, 'Invalid action. Use: pause, resume, or cancel');
  }

  // Update execution status
  await OrchestrationWorkflow.findOneAndUpdate(
    { workflowId },
    {
      'execution.status': newStatus,
      'execution.currentExecution.status': newStatus,
      'audit.updatedBy': req.user.id
    }
  );

  logger.info('Workflow execution controlled', {
    workflowId,
    executionId,
    action,
    newStatus,
    userId: req.user.id
  });

  res.json({
    success: true,
    message: `Workflow execution ${action}d successfully`,
    data: {
      executionId,
      workflowId,
      status: newStatus,
      action,
      timestamp: new Date()
    }
  });
});

/**
 * Get workflow performance analytics
 * @route GET /api/v1/webhunter/workflows/:workflowId/analytics
 */
const getWorkflowAnalytics = handleAsync(async (req, res) => {
  const { workflowId } = req.params;
  const { period = 'last_30_days', metrics = 'performance,cost,quality,reliability' } = req.query;

  const workflow = await OrchestrationWorkflow.findOne({ workflowId });

  if (!workflow) {
    throw new ApiError(404, 'Workflow not found');
  }

  // Generate analytics based on execution history
  const analytics = {
    workflowId,
    workflowName: workflow.name,
    period,
    requestedMetrics: metrics.split(','),
    data: {
      performance: {
        totalExecutions: workflow.execution.statistics.totalExecutions,
        successfulExecutions: workflow.execution.statistics.successfulExecutions,
        failedExecutions: workflow.execution.statistics.failedExecutions,
        successRate: workflow.execution.statistics.totalExecutions > 0 ? 
          (workflow.execution.statistics.successfulExecutions / workflow.execution.statistics.totalExecutions * 100) : 0,
        avgExecutionTime: workflow.execution.statistics.avgExecutionTime,
        trend: 'stable'
      },
      cost: {
        totalCost: workflow.execution.history.reduce((sum, h) => sum + (h.metrics?.totalCost || 0), 0),
        avgCostPerExecution: workflow.execution.history.length > 0 ?
          workflow.execution.history.reduce((sum, h) => sum + (h.metrics?.totalCost || 0), 0) / workflow.execution.history.length : 0,
        trend: 'decreasing'
      },
      quality: {
        avgQualityScore: workflow.execution.history.length > 0 ?
          workflow.execution.history.reduce((sum, h) => sum + (h.metrics?.dataQualityScore || 0), 0) / workflow.execution.history.length : 0,
        trend: 'improving'
      },
      reliability: {
        uptime: 99.5,
        mttr: 300, // Mean time to recovery in seconds
        mtbf: 3600000, // Mean time between failures in seconds
        trend: 'stable'
      }
    },
    generatedAt: new Date()
  };

  res.json({
    success: true,
    message: 'Workflow analytics retrieved successfully',
    data: analytics
  });
});

/**
 * Search workflows
 * @route GET /api/v1/webhunter/search/workflows
 */
const searchWorkflows = handleAsync(async (req, res) => {
  const { q, filters = {} } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const searchFilter = {
    $text: { $search: q },
    ...buildFilter(filters)
  };

  const workflows = await OrchestrationWorkflow.find(searchFilter)
    .select('workflowId name displayName classification execution security')
    .populate('security.owner', 'profile.firstName profile.lastName')
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);

  res.json({
    success: true,
    message: 'Search completed successfully',
    data: workflows,
    count: workflows.length
  });
});

module.exports = {
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
};