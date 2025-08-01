/**
 * AI-HRMS Framework Routes
 * Human Resources Management System API endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers
const employeeController = require('../../controllers/hrms/employeeController');
const analyticsController = require('../../controllers/hrms/analyticsController');

// Import middleware
const { authenticateToken, requireFrameworkPermission } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validation');

// Import validation schemas
const employeeValidation = require('../../validation/hrms/employeeValidation');

// Apply authentication and framework permission middleware
router.use(authenticateToken);
router.use(requireFrameworkPermission('AI-HRMS'));

// Employee Management Routes
router.route('/employees')
  .get(employeeController.getAllEmployees)
  .post(validateRequest(employeeValidation.createEmployee), employeeController.createEmployee);

router.route('/employees/:employeeId')
  .get(employeeController.getEmployeeById)
  .put(validateRequest(employeeValidation.updateEmployee), employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

// Employee Status Management
router.patch('/employees/:employeeId/status', 
  validateRequest(employeeValidation.updateEmployeeStatus), 
  employeeController.updateEmployeeStatus
);

// Analytics and Reporting Routes
router.get('/analytics/dashboard', analyticsController.getDashboard);
router.get('/analytics/headcount', analyticsController.getHeadcountReport);
router.get('/analytics/turnover', analyticsController.getTurnoverAnalytics);
router.get('/analytics/departments', analyticsController.getDepartmentAnalytics);
router.get('/analytics/performance', analyticsController.getPerformanceMetrics);

// Search and Export Routes
router.get('/search/employees', employeeController.searchEmployees);
router.get('/export/employees', employeeController.exportEmployees);

module.exports = router;