const mongoose = require('mongoose');

/**
 * WebHunterAnalytics Schema - Web-Hunter Framework
 * Comprehensive analytics and reporting for the Web-Hunter ecosystem
 * Tracks performance, usage, costs, and business intelligence metrics
 */
const WebHunterAnalyticsSchema = new mongoose.Schema({
  // Analytics Record Identification
  analyticsId: {
    type: String,
    required: [true, 'Analytics ID is required'],
    unique: true,
    uppercase: true,
    match: [/^WHA[0-9]{8}$/, 'Analytics ID must be in format WHA00000000']
  },
  
  // Report Type and Scope
  reportType: {
    type: String,
    enum: ['system_overview', 'provider_performance', 'workflow_analytics', 'cost_analysis', 'quality_metrics', 'usage_statistics', 'compliance_report', 'business_intelligence'],
    required: [true, 'Report type is required']
  },
  
  name: {
    type: String,
    required: [true, 'Analytics name is required'],
    trim: true,
    maxlength: [150, 'Name cannot exceed 150 characters']
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Time Period and Scope
  period: {
    type: {
      type: String,
      enum: ['real_time', 'hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
      required: [true, 'Period type is required']
    },
    
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    
    timezone: {
      type: String,
      default: 'UTC'
    },
    
    // Granularity for time-series data
    granularity: {
      type: String,
      enum: ['minute', 'hour', 'day', 'week', 'month'],
      default: 'day'
    }
  },
  
  // Analytics Scope
  scope: {
    // What entities are included in this analytics
    entities: [{
      type: {
        type: String,
        enum: ['provider', 'source', 'workflow', 'job', 'user', 'organization', 'global'],
        required: true
      },
      
      entityId: String,    // ID of the specific entity
      entityName: String,  // Name for display purposes
      
      // Filters applied to this entity
      filters: mongoose.Schema.Types.Mixed,
      
      included: { type: Boolean, default: true }
    }],
    
    // Geographic scope
    geographic: {
      global: { type: Boolean, default: true },
      regions: [String],    // Continent codes
      countries: [String],  // ISO country codes
      cities: [String]
    },
    
    // User/Organization scope
    users: [String],         // User IDs
    organizations: [String], // Organization IDs
    teams: [String],         // Team IDs
    
    // Data filters
    filters: {
      // Data quality filters
      minQualityScore: { type: Number, min: 0, max: 100 },
      
      // Volume filters
      minRecords: Number,
      maxRecords: Number,
      
      // Cost filters
      minCost: Number,
      maxCost: Number,
      
      // Status filters
      statuses: [String],
      
      // Custom filters
      custom: mongoose.Schema.Types.Mixed
    }
  },
  
  // System Overview Metrics
  systemMetrics: {
    // Overall system health
    health: {
      overallScore: { type: Number, min: 0, max: 100 },
      
      // Component health scores
      providers: { type: Number, min: 0, max: 100 },
      workflows: { type: Number, min: 0, max: 100 },
      dataQuality: { type: Number, min: 0, max: 100 },
      compliance: { type: Number, min: 0, max: 100 },
      
      // Health trend
      trend: {
        type: String,
        enum: ['improving', 'stable', 'declining'],
        default: 'stable'
      },
      
      issues: [{
        type: String,
        severity: String,
        count: Number,
        description: String
      }]
    },
    
    // System utilization
    utilization: {
      // Resource utilization
      cpu: {
        average: Number,  // percentage
        peak: Number,
        trend: String
      },
      
      memory: {
        average: Number,  // MB
        peak: Number,
        trend: String
      },
      
      storage: {
        used: Number,     // GB
        available: Number,
        percentage: Number,
        trend: String
      },
      
      network: {
        inbound: Number,  // Mbps
        outbound: Number,
        trend: String
      },
      
      // API utilization
      apiCalls: {
        total: Number,
        successful: Number,
        failed: Number,
        rateLimit: Number,
        trend: String
      }
    },
    
    // Performance metrics
    performance: {
      // Response times
      avgResponseTime: Number,  // milliseconds
      p50ResponseTime: Number,
      p95ResponseTime: Number,
      p99ResponseTime: Number,
      
      // Throughput
      requestsPerSecond: Number,
      recordsPerSecond: Number,
      
      // Error rates
      errorRate: { type: Number, min: 0, max: 100 },  // percentage
      timeoutRate: { type: Number, min: 0, max: 100 },
      
      // Trends
      performanceTrend: String,
      reliability: { type: Number, min: 0, max: 100 }
    }
  },
  
  // Provider Performance Analytics
  providerMetrics: [{
    providerId: { type: String, required: true },
    providerName: String,
    
    // Performance metrics
    performance: {
      totalRequests: Number,
      successfulRequests: Number,
      failedRequests: Number,
      successRate: { type: Number, min: 0, max: 100 },
      
      // Response times
      avgResponseTime: Number,
      minResponseTime: Number,
      maxResponseTime: Number,
      p95ResponseTime: Number,
      
      // Reliability
      uptime: { type: Number, min: 0, max: 100 },
      availability: { type: Number, min: 0, max: 100 },
      
      // Data quality
      dataQualityScore: { type: Number, min: 0, max: 100 },
      completenessRate: { type: Number, min: 0, max: 100 },
      accuracyRate: { type: Number, min: 0, max: 100 }
    },
    
    // Cost metrics
    costs: {
      totalCost: Number,
      costPerRequest: Number,
      costPerRecord: Number,
      currency: { type: String, default: 'USD' },
      
      // Cost breakdown
      setup: Number,
      usage: Number,
      subscription: Number,
      overage: Number,
      
      // Budget tracking
      budgetUsed: { type: Number, min: 0, max: 100 },  // percentage
      projectedMonthlyCost: Number
    },
    
    // Usage patterns
    usage: {
      totalDataVolume: Number,  // bytes
      peakUsage: Date,
      peakVolume: Number,
      
      // Usage by time
      hourlyPatterns: [Number],   // 24 hours
      dailyPatterns: [Number],    // 7 days
      monthlyPatterns: [Number],  // 12 months
      
      // Top sources accessed via this provider
      topSources: [{
        sourceId: String,
        sourceName: String,
        requestCount: Number,
        dataVolume: Number
      }]
    },
    
    // Trends and insights
    trends: {
      performanceTrend: String,
      costTrend: String,
      usageTrend: String,
      qualityTrend: String,
      
      // Recommendations
      recommendations: [String],
      
      // Risk factors
      risks: [{
        type: String,
        severity: String,
        probability: String,
        impact: String,
        description: String
      }]
    }
  }],
  
  // Workflow Analytics
  workflowMetrics: [{
    workflowId: { type: String, required: true },
    workflowName: String,
    workflowType: String,
    
    // Execution metrics
    execution: {
      totalExecutions: Number,
      successfulExecutions: Number,
      failedExecutions: Number,
      cancelledExecutions: Number,
      successRate: { type: Number, min: 0, max: 100 },
      
      // Duration metrics
      avgDuration: Number,      // minutes
      minDuration: Number,
      maxDuration: Number,
      p95Duration: Number,
      
      // Recent executions
      recentExecutions: [{
        executionId: String,
        startTime: Date,
        endTime: Date,
        duration: Number,
        status: String,
        recordsProcessed: Number,
        cost: Number
      }]
    },
    
    // Data processing metrics
    dataProcessing: {
      totalRecordsProcessed: Number,
      avgRecordsPerExecution: Number,
      peakRecordsPerExecution: Number,
      
      // Data quality metrics
      qualityScore: { type: Number, min: 0, max: 100 },
      validRecords: Number,
      invalidRecords: Number,
      duplicateRecords: Number,
      
      // Processing rate
      avgProcessingRate: Number,  // records per minute
      peakProcessingRate: Number
    },
    
    // Cost analysis
    costs: {
      totalCost: Number,
      costPerExecution: Number,
      costPerRecord: Number,
      
      // Cost breakdown by provider
      providerCosts: [{
        providerId: String,
        providerName: String,
        cost: Number,
        percentage: Number
      }],
      
      // Monthly cost projection
      projectedMonthlyCost: Number,
      budgetUtilization: { type: Number, min: 0, max: 100 }
    },
    
    // Efficiency metrics
    efficiency: {
      resourceUtilization: { type: Number, min: 0, max: 100 },
      timeEfficiency: { type: Number, min: 0, max: 100 },
      costEfficiency: { type: Number, min: 0, max: 100 },
      
      // Bottlenecks
      bottlenecks: [{
        component: String,
        impact: String,
        frequency: Number,
        avgDelay: Number
      }],
      
      // Optimization opportunities
      optimizations: [{
        type: String,
        description: String,
        potentialSaving: Number,
        effort: String
      }]
    }
  }],
  
  // Data Quality Analytics
  qualityMetrics: {
    // Overall quality assessment
    overall: {
      avgQualityScore: { type: Number, min: 0, max: 100 },
      
      // Dimensional scores
      completeness: { type: Number, min: 0, max: 100 },
      accuracy: { type: Number, min: 0, max: 100 },
      consistency: { type: Number, min: 0, max: 100 },
      validity: { type: Number, min: 0, max: 100 },
      timeliness: { type: Number, min: 0, max: 100 },
      uniqueness: { type: Number, min: 0, max: 100 },
      
      // Quality distribution
      gradeDistribution: {
        A: Number,
        B: Number,
        C: Number,
        D: Number,
        F: Number
      },
      
      trend: String
    },
    
    // Quality by source type
    bySourceType: [{
      sourceType: String,
      qualityScore: Number,
      recordCount: Number,
      issueCount: Number
    }],
    
    // Quality by provider
    byProvider: [{
      providerId: String,
      providerName: String,
      qualityScore: Number,
      recordCount: Number,
      reliability: Number
    }],
    
    // Common issues
    commonIssues: [{
      issueType: String,
      frequency: Number,
      impact: String,
      affectedSources: Number,
      trend: String
    }],
    
    // Quality improvements
    improvements: [{
      period: String,
      improvement: Number,
      source: String,
      method: String
    }]
  },
  
  // Cost Analytics
  costMetrics: {
    // Overall cost summary
    summary: {
      totalCost: Number,
      currency: { type: String, default: 'USD' },
      
      // Cost breakdown
      providerCosts: Number,
      infrastructureCosts: Number,
      operationalCosts: Number,
      
      // Cost per unit
      costPerRecord: Number,
      costPerRequest: Number,
      costPerWorkflow: Number,
      
      // Budget tracking
      budget: Number,
      budgetUsed: { type: Number, min: 0, max: 100 },
      projectedCost: Number,
      variance: Number
    },
    
    // Cost trends
    trends: {
      // Monthly costs
      monthly: [{
        month: String,  // YYYY-MM
        cost: Number,
        records: Number,
        costPerRecord: Number
      }],
      
      // Cost efficiency trend
      efficiency: {
        trend: String,
        improvement: Number,
        projectedSavings: Number
      },
      
      // Forecasting
      forecast: [{
        period: String,
        projectedCost: Number,
        confidence: Number,
        factors: [String]
      }]
    },
    
    // Cost optimization
    optimization: {
      opportunities: [{
        type: String,
        description: String,
        potentialSaving: Number,
        effort: String,
        impact: String
      }],
      
      recommendations: [{
        priority: String,
        action: String,
        expectedSaving: Number,
        timeframe: String
      }]
    }
  },
  
  // Usage Statistics
  usageMetrics: {
    // User activity
    users: {
      totalUsers: Number,
      activeUsers: Number,
      newUsers: Number,
      
      // Usage patterns
      peakUsageHour: Number,
      peakUsageDay: Number,
      
      // User engagement
      avgSessionDuration: Number,
      avgWorkflowsPerUser: Number,
      avgRecordsPerUser: Number,
      
      // Top users
      topUsers: [{
        userId: String,
        userName: String,
        workflowCount: Number,
        recordsProcessed: Number,
        cost: Number
      }]
    },
    
    // System usage
    system: {
      totalRequests: Number,
      avgDailyRequests: Number,
      peakRequests: Number,
      
      // Feature usage
      featureUsage: [{
        feature: String,
        usageCount: Number,
        uniqueUsers: Number,
        trend: String
      }],
      
      // Geographic distribution
      geographic: [{
        region: String,
        userCount: Number,
        requestCount: Number,
        dataVolume: Number
      }]
    },
    
    // Growth metrics
    growth: {
      userGrowthRate: { type: Number, min: -100, max: 1000 },  // percentage
      usageGrowthRate: { type: Number, min: -100, max: 1000 },
      dataGrowthRate: { type: Number, min: -100, max: 1000 },
      
      // Growth projections
      projections: [{
        metric: String,
        period: String,
        projectedValue: Number,
        confidence: Number
      }]
    }
  },
  
  // Business Intelligence
  businessIntelligence: {
    // Key Performance Indicators (KPIs)
    kpis: [{
      name: String,
      value: Number,
      unit: String,
      target: Number,
      variance: Number,
      trend: String,
      
      // Benchmark comparison
      benchmark: {
        value: Number,
        source: String,
        comparison: String  // 'above', 'below', 'equal'
      }
    }],
    
    // Business impact metrics
    impact: {
      // Value delivered
      valueDelivered: {
        costSavings: Number,
        timesSaved: Number,  // hours
        efficiencyGains: Number,
        qualityImprovements: Number
      },
      
      // ROI analysis
      roi: {
        investment: Number,
        returns: Number,
        roiPercentage: Number,
        paybackPeriod: Number,  // months
        npv: Number
      },
      
      // Business outcomes
      outcomes: [{
        category: String,
        metric: String,
        baseline: Number,
        current: Number,
        improvement: Number,
        attribution: Number  // percentage attributable to Web-Hunter
      }]
    },
    
    // Insights and recommendations
    insights: [{
      type: {
        type: String,
        enum: ['opportunity', 'risk', 'trend', 'anomaly', 'recommendation']
      },
      
      priority: String,
      title: String,
      description: String,
      
      // Supporting data
      evidence: mongoose.Schema.Types.Mixed,
      confidence: { type: Number, min: 0, max: 1 },
      
      // Recommended actions
      actions: [{
        action: String,
        effort: String,
        impact: String,
        timeframe: String
      }]
    }]
  },
  
  // Time-Series Data
  timeSeries: [{
    timestamp: { type: Date, required: true },
    
    // Metrics at this point in time
    metrics: {
      // System metrics
      activeProviders: Number,
      runningWorkflows: Number,
      queuedJobs: Number,
      
      // Performance metrics
      avgResponseTime: Number,
      errorRate: Number,
      throughput: Number,
      
      // Quality metrics
      avgQualityScore: Number,
      qualityIssues: Number,
      
      // Cost metrics
      hourlyCost: Number,
      cumulativeCost: Number,
      
      // Usage metrics
      activeUsers: Number,
      apiCalls: Number,
      dataVolume: Number
    },
    
    // Events at this timestamp
    events: [{
      type: String,
      source: String,
      description: String,
      impact: String
    }]
  }],
  
  // Report Generation
  report: {
    // Report metadata
    generatedAt: { type: Date, default: Date.now },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    // Generation settings
    generation: {
      automated: { type: Boolean, default: false },
      schedule: String,
      
      // Data collection settings
      dataSources: [String],
      aggregationLevel: String,
      includeForecasts: { type: Boolean, default: false },
      includeRecommendations: { type: Boolean, default: true }
    },
    
    // Report format and distribution
    format: {
      type: String,
      enum: ['json', 'pdf', 'csv', 'excel', 'dashboard'],
      default: 'json'
    },
    
    // Distribution settings
    distribution: {
      recipients: [String],
      channels: [String],
      
      // Sharing settings
      public: { type: Boolean, default: false },
      teams: [String],
      organizations: [String]
    },
    
    // Report status
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed', 'scheduled'],
      default: 'completed'
    },
    
    errors: [String],
    warnings: [String]
  },
  
  // Metadata and Configuration
  metadata: {
    tags: [String],
    category: String,
    
    // Business context
    businessOwner: String,
    purpose: String,
    audience: [String],
    
    // Technical metadata
    dataFreshness: Date,
    lastUpdated: Date,
    updateFrequency: String,
    
    // Quality metadata
    dataCompleteness: { type: Number, min: 0, max: 100 },
    confidence: { type: Number, min: 0, max: 1 },
    
    // Notes and comments
    notes: String,
    methodology: String
  },
  
  // Access Control
  security: {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required']
    },
    
    visibility: {
      type: String,
      enum: ['private', 'team', 'organization', 'public'],
      default: 'team'
    },
    
    accessControl: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permissions: [{
        type: String,
        enum: ['view', 'download', 'share', 'edit', 'delete']
      }],
      grantedDate: { type: Date, default: Date.now }
    }]
  },
  
  // Audit Trail
  audit: {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastModified: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    
    // Access history
    accessHistory: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      action: String,
      timestamp: { type: Date, default: Date.now },
      ipAddress: String,
      userAgent: String
    }]
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for Performance
WebHunterAnalyticsSchema.index({ analyticsId: 1 });
WebHunterAnalyticsSchema.index({ reportType: 1 });
WebHunterAnalyticsSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
WebHunterAnalyticsSchema.index({ 'security.owner': 1 });
WebHunterAnalyticsSchema.index({ 'report.generatedAt': -1 });

