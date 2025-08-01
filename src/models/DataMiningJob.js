const mongoose = require('mongoose');

/**
 * DataMiningJob Schema - Web-Hunter Framework
 * Comprehensive data mining and analytics job management system
 */
const DataMiningJobSchema = new mongoose.Schema({
  // Job Identification
  jobId: {
    type: String,
    required: [true, 'Job ID is required'],
    unique: true,
    uppercase: true,
    match: [/^JOB[0-9]{8}$/, 'Job ID must be in format JOB00000000']
  },
  
  name: {
    type: String,
    required: [true, 'Job name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Job Configuration
  configuration: {
    // Data Mining Type
    miningType: {
      type: String,
      enum: ['web_scraping', 'api_extraction', 'database_mining', 'file_processing', 'stream_processing'],
      required: [true, 'Mining type is required']
    },
    
    // Data Sources
    dataSources: [{
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ['website', 'api', 'database', 'file', 'stream'],
        required: true
      },
      
      // Connection Details
      connection: {
        url: String,
        headers: [{
          key: String,
          value: String
        }],
        authentication: {
          type: {
            type: String,
            enum: ['none', 'basic', 'bearer', 'api_key', 'oauth2']
          },
          credentials: mongoose.Schema.Types.Mixed, // Encrypted storage
          tokenUrl: String,
          refreshUrl: String
        },
        
        // Database specific
        host: String,
        port: Number,
        database: String,
        collection: String,
        query: String,
        
        // File specific
        filePath: String,
        fileFormat: {
          type: String,
          enum: ['csv', 'json', 'xml', 'excel', 'pdf', 'text']
        },
        
        // Web scraping specific
        selectors: [{
          name: String,
          selector: String,
          attribute: String,
          dataType: {
            type: String,
            enum: ['text', 'number', 'date', 'url', 'email']
          }
        }],
        
        // Rate limiting and politeness
        rateLimit: {
          requests: { type: Number, default: 10 },
          per: { type: String, default: 'minute' }, // second, minute, hour
          delay: { type: Number, default: 1000 } // milliseconds
        },
        
        userAgent: { type: String, default: 'Web-Hunter Bot 1.0' },
        respectRobotsTxt: { type: Boolean, default: true }
      },
      
      // Data Validation Rules
      validation: {
        required: [String],
        dataTypes: [{
          field: String,
          type: {
            type: String,
            enum: ['string', 'number', 'date', 'boolean', 'array', 'object']
          },
          format: String, // regex or format string
          range: {
            min: mongoose.Schema.Types.Mixed,
            max: mongoose.Schema.Types.Mixed
          }
        }],
        uniqueFields: [String],
        customRules: [String] // JavaScript validation functions
      },
      
      status: {
        type: String,
        enum: ['active', 'inactive', 'error'],
        default: 'active'
      }
    }],
    
    // Data Processing Pipeline
    processing: {
      // Data Transformation
      transformations: [{
        name: String,
        type: {
          type: String,
          enum: ['filter', 'map', 'aggregate', 'join', 'clean', 'enrich', 'normalize']
        },
        parameters: mongoose.Schema.Types.Mixed,
        order: { type: Number, required: true }
      }],
      
      // Data Cleaning Rules
      cleaning: {
        removeEmptyRecords: { type: Boolean, default: true },
        removeDuplicates: { type: Boolean, default: true },
        trimWhitespace: { type: Boolean, default: true },
        normalizeText: { type: Boolean, default: false },
        handleMissingValues: {
          strategy: {
            type: String,
            enum: ['remove', 'default', 'interpolate', 'ignore'],
            default: 'ignore'
          },
          defaultValues: mongoose.Schema.Types.Mixed
        }
      },
      
      // Data Enrichment
      enrichment: [{
        name: String,
        type: {
          type: String,
          enum: ['geocoding', 'sentiment_analysis', 'entity_extraction', 'classification', 'translation']
        },
        apiEndpoint: String,
        apiKey: String,
        parameters: mongoose.Schema.Types.Mixed,
        enabled: { type: Boolean, default: false }
      }],
      
      // Machine Learning Pipeline
      mlPipeline: {
        enabled: { type: Boolean, default: false },
        models: [{
          name: String,
          type: {
            type: String,
            enum: ['classification', 'regression', 'clustering', 'anomaly_detection', 'recommendation']
          },
          algorithm: String,
          parameters: mongoose.Schema.Types.Mixed,
          trainedModel: String, // Path to trained model
          accuracy: Number,
          lastTrained: Date
        }],
        features: [{
          name: String,
          type: String,
          transformation: String
        }]
      }
    },
    
    // Output Configuration
    output: {
      // Storage Destinations
      destinations: [{
        name: String,
        type: {
          type: String,
          enum: ['database', 'file', 'api', 'stream', 'email'],
          required: true
        },
        
        // Database storage
        database: {
          connection: String,
          collection: String,
          upsert: { type: Boolean, default: false },
          batchSize: { type: Number, default: 1000 }
        },
        
        // File storage
        file: {
          path: String,
          format: {
            type: String,
            enum: ['json', 'csv', 'xml', 'excel', 'parquet']
          },
          compression: {
            type: String,
            enum: ['none', 'gzip', 'zip']
          }
        },
        
        // API destination
        api: {
          endpoint: String,
          method: { type: String, default: 'POST' },
          headers: mongoose.Schema.Types.Mixed,
          authentication: mongoose.Schema.Types.Mixed
        },
        
        // Email notification
        email: {
          recipients: [String],
          subject: String,
          template: String,
          attachData: { type: Boolean, default: false }
        },
        
        enabled: { type: Boolean, default: true }
      }],
      
      // Data Format
      format: {
        structure: {
          type: String,
          enum: ['flat', 'nested', 'normalized'],
          default: 'flat'
        },
        fields: [{
          name: String,
          alias: String,
          dataType: String,
          format: String
        }],
        metadata: {
          includeTimestamp: { type: Boolean, default: true },
          includeSource: { type: Boolean, default: true },
          includeJobId: { type: Boolean, default: true }
        }
      }
    },
    
    // Scheduling
    schedule: {
      type: {
        type: String,
        enum: ['manual', 'interval', 'cron', 'event_driven'],
        default: 'manual'
      },
      
      // Interval scheduling
      interval: {
        value: Number,
        unit: {
          type: String,
          enum: ['minutes', 'hours', 'days', 'weeks', 'months']
        }
      },
      
      // Cron scheduling
      cronExpression: String,
      timezone: { type: String, default: 'UTC' },
      
      // Event-driven triggers
      triggers: [{
        type: {
          type: String,
          enum: ['file_change', 'api_webhook', 'database_change', 'time_condition']
        },
        condition: mongoose.Schema.Types.Mixed,
        enabled: { type: Boolean, default: true }
      }],
      
      // Execution limits
      maxRuns: Number,
      startDate: Date,
      endDate: Date,
      enabled: { type: Boolean, default: true }
    }
  },
  
  // Execution Management
  execution: {
    // Current Status
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed', 'cancelled'],
      default: 'draft'
    },
    
    // Execution History
    runs: [{
      runId: { type: String, required: true },
      startTime: { type: Date, required: true },
      endTime: Date,
      duration: Number, // milliseconds
      
      status: {
        type: String,
        enum: ['running', 'completed', 'failed', 'cancelled'],
        required: true
      },
      
      // Performance Metrics
      metrics: {
        recordsProcessed: { type: Number, default: 0 },
        recordsSuccessful: { type: Number, default: 0 },
        recordsFailed: { type: Number, default: 0 },
        dataVolume: { type: Number, default: 0 }, // bytes
        
        // Source-specific metrics
        pagesScraped: Number,
        apiCallsMade: Number,
        filesProcessed: Number,
        
        // Performance metrics
        avgProcessingTime: Number, // ms per record
        memoryUsage: Number, // MB
        cpuUsage: Number, // percentage
        
        // Error metrics
        errors: [{
          type: String,
          message: String,
          count: { type: Number, default: 1 },
          lastOccurrence: { type: Date, default: Date.now }
        }]
      },
      
      // Output Information
      outputs: [{
        destination: String,
        recordCount: Number,
        fileSize: Number,
        location: String,
        checksum: String
      }],
      
      // Logs and Debug Info
      logs: [{
        level: {
          type: String,
          enum: ['debug', 'info', 'warn', 'error']
        },
        message: String,
        timestamp: { type: Date, default: Date.now },
        source: String,
        details: mongoose.Schema.Types.Mixed
      }],
      
      // Resource Usage
      resources: {
        maxMemory: Number,
        avgCpu: Number,
        networkIO: Number,
        diskIO: Number
      },
      
      triggerType: String,
      triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    
    // Next Scheduled Run
    nextRun: Date,
    lastRun: Date,
    
    // Execution Statistics
    statistics: {
      totalRuns: { type: Number, default: 0 },
      successfulRuns: { type: Number, default: 0 },
      failedRuns: { type: Number, default: 0 },
      totalRecordsProcessed: { type: Number, default: 0 },
      totalDataVolume: { type: Number, default: 0 },
      avgExecutionTime: Number,
      lastSuccessfulRun: Date,
      lastFailedRun: Date
    }
  },
  
  // Data Quality and Monitoring
  dataQuality: {
    // Quality Metrics
    metrics: {
      completeness: { type: Number, min: 0, max: 100 }, // percentage
      accuracy: { type: Number, min: 0, max: 100 },
      consistency: { type: Number, min: 0, max: 100 },
      validity: { type: Number, min: 0, max: 100 },
      freshness: { type: Number, min: 0, max: 100 },
      lastCalculated: Date
    },
    
    // Quality Rules
    rules: [{
      name: String,
      description: String,
      rule: String, // JavaScript expression
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      enabled: { type: Boolean, default: true }
    }],
    
    // Alerts and Notifications
    alerts: [{
      type: {
        type: String,
        enum: ['quality_threshold', 'execution_failure', 'data_anomaly', 'resource_limit']
      },
      condition: String,
      threshold: Number,
      recipients: [String],
      enabled: { type: Boolean, default: true },
      lastTriggered: Date
    }]
  },
  
  // Access Control and Security
  security: {
    // Access Control
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required']
    },
    
    collaborators: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permissions: [{
        type: String,
        enum: ['view', 'edit', 'execute', 'delete', 'manage_access']
      }],
      addedDate: { type: Date, default: Date.now },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    
    // Data Classification
    dataClassification: {
      type: String,
      enum: ['public', 'internal', 'confidential', 'restricted'],
      default: 'internal'
    },
    
    // Compliance and Governance
    compliance: {
      gdprCompliant: { type: Boolean, default: false },
      dataRetentionDays: { type: Number, default: 365 },
      anonymizeData: { type: Boolean, default: false },
      encryptAtRest: { type: Boolean, default: true },
      auditLog: { type: Boolean, default: true }
    }
  },
  
  // Analytics and Insights
  analytics: {
    // Usage Analytics
    usage: {
      views: { type: Number, default: 0 },
      executions: { type: Number, default: 0 },
      dataExports: { type: Number, default: 0 },
      apiCalls: { type: Number, default: 0 },
      lastAccessed: Date
    },
    
    // Performance Trends
    trends: {
      executionTimes: [Number],
      errorRates: [Number],
      dataVolumes: [Number],
      qualityScores: [Number],
      timestamps: [Date]
    },
    
    // Cost Analysis
    costs: {
      computeCost: { type: Number, default: 0 },
      storageCost: { type: Number, default: 0 },
      apiCosts: { type: Number, default: 0 },
      totalCost: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      lastCalculated: Date
    }
  },
  
  // System Metadata
  metadata: {
    tags: [String],
    category: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    // Technical Metadata
    version: { type: String, default: '1.0.0' },
    framework: { type: String, default: 'web-hunter' },
    environment: {
      type: String,
      enum: ['development', 'testing', 'staging', 'production'],
      default: 'development'
    },
    
    // Business Metadata
    businessPurpose: String,
    dataOwner: String,
    contactInfo: {
      email: String,
      phone: String
    }
  },
  
  // Audit Trail
  audit: {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastModified: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    
    // Change History
    changes: [{
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      changedAt: { type: Date, default: Date.now },
      reason: String
    }]
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for Performance
DataMiningJobSchema.index({ jobId: 1 });
DataMiningJobSchema.index({ 'security.owner': 1 });
DataMiningJobSchema.index({ 'execution.status': 1 });
DataMiningJobSchema.index({ 'configuration.miningType': 1 });
DataMiningJobSchema.index({ 'execution.nextRun': 1 });
DataMiningJobSchema.index({ 'metadata.tags': 1 });

// Compound indexes
DataMiningJobSchema.index({ 'security.owner': 1, 'execution.status': 1 });
DataMiningJobSchema.index({ 'configuration.miningType': 1, 'execution.status': 1 });
DataMiningJobSchema.index({ 'execution.nextRun': 1, 'configuration.schedule.enabled': 1 });

// Text index for search
DataMiningJobSchema.index({
  name: 'text',
  description: 'text',
  'metadata.tags': 'text'
});

// Virtual for success rate
DataMiningJobSchema.virtual('successRate').get(function() {
  const stats = this.execution.statistics;
  if (stats.totalRuns === 0) return 0;
  return Math.round((stats.successfulRuns / stats.totalRuns) * 100);
});

// Virtual for last run status
DataMiningJobSchema.virtual('lastRunStatus').get(function() {
  if (!this.execution.runs.length) return 'never_run';
  const lastRun = this.execution.runs[this.execution.runs.length - 1];
  return lastRun.status;
});

// Virtual for average data quality
DataMiningJobSchema.virtual('avgDataQuality').get(function() {
  const metrics = this.dataQuality.metrics;
  if (!metrics.completeness) return 0;
  
  const scores = [
    metrics.completeness || 0,
    metrics.accuracy || 0,
    metrics.consistency || 0,
    metrics.validity || 0,
    metrics.freshness || 0
  ];
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
});

// Pre-save middleware for audit trail
DataMiningJobSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.audit.lastModified = new Date();
    this.audit.version += 1;
  }
  next();
});

// Instance Methods

/**
 * Check if job is currently running
 * @returns {boolean} - True if job is running
 */
DataMiningJobSchema.methods.isRunning = function() {
  return this.execution.status === 'running';
};

/**
 * Check if job is scheduled for next run
 * @returns {boolean} - True if job has next run scheduled
 */
DataMiningJobSchema.methods.hasNextRun = function() {
  return this.execution.nextRun && new Date(this.execution.nextRun) > new Date();
};

/**
 * Get latest run information
 * @returns {Object|null} - Latest run object or null
 */
DataMiningJobSchema.methods.getLatestRun = function() {
  if (!this.execution.runs.length) return null;
  return this.execution.runs[this.execution.runs.length - 1];
};

/**
 * Add execution run
 * @param {Object} runData - Run data
 * @returns {Promise} - Saved job
 */
DataMiningJobSchema.methods.addRun = function(runData) {
  this.execution.runs.push(runData);
  this.execution.statistics.totalRuns += 1;
  
  if (runData.status === 'completed') {
    this.execution.statistics.successfulRuns += 1;
    this.execution.lastRun = runData.startTime;
  } else if (runData.status === 'failed') {
    this.execution.statistics.failedRuns += 1;
  }
  
  return this.save();
};

/**
 * Check user permissions
 * @param {string} userId - User ID
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
DataMiningJobSchema.methods.hasUserPermission = function(userId, permission) {
  // Owner has all permissions
  if (this.security.owner.toString() === userId) return true;
  
  // Check collaborator permissions
  const collaborator = this.security.collaborators.find(
    c => c.userId.toString() === userId
  );
  
  return collaborator && collaborator.permissions.includes(permission);
};

/**
 * Calculate next run time based on schedule
 * @returns {Date|null} - Next run date or null
 */
DataMiningJobSchema.methods.calculateNextRun = function() {
  if (!this.configuration.schedule.enabled || this.configuration.schedule.type === 'manual') {
    return null;
  }
  
  const now = new Date();
  
  if (this.configuration.schedule.type === 'interval') {
    const interval = this.configuration.schedule.interval;
    const ms = this.convertIntervalToMs(interval.value, interval.unit);
    return new Date(now.getTime() + ms);
  }
  
  // TODO: Implement cron expression parsing
  return null;
};

/**
 * Convert interval to milliseconds
 * @param {number} value - Interval value
 * @param {string} unit - Time unit
 * @returns {number} - Milliseconds
 */
DataMiningJobSchema.methods.convertIntervalToMs = function(value, unit) {
  const conversions = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000
  };
  
  return value * (conversions[unit] || conversions.hours);
};

