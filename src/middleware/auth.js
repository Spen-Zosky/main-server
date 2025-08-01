/**
 * Authentication and Authorization Middleware
 * JWT token validation and framework permission checks
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ApiError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Authenticate JWT token middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new ApiError(401, 'Access token is required');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new ApiError(401, 'Invalid token - user not found');
    }

    // Check if user account is active
    if (user.status === 'suspended' || user.status === 'deactivated') {
      throw new ApiError(401, 'Account is suspended or deactivated');
    }

    // Check account lockout
    if (user.security.accountLocked) {
      const lockUntil = new Date(user.security.lockUntil);
      if (lockUntil > new Date()) {
        const remainingTime = Math.ceil((lockUntil - new Date()) / (1000 * 60)); // minutes
        throw new ApiError(423, `Account is locked. Try again in ${remainingTime} minutes`);
      } else {
        // Unlock account if lock period has expired
        user.security.accountLocked = false;
        user.security.lockUntil = null;
        user.security.loginAttempts = 0;
        await user.save();
      }
    }

    // Attach user to request
    req.user = user;
    
    logger.auth(`User authenticated: ${user.email}`, {
      userId: user._id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.security(`Invalid JWT token attempt from ${req.ip}`, {
        error: error.message,
        userAgent: req.get('User-Agent')
      });
      return next(new ApiError(401, 'Invalid token'));
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.security(`Expired JWT token attempt from ${req.ip}`, {
        userAgent: req.get('User-Agent')
      });
      return next(new ApiError(401, 'Token expired'));
    }

    next(error);
  }
};

/**
 * Check if user has required framework permission
 */
const requireFrameworkPermission = (frameworkName) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const user = req.user;
      let hasPermission = false;

      // Check framework-specific permissions
      switch (frameworkName.toUpperCase()) {
        case 'AI-HRMS':
        case 'HRMS':
          hasPermission = user.frameworks?.aiHrms?.enabled && 
                         user.frameworks.aiHrms.permissions?.length > 0;
          break;
          
        case 'NOSE':
        case 'NOSE-RESEARCH':
          hasPermission = user.frameworks?.nose?.enabled && 
                         user.frameworks.nose.permissions?.length > 0;
          break;
          
        case 'WEB-HUNTER':
          hasPermission = user.frameworks?.webHunter?.enabled && 
                         user.frameworks.webHunter.permissions?.length > 0;
          break;
          
        default:
          throw new ApiError(400, 'Invalid framework name');
      }

      if (!hasPermission) {
        logger.security(`Access denied for framework ${frameworkName}`, {
          userId: user._id,
          email: user.email,
          framework: frameworkName,
          ip: req.ip
        });
        
        throw new ApiError(403, `Access denied for ${frameworkName} framework`);
      }

      logger.auth(`Framework access granted: ${frameworkName}`, {
        userId: user._id,
        framework: frameworkName
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user has specific permission within a framework
 */
const requirePermission = (frameworkName, permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const user = req.user;
      let hasPermission = false;

      // Check framework-specific permissions
      switch (frameworkName.toUpperCase()) {
        case 'AI-HRMS':
        case 'HRMS':
          hasPermission = user.frameworks?.aiHrms?.enabled && 
                         user.frameworks.aiHrms.permissions?.includes(permission);
          break;
          
        case 'NOSE':
        case 'NOSE-RESEARCH':
          hasPermission = user.frameworks?.nose?.enabled && 
                         user.frameworks.nose.permissions?.includes(permission);
          break;
          
        case 'WEB-HUNTER':
          hasPermission = user.frameworks?.webHunter?.enabled && 
                         user.frameworks.webHunter.permissions?.includes(permission);
          break;
          
        default:
          throw new ApiError(400, 'Invalid framework name');
      }

      if (!hasPermission) {
        logger.security(`Permission denied: ${permission} in ${frameworkName}`, {
          userId: user._id,
          email: user.email,
          framework: frameworkName,
          permission,
          ip: req.ip
        });
        
        throw new ApiError(403, `Permission denied: ${permission}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user is admin (super_admin role in any framework)
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const user = req.user;
    const isAdmin = user.frameworks?.aiHrms?.role === 'super_admin' ||
                   user.frameworks?.nose?.role === 'admin' ||
                   user.frameworks?.webHunter?.role === 'admin';

    if (!isAdmin) {
      logger.security(`Admin access denied`, {
        userId: user._id,
        email: user.email,
        ip: req.ip
      });
      
      throw new ApiError(403, 'Admin privileges required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - don't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.status === 'active') {
      req.user = user;
    }

    next();
  } catch (error) {
    // Don't fail on authentication errors for optional auth
    next();
  }
};

/**
 * Rate limiting by user ID
 */
const userRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (userRequests.has(userId)) {
      const requests = userRequests.get(userId).filter(time => time > windowStart);
      userRequests.set(userId, requests);
    } else {
      userRequests.set(userId, []);
    }

    const userRequestCount = userRequests.get(userId).length;

    if (userRequestCount >= max) {
      logger.security(`Rate limit exceeded for user`, {
        userId,
        requestCount: userRequestCount,
        limit: max,
        ip: req.ip
      });
      
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: `Rate limit exceeded. Maximum ${max} requests per ${windowMs / 1000} seconds.`,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    userRequests.get(userId).push(now);
    next();
  };
};

module.exports = {
  authenticateToken,
  requireFrameworkPermission,
  requirePermission,
  requireAdmin,
  optionalAuth,
  userRateLimit
};