/**
 * NOSE Research Framework Routes
 * Academic research project management API endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers
const projectController = require('../../controllers/nose/projectController');
const teamController = require('../../controllers/nose/teamController');
const publicationController = require('../../controllers/nose/publicationController');
const analyticsController = require('../../controllers/nose/analyticsController');

// Import middleware
const { authenticateToken, requireFrameworkPermission } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');

// Import validation schemas
const projectValidation = require('../../validation/nose/projectValidation');
const teamValidation = require('../../validation/nose/teamValidation');
const publicationValidation = require('../../validation/nose/publicationValidation');

// Apply authentication and framework permission middleware
router.use(authenticateToken);
router.use(requireFrameworkPermission('NOSE'));

// Research Project Management Routes
router.route('/projects')
  .get(projectController.getAllProjects)
  .post(validateRequest(projectValidation.createProject), projectController.createProject);

router.route('/projects/:projectId')
  .get(projectController.getProjectById)
  .put(validateRequest(projectValidation.updateProject), projectController.updateProject)
  .delete(projectController.deleteProject);

// Project Status Management
router.patch('/projects/:projectId/status', 
  validateRequest(projectValidation.updateProjectStatus), 
  projectController.updateProjectStatus
);

// Project Health Check
router.get('/projects/:projectId/health', projectController.getProjectHealth);

// Team Management Routes
router.route('/projects/:projectId/team')
  .get(teamController.getTeamMembers)
  .post(validateRequest(teamValidation.addTeamMember), teamController.addTeamMember);

router.route('/projects/:projectId/team/:memberId')
  .put(validateRequest(teamValidation.updateTeamMember), teamController.updateTeamMember)
  .delete(teamController.removeTeamMember);

// Publications Management Routes
router.route('/projects/:projectId/publications')
  .get(publicationController.getPublications)
  .post(validateRequest(publicationValidation.createPublication), publicationController.createPublication);

router.route('/projects/:projectId/publications/:publicationId')
  .get(publicationController.getPublicationById)
  .put(validateRequest(publicationValidation.updatePublication), publicationController.updatePublication)
  .delete(publicationController.deletePublication);

// Analytics and Reporting Routes
router.get('/analytics/dashboard', analyticsController.getDashboard);
router.get('/analytics/projects/overview', analyticsController.getProjectsOverview);
router.get('/analytics/publications/metrics', analyticsController.getPublicationMetrics);
router.get('/analytics/funding/summary', analyticsController.getFundingSummary);
router.get('/analytics/collaboration/network', analyticsController.getCollaborationNetwork);

// Search and Filter Routes
router.get('/search/projects', projectController.searchProjects);
router.get('/search/publications', publicationController.searchPublications);

// Export Routes
router.get('/export/projects', projectController.exportProjects);
router.get('/export/publications', publicationController.exportPublications);

module.exports = router;