// Static Methods

/**
 * Find jobs by owner
 * @param {string} userId - Owner user ID
 * @returns {Promise<DataMiningJob[]>} - Array of jobs
 */
DataMiningJobSchema.statics.findByOwner = function(userId) {
  return this.find({ 'security.owner': userId })
    .populate('security.owner', 'profile.firstName profile.lastName email');
};

/**
 * Generate next job ID
 * @returns {Promise<string>} - Next job ID
 */
DataMiningJobSchema.statics.generateJobId = async function() {
  const count = await this.countDocuments();
  const nextNumber = count + 1;
  return `JOB${nextNumber.toString().padStart(8, '0')}`;
};

/**
 * Find jobs ready for execution
 * @returns {Promise<DataMiningJob[]>} - Array of jobs ready to run
 */
DataMiningJobSchema.statics.findReadyForExecution = function() {
  const now = new Date();
  return this.find({
    'execution.status': 'scheduled',
    'execution.nextRun': { $lte: now },
    'configuration.schedule.enabled': true
  });
};

/**
 * Get jobs by mining type
 * @param {string} miningType - Mining type
 * @returns {Promise<DataMiningJob[]>} - Array of jobs
 */
DataMiningJobSchema.statics.findByMiningType = function(miningType) {
  return this.find({ 'configuration.miningType': miningType });
};

module.exports = mongoose.model('DataMiningJob', DataMiningJobSchema);