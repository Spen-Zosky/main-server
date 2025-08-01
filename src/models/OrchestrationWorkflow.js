const mongoose = require('mongoose');

/**
 * OrchestrationWorkflow Schema - Web-Hunter Framework
 * Manages complex multi-provider data orchestration workflows
 * Implements system integrator approach with intelligent routing and failover
 */
const OrchestrationWorkflowSchema = new mongoose.Schema({
  // Workflow Identification
  workflowId: {
    type: String,
    required: [true, 'Workflow ID is required'],
    unique: true,
    uppercase: true,
    match: [/^WF[0-9]{8}$/, 'Workflow ID must be in format WF00000000']
  },
  
  name: {
    type: String,
    required: [true, 'Workflow name is required'],
    trim: true,
    maxlength: [150, 'Name cannot exceed 150 characters']
  },
  
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Workflow Classification
  classification: {
    type: {
      type: String,
      enum: ['data_aggregation', 'cross_validation', 'enrichment_pipeline', 'monitoring_workflow', 'backup_strategy', 'cost_optimization', 'quality_assurance'],
      required: [true, 'Workflow type is required']
    },
    
    complexity: {
      type: String,
      enum: ['simple', 'moderate', 'complex', 'enterprise'],
      default: 'moderate'
    },
    
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    businessFunction: {
      type: String,
      enum: ['research', 'monitoring', 'analytics', 'compliance', 'business_intelligence', 'market_research', 'competitive_analysis'],
      required: [true, 'Business function is required']
    }
  },
  
  // Workflow Configuration
  configuration: {
    // Execution Strategy
    strategy: {
      execution: {
        type: String,
        enum: ['sequential', 'parallel', 'hybrid', 'conditional', 'event_driven'],
        default: 'sequential'
      },
      
      failover: {
        enabled: { type: Boolean, default: true },
        strategy: {
          type: String,
          enum: ['fast_failover', 'circuit_breaker', 'retry_cascade', 'provider_rotation'],
          default: 'fast_failover'
        },
        maxRetries: { type: Number, default: 3 },
        backoffMultiplier: { type: Number, default: 1.5 },
        timeoutMs: { type: Number, default: 30000 }
      },
      
      loadBalancing: {
        enabled: { type: Boolean, default: false },
        algorithm: {
          type: String,
          enum: ['round_robin', 'weighted', 'least_connections', 'response_time', 'cost_optimized'],
          default: 'weighted'
        },
        weights: mongoose.Schema.Types.Mixed
      }
    },
    
    // Data Flow Configuration
    dataFlow: {
      inputSources: [{
        sourceId: { type: String, required: true },
        providerId: { type: String, required: true },
        priority: { type: Number, min: 1, max: 10, default: 5 },
        
        // Source-specific configuration
        config: {
          extractionMethod: String,
          parameters: mongoose.Schema.Types.Mixed,
          filters: mongoose.Schema.Types.Mixed,
          transformations: mongoose.Schema.Types.Mixed
        },
        
        // Data validation rules
        validation: {
          required: { type: Boolean, default: true },
          minRecords: Number,
          maxRecords: Number,
          qualityThreshold: { type: Number, min: 0, max: 100 },
          freshnessHours: Number
        },
        
        // Fallback options
        fallbacks: [{
          sourceId: String,
          providerId: String,
          condition: String, // When to use this fallback
          priority: Number
        }],
        
        status: {
          type: String,
          enum: ['active', 'inactive', 'testing', 'deprecated'],
          default: 'active'
        }
      }],
      
      // Data processing pipeline
      processing: {
        steps: [{
          stepId: { type: String, required: true },
          name: { type: String, required: true },
          type: {
            type: String,
            enum: ['merge', 'deduplicate', 'validate', 'enrich', 'transform', 'filter', 'aggregate', 'normalize', 'custom'],
            required: true
          },
          
          order: { type: Number, required: true },
          
          // Step configuration
          config: {
            parameters: mongoose.Schema.Types.Mixed,
            conditions: mongoose.Schema.Types.Mixed,
            outputFormat: String,
            
            // For merge operations
            mergeStrategy: {
              type: String,
              enum: ['union', 'intersection', 'left_join', 'right_join', 'full_join']
            },
            mergeKeys: [String],
            
            // For validation
            validationRules: [{
              field: String,
              rule: String,
              errorAction: {
                type: String,
                enum: ['skip', 'fail', 'warn', 'default']
              }
            }],
            
            // For enrichment
            enrichmentSources: [{
              sourceId: String,
              providerId: String,
              mapping: mongoose.Schema.Types.Mixed
            }]
          },
          
          // Error handling
          errorHandling: {
            strategy: {
              type: String,
              enum: ['stop', 'skip', 'retry', 'fallback'],
              default: 'retry'
            },
            maxRetries: { type: Number, default: 3 },
            fallbackStep: String
          },
          
          enabled: { type: Boolean, default: true }
        }],
        
        // Global processing settings
        settings: {
          batchSize: { type: Number, default: 1000 },
          maxMemoryMB: { type: Number, default: 512 },
          timeoutMinutes: { type: Number, default: 60 },
          preserveOrder: { type: Boolean, default: false }
        }
      },
      
      // Output configuration
      outputs: [{
        outputId: { type: String, required: true },
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ['database', 'file', 'api', 'stream', 'notification', 'webhook'],
          required: true
        },
        
        // Output destination
        destination: {
          // Database output
          database: {
            connectionString: String,
            collection: String,
            insertStrategy: {
              type: String,
              enum: ['insert', 'upsert', 'replace'],
              default: 'insert'
            },
            batchSize: { type: Number, default: 1000 }
          },
          
          // File output
          file: {
            path: String,
            format: {
              type: String,
              enum: ['json', 'csv', 'xml', 'excel', 'parquet'],
              default: 'json'
            },
            compression: String,
            splitStrategy: String // e.g., "by_size", "by_date"
          },
          
          // API output
          api: {
            endpoint: String,
            method: { type: String, default: 'POST' },
            headers: mongoose.Schema.Types.Mixed,
            authentication: mongoose.Schema.Types.Mixed
          },
          
          // Webhook notification
          webhook: {
            url: String,
            method: { type: String, default: 'POST' },
            headers: mongoose.Schema.Types.Mixed,
            payload: mongoose.Schema.Types.Mixed
          }
        },
        
        // Data formatting
        formatting: {
          fields: [{
            source: String,
            target: String,
            transformation: String
          }],
          metadata: {
            includeTimestamp: { type: Boolean, default: true },
            includeWorkflowId: { type: Boolean, default: true },
            includeSource: { type: Boolean, default: true }
          }
        },
        
        enabled: { type: Boolean, default: true }
      }]
    },
    
    // Scheduling Configuration
    schedule: {
      type: {
        type: String,
        enum: ['manual', 'interval', 'cron', 'event_driven', 'dependency_based'],
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
          enum: ['data_update', 'webhook', 'file_change', 'threshold_breach', 'time_condition', 'dependency_complete']
        },
        condition: mongoose.Schema.Types.Mixed,
        source: String,
        enabled: { type: Boolean, default: true }
      }],
      
      // Dependencies
      dependencies: [{
        workflowId: String,
        condition: {
          type: String,
          enum: ['success', 'completion', 'failure', 'custom'],
          default: 'success'
        },
        timeout: Number // minutes to wait for dependency
      }],
      
      // Execution limits
      limits: {
        maxRuns: Number,
        maxConcurrent: { type: Number, default: 1 },
        startDate: Date,
        endDate: Date,
        enabledDays: [Number], // 0=Sunday, 1=Monday, etc.
        enabledHours: [Number] // 0-23
      },
      
      enabled: { type: Boolean, default: true }
    },
    
    // Quality and Monitoring
    monitoring: {
      // Data quality checks
      qualityChecks: [{
        name: String,
        type: {
          type: String,
          enum: ['completeness', 'accuracy', 'consistency', 'validity', 'freshness', 'uniqueness']
        },
        threshold: { type: Number, min: 0, max: 100 },
        action: {
          type: String,
          enum: ['warn', 'fail', 'retry', 'skip'],
          default: 'warn'
        },
        enabled: { type: Boolean, default: true }
      }],
      
      // Performance monitoring
      performance: {
        maxExecutionTime: Number, // minutes
        maxMemoryUsage: Number, // MB
        maxCpuUsage: Number, // percentage
        alertThresholds: {
          executionTime: Number,
          errorRate: Number,
          dataQuality: Number
        }
      },
      
      // Alerts and notifications
      alerts: [{
        name: String,
        condition: String,
        severity: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium'
        },
        recipients: [String],
        channels: [{
          type: String,
          enum: ['email', 'slack', 'webhook', 'sms']
        }],
        enabled: { type: Boolean, default: true }
      }]
    }
  },
  
  // Execution Status and History
  execution: {
    // Current status
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed', 'cancelled'],
      default: 'draft'
    },
    
    // Current execution details
    currentExecution: {
      executionId: String,
      startTime: Date,
      estimatedEndTime: Date,
      currentStep: String,
      progress: { type: Number, min: 0, max: 100, default: 0 },
      
      // Real-time metrics
      metrics: {
        recordsProcessed: { type: Number, default: 0 },
        recordsSuccessful: { type: Number, default: 0 },
        recordsFailed: { type: Number, default: 0 },
        currentMemoryUsage: Number,
        currentCpuUsage: Number,
        averageProcessingRate: Number // records per second
      },
      
      // Step execution details
      stepStatus: [{
        stepId: String,
        stepName: String,
        status: String,
        startTime: Date,
        endTime: Date,
        recordsProcessed: Number,
        errors: [String]
      }]
    },
    
    // Execution history
    history: [{
      executionId: { type: String, required: true },
      startTime: { type: Date, required: true },
      endTime: Date,
      duration: Number, // milliseconds
      
      status: {
        type: String,
        enum: ['completed', 'failed', 'cancelled'],
        required: true
      },
      
      trigger: {
        type: String,
        source: String,
        details: mongoose.Schema.Types.Mixed
      },
      
      // Performance metrics
      metrics: {
        totalRecordsProcessed: { type: Number, default: 0 },
        totalRecordsSuccessful: { type: Number, default: 0 },
        totalRecordsFailed: { type: Number, default: 0 },
        dataVolumeProcessed: { type: Number, default: 0 }, // bytes
        
        // Resource usage
        peakMemoryUsage: Number, // MB
        avgCpuUsage: Number, // percentage
        totalApiCalls: Number,
        totalCost: Number,
        
        // Quality metrics
        dataQualityScore: { type: Number, min: 0, max: 100 },
        completenessScore: { type: Number, min: 0, max: 100 },
        accuracyScore: { type: Number, min: 0, max: 100 }
      },
      
      // Provider performance
      providerMetrics: [{
        providerId: String,
        sourceId: String,
        requestCount: Number,
        successCount: Number,
        failureCount: Number,
        avgResponseTime: Number,
        totalCost: Number,
        dataQuality: Number
      }],
      
      // Step execution results
      stepResults: [{
        stepId: String,
        stepName: String,
        status: String,
        duration: Number,
        recordsInput: Number,
        recordsOutput: Number,
        recordsRejected: Number,
        errors: [String]
      }],
      
      // Output results
      outputs: [{
        outputId: String,
        outputName: String,
        recordCount: Number,
        fileSize: Number,
        location: String,
        checksum: String,
        success: Boolean
      }],
      
      // Errors and warnings
      issues: [{
        level: {
          type: String,
          enum: ['info', 'warning', 'error', 'critical']
        },
        component: String, // step, provider, output, etc.
        message: String,
        details: mongoose.Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now }
      }],
      
      // Logs (limited for performance)
      logs: [{
        level: String,
        message: String,
        timestamp: Date,
        component: String
      }]
    }],
    
    // Next scheduled execution
    nextExecution: Date,
    lastExecution: Date,
    
    // Execution statistics
    statistics: {
      totalExecutions: { type: Number, default: 0 },
      successfulExecutions: { type: Number, default: 0 },
      failedExecutions: { type: Number, default: 0 },
      totalRecordsProcessed: { type: Number, default: 0 },
      totalDataVolumeProcessed: { type: Number, default: 0 },
      totalCost: { type: Number, default: 0 },
      avgExecutionTime: Number,
      avgDataQuality: Number,
      lastSuccessfulExecution: Date,
      lastFailedExecution: Date
    }
  },
  
  // Cost Management
  costs: {
    // Cost configuration
    budget: {
      monthly: Number,
      execution: Number, // per execution
      record: Number, // per record processed
      currency: { type: String, default: 'USD' }
    },
    
    // Cost tracking
    tracking: {
      currentMonth: {
        spent: { type: Number, default: 0 },
        executions: { type: Number, default: 0 },
        records: { type: Number, default: 0 },
        lastUpdated: Date
      },
      
      // Monthly history
      monthlyHistory: [{
        month: String, // YYYY-MM
        totalCost: Number,
        executions: Number,
        records: Number,
        providerCosts: [{
          providerId: String,
          cost: Number
        }]
      }],
      
      // Cost optimization
      optimization: {
        enabled: { type: Boolean, default: true },
        strategy: {
          type: String,
          enum: ['cost_first', 'quality_first', 'balanced'],
          default: 'balanced'
        },
        maxCostPerExecution: Number,
        maxCostPerRecord: Number
      }
    }
  },
  
  // Access Control and Security
  security: {
    // Ownership and permissions
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
        enum: ['view', 'edit', 'execute', 'monitor', 'manage_access', 'delete']
      }],
      addedDate: { type: Date, default: Date.now },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    
    // Data classification
    dataClassification: {
      type: String,
      enum: ['public', 'internal', 'confidential', 'restricted'],
      default: 'internal'
    },
    
    // Compliance settings
    compliance: {
      gdprCompliant: { type: Boolean, default: false },
      ccpaCompliant: { type: Boolean, default: false },
      dataRetentionDays: { type: Number, default: 365 },
      encryptInTransit: { type: Boolean, default: true },
      encryptAtRest: { type: Boolean, default: true },
      auditLog: { type: Boolean, default: true },
      anonymizeData: { type: Boolean, default: false }
    }
  },
  
  // Metadata and Tags
  metadata: {
    tags: [String],
    keywords: [String],
    
    // Business metadata
    businessOwner: String,
    businessUnit: String,
    costCenter: String,
    purpose: String,
    
    // Technical metadata
    version: { type: String, default: '1.0.0' },
    framework: { type: String, default: 'web-hunter' },
    environment: {
      type: String,
      enum: ['development', 'testing', 'staging', 'production'],
      default: 'development'
    },
    
    // Relationships
    parentWorkflow: String,
    childWorkflows: [String],
    relatedWorkflows: [String],
    
    // Documentation
    documentation: String,
    runbook: String,
    troubleshooting: String,
    
    // Notes
    notes: String,
    changelog: String
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
      reason: String,
      impact: String
    }]
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for Performance
OrchestrationWorkflowSchema.index({ workflowId: 1 });
OrchestrationWorkflowSchema.index({ name: 1 });
OrchestrationWorkflowSchema.index({ 'security.owner': 1 });
OrchestrationWorkflowSchema.index({ 'execution.status': 1 });
OrchestrationWorkflowSchema.index({ 'classification.type': 1 });
OrchestrationWorkflowSchema.index({ 'execution.nextExecution': 1 });

