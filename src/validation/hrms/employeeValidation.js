/**
 * AI-HRMS Employee Validation Schemas
 * Express-validator schemas for employee operations
 */

const { body, param, query } = require('express-validator');

/**
 * Validation for creating an employee
 */
const createEmployee = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('employment.startDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid start date is required'),

  body('employment.position.title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position title is required and must be between 2 and 100 characters'),

  body('employment.position.level')
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'])
    .withMessage('Invalid position level'),

  body('compensation.salary.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary amount must be a positive number'),

  body('personalInfo.dateOfBirth')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid date of birth is required'),

  body('personalInfo.gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Invalid gender value'),

  body('personalInfo.phoneNumber')
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters')
];

/**
 * Validation for updating an employee
 */
const updateEmployee = [
  param('employeeId')
    .matches(/^EMP[0-9]{6}$/)
    .withMessage('Invalid employee ID format'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('employment.position.title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position title must be between 2 and 100 characters'),

  body('employment.position.level')
    .optional()
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'])
    .withMessage('Invalid position level'),

  body('compensation.salary.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary amount must be a positive number'),

  body('personalInfo.phoneNumber')
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters')
];

/**
 * Validation for updating employee status
 */
const updateEmployeeStatus = [
  param('employeeId')
    .matches(/^EMP[0-9]{6}$/)
    .withMessage('Invalid employee ID format'),

  body('status')
    .isIn(['active', 'inactive', 'terminated', 'on_leave', 'pending'])
    .withMessage('Invalid employee status')
];

module.exports = {
  createEmployee,
  updateEmployee,
  updateEmployeeStatus
};