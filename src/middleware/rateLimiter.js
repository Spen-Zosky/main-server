/**
 * Rate Limiting Middleware for Web-Hunter Framework
 * Provides configurable rate limiting for API endpoints
 */

const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

/**
 * Create rate limiter with configurable options
 * @param {Object} options - Rate limiting options
 * @returns {Function} Express middleware
 */
function rateLimiter(options = {}) {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(options.windowMs / 1000) || 900
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Use MongoDB store for distributed rate limiting
    store: process.env.MONGODB_URI ? new MongoStore({
      uri: process.env.MONGODB_URI,
      collectionName: 'rateLimitStore',
      expireTimeMs: options.windowMs || 15 * 60 * 1000
    }) : undefined,
    // Skip successful requests (optional)
    skipSuccessfulRequests: false,
    // Skip failed requests (optional)
    skipFailedRequests: false,
    // Use default key generator (handles IPv6 properly)
    // Custom handler for when limit is exceeded
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: options.message || 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil((options.windowMs || 15 * 60 * 1000) / 1000),
        timestamp: new Date().toISOString()
      });
    }
  };

  // Merge provided options with defaults
  const config = { ...defaultOptions, ...options };

  return rateLimit(config);
}

/**
 * Predefined rate limiters for different use cases
 */
const rateLimiters = {
  // Strict rate limiting for authentication endpoints
  auth: rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts, please try again later.'
  }),

  // Standard rate limiting for API endpoints
  api: rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: 'API request limit exceeded, please try again later.'
  }),

  // Lenient rate limiting for public endpoints
  public: rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // 2000 requests per window
    message: 'Request limit exceeded, please try again later.'
  }),

  // Strict rate limiting for data-intensive operations
  dataIntensive: rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 requests per hour
    message: 'Data operation limit exceeded, please try again later.'
  }),

  // Rate limiting for WebHunter framework endpoints
  webHunter: rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: 'Web-Hunter API request limit exceeded, please try again later.'
  })
};

module.exports = {
  rateLimiter,
  rateLimiters
};