/**
 * Validation Middleware
 * Express-validator integration and request validation
 */

const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Middleware to handle validation results
 */
const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    if (Array.isArray(validations)) {
      await Promise.all(validations.map(validation => validation.run(req)));
    }

    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    logger.security(`Validation failed for ${req.method} ${req.path}`, {
      errors: formattedErrors,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    });

    // Create error response
    const error = new ApiError(400, 'Validation failed', formattedErrors);
    next(error);
  };
};

/**
 * Sanitize request data
 */
const sanitizeRequest = (req, res, next) => {
  // Remove any potentially dangerous characters from string fields
  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
      // Remove script tags, SQL injection patterns, etc.
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * Validate MongoDB ObjectId parameters
 */
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return next(new ApiError(400, `${paramName} parameter is required`));
    }

    // Check if it's a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, `Invalid ${paramName} format`));
    }

    next();
  };
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  // Validate page
  const pageNum = parseInt(page);
  if (isNaN(pageNum) || pageNum < 1) {
    return next(new ApiError(400, 'Page must be a positive integer'));
  }

  // Validate limit
  const limitNum = parseInt(limit);
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return next(new ApiError(400, 'Limit must be between 1 and 100'));
  }

  // Set validated values
  req.query.page = pageNum;
  req.query.limit = limitNum;

  next();
};

/**
 * Validate sort parameters
 */
const validateSort = (allowedFields = []) => {
  return (req, res, next) => {
    const { sortBy, sortOrder } = req.query;

    if (sortBy) {
      if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
        return next(new ApiError(400, `Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`));
      }
    }

    if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
      return next(new ApiError(400, 'Sort order must be "asc" or "desc"'));
    }

    next();
  };
};

/**
 * Validate date range parameters
 */
const validateDateRange = (req, res, next) => {
  const { dateFrom, dateTo } = req.query;

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    if (isNaN(fromDate.getTime())) {
      return next(new ApiError(400, 'Invalid dateFrom format. Use YYYY-MM-DD or ISO string'));
    }
    req.query.dateFrom = fromDate;
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    if (isNaN(toDate.getTime())) {
      return next(new ApiError(400, 'Invalid dateTo format. Use YYYY-MM-DD or ISO string'));
    }
    req.query.dateTo = toDate;
  }

  if (dateFrom && dateTo && req.query.dateFrom >= req.query.dateTo) {
    return next(new ApiError(400, 'dateFrom must be before dateTo'));
  }

  next();
};

/**
 * Validate file upload parameters
 */
const validateFileUpload = (options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    required = false
  } = options;

  return (req, res, next) => {
    if (!req.file && required) {
      return next(new ApiError(400, 'File upload is required'));
    }

    if (req.file) {
      // Check file size
      if (req.file.size > maxSize) {
        return next(new ApiError(400, `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`));
      }

      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(req.file.mimetype)) {
        return next(new ApiError(400, `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
      }

      logger.info('File upload validated', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        userId: req.user?.id
      });
    }

    next();
  };
};

/**
 * Validate JSON structure
 */
const validateJsonStructure = (schema) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return next(new ApiError(400, 'Request body must be valid JSON'));
    }

    // Basic schema validation
    for (let field of schema.required || []) {
      if (!(field in req.body)) {
        return next(new ApiError(400, `Required field missing: ${field}`));
      }
    }

    // Type validation
    if (schema.fields) {
      for (let [field, expectedType] of Object.entries(schema.fields)) {
        if (field in req.body) {
          const actualType = typeof req.body[field];
          if (actualType !== expectedType) {
            return next(new ApiError(400, `Field '${field}' must be of type ${expectedType}, got ${actualType}`));
          }
        }
      }
    }

    next();
  };
};

/**
 * Request logging for debugging
 */
const logRequest = (req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  next();
};

module.exports = {
  validateRequest,
  sanitizeRequest,
  validateObjectId,
  validatePagination,
  validateSort,
  validateDateRange,
  validateFileUpload,
  validateJsonStructure,
  logRequest
};