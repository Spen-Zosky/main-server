const mongoose = require('mongoose');

/**
 * DataQualityMonitor Schema - Web-Hunter Framework
 * Comprehensive data quality monitoring and compliance management
 * Tracks quality metrics, compliance violations, and improvement recommendations
 */
const DataQualityMonitorSchema = new mongoose.Schema({
  // Monitor Identification
  monitorId: {
    type: String,
    required: [true, 'Monitor ID is required'],
    unique: true,
    uppercase: true,
    match: [/^DQM[0-9]{7}$/, 'Monitor ID must be in format DQM0000000']
  },
  
  name: {
    type: String,
    required: [true, 'Monitor name is required'],
    trim: true,
    maxlength: [150, 'Name cannot exceed 150 characters']
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Monitoring Scope
  scope: {
    // What is being monitored
    target: {
      type: {
        type: String,
        enum: ['source', 'workflow', 'provider', 'dataset', 'pipeline', 'global'],
        required: [true, 'Monitoring target type is required']
      },
      
      // Target references
      sourceId: String,        // DataSourceCatalog ID
      workflowId: String,      // OrchestrationWorkflow ID
      providerId: String,      // ProviderIntegration ID
      jobId: String,          // DataMiningJob ID
      
      // Target details
      name: String,
      description: String
    },
    
    // Monitoring dimensions
    dimensions: [{
      type: String,
      enum: ['completeness', 'accuracy', 'consistency', 'validity', 'timeliness', 'uniqueness', 'integrity', 'compliance'],
      required: true
    }],
    
    // Monitoring frequency
    frequency: {
      type: String,
      enum: ['real_time', 'continuous', 'hourly', 'daily', 'weekly', 'monthly', 'on_demand'],
      default: 'daily'
    },
    
    // Data sample configuration
    sampling: {
      strategy: {
        type: String,
        enum: ['all', 'random', 'systematic', 'stratified', 'recent'],
        default: 'random'
      },
      size: { type: Number, default: 1000 },
      percentage: { type: Number, min: 0, max: 100, default: 10 }
    }
  },
  
  // Quality Rules and Thresholds
  qualityRules: [{
    ruleId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    
    // Rule definition
    dimension: {
      type: String,
      enum: ['completeness', 'accuracy', 'consistency', 'validity', 'timeliness', 'uniqueness', 'integrity', 'compliance'],
      required: true
    },
    
    category: {
      type: String,
      enum: ['field_level', 'record_level', 'dataset_level', 'cross_reference', 'business_rule'],
      default: 'field_level'
    },
    
    // Rule specification
    specification: {
      // Field-level rules
      field: String,
      dataType: String,
      format: String,      // regex pattern or format string
      range: {
        min: mongoose.Schema.Types.Mixed,
        max: mongoose.Schema.Types.Mixed
      },
      enumValues: [String],
      
      // Record-level rules
      requiredFields: [String],
      conditionalFields: [{
        condition: String,
        requiredFields: [String]
      }],
      
      // Cross-reference rules
      referenceSource: String,
      referenceField: String,
      
      // Custom rules
      customRule: String,  // JavaScript expression
      sqlRule: String,     // SQL WHERE clause
      
      // Business rules
      businessLogic: String,
      constraints: mongoose.Schema.Types.Mixed
    },
    
    // Thresholds and scoring
    thresholds: {
      critical: { type: Number, min: 0, max: 100 },    // Below this = critical
      warning: { type: Number, min: 0, max: 100 },     // Below this = warning
      target: { type: Number, min: 0, max: 100 },      // Target quality level
      excellent: { type: Number, min: 0, max: 100 }    // Excellent quality level
    },
    
    // Rule configuration
    weight: { type: Number, min: 0.1, max: 10, default: 1 },  // Importance weight
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    // Actions on rule violation
    actions: [{
      type: {
        type: String,
        enum: ['alert', 'quarantine', 'reject', 'flag', 'auto_correct', 'escalate'],
        required: true
      },
      condition: String,    // When to trigger this action
      parameters: mongoose.Schema.Types.Mixed,
      enabled: { type: Boolean, default: true }
    }],
    
    enabled: { type: Boolean, default: true },
    lastModified: { type: Date, default: Date.now }
  }],
  
  // Current Quality Metrics and Status
  currentStatus: {
    // Overall quality score
    overallScore: { type: Number, min: 0, max: 100 },
    
    // Dimensional scores
    dimensionScores: {
      completeness: { type: Number, min: 0, max: 100 },
      accuracy: { type: Number, min: 0, max: 100 },
      consistency: { type: Number, min: 0, max: 100 },
      validity: { type: Number, min: 0, max: 100 },
      timeliness: { type: Number, min: 0, max: 100 },
      uniqueness: { type: Number, min: 0, max: 100 },
      integrity: { type: Number, min: 0, max: 100 },
      compliance: { type: Number, min: 0, max: 100 }
    },
    
    // Quality grade
    grade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'],
      default: 'C'
    },
    
    // Status indicators
    status: {
      type: String,
      enum: ['excellent', 'good', 'acceptable', 'poor', 'critical'],
      default: 'acceptable'
    },
    
    // Last assessment
    lastAssessment: Date,
    assessmentDuration: Number,  // milliseconds
    recordsAssessed: Number,
    
    // Trends
    trend: {
      direction: {
        type: String,
        enum: ['improving', 'stable', 'declining', 'unknown'],
        default: 'unknown'
      },
      magnitude: String,    // e.g., "significant", "moderate", "slight"
      timeframe: String,    // e.g., "last 7 days", "last month"
      confidence: { type: Number, min: 0, max: 1 }
    }
  },
  
  // Quality Assessment History
  assessments: [{
    assessmentId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    duration: Number,      // milliseconds
    
    // Sample information
    sample: {
      strategy: String,
      size: Number,
      totalRecords: Number,
      representativeness: { type: Number, min: 0, max: 1 }
    },
    
    // Overall results
    results: {
      overallScore: { type: Number, min: 0, max: 100 },
      grade: String,
      
      // Dimensional results
      dimensions: [{
        name: String,
        score: { type: Number, min: 0, max: 100 },
        recordsPassed: Number,
        recordsFailed: Number,
        trend: String
      }],
      
      // Rule results
      ruleResults: [{
        ruleId: String,
        ruleName: String,
        dimension: String,
        score: { type: Number, min: 0, max: 100 },
        threshold: String,    // which threshold was breached
        recordsPassed: Number,
        recordsFailed: Number,
        violations: [{
          type: String,
          count: Number,
          percentage: Number,
          examples: [mongoose.Schema.Types.Mixed]
        }]
      }]
    },
    
    // Issues discovered
    issues: [{
      issueId: String,
      type: {
        type: String,
        enum: ['missing_data', 'invalid_format', 'duplicate_records', 'referential_integrity', 'business_rule_violation', 'outlier', 'inconsistency']
      },
      severity: String,
      dimension: String,
      ruleId: String,
      
      description: String,
      affectedRecords: Number,
      affectedFields: [String],
      
      // Issue examples
      examples: [{
        record: mongoose.Schema.Types.Mixed,
        issue: String,
        expectedValue: String,
        actualValue: String
      }],
      
      // Recommendations
      recommendations: [{
        action: String,
        priority: String,
        effort: String,
        expectedImprovement: String
      }]
    }],
    
    // Performance metrics
    performance: {
      executionTime: Number,
      memoryUsage: Number,
      cpuUsage: Number,
      rulesExecuted: Number,
      recordsPerSecond: Number
    },
    
    // Comparison with previous assessment
    comparison: {
      previousAssessmentId: String,
      scoreDifference: Number,
      trendAnalysis: String,
      improvements: [String],
      degradations: [String]
    }
  }],
  
  // Compliance Monitoring
  compliance: {
    // Regulatory frameworks
    frameworks: [{
      name: {
        type: String,
        enum: ['GDPR', 'CCPA', 'HIPAA', 'SOX', 'PCI_DSS', 'ISO_27001', 'NIST', 'Custom'],
        required: true
      },
      version: String,
      
      // Compliance requirements
      requirements: [{
        requirementId: String,
        name: String,
        description: String,
        category: String,
        
        // Monitoring rules
        rules: [String],  // References to qualityRules
        
        // Compliance status
        status: {
          type: String,
          enum: ['compliant', 'non_compliant', 'partially_compliant', 'unknown'],
          default: 'unknown'
        },
        
        score: { type: Number, min: 0, max: 100 },
        lastCheck: Date,
        
        // Violations
        violations: [{
          timestamp: Date,
          description: String,
          severity: String,
          affectedRecords: Number,
          resolved: { type: Boolean, default: false },
          resolvedDate: Date
        }]
      }],
      
      // Overall framework compliance
      overallStatus: String,
      overallScore: { type: Number, min: 0, max: 100 },
      lastAssessment: Date,
      nextAssessment: Date,
      
      enabled: { type: Boolean, default: true }
    }],
    
    // Data governance
    governance: {
      dataOwner: String,
      datasteward: String,
      businessOwner: String,
      
      // Data classification
      classification: {
        level: {
          type: String,
          enum: ['public', 'internal', 'confidential', 'restricted'],
          default: 'internal'
        },
        categories: [String],
        sensitivity: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium'
        }
      },
      
      // Retention policies
      retention: {
        policy: String,
        retentionPeriod: Number,  // days
        archiveDate: Date,
        deletionDate: Date,
        legalHold: { type: Boolean, default: false }
      },
      
      // Access controls
      access: {
        restrictions: [String],
        approvals: [String],
        auditRequired: { type: Boolean, default: false }
      }
    }
  },
  
  // Alerts and Notifications
  alerts: {
    // Alert configuration
    configuration: {
      enabled: { type: Boolean, default: true },
      
      // Alert triggers
      triggers: [{
        name: String,
        condition: String,      // e.g., "overallScore < 70"
        severity: String,
        frequency: String,      // how often to check
        cooldown: Number,       // minutes between alerts
        enabled: { type: Boolean, default: true }
      }],
      
      // Notification channels
      channels: [{
        type: {
          type: String,
          enum: ['email', 'slack', 'webhook', 'sms', 'dashboard'],
          required: true
        },
        
        // Channel configuration
        config: mongoose.Schema.Types.Mixed,
        
        // Recipients
        recipients: [String],
        
        // Message templates
        templates: {
          critical: String,
          warning: String,
          info: String,
          resolved: String
        },
        
        enabled: { type: Boolean, default: true }
      }],
      
      // Escalation rules
      escalation: [{
        level: Number,
        condition: String,
        delay: Number,        // minutes
        recipients: [String],
        channels: [String]
      }]
    },
    
    // Active alerts
    active: [{
      alertId: String,
      type: String,
      severity: String,
      message: String,
      
      triggered: { type: Date, default: Date.now },
      acknowledged: Date,
      acknowledgedBy: String,
      resolved: Date,
      resolvedBy: String,
      
      // Alert context
      context: {
        dimension: String,
        ruleId: String,
        threshold: String,
        actualValue: Number,
        expectedValue: Number,
        affectedRecords: Number
      },
      
      // Notifications sent
      notifications: [{
        channel: String,
        recipient: String,
        sent: Date,
        delivered: Boolean,
        error: String
      }],
      
      status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved', 'suppressed'],
        default: 'active'
      }
    }],
    
    // Alert history
    history: [{
      alertId: String,
      type: String,
      severity: String,
      message: String,
      triggered: Date,
      resolved: Date,
      duration: Number,      // minutes
      
      resolution: {
        method: String,
        description: String,
        resolvedBy: String
      }
    }]
  },
  
  // Improvement Recommendations
  recommendations: {
    // Current recommendations
    current: [{
      recommendationId: String,
      type: {
        type: String,
        enum: ['data_cleansing', 'process_improvement', 'rule_adjustment', 'infrastructure_upgrade', 'training', 'policy_change'],
        required: true
      },
      
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      
      // Recommendation details
      title: String,
      description: String,
      rationale: String,
      
      // Target improvements
      expectedImprovement: {
        dimension: String,
        currentScore: Number,
        targetScore: Number,
        confidence: Number
      },
      
      // Implementation details
      implementation: {
        effort: {
          type: String,
          enum: ['low', 'medium', 'high', 'very_high'],
          default: 'medium'
        },
        duration: String,
        resources: [String],
        dependencies: [String],
        risks: [String]
      },
      
      // Status tracking
      status: {
        type: String,
        enum: ['new', 'under_review', 'approved', 'in_progress', 'completed', 'rejected', 'deferred'],
        default: 'new'
      },
      
      assignedTo: String,
      dueDate: Date,
      completedDate: Date,
      
      created: { type: Date, default: Date.now },
      createdBy: String
    }],
    
    // Automated recommendations engine
    engine: {
      enabled: { type: Boolean, default: true },
      
      // Machine learning model for recommendations
      model: {
        version: String,
        lastTrained: Date,
        accuracy: Number,
        features: [String]
      },
      
      // Pattern detection
      patterns: [{
        pattern: String,
        frequency: Number,
        impact: String,
        recommendation: String
      }],
      
      // Recommendation history
      history: [{
        timestamp: Date,
        recommendations: Number,
        accepted: Number,
        implemented: Number,
        effectiveness: Number
      }]
    }
  },
  
  // Configuration and Settings
  configuration: {
    // Monitoring settings
    monitoring: {
      enabled: { type: Boolean, default: true },
      autoRun: { type: Boolean, default: true },
      
      // Scheduling
      schedule: {
        frequency: String,
        time: String,
        timezone: { type: String, default: 'UTC' },
        enabled: { type: Boolean, default: true }
      },
      
      // Performance settings
      performance: {
        maxExecutionTime: { type: Number, default: 3600 }, // seconds
        maxMemoryUsage: { type: Number, default: 1024 },   // MB
        parallelRules: { type: Number, default: 5 },
        batchSize: { type: Number, default: 1000 }
      }
    },
    
    // Reporting settings
    reporting: {
      autoGenerate: { type: Boolean, default: true },
      
      // Report types
      reports: [{
        type: String,
        frequency: String,
        recipients: [String],
        format: String,
        enabled: { type: Boolean, default: true }
      }],
      
      // Report retention
      retention: {
        assessments: { type: Number, default: 365 },  // days
        alerts: { type: Number, default: 90 },
        recommendations: { type: Number, default: 180 }
      }
    },
    
    // Integration settings
    integrations: [{
      type: String,
      endpoint: String,
      authentication: mongoose.Schema.Types.Mixed,
      enabled: { type: Boolean, default: false }
    }]
  },
  
  // Metadata and Context
  metadata: {
    tags: [String],
    category: String,
    
    // Business context
    businessOwner: String,
    technicalOwner: String,
    stakeholders: [String],
    
    // Monitoring context
    purpose: String,
    scope: String,
    criticality: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    // Documentation
    documentation: String,
    runbook: String,
    
    // External references
    externalId: String,
    externalSystem: String,
    
    // Notes
    notes: String
  },
  
  // Access Control
  security: {
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
        enum: ['view', 'edit', 'execute', 'manage_alerts', 'manage_rules', 'delete']
      }],
      addedDate: { type: Date, default: Date.now }
    }],
    
    visibility: {
      type: String,
      enum: ['private', 'team', 'organization', 'public'],
      default: 'team'
    }
  },
  
  // Status and Lifecycle
  status: {
    overall: {
      type: String,
      enum: ['active', 'inactive', 'paused', 'error', 'maintenance'],
      default: 'active'
    },
    
    monitoring: {
      type: String,
      enum: ['running', 'stopped', 'error', 'scheduled'],
      default: 'stopped'
    },
    
    lastExecution: Date,
    nextExecution: Date,
    
    health: {
      score: { type: Number, min: 0, max: 100 },
      issues: [String],
      lastHealthCheck: Date
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
DataQualityMonitorSchema.index({ monitorId: 1 });
DataQualityMonitorSchema.index({ 'scope.target.type': 1 });
DataQualityMonitorSchema.index({ 'scope.target.sourceId': 1 });
DataQualityMonitorSchema.index({ 'scope.target.workflowId': 1 });
DataQualityMonitorSchema.index({ 'security.owner': 1 });
DataQualityMonitorSchema.index({ 'status.overall': 1 });
DataQualityMonitorSchema.index({ 'currentStatus.grade': 1 });

// Compound indexes
DataQualityMonitorSchema.index({ 'scope.target.type': 1, 'status.overall': 1 });
DataQualityMonitorSchema.index({ 'security.owner': 1, 'currentStatus.overallScore': -1 });
DataQualityMonitorSchema.index({ 'currentStatus.grade': 1, 'currentStatus.lastAssessment': -1 });

// Text index for search
DataQualityMonitorSchema.index({
  name: 'text',
  description: 'text',
  'metadata.tags': 'text'
});

// Virtual for quality status
DataQualityMonitorSchema.virtual('qualityStatus').get(function() {
  const score = this.currentStatus.overallScore || 0;
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'acceptable';
  if (score >= 50) return 'poor';
  return 'critical';
});

// Virtual for active alerts count
DataQualityMonitorSchema.virtual('activeAlertsCount').get(function() {
  return this.alerts.active.filter(alert => alert.status === 'active').length;
});

// Virtual for compliance status
DataQualityMonitorSchema.virtual('complianceStatus').get(function() {
  const compliantFrameworks = this.compliance.frameworks.filter(f => f.overallStatus === 'compliant').length;
  const totalFrameworks = this.compliance.frameworks.length;
  
  if (totalFrameworks === 0) return 'unknown';
  if (compliantFrameworks === totalFrameworks) return 'compliant';
  if (compliantFrameworks === 0) return 'non_compliant';
  return 'partially_compliant';
});

// Instance Methods

/**
 * Calculate overall quality score
 * @returns {number} - Overall quality score (0-100)
 */
DataQualityMonitorSchema.methods.calculateOverallScore = function() {
  const scores = this.currentStatus.dimensionScores;
  const enabledDimensions = this.scope.dimensions;
  
  let totalScore = 0;
  let count = 0;
  
  enabledDimensions.forEach(dimension => {
    if (scores[dimension] !== undefined) {
      totalScore += scores[dimension];
      count++;
    }
  });
  
  return count > 0 ? Math.round(totalScore / count) : 0;
};

/**
 * Add new quality assessment
 * @param {Object} assessment - Assessment data
 * @returns {Promise} - Saved monitor
 */
DataQualityMonitorSchema.methods.addAssessment = function(assessment) {
  this.assessments.push(assessment);
  
  // Update current status
  this.currentStatus.overallScore = assessment.results.overallScore;
  this.currentStatus.grade = assessment.results.grade;
  this.currentStatus.lastAssessment = assessment.timestamp;
  this.currentStatus.recordsAssessed = assessment.sample.size;
  
  // Update dimensional scores
  assessment.results.dimensions.forEach(dim => {
    this.currentStatus.dimensionScores[dim.name] = dim.score;
  });
  
  return this.save();
};

/**
 * Create new alert
 * @param {Object} alertData - Alert data
 * @returns {Promise} - Saved monitor
 */
DataQualityMonitorSchema.methods.createAlert = function(alertData) {
  const alert = {
    alertId: `ALT${Date.now()}`,
    ...alertData,
    triggered: new Date(),
    status: 'active'
  };
  
  this.alerts.active.push(alert);
  return this.save();
};

/**
 * Resolve alert
 * @param {string} alertId - Alert ID to resolve
 * @param {string} resolvedBy - User who resolved the alert
 * @param {string} resolution - Resolution description
 * @returns {Promise} - Saved monitor
 */
DataQualityMonitorSchema.methods.resolveAlert = function(alertId, resolvedBy, resolution) {
  const alert = this.alerts.active.find(a => a.alertId === alertId);
  if (alert) {
    alert.status = 'resolved';
    alert.resolved = new Date();
    alert.resolvedBy = resolvedBy;
    
    // Move to history
    this.alerts.history.push({
      ...alert.toObject(),
      resolution: {
        method: 'manual',
        description: resolution,
        resolvedBy: resolvedBy
      },
      duration: Math.round((alert.resolved - alert.triggered) / (1000 * 60)) // minutes
    });
    
    // Remove from active alerts
    this.alerts.active = this.alerts.active.filter(a => a.alertId !== alertId);
  }
  
  return this.save();
};

/**
 * Add recommendation
 * @param {Object} recommendation - Recommendation data
 * @returns {Promise} - Saved monitor
 */
DataQualityMonitorSchema.methods.addRecommendation = function(recommendation) {
  const rec = {
    recommendationId: `REC${Date.now()}`,
    ...recommendation,
    created: new Date(),
    status: 'new'
  };
  
  this.recommendations.current.push(rec);
  return this.save();
};

/**
 * Check if monitor is healthy
 * @returns {boolean} - True if monitor is healthy
 */
DataQualityMonitorSchema.methods.isHealthy = function() {
  return this.status.overall === 'active' &&
         this.status.monitoring !== 'error' &&
         this.currentStatus.overallScore >= 70;
};

// Static Methods

/**
 * Generate next monitor ID
 * @returns {Promise<string>} - Next monitor ID
 */
DataQualityMonitorSchema.statics.generateMonitorId = async function() {
  const count = await this.countDocuments();
  const nextNumber = count + 1;
  return `DQM${nextNumber.toString().padStart(7, '0')}`;
};

/**
 * Find monitors by target type
 * @param {string} targetType - Target type (source, workflow, etc.)
 * @returns {Promise<DataQualityMonitor[]>} - Array of monitors
 */
DataQualityMonitorSchema.statics.findByTargetType = function(targetType) {
  return this.find({
    'scope.target.type': targetType,
    'status.overall': 'active'
  });
};

/**
 * Find monitors with active alerts
 * @returns {Promise<DataQualityMonitor[]>} - Array of monitors with active alerts
 */
DataQualityMonitorSchema.statics.findWithActiveAlerts = function() {
  return this.find({
    'alerts.active.status': 'active',
    'status.overall': 'active'
  });
};

/**
 * Get quality overview statistics
 * @returns {Promise<Object>} - Quality statistics
 */
DataQualityMonitorSchema.statics.getQualityOverview = function() {
  return this.aggregate([
    { $match: { 'status.overall': 'active' } },
    {
      $group: {
        _id: null,
        totalMonitors: { $sum: 1 },
        avgQualityScore: { $avg: '$currentStatus.overallScore' },
        excellentCount: {
          $sum: { $cond: [{ $gte: ['$currentStatus.overallScore', 90] }, 1, 0] }
        },
        goodCount: {
          $sum: { $cond: [{ $and: [{ $gte: ['$currentStatus.overallScore', 80] }, { $lt: ['$currentStatus.overallScore', 90] }] }, 1, 0] }
        },
        acceptableCount: {
          $sum: { $cond: [{ $and: [{ $gte: ['$currentStatus.overallScore', 70] }, { $lt: ['$currentStatus.overallScore', 80] }] }, 1, 0] }
        },
        poorCount: {
          $sum: { $cond: [{ $and: [{ $gte: ['$currentStatus.overallScore', 50] }, { $lt: ['$currentStatus.overallScore', 70] }] }, 1, 0] }
        },
        criticalCount: {
          $sum: { $cond: [{ $lt: ['$currentStatus.overallScore', 50] }, 1, 0] }
        },
        activeAlerts: { $sum: { $size: '$alerts.active' } }
      }
    }
  ]);
};

module.exports = mongoose.model('DataQualityMonitor', DataQualityMonitorSchema);