/**
 * Web-Hunter Data Quality Monitor Controller
 * Manages comprehensive data quality monitoring and compliance
 */

const { DataQualityMonitor } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get all quality monitors with filtering and pagination
 * @route GET /api/v1/webhunter/quality-monitors
 */
const getAllMonitors = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    targetType,
    status,
    grade,
    owner,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = buildFilter({
    'scope.target.type': targetType,
    'currentStatus.status': status,
    'currentStatus.grade': grade,
    'security.owner': owner,
    search: search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { monitorId: { $regex: search, $options: 'i' } }
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

  const result = await paginate(DataQualityMonitor, filter, options);

  logger.info('Quality monitors retrieved', {
    userId: req.user.id,
    count: result.docs.length,
    totalDocs: result.totalDocs,
    filter
  });

  res.json({
    success: true,
    message: 'Quality monitors retrieved successfully',
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
 * Get quality monitor by ID
 * @route GET /api/v1/webhunter/quality-monitors/:monitorId
 */
const getMonitorById = handleAsync(async (req, res) => {
  const { monitorId } = req.params;

  const monitor = await DataQualityMonitor.findOne({ monitorId })
    .populate('security.owner', 'profile.firstName profile.lastName email');

  if (!monitor) {
    throw new ApiError(404, 'Quality monitor not found');
  }

  logger.info('Quality monitor retrieved', {
    monitorId,
    userId: req.user.id,
    action: 'view_monitor'
  });

  res.json({
    success: true,
    message: 'Quality monitor retrieved successfully',
    data: monitor
  });
});

/**
 * Create new quality monitor
 * @route POST /api/v1/webhunter/quality-monitors
 */
const createMonitor = handleAsync(async (req, res) => {
  const monitorData = {
    ...req.body,
    monitorId: await DataQualityMonitor.generateMonitorId(),
    'security.owner': req.user.id,
    'audit.createdBy': req.user.id
  };

  const monitor = new DataQualityMonitor(monitorData);
  await monitor.save();

  await monitor.populate('security.owner', 'profile.firstName profile.lastName email');

  logger.info('Quality monitor created', {
    monitorId: monitor.monitorId,
    userId: req.user.id,
    name: monitor.name
  });

  res.status(201).json({
    success: true,
    message: 'Quality monitor created successfully',
    data: monitor
  });
});

/**
 * Update quality monitor
 * @route PUT /api/v1/webhunter/quality-monitors/:monitorId
 */
const updateMonitor = handleAsync(async (req, res) => {
  const { monitorId } = req.params;
  const updates = {
    ...req.body,
    'audit.updatedBy': req.user.id
  };

  const monitor = await DataQualityMonitor.findOneAndUpdate(
    { monitorId },
    updates,
    { new: true, runValidators: true }
  ).populate('security.owner', 'profile.firstName profile.lastName email');

  if (!monitor) {
    throw new ApiError(404, 'Quality monitor not found');
  }

  logger.info('Quality monitor updated', {
    monitorId,
    userId: req.user.id,
    updatedFields: Object.keys(req.body)
  });

  res.json({
    success: true,
    message: 'Quality monitor updated successfully',
    data: monitor
  });
});

/**
 * Delete quality monitor
 * @route DELETE /api/v1/webhunter/quality-monitors/:monitorId
 */
const deleteMonitor = handleAsync(async (req, res) => {
  const { monitorId } = req.params;

  const monitor = await DataQualityMonitor.findOneAndDelete({ monitorId });

  if (!monitor) {
    throw new ApiError(404, 'Quality monitor not found');
  }

  logger.info('Quality monitor deleted', {
    monitorId,
    userId: req.user.id,
    name: monitor.name
  });

  res.json({
    success: true,
    message: 'Quality monitor deleted successfully'
  });
});

/**
 * Run quality assessment
 * @route POST /api/v1/webhunter/quality-monitors/:monitorId/assess
 */
const runQualityAssessment = handleAsync(async (req, res) => {
  const { monitorId } = req.params;

  const monitor = await DataQualityMonitor.findOne({ monitorId });

  if (!monitor) {
    throw new ApiError(404, 'Quality monitor not found');
  }

  // Generate assessment ID
  const assessmentId = `assess_${Date.now()}`;

  // Simulate quality assessment based on rules
  const ruleResults = monitor.qualityRules.map(rule => {
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    let status = 'pass';
    let threshold = 'target';

    if (score < rule.thresholds.critical) {
      status = 'fail';
      threshold = 'critical';
    } else if (score < rule.thresholds.warning) {
      status = 'warning';
      threshold = 'warning';
    } else if (score >= rule.thresholds.excellent) {
      threshold = 'excellent';
    }

    return {
      ruleId: rule.ruleId,
      name: rule.name,
      score,
      status,
      threshold,
      dimension: rule.dimension
    };
  });

  // Calculate overall scores
  const dimensionScores = {
    completeness: 0,
    accuracy: 0,
    consistency: 0,
    validity: 0
  };

  // Group rule results by dimension
  const dimensionCounts = { completeness: 0, accuracy: 0, consistency: 0, validity: 0 };
  ruleResults.forEach(result => {
    if (dimensionScores.hasOwnProperty(result.dimension)) {
      dimensionScores[result.dimension] += result.score;
      dimensionCounts[result.dimension]++;
    }
  });

  // Calculate averages
  Object.keys(dimensionScores).forEach(dimension => {
    if (dimensionCounts[dimension] > 0) {
      dimensionScores[dimension] = Math.round(dimensionScores[dimension] / dimensionCounts[dimension]);
    }
  });

  const overallScore = Math.round(Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 4);

  // Determine grade
  let grade = 'F';
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 90) grade = 'A';
  else if (overallScore >= 85) grade = 'B';
  else if (overallScore >= 80) grade = 'C';
  else if (overallScore >= 70) grade = 'D';

  // Determine status
  let status = 'critical';
  if (overallScore >= 90) status = 'excellent';
  else if (overallScore >= 80) status = 'good';
  else if (overallScore >= 70) status = 'acceptable';
  else if (overallScore >= 60) status = 'poor';

  // Generate issues
  const issues = ruleResults
    .filter(result => result.status === 'fail' || result.status === 'warning')
    .map(result => ({
      severity: result.status === 'fail' ? 'high' : 'medium',
      rule: result.ruleId,
      description: `${result.name} score (${result.score}) below ${result.threshold} threshold`,
      recommendation: 'Review data source validation rules'
    }));

  const assessment = {
    monitorId,
    assessmentId,
    overallScore,
    dimensionScores,
    grade,
    status,
    ruleResults,
    issues,
    assessedAt: new Date()
  };

  // Update monitor current status
  await DataQualityMonitor.findOneAndUpdate(
    { monitorId },
    {
      currentStatus: {
        overallScore,
        dimensionScores,
        grade,
        status,
        lastAssessment: new Date()
      },
      'audit.updatedBy': req.user.id
    }
  );

  logger.info('Quality assessment completed', {
    monitorId,
    assessmentId,
    userId: req.user.id,
    overallScore,
    grade,
    issuesCount: issues.length
  });

  res.json({
    success: true,
    message: 'Quality assessment completed successfully',
    data: assessment
  });
});

/**
 * Get quality alerts
 * @route GET /api/v1/webhunter/quality-monitors/:monitorId/alerts
 */
const getQualityAlerts = handleAsync(async (req, res) => {
  const { monitorId } = req.params;
  const { status = 'active', severity, limit = 50 } = req.query;

  const monitor = await DataQualityMonitor.findOne({ monitorId });

  if (!monitor) {
    throw new ApiError(404, 'Quality monitor not found');
  }

  let alerts = monitor.alerts.active || [];

  // Filter by status
  if (status !== 'all') {
    alerts = alerts.filter(alert => alert.status === status);
  }

  // Filter by severity
  if (severity) {
    alerts = alerts.filter(alert => alert.severity === severity);
  }

  // Limit results
  alerts = alerts.slice(0, parseInt(limit));

  res.json({
    success: true,
    message: 'Quality alerts retrieved successfully',
    data: alerts,
    count: alerts.length,
    monitorId,
    monitorName: monitor.name
  });
});

/**
 * Acknowledge alert
 * @route PATCH /api/v1/webhunter/quality-monitors/:monitorId/alerts/:alertId
 */
const acknowledgeAlert = handleAsync(async (req, res) => {
  const { monitorId, alertId } = req.params;
  const { status, notes } = req.body;

  const monitor = await DataQualityMonitor.findOne({ monitorId });

  if (!monitor) {
    throw new ApiError(404, 'Quality monitor not found');
  }

  // Find and update the alert
  const alertIndex = monitor.alerts.active.findIndex(alert => alert.alertId === alertId);

  if (alertIndex === -1) {
    throw new ApiError(404, 'Alert not found');
  }

  monitor.alerts.active[alertIndex].status = status;
  monitor.alerts.active[alertIndex].acknowledgedBy = req.user.id;
  monitor.alerts.active[alertIndex].acknowledgedAt = new Date();
  monitor.alerts.active[alertIndex].notes = notes;

  monitor.audit.updatedBy = req.user.id;
  await monitor.save();

  logger.info('Quality alert acknowledged', {
    monitorId,
    alertId,
    userId: req.user.id,
    status,
    notes: notes ? 'provided' : 'none'
  });

  res.json({
    success: true,
    message: 'Alert acknowledged successfully',
    data: monitor.alerts.active[alertIndex]
  });
});

/**
 * Get compliance report
 * @route GET /api/v1/webhunter/quality-monitors/:monitorId/compliance
 */
const getComplianceReport = handleAsync(async (req, res) => {
  const { monitorId } = req.params;
  const { framework } = req.query;

  const monitor = await DataQualityMonitor.findOne({ monitorId });

  if (!monitor) {
    throw new ApiError(404, 'Quality monitor not found');
  }

  let complianceData = monitor.compliance.frameworks;

  // Filter by framework if specified
  if (framework) {
    complianceData = complianceData.filter(f => f.name.toLowerCase() === framework.toLowerCase());
  }

  const report = {
    monitorId,
    monitorName: monitor.name,
    generatedAt: new Date(),
    frameworks: complianceData.map(framework => ({
      name: framework.name,
      overallStatus: framework.overallStatus,
      overallScore: framework.overallScore,
      requirements: framework.requirements.map(req => ({
        requirementId: req.requirementId,
        name: req.name,
        status: req.status,
        score: req.score,
        lastCheck: req.lastCheck
      }))
    })),
    governance: monitor.compliance.governance
  };

  res.json({
    success: true,
    message: 'Compliance report generated successfully',
    data: report
  });
});

/**
 * Search quality monitors
 * @route GET /api/v1/webhunter/search/quality-monitors
 */
const searchMonitors = handleAsync(async (req, res) => {
  const { q, filters = {} } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const searchFilter = {
    $text: { $search: q },
    ...buildFilter(filters)
  };

  const monitors = await DataQualityMonitor.find(searchFilter)
    .select('monitorId name description scope currentStatus security')
    .populate('security.owner', 'profile.firstName profile.lastName')
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);

  res.json({
    success: true,
    message: 'Search completed successfully',
    data: monitors,
    count: monitors.length
  });
});

module.exports = {
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
};