/**
 * NOSE Research Project Validation Schemas
 * Express-validator schemas for research project operations
 */

const { body, param, query } = require('express-validator');

/**
 * Validation for creating a research project
 */
const createProject = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Project title must be between 5 and 200 characters'),

  body('description.abstract')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Project abstract must be between 50 and 2000 characters'),

  body('description.objectives')
    .isArray({ min: 1 })
    .withMessage('At least one objective is required'),

  body('description.objectives.*')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Each objective must be between 10 and 500 characters'),

  body('classification.researchType')
    .isIn(['basic', 'applied', 'experimental', 'theoretical', 'mixed'])
    .withMessage('Invalid research type'),

  body('classification.fieldOfStudy.primary')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Primary field of study is required'),

  body('classification.subjects')
    .optional()
    .isArray()
    .withMessage('Subjects must be an array'),

  body('classification.subjects.*')
    .optional()
    .isIn([
      'computer_science', 'mathematics', 'physics', 'chemistry', 'biology',
      'medicine', 'engineering', 'psychology', 'sociology', 'economics',
      'philosophy', 'literature', 'history', 'other'
    ])
    .withMessage('Invalid subject'),

  body('classification.keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),

  body('classification.keywords.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each keyword must be between 2 and 50 characters'),

  body('timeline.startDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid start date is required'),

  body('timeline.expectedEndDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid expected end date is required')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.timeline.startDate)) {
        throw new Error('Expected end date must be after start date');
      }
      return true;
    }),

  body('timeline.milestones')
    .optional()
    .isArray()
    .withMessage('Milestones must be an array'),

  body('timeline.milestones.*.title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Milestone title must be between 5 and 100 characters'),

  body('timeline.milestones.*.targetDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid milestone target date is required'),

  body('funding.totalBudget.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget amount must be a positive number'),

  body('funding.totalBudget.currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),

  body('funding.sources')
    .optional()
    .isArray()
    .withMessage('Funding sources must be an array'),

  body('funding.sources.*.organization')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Funding organization name is required'),

  body('funding.sources.*.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Funding amount must be a positive number'),

  body('classification.ethicsApprovalRequired')
    .optional()
    .isBoolean()
    .withMessage('Ethics approval required must be a boolean'),

  body('classification.ethicsApprovalNumber')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Ethics approval number must be between 3 and 50 characters')
];

/**
 * Validation for updating a research project
 */
const updateProject = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Project title must be between 5 and 200 characters'),

  body('description.abstract')
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Project abstract must be between 50 and 2000 characters'),

  body('description.methodology')
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage('Methodology cannot exceed 3000 characters'),

  body('status')
    .optional()
    .isIn(['planning', 'active', 'on_hold', 'completed', 'cancelled', 'suspended'])
    .withMessage('Invalid project status'),

  body('timeline.actualEndDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid actual end date is required'),

  body('funding.expenses')
    .optional()
    .isArray()
    .withMessage('Expenses must be an array'),

  body('funding.expenses.*.category')
    .optional()
    .isIn(['personnel', 'equipment', 'supplies', 'travel', 'other'])
    .withMessage('Invalid expense category'),

  body('funding.expenses.*.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Expense amount must be a positive number'),

  body('funding.expenses.*.description')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Expense description must be between 5 and 200 characters')
];

/**
 * Validation for updating project status
 */
const updateProjectStatus = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  body('status')
    .isIn(['planning', 'active', 'on_hold', 'completed', 'cancelled', 'suspended'])
    .withMessage('Invalid project status'),

  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Status change reason must be between 10 and 500 characters')
];

/**
 * Validation for project ID parameter
 */
const validateProjectId = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format')
];

/**
 * Validation for project search and filtering
 */
const searchProjects = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),

  query('status')
    .optional()
    .isIn(['planning', 'active', 'on_hold', 'completed', 'cancelled', 'suspended'])
    .withMessage('Invalid status filter'),

  query('researchType')
    .optional()
    .isIn(['basic', 'applied', 'experimental', 'theoretical', 'mixed'])
    .withMessage('Invalid research type filter'),

  query('fieldOfStudy')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Invalid field of study filter'),

  query('healthStatus')
    .optional()
    .isIn(['green', 'yellow', 'red'])
    .withMessage('Invalid health status filter'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'startDate', 'expectedEndDate'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

/**
 * Validation for adding milestones
 */
const addMilestone = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Milestone title must be between 5 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Milestone description cannot exceed 500 characters'),

  body('targetDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid target date is required'),

  body('deliverables')
    .optional()
    .isArray()
    .withMessage('Deliverables must be an array'),

  body('deliverables.*')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Each deliverable must be between 5 and 200 characters')
];

/**
 * Validation for risk management
 */
const addRisk = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  body('category')
    .isIn(['technical', 'financial', 'timeline', 'personnel', 'ethical', 'regulatory'])
    .withMessage('Invalid risk category'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Risk description must be between 10 and 500 characters'),

  body('probability')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Risk probability must be low, medium, or high'),

  body('impact')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Risk impact must be low, medium, or high'),

  body('mitigationStrategy')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mitigation strategy must be between 10 and 1000 characters')
];

/**
 * Validation for data export
 */
const exportValidation = [
  query('format')
    .optional()
    .isIn(['json', 'csv', 'xlsx'])
    .withMessage('Export format must be json, csv, or xlsx'),

  query('dateFrom')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid from date is required'),

  query('dateTo')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid to date is required')
    .custom((value, { req }) => {
      if (req.query.dateFrom && new Date(value) <= new Date(req.query.dateFrom)) {
        throw new Error('To date must be after from date');
      }
      return true;
    })
];

module.exports = {
  createProject,
  updateProject,
  updateProjectStatus,
  validateProjectId,
  searchProjects,
  addMilestone,
  addRisk,
  exportValidation
};