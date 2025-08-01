/**
 * Winston Logger Configuration
 * Enterprise logging system with multiple transports and formats
 */

const winston = require('winston');
const path = require('path');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston about the colors
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define file format (without colors for file logs)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create transports array
const transports = [
  // Console transport
  new winston.transports.Console({
    format: logFormat
  })
];

// Add file transports in production or if LOG_TO_FILE is set
if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  levels: logLevels,
  format: fileFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false
});

// Create logs directory if it doesn't exist (only if file logging is enabled)
if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
  const fs = require('fs');
  const logsDir = path.join(process.cwd(), 'logs');
  
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

// Add custom methods for different frameworks
logger.hrms = (message, meta = {}) => {
  logger.info(`[AI-HRMS] ${message}`, meta);
};

logger.nose = (message, meta = {}) => {
  logger.info(`[NOSE] ${message}`, meta);
};

logger.webHunter = (message, meta = {}) => {
  logger.info(`[WEB-HUNTER] ${message}`, meta);
};

logger.auth = (message, meta = {}) => {
  logger.info(`[AUTH] ${message}`, meta);
};

logger.api = (message, meta = {}) => {
  logger.info(`[API] ${message}`, meta);
};

logger.db = (message, meta = {}) => {
  logger.info(`[DATABASE] ${message}`, meta);
};

logger.security = (message, meta = {}) => {
  logger.warn(`[SECURITY] ${message}`, meta);
};

// Stream interface for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Log system startup information
logger.startup = () => {
  const env = process.env.NODE_ENV || 'development';
  logger.info('🚀 Logger initialized successfully');
  logger.info(`📊 Environment: ${env}`);
  logger.info(`📝 Log Level: ${logger.level}`);
  logger.info(`💾 File Logging: ${process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true' ? 'enabled' : 'disabled'}`);
};

// Error handling for logger itself
logger.on('error', (error) => {
  console.error('Logger error:', error);
});

module.exports = logger;