// Compound indexes
OrchestrationWorkflowSchema.index({ 'security.owner': 1, 'execution.status': 1 });
OrchestrationWorkflowSchema.index({ 'classification.type': 1, 'classification.priority': 1 });
OrchestrationWorkflowSchema.index({ 'execution.nextExecution': 1, 'configuration.schedule.enabled': 1 });

// Text index for search
OrchestrationWorkflowSchema.index({
  name: 'text',
  displayName: 'text',
  description: 'text',
  'metadata.tags': 'text',
  'metadata.keywords': 'text'
});

// Virtual for execution health
OrchestrationWorkflowSchema.virtual('executionHealth').get(function() {
  const stats = this.execution.statistics;
  if (stats.totalExecutions === 0) return 0;
  
  const successRate = (stats.successfulExecutions / stats.totalExecutions) * 100;
  const qualityScore = stats.avgDataQuality || 0;
  
  // Health score based on success rate and data quality
  return Math.round((successRate + qualityScore) / 2);
});

// Virtual for cost efficiency
OrchestrationWorkflowSchema.virtual('costEfficiency').get(function() {
  const stats = this.execution.statistics;
  if (stats.totalRecordsProcessed === 0 || stats.totalCost === 0) return 'unknown';
  
  const costPerRecord = stats.totalCost / stats.totalRecordsProcessed;
  
  if (costPerRecord < 0.001) return 'excellent';
  if (costPerRecord < 0.01) return 'good';
  if (costPerRecord < 0.1) return 'fair';
  return 'expensive';
});