// Compound indexes
WebHunterAnalyticsSchema.index({ reportType: 1, 'period.startDate': -1 });
WebHunterAnalyticsSchema.index({ 'security.owner': 1, reportType: 1 });
WebHunterAnalyticsSchema.index({ 'security.visibility': 1, 'report.generatedAt': -1 });

// Time-series index
WebHunterAnalyticsSchema.index({ 'timeSeries.timestamp': 1 });

// Text index for search
WebHunterAnalyticsSchema.index({
  name: 'text',
  description: 'text',
  'metadata.tags': 'text'
});

// Virtual for report age
WebHunterAnalyticsSchema.virtual('reportAge').get(function() {
  const now = new Date();
  const generated = this.report.generatedAt;
  return Math.round((now - generated) / (1000 * 60 * 60)); // hours
});

// Virtual for data freshness indicator
WebHunterAnalyticsSchema.virtual('dataFreshness').get(function() {
  const age = this.reportAge;
  if (age < 1) return 'fresh';
  if (age < 24) return 'recent';
  if (age < 168) return 'week_old';  // 1 week
  return 'stale';
});

// Virtual for overall system health
WebHunterAnalyticsSchema.virtual('systemHealth').get(function() {
  if (!this.systemMetrics || !this.systemMetrics.health) return 'unknown';
  
  const score = this.systemMetrics.health.overallScore;
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'fair';
  if (score >= 50) return 'poor';
  return 'critical';
});

