const mongoose = require('mongoose');

/**
 * ProviderIntegration Schema - Web-Hunter Framework
 * Manages external data mining provider integrations (Bright Data, Apify, OpenAlex, etc.)
 * System Integrator approach - orchestrating best-of-breed platforms
 */
const ProviderIntegrationSchema = new mongoose.Schema({
  // Provider Identification
  providerId: {
    type: String,
    required: [true, 'Provider ID is required'],
    unique: true,
    uppercase: true,
    match: [/^PROV[0-9]{6}$/, 'Provider ID must be in format PROV000000']
  },
  
  name: {
    type: String,
    required: [true, 'Provider name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Provider Classification (from our research)
  classification: {
    tier: {
      type: String,
      enum: ['enterprise_champion', 'specialized_solution', 'intelligence_specialist', 'cost_optimizer'],
      required: [true, 'Provider tier is required']
    },
    
    category: {
      type: String,
      enum: ['web_scraping', 'api_extraction', 'academic_research', 'threat_intelligence', 'business_intelligence', 'ai_extraction'],
      required: [true, 'Provider category is required']
    },
    
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium'
    },
    
    specializations: [{
      type: String,
      enum: ['e_commerce', 'social_media', 'financial_data', 'government_sources', 'academic_papers', 'dark_web', 'real_time_data', 'ai_ready_content']
    }]
  },
  
  // Technical Integration Details
  integration: {
    // API Configuration
    api: {
      baseUrl: {
        type: String,
        required: [true, 'API base URL is required']
      },
      
      version: {
        type: String,
        default: 'v1'
      },
      
      endpoints: [{
        name: String,
        path: String,
        method: {
          type: String,
          enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          default: 'GET'
        },
        description: String,
        parameters: mongoose.Schema.Types.Mixed,
        responseFormat: {
          type: String,
          enum: ['json', 'xml', 'csv', 'text', 'binary'],
          default: 'json'
        }
      }],
      
      rateLimits: {
        requestsPerSecond: { type: Number, default: 10 },
        requestsPerMinute: { type: Number, default: 600 },
        requestsPerHour: { type: Number, default: 36000 },
        requestsPerDay: { type: Number, default: 864000 },
        burstLimit: { type: Number, default: 50 }
      },
      
      timeout: {
        connect: { type: Number, default: 5000 },
        read: { type: Number, default: 30000 },
        request: { type: Number, default: 60000 }
      }
    },
    
    // Authentication Methods
    authentication: {
      type: {
        type: String,
        enum: ['none', 'api_key', 'bearer_token', 'basic_auth', 'oauth2', 'jwt', 'custom'],
        required: [true, 'Authentication type is required']
      },
      
      // API Key authentication
      apiKey: {
        headerName: { type: String, default: 'X-API-Key' },
        paramName: String,
        prefix: String // e.g., "Bearer ", "Token "
      },
      
      // OAuth 2.0 configuration
      oauth2: {
        authUrl: String,
        tokenUrl: String,
        refreshUrl: String,
        scopes: [String],
        clientId: String,
        // clientSecret stored in environment variables
        grantType: {
          type: String,
          enum: ['authorization_code', 'client_credentials', 'password'],
          default: 'client_credentials'
        }
      },
      
      // Basic Auth
      basicAuth: {
        usernameField: { type: String, default: 'username' },
        passwordField: { type: String, default: 'password' }
      },
      
      // Custom authentication headers
      customHeaders: [{
        name: String,
        value: String,
        encrypted: { type: Boolean, default: false }
      }]
    },
    
    // SDK Support
    sdks: [{
      language: {
        type: String,
        enum: ['javascript', 'python', 'java', 'csharp', 'php', 'ruby', 'go', 'curl']
      },
      version: String,
      packageName: String,
      installCommand: String,
      documentation: String,
      quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'good'
      }
    }],
    
    // Data Formats Supported
    dataFormats: {
      input: [{
        type: String,
        enum: ['json', 'xml', 'csv', 'form_data', 'multipart', 'raw_text', 'binary']
      }],
      output: [{
        type: String,
        enum: ['json', 'xml', 'csv', 'excel', 'parquet', 'avro', 'markdown', 'html', 'pdf']
      }]
    }
  },
  
  // Service Capabilities (from our provider research)
  capabilities: {
    // Data Source Coverage
    dataSources: [{
      type: {
        type: String,
        enum: ['websites', 'apis', 'databases', 'social_media', 'e_commerce', 'government', 'academic', 'financial', 'news_media', 'dark_web']
      },
      coverage: {
        geographic: [String], // Country codes
        languages: [String],  // ISO language codes
        domains: [String],    // Specific domains or patterns
        volume: String        // e.g., "100M+ records", "1000+ sites"
      },
      quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'good'
      }
    }],
    
    // Technical Capabilities
    features: [{
      name: String,
      type: {
        type: String,
        enum: ['javascript_rendering', 'captcha_solving', 'proxy_rotation', 'session_management', 'anti_bot_detection', 'real_time_streaming', 'bulk_download', 'ai_extraction', 'content_parsing', 'data_validation']
      },
      supported: { type: Boolean, default: true },
      limitations: String,
      additionalCost: { type: Boolean, default: false }
    }],
    
    // Performance Specifications
    performance: {
      maxConcurrency: Number,
      avgResponseTime: Number, // milliseconds
      successRate: { type: Number, min: 0, max: 100 }, // percentage
      uptime: { type: Number, min: 0, max: 100 }, // percentage
      throughput: String, // e.g., "1000 requests/minute"
    },
    
    // Compliance & Security
    compliance: {
      gdprCompliant: { type: Boolean, default: false },
      ccpaCompliant: { type: Boolean, default: false },
      soxCompliant: { type: Boolean, default: false },
      soc2Type2: { type: Boolean, default: false },
      iso27001: { type: Boolean, default: false },
      pciDss: { type: Boolean, default: false },
      
      certifications: [String],
      dataRetentionPolicy: String,
      dataLocationRestrictions: [String]
    }
  },
  
  // Pricing and Cost Management
  pricing: {
    model: {
      type: String,
      enum: ['pay_per_request', 'subscription', 'tiered', 'volume_based', 'custom', 'free'],
      required: [true, 'Pricing model is required']
    },
    
    tiers: [{
      name: String,
      description: String,
      price: {
        amount: Number,
        currency: { type: String, default: 'USD' },
        period: {
          type: String,
          enum: ['per_request', 'monthly', 'annually', 'one_time'],
          default: 'monthly'
        }
      },
      limits: {
        requests: Number,
        dataVolume: String, // e.g., "100GB"
        features: [String]
      },
      recommended: { type: Boolean, default: false }
    }],
    
    costTracking: {
      enabled: { type: Boolean, default: true },
      estimatedMonthlyCost: Number,
      actualMonthlyCost: Number,
      lastCalculated: Date,
      costPerRequest: Number,
      costPerRecord: Number
    }
  },
  
  // Connection Status and Health
  status: {
    connection: {
      type: String,
      enum: ['connected', 'disconnected', 'error', 'testing', 'maintenance'],
      default: 'disconnected'
    },
    
    health: {
      lastCheck: Date,
      lastSuccessfulRequest: Date,
      lastError: {
        timestamp: Date,
        message: String,
        code: String,
        details: mongoose.Schema.Types.Mixed
      },
      
      metrics: {
        avgResponseTime: Number,
        successRate: Number,
        errorRate: Number,
        requestCount24h: { type: Number, default: 0 },
        errorCount24h: { type: Number, default: 0 }
      }
    },
    
    maintenance: {
      scheduled: [{
        start: Date,
        end: Date,
        description: String,
        impact: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical']
        }
      }],
      
      lastUpdated: Date
    }
  },
  
  // Configuration and Settings
  configuration: {
    // Environment-specific settings
    environments: [{
      name: {
        type: String,
        enum: ['development', 'testing', 'staging', 'production'],
        required: true
      },
      
      enabled: { type: Boolean, default: true },
      
      config: {
        baseUrl: String,
        credentials: mongoose.Schema.Types.Mixed, // Encrypted
        rateLimits: mongoose.Schema.Types.Mixed,
        customSettings: mongoose.Schema.Types.Mixed
      }
    }],
    
    // Retry and Fallback Strategy
    reliability: {
      retryPolicy: {
        enabled: { type: Boolean, default: true },
        maxRetries: { type: Number, default: 3 },
        backoffStrategy: {
          type: String,
          enum: ['linear', 'exponential', 'fixed'],
          default: 'exponential'
        },
        baseDelay: { type: Number, default: 1000 }, // milliseconds
        maxDelay: { type: Number, default: 30000 }
      },
      
      circuitBreaker: {
        enabled: { type: Boolean, default: true },
        failureThreshold: { type: Number, default: 5 },
        timeout: { type: Number, default: 60000 },
        resetTimeout: { type: Number, default: 300000 }
      },
      
      fallbackProviders: [{
        providerId: String,
        priority: Number,
        conditions: [String] // When to use this fallback
      }]
    },
    
    // Custom Configuration
    customConfig: mongoose.Schema.Types.Mixed,
    
    // Integration Preferences
    preferences: {
      preferredDataFormat: String,
      preferredAuthentication: String,
      maxConcurrentRequests: { type: Number, default: 10 },
      enableCaching: { type: Boolean, default: true },
      cacheTimeout: { type: Number, default: 3600 }, // seconds
      enableMetrics: { type: Boolean, default: true }
    }
  },
  
  // Usage Analytics and Monitoring
  analytics: {
    usage: {
      totalRequests: { type: Number, default: 0 },
      successfulRequests: { type: Number, default: 0 },
      failedRequests: { type: Number, default: 0 },
      totalDataProcessed: { type: Number, default: 0 }, // bytes
      avgResponseTime: Number,
      
      // Time-series data (last 30 days)
      dailyStats: [{
        date: { type: Date, required: true },
        requests: { type: Number, default: 0 },
        successes: { type: Number, default: 0 },
        failures: { type: Number, default: 0 },
        avgResponseTime: Number,
        dataVolume: { type: Number, default: 0 },
        cost: { type: Number, default: 0 }
      }]
    },
    
    performance: {
      benchmarks: [{
        date: Date,
        test: String,
        result: mongoose.Schema.Types.Mixed,
        score: Number,
        notes: String
      }],
      
      trends: {
        responseTimesTrend: String, // 'improving', 'stable', 'degrading'
        reliabilityTrend: String,
        costTrend: String,
        lastAnalyzed: Date
      }
    }
  },
  
  // Documentation and Support
  documentation: {
    officialDocs: String,
    apiReference: String,
    gettingStarted: String,
    examples: String,
    sdkDocs: String,
    community: String,
    
    // Internal documentation
    internalNotes: String,
    integrationGuide: String,
    troubleshooting: String,
    bestPractices: String
  },
  
  // Access Control and Security
  security: {
    // Who can manage this provider integration
    administrators: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permissions: [{
        type: String,
        enum: ['view', 'configure', 'test', 'deploy', 'monitor', 'delete']
      }],
      addedDate: { type: Date, default: Date.now }
    }],
    
    // Credential management
    credentials: {
      encrypted: { type: Boolean, default: true },
      rotationPolicy: {
        enabled: { type: Boolean, default: false },
        intervalDays: Number,
        lastRotated: Date,
        nextRotation: Date
      },
      
      // Security settings
      ipWhitelist: [String],
      accessRestrictions: [String],
      auditLog: { type: Boolean, default: true }
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
ProviderIntegrationSchema.index({ providerId: 1 });
ProviderIntegrationSchema.index({ name: 1 });
ProviderIntegrationSchema.index({ 'classification.tier': 1 });
ProviderIntegrationSchema.index({ 'classification.category': 1 });
ProviderIntegrationSchema.index({ 'status.connection': 1 });
ProviderIntegrationSchema.index({ 'classification.priority': 1 });

// Compound indexes
ProviderIntegrationSchema.index({ 'classification.tier': 1, 'status.connection': 1 });
ProviderIntegrationSchema.index({ 'classification.category': 1, 'classification.priority': 1 });

// Text index for search
ProviderIntegrationSchema.index({
  name: 'text',
  displayName: 'text',
  description: 'text',
  'classification.specializations': 'text'
});

// Virtual for connection health score
ProviderIntegrationSchema.virtual('healthScore').get(function() {
  if (!this.status.health.metrics) return 0;
  
  const metrics = this.status.health.metrics;
  const successRate = metrics.successRate || 0;
  const responseTime = metrics.avgResponseTime || 0;
  
  // Health score based on success rate and response time
  let score = successRate;
  if (responseTime > 0) {
    // Penalize slow response times
    const responseTimePenalty = Math.min(responseTime / 1000, 50); // Max 50 point penalty
    score = Math.max(0, score - responseTimePenalty);
  }
  
  return Math.round(score);
});

// Virtual for cost efficiency
ProviderIntegrationSchema.virtual('costEfficiency').get(function() {
  const pricing = this.pricing.costTracking;
  if (!pricing.costPerRequest) return 'unknown';
  
  if (pricing.costPerRequest < 0.001) return 'excellent';
  if (pricing.costPerRequest < 0.01) return 'good';
  if (pricing.costPerRequest < 0.1) return 'fair';
  return 'expensive';
});

// Instance Methods

/**
 * Test provider connection and API endpoints
 * @returns {Promise<Object>} - Test results
 */
ProviderIntegrationSchema.methods.testConnection = async function() {
  // Implementation would test actual API connection
  // For now, return mock result
  return {
    success: true,
    responseTime: 250,
    endpoints: [],
    timestamp: new Date()
  };
};

/**
 * Update health metrics
 * @param {Object} metrics - New metrics data
 * @returns {Promise} - Saved provider
 */
ProviderIntegrationSchema.methods.updateHealthMetrics = function(metrics) {
  this.status.health.metrics = { ...this.status.health.metrics, ...metrics };
  this.status.health.lastCheck = new Date();
  return this.save();
};

/**
 * Add usage statistics
 * @param {Object} stats - Usage statistics
 * @returns {Promise} - Saved provider
 */
ProviderIntegrationSchema.methods.addUsageStats = function(stats) {
  const today = new Date().toISOString().split('T')[0];
  const dailyStat = this.analytics.usage.dailyStats.find(
    stat => stat.date.toISOString().split('T')[0] === today
  );
  
  if (dailyStat) {
    dailyStat.requests += stats.requests || 0;
    dailyStat.successes += stats.successes || 0;
    dailyStat.failures += stats.failures || 0;
    dailyStat.dataVolume += stats.dataVolume || 0;
    dailyStat.cost += stats.cost || 0;
  } else {
    this.analytics.usage.dailyStats.push({
      date: new Date(),
      requests: stats.requests || 0,
      successes: stats.successes || 0,
      failures: stats.failures || 0,
      avgResponseTime: stats.avgResponseTime,
      dataVolume: stats.dataVolume || 0,
      cost: stats.cost || 0
    });
  }
  
  // Update totals
  this.analytics.usage.totalRequests += stats.requests || 0;
  this.analytics.usage.successfulRequests += stats.successes || 0;
  this.analytics.usage.failedRequests += stats.failures || 0;
  
  return this.save();
};

/**
 * Check if provider is available for use
 * @returns {boolean} - True if provider is available
 */
ProviderIntegrationSchema.methods.isAvailable = function() {
  return this.status.connection === 'connected' && 
         this.healthScore >= 50; // Minimum health threshold
};

// Static Methods

/**
 * Generate next provider ID
 * @returns {Promise<string>} - Next provider ID
 */
ProviderIntegrationSchema.statics.generateProviderId = async function() {
  const count = await this.countDocuments();
  const nextNumber = count + 1;
  return `PROV${nextNumber.toString().padStart(6, '0')}`;
};

/**
 * Find providers by tier and category
 * @param {string} tier - Provider tier
 * @param {string} category - Provider category
 * @returns {Promise<ProviderIntegration[]>} - Array of providers
 */
ProviderIntegrationSchema.statics.findByTierAndCategory = function(tier, category) {
  return this.find({
    'classification.tier': tier,
    'classification.category': category,
    'status.connection': 'connected'
  }).sort({ 'classification.priority': 1 });
};

/**
 * Find available providers for data source type
 * @param {string} sourceType - Data source type
 * @returns {Promise<ProviderIntegration[]>} - Array of available providers
 */
ProviderIntegrationSchema.statics.findForDataSource = function(sourceType) {
  return this.find({
    'capabilities.dataSources.type': sourceType,
    'status.connection': 'connected'
  }).sort({ 'classification.priority': 1, healthScore: -1 });
};

/**
 * Get cost-optimized provider recommendations
 * @param {string} dataType - Type of data needed
 * @param {number} estimatedVolume - Estimated data volume
 * @returns {Promise<ProviderIntegration[]>} - Cost-optimized providers
 */
ProviderIntegrationSchema.statics.getCostOptimizedProviders = function(dataType, estimatedVolume) {
  return this.find({
    'capabilities.dataSources.type': dataType,
    'status.connection': 'connected'
  }).sort({ 'pricing.costTracking.costPerRequest': 1 });
};

module.exports = mongoose.model('ProviderIntegration', ProviderIntegrationSchema);