// Virtual for current progress
OrchestrationWorkflowSchema.virtual('currentProgress').get(function() {
  if (this.execution.status !== 'running') return null;
  
  return {
    progress: this.execution.currentExecution.progress,
    currentStep: this.execution.currentExecution.currentStep,
    recordsProcessed: this.execution.currentExecution.metrics.recordsProcessed,
    estimatedEndTime: this.execution.currentExecution.estimatedEndTime
  };
});

// Instance Methods

/**
 * Check if workflow is currently running
 * @returns {boolean} - True if workflow is running
 */
OrchestrationWorkflowSchema.methods.isRunning = function() {
  return this.execution.status === 'running';
};

/**
 * Check if workflow is ready for execution
 * @returns {boolean} - True if workflow can be executed
 */
OrchestrationWorkflowSchema.methods.isReadyForExecution = function() {
  return this.execution.status === 'scheduled' &&
         this.configuration.schedule.enabled &&
         this.configuration.dataFlow.inputSources.some(s => s.status === 'active');
};

/**
 * Get active input sources
 * @returns {Array} - Active input sources
 */
OrchestrationWorkflowSchema.methods.getActiveInputSources = function() {
  return this.configuration.dataFlow.inputSources.filter(s => s.status === 'active');
};

/**
 * Add execution result
 * @param {Object} executionData - Execution result data
 * @returns {Promise} - Saved workflow
 */