// Instance Methods

/**
 * Calculate ROI for the analytics period
 * @returns {Object} - ROI calculation
 */
WebHunterAnalyticsSchema.methods.calculateROI = function() {
  if (!this.businessIntelligence || !this.businessIntelligence.impact) {
    return { roi: 0, confidence: 0 };
  }
  
  const impact = this.businessIntelligence.impact;
  if (!impact.roi) return { roi: 0, confidence: 0 };
  
  return {
    roi: impact.roi.roiPercentage || 0,
    paybackPeriod: impact.roi.paybackPeriod || 0,
    confidence: 0.8 // Default confidence
  };
};

/**
 * Get top performing providers
 * @param {number} limit - Number of top providers to return
 * @returns {Array} - Top performing providers
 */
WebHunterAnalyticsSchema.methods.getTopProviders = function(limit = 5) {
  if (!this.providerMetrics) return [];
  
  return this.providerMetrics
    .sort((a, b) => {
      // Sort by performance score (combination of success rate and response time)
      const scoreA = (a.performance.successRate || 0) - (a.performance.avgResponseTime || 0) / 1000;
      const scoreB = (b.performance.successRate || 0) - (b.performance.avgResponseTime || 0) / 1000;
      return scoreB - scoreA;
    })
    .slice(0, limit)
    .map(p => ({
      providerId: p.providerId,
      providerName: p.providerName,
      successRate: p.performance.successRate,
      avgResponseTime: p.performance.avgResponseTime,
      totalCost: p.costs.totalCost,
      qualityScore: p.performance.dataQualityScore
    }));
};

