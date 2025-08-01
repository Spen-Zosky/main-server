/**
 * NOSE Research Project Controller
 * Handles all research project CRUD operations and management
 */

const { ResearchProject } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get all research projects with filtering and pagination
 * @route GET /api/v1/nose/projects
 */
const getAllProjects = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    fieldOfStudy,
    researchType,
    healthStatus,
    piUserId,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = buildFilter({
    status,
    'classification.researchType': researchType,
    'classification.fieldOfStudy.primary': fieldOfStudy,
    'health.overallHealth': healthStatus,
    'team.principalInvestigator.userId': piUserId,
    search: search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { 'description.abstract': { $regex: search, $options: 'i' } },
        { 'classification.keywords': { $regex: search, $options: 'i' } }
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
        path: 'team.principalInvestigator.userId',
        select: 'profile.firstName profile.lastName email'
      }
    ]
  };

  const result = await paginate(ResearchProject, filter, options);

  logger.info('Research projects retrieved', {
    userId: req.user.id,
    count: result.docs.length,
    totalDocs: result.totalDocs,
    filter
  });

  res.json({
    success: true,
    message: 'Research projects retrieved successfully',
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
 * Get research project by ID
 * @route GET /api/v1/nose/projects/:projectId
 */
const getProjectById = handleAsync(async (req, res) => {
  const { projectId } = req.params;

  const project = await ResearchProject.findOne({ projectId })
    .populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName email')
    .populate('team.coInvestigators.userId', 'profile.firstName profile.lastName email')
    .populate('team.students.userId', 'profile.firstName profile.lastName email')
    .populate('audit.createdBy', 'profile.firstName profile.lastName')
    .populate('audit.updatedBy', 'profile.firstName profile.lastName');

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  // Update analytics
  project.analytics.views += 1;
  project.analytics.lastAnalyticsUpdate = new Date();
  await project.save();

  logger.info('Research project retrieved', {
    projectId,
    userId: req.user.id,
    action: 'view_project'
  });

  res.json({
    success: true,
    message: 'Research project retrieved successfully',
    data: project
  });
});

/**
 * Create new research project
 * @route POST /api/v1/nose/projects
 */
const createProject = handleAsync(async (req, res) => {
  const projectData = {
    ...req.body,
    projectId: await ResearchProject.generateProjectId(),
    'team.principalInvestigator.userId': req.user.id,
    'audit.createdBy': req.user.id
  };

  const project = new ResearchProject(projectData);
  await project.save();

  await project.populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName email');

  logger.info('Research project created', {
    projectId: project.projectId,
    userId: req.user.id,
    title: project.title
  });

  res.status(201).json({
    success: true,
    message: 'Research project created successfully',
    data: project
  });
});

/**
 * Update research project
 * @route PUT /api/v1/nose/projects/:projectId
 */
const updateProject = handleAsync(async (req, res) => {
  const { projectId } = req.params;
  const updates = {
    ...req.body,
    'audit.updatedBy': req.user.id
  };

  const project = await ResearchProject.findOneAndUpdate(
    { projectId },
    updates,
    { new: true, runValidators: true }
  ).populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName email');

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  logger.info('Research project updated', {
    projectId,
    userId: req.user.id,
    updatedFields: Object.keys(req.body)
  });

  res.json({
    success: true,
    message: 'Research project updated successfully',
    data: project
  });
});

/**
 * Delete research project
 * @route DELETE /api/v1/nose/projects/:projectId
 */
const deleteProject = handleAsync(async (req, res) => {
  const { projectId } = req.params;

  const project = await ResearchProject.findOneAndDelete({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  logger.info('Research project deleted', {
    projectId,
    userId: req.user.id,
    title: project.title
  });

  res.json({
    success: true,
    message: 'Research project deleted successfully'
  });
});

/**
 * Update project status
 * @route PATCH /api/v1/nose/projects/:projectId/status
 */
const updateProjectStatus = handleAsync(async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  const project = await ResearchProject.findOneAndUpdate(
    { projectId },
    { 
      status,
      'audit.updatedBy': req.user.id,
      ...(status === 'completed' && { 'timeline.actualEndDate': new Date() })
    },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  logger.info('Research project status updated', {
    projectId,
    userId: req.user.id,
    oldStatus: project.status,
    newStatus: status
  });

  res.json({
    success: true,
    message: 'Project status updated successfully',
    data: { projectId, status }
  });
});

/**
 * Get project health metrics
 * @route GET /api/v1/nose/projects/:projectId/health
 */
const getProjectHealth = handleAsync(async (req, res) => {
  const { projectId } = req.params;

  const project = await ResearchProject.findOne({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  const healthMetrics = {
    projectId,
    overallHealth: project.health.overallHealth,
    budgetHealth: project.health.budgetHealth,
    timelineHealth: project.health.timelineHealth,
    teamHealth: project.health.teamHealth,
    lastHealthCheck: project.health.lastHealthCheck,
    budgetUtilization: project.budgetUtilization,
    progress: project.calculateProgress(),
    isOverdue: project.isOverdue(),
    teamSize: project.teamSize,
    durationInDays: project.durationInDays,
    publicationsCount: project.publications.length,
    activeMilestones: project.timeline.milestones.filter(m => m.status === 'in_progress').length,
    upcomingDeadlines: project.timeline.milestones
      .filter(m => m.status !== 'completed' && new Date(m.targetDate) > new Date())
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
      .slice(0, 5)
  };

  res.json({
    success: true,
    message: 'Project health retrieved successfully',
    data: healthMetrics
  });
});

/**
 * Search research projects
 * @route GET /api/v1/nose/search/projects
 */
const searchProjects = handleAsync(async (req, res) => {
  const { q, filters = {} } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const searchFilter = {
    $text: { $search: q },
    ...buildFilter(filters)
  };

  const projects = await ResearchProject.find(searchFilter)
    .select('projectId title description.abstract classification status health createdAt')
    .populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName')
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);

  res.json({
    success: true,
    message: 'Search completed successfully',
    data: projects,
    count: projects.length
  });
});

/**
 * Export research projects
 * @route GET /api/v1/nose/export/projects
 */
const exportProjects = handleAsync(async (req, res) => {
  const { format = 'json', filters = {} } = req.query;

  const filter = buildFilter(filters);
  const projects = await ResearchProject.find(filter)
    .populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName email')
    .sort({ createdAt: -1 });

  if (format === 'csv') {
    // Convert to CSV format
    const csvData = projects.map(project => ({
      projectId: project.projectId,
      title: project.title,
      status: project.status,
      researchType: project.classification.researchType,
      fieldOfStudy: project.classification.fieldOfStudy.primary,
      principalInvestigator: `${project.team.principalInvestigator.userId.profile.firstName} ${project.team.principalInvestigator.userId.profile.lastName}`,
      startDate: project.timeline.startDate,
      expectedEndDate: project.timeline.expectedEndDate,
      budget: project.funding.totalBudget.amount,
      progress: project.calculateProgress(),
      teamSize: project.teamSize,
      publicationsCount: project.publications.length
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="research_projects_${new Date().toISOString().split('T')[0]}.csv"`);
    
    // Simple CSV conversion (in production, use a proper CSV library)
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    res.send(csv);
  } else {
    res.json({
      success: true,
      message: 'Projects exported successfully',
      data: projects,
      exportDate: new Date().toISOString(),
      count: projects.length
    });
  }

  logger.info('Research projects exported', {
    userId: req.user.id,
    format,
    count: projects.length,
    filters
  });
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getProjectHealth,
  searchProjects,
  exportProjects
};