OrchestrationWorkflowSchema.methods.addExecutionResult = function(executionData) {
  this.execution.history.push(executionData);
  
  // Update statistics
  this.execution.statistics.totalExecutions += 1;
  
  if (executionData.status === 'completed') {
    this.execution.statistics.successfulExecutions += 1;
    this.execution.lastExecution = executionData.startTime;
  } else if (executionData.status === 'failed') {
    this.execution.statistics.failedExecutions += 1;
  }
  
  // Update totals
  if (executionData.metrics) {
    this.execution.statistics.totalRecordsProcessed += executionData.metrics.totalRecordsProcessed || 0;
    this.execution.statistics.totalDataVolumeProcessed += executionData.metrics.dataVolumeProcessed || 0;
    this.execution.statistics.totalCost += executionData.metrics.totalCost || 0;
  }
  
  return this.save();
};

/**
 * Calculate next execution time
 * @returns {Date|null} - Next execution date or null
 */
OrchestrationWorkflowSchema.methods.calculateNextExecution = function() {
  if (!this.configuration.schedule.enabled || this.configuration.schedule.type === 'manual') {
    return null;
  }
  
  const now = new Date();
  
  if (this.configuration.schedule.type === 'interval') {
    const interval = this.configuration.schedule.interval;
    const ms = this.convertIntervalToMs(interval.value, interval.unit);
    return new Date(now.getTime() + ms);
  }
  
  // TODO: Implement cron expression parsing and other schedule types
  return null;
};