/**
 * Get cost optimization opportunities
 * @returns {Array} - Cost optimization opportunities
 */
WebHunterAnalyticsSchema.methods.getCostOptimizations = function() {
  if (!this.costMetrics || !this.costMetrics.optimization) return [];
  
  return this.costMetrics.optimization.opportunities
    .sort((a, b) => b.potentialSaving - a.potentialSaving)
    .map(opp => ({
      type: opp.type,
      description: opp.description,
      potentialSaving: opp.potentialSaving,
      effort: opp.effort,
      roi: opp.potentialSaving / (opp.effort === 'low' ? 1 : opp.effort === 'medium' ? 5 : 10)
    }));
};

/**
 * Generate executive summary
 * @returns {Object} - Executive summary
 */
WebHunterAnalyticsSchema.methods.generateExecutiveSummary = function() {
  return {
    period: `${this.period.startDate.toISOString().split('T')[0]} to ${this.period.endDate.toISOString().split('T')[0]}`,
    
    // Key metrics
    systemHealth: this.systemHealth,
    totalCost: this.costMetrics?.summary?.totalCost || 0,
    totalRecords: this.workflowMetrics?.reduce((sum, w) => sum + (w.dataProcessing?.totalRecordsProcessed || 0), 0) || 0,
    avgQualityScore: this.qualityMetrics?.overall?.avgQualityScore || 0,
    
    // Top insights
    topInsights: this.businessIntelligence?.insights?.slice(0, 3) || [],
    
    // Key recommendations
    keyRecommendations: this.getCostOptimizations().slice(0, 3),
    
    // Performance highlights
    topProviders: this.getTopProviders(3),
    
    // ROI
    roi: this.calculateROI()
  };
};