/**
 * Convert interval to milliseconds
 * @param {number} value - Interval value
 * @param {string} unit - Time unit
 * @returns {number} - Milliseconds
 */
OrchestrationWorkflowSchema.methods.convertIntervalToMs = function(value, unit) {
  const conversions = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000
  };
  
  return value * (conversions[unit] || conversions.hours);
};

/**
 * Check user permissions
 * @param {string} userId - User ID
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
OrchestrationWorkflowSchema.methods.hasUserPermission = function(userId, permission) {
  // Owner has all permissions
  if (this.security.owner.toString() === userId) return true;
  
  // Check collaborator permissions
  const collaborator = this.security.collaborators.find(
    c => c.userId.toString() === userId
  );
  
  return collaborator && collaborator.permissions.includes(permission);
};

// Static Methods

/**
 * Generate next workflow ID
 * @returns {Promise<string>} - Next workflow ID
 */
OrchestrationWorkflowSchema.statics.generateWorkflowId = async function() {
  const count = await this.countDocuments();
  const nextNumber = count + 1;
  return `WF${nextNumber.toString().padStart(8, '0')}`;
};

/**
 * Find workflows ready for execution
 * @returns {Promise<OrchestrationWorkflow[]>} - Array of workflows ready to run
 */
OrchestrationWorkflowSchema.statics.findReadyForExecution = function() {
  const now = new Date();
  return this.find({
    'execution.status': 'scheduled',
    'execution.nextExecution': { $lte: now },
    'configuration.schedule.enabled': true
  });
};