// Static Methods

/**
 * Generate next analytics ID
 * @returns {Promise<string>} - Next analytics ID
 */
WebHunterAnalyticsSchema.statics.generateAnalyticsId = async function() {
  const count = await this.countDocuments();
  const nextNumber = count + 1;
  return `WHA${nextNumber.toString().padStart(8, '0')}`;
};

/**
 * Get latest analytics by type
 * @param {string} reportType - Report type
 * @param {number} limit - Number of reports to return
 * @returns {Promise<WebHunterAnalytics[]>} - Latest analytics
 */
WebHunterAnalyticsSchema.statics.getLatestByType = function(reportType, limit = 10) {
  return this.find({ reportType })
    .sort({ 'report.generatedAt': -1 })
    .limit(limit)
    .populate('security.owner', 'profile.firstName profile.lastName email');
};

/**
 * Get analytics for date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} reportType - Optional report type filter
 * @returns {Promise<WebHunterAnalytics[]>} - Analytics in date range
 */
WebHunterAnalyticsSchema.statics.getByDateRange = function(startDate, endDate, reportType = null) {
  const query = {
    'period.startDate': { $gte: startDate },
    'period.endDate': { $lte: endDate }
  };
  
  if (reportType) {
    query.reportType = reportType;
  }
  
  return this.find(query).sort({ 'report.generatedAt': -1 });
};

/**
 * Get system overview statistics
 * @returns {Promise<Object>} - System overview
 */
WebHunterAnalyticsSchema.statics.getSystemOverview = function() {
  return this.aggregate([
    { $match: { reportType: 'system_overview' } },
    { $sort: { 'report.generatedAt': -1 } },
    { $limit: 1 },
    {
      $project: {
        systemHealth: '$systemMetrics.health.overallScore',
        totalCost: '$costMetrics.summary.totalCost',
        avgQualityScore: '$qualityMetrics.overall.avgQualityScore',
        totalProviders: { $size: '$providerMetrics' },
        totalWorkflows: { $size: '$workflowMetrics' },
        generatedAt: '$report.generatedAt'
      }
    }
  ]);
};

module.exports = mongoose.model('WebHunterAnalytics', WebHunterAnalyticsSchema);