/**
 * Find workflows by owner
 * @param {string} userId - Owner user ID
 * @returns {Promise<OrchestrationWorkflow[]>} - Array of workflows
 */
OrchestrationWorkflowSchema.statics.findByOwner = function(userId) {
  return this.find({ 'security.owner': userId })
    .populate('security.owner', 'profile.firstName profile.lastName email');
};

/**
 * Find workflows by type and business function
 * @param {string} type - Workflow type
 * @param {string} businessFunction - Business function
 * @returns {Promise<OrchestrationWorkflow[]>} - Array of workflows
 */
OrchestrationWorkflowSchema.statics.findByTypeAndFunction = function(type, businessFunction) {
  return this.find({
    'classification.type': type,
    'classification.businessFunction': businessFunction,
    'execution.status': { $ne: 'cancelled' }
  });
};

/**
 * Get workflow performance analytics
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>} - Performance analytics
 */
OrchestrationWorkflowSchema.statics.getPerformanceAnalytics = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalWorkflows: { $sum: 1 },
        avgExecutionTime: { $avg: '$execution.statistics.avgExecutionTime' },
        totalExecutions: { $sum: '$execution.statistics.totalExecutions' },
        totalRecordsProcessed: { $sum: '$execution.statistics.totalRecordsProcessed' },
        totalCost: { $sum: '$execution.statistics.totalCost' },
        avgDataQuality: { $avg: '$execution.statistics.avgDataQuality' }
      }
    }
  ]);
};

module.exports = mongoose.model('OrchestrationWorkflow', OrchestrationWorkflowSchema);