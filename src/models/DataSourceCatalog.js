const mongoose = require('mongoose');

/**
 * DataSourceCatalog Schema - Web-Hunter Framework
 * Comprehensive catalog of all available data sources across integrated providers
 * Maps data sources to provider capabilities and access methods
 */
const DataSourceCatalogSchema = new mongoose.Schema({
  // Source Identification
  sourceId: {
    type: String,
    required: [true, 'Source ID is required'],
    unique: true,
    uppercase: true,
    match: [/^SRC[0-9]{8}$/, 'Source ID must be in format SRC00000000']
  },
  
  name: {
    type: String,
    required: [true, 'Source name is required'],
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
  
  // Source Classification
  classification: {
    type: {
      type: String,
      enum: ['website', 'api', 'database', 'social_media', 'e_commerce', 'government', 'academic', 'financial', 'news_media', 'dark_web', 'file_repository'],
      required: [true, 'Source type is required']
    },
    
    category: {
      type: String,
      enum: ['public', 'private', 'restricted', 'premium', 'government', 'academic', 'commercial'],
      required: [true, 'Source category is required']
    },
    
    industry: [{
      type: String,
      enum: ['technology', 'finance', 'healthcare', 'education', 'government', 'retail', 'media', 'legal', 'real_estate', 'automotive', 'energy', 'telecommunications', 'general']
    }],
    
    dataTypes: [{
      type: String,
      enum: ['structured', 'unstructured', 'semi_structured', 'binary', 'multimedia', 'geospatial', 'time_series', 'graph', 'text', 'images', 'videos', 'documents']
    }],
    
    accessibility: {
      type: String,
      enum: ['public', 'registration_required', 'subscription_required', 'api_key_required', 'oauth_required', 'restricted'],
      default: 'public'
    }
  },
  
  // Source Technical Details
  technical: {
    // Primary URL or endpoint
    primaryUrl: {
      type: String,
      required: [true, 'Primary URL is required']
    },
    
    // Alternative URLs/mirrors
    alternativeUrls: [String],
    
    // Protocol information
    protocol: {
      type: String,
      enum: ['http', 'https', 'ftp', 'sftp', 'websocket', 'graphql', 'rest', 'soap', 'rss', 'custom'],
      default: 'https'
    },
    
    // Content structure
    structure: {
      format: {
        type: String,
        enum: ['html', 'json', 'xml', 'csv', 'rss', 'atom', 'yaml', 'binary', 'multipart', 'text', 'custom']
      },
      
      encoding: {
        type: String,
        default: 'utf-8'
      },
      
      // For web scraping sources
      selectors: [{
        name: String,
        selector: String,
        attribute: String,
        dataType: String,
        required: Boolean,
        description: String
      }],
      
      // For API sources
      endpoints: [{
        path: String,
        method: String,
        parameters: mongoose.Schema.Types.Mixed,
        responseSchema: mongoose.Schema.Types.Mixed,
        pagination: {
          type: {
            type: String,
            enum: ['offset', 'cursor', 'page', 'none']
          },
          parameters: mongoose.Schema.Types.Mixed
        }
      }],
      
      // Data schema definition
      schema: mongoose.Schema.Types.Mixed,
      
      // Sample data
      sampleData: mongoose.Schema.Types.Mixed
    },
    
    // Update characteristics
    updateFrequency: {
      type: String,
      enum: ['real_time', 'hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'annually', 'irregular', 'static'],
      default: 'daily'
    },
    
    dataVolume: {
      estimate: String, // e.g., "10M records", "500GB"
      lastMeasured: Date,
      growthRate: String // e.g., "10% monthly"
    },
    
    // Technical constraints
    constraints: {
      rateLimit: {
        requests: Number,
        period: String, // e.g., "minute", "hour"
        enforced: Boolean
      },
      
      robotsTxt: {
        exists: Boolean,
        respectRequired: Boolean,
        crawlDelay: Number
      },
      
      authentication: {
        required: Boolean,
        methods: [String],
        registrationUrl: String
      },
      
      ipRestrictions: {
        hasRestrictions: Boolean,
        allowedRegions: [String],
        blockedRegions: [String]
      }
    }
  },
  
  // Data Quality and Reliability
  quality: {
    // Overall quality assessment
    score: {
      overall: { type: Number, min: 0, max: 100 },
      completeness: { type: Number, min: 0, max: 100 },
      accuracy: { type: Number, min: 0, max: 100 },
      consistency: { type: Number, min: 0, max: 100 },
      timeliness: { type: Number, min: 0, max: 100 },
      lastAssessed: Date
    },
    
    // Reliability metrics
    reliability: {
      uptime: { type: Number, min: 0, max: 100 }, // percentage
      avgResponseTime: Number, // milliseconds
      errorRate: { type: Number, min: 0, max: 100 }, // percentage
      lastCheck: Date,
      consecutiveFailures: { type: Number, default: 0 }
    },
    
    // Data freshness
    freshness: {
      lastUpdated: Date,
      updatePattern: String, // detected pattern
      staleThreshold: Number, // hours after which data is considered stale
      isFresh: { type: Boolean, default: true }
    },
    
    // Quality issues tracking
    issues: [{
      type: {
        type: String,
        enum: ['missing_data', 'duplicate_records', 'format_changes', 'encoding_issues', 'broken_links', 'access_denied', 'rate_limited', 'structure_changes']
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      description: String,
      firstDetected: { type: Date, default: Date.now },
      lastOccurrence: { type: Date, default: Date.now },
      occurrenceCount: { type: Number, default: 1 },
      resolved: { type: Boolean, default: false },
      resolvedDate: Date
    }]
  },
  
  // Provider Integration Mapping
  providers: [{
    // Reference to ProviderIntegration
    providerId: {
      type: String,
      required: true
    },
    
    providerName: String,
    
    // How this provider accesses this source
    accessMethod: {
      type: String,
      enum: ['direct_api', 'web_scraping', 'database_query', 'file_download', 'stream_processing', 'proxy_access'],
      required: true
    },
    
    // Provider-specific configuration
    configuration: mongoose.Schema.Types.Mixed,
    
    // Performance metrics for this provider-source combination
    performance: {
      successRate: { type: Number, min: 0, max: 100 },
      avgResponseTime: Number,
      dataQuality: { type: Number, min: 0, max: 100 },
      costPerRequest: Number,
      lastBenchmark: Date
    },
    
    // Supported features for this source
    features: [{
      name: String,
      supported: Boolean,
      limitations: String
    }],
    
    // Priority and preference
    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    
    recommended: { type: Boolean, default: false },
    
    status: {
      type: String,
      enum: ['active', 'inactive', 'testing', 'deprecated'],
      default: 'active'
    },
    
    // Cost information
    costs: {
      setupCost: Number,
      costPerRequest: Number,
      monthlyFee: Number,
      freeQuota: Number
    }
  }],
  
  // Content and Data Characteristics
  content: {
    // Languages available
    languages: [{
      code: String, // ISO 639-1 code
      name: String,
      coverage: { type: Number, min: 0, max: 100 }, // percentage
      quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      }
    }],
    
    // Geographic coverage
    geographic: {
      global: { type: Boolean, default: false },
      regions: [String], // Continent codes
      countries: [String], // ISO country codes
      cities: [String],
      coordinates: {
        type: {
          type: String,
          enum: ['Point', 'Polygon', 'MultiPolygon'],
          default: 'Point'
        },
        coordinates: [Number] // [longitude, latitude] for Point
      }
    },
    
    // Time coverage
    temporal: {
      startDate: Date,
      endDate: Date,
      granularity: {
        type: String,
        enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']
      },
      timeZone: String,
      historical: { type: Boolean, default: false },
      realTime: { type: Boolean, default: false }
    },
    
    // Content topics and themes
    topics: [{
      name: String,
      category: String,
      confidence: { type: Number, min: 0, max: 1 },
      keywords: [String]
    }],
    
    // Content format details
    formats: [{
      type: String,
      encoding: String,
      compression: String,
      averageSize: String,
      maxSize: String
    }]
  },
  
  // Access Control and Legal
  access: {
    // Legal status
    legal: {
      publicDomain: { type: Boolean, default: false },
      copyrighted: { type: Boolean, default: true },
      license: String,
      licenseUrl: String,
      
      // Terms of use
      termsOfUse: String,
      termsUrl: String,
      acceptanceRequired: { type: Boolean, default: false },
      
      // Usage restrictions
      restrictions: [{
        type: {
          type: String,
          enum: ['commercial_use', 'redistribution', 'modification', 'attribution', 'time_limited', 'geographic', 'volume_limited']
        },
        description: String,
        severity: {
          type: String,
          enum: ['info', 'warning', 'restriction', 'prohibition']
        }
      }]
    },
    
    // Privacy and compliance
    privacy: {
      containsPII: { type: Boolean, default: false },
      gdprCompliant: { type: Boolean, default: false },
      ccpaCompliant: { type: Boolean, default: false },
      privacyPolicy: String,
      dataProcessingAgreement: String,
      
      // Personal data types if any
      personalDataTypes: [{
        type: String,
        sensitivity: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical']
        },
        processingBasis: String
      }]
    },
    
    // Authentication requirements
    authentication: {
      required: { type: Boolean, default: false },
      methods: [String],
      registrationRequired: { type: Boolean, default: false },
      registrationUrl: String,
      approvalRequired: { type: Boolean, default: false },
      approvalProcess: String
    }
  },
  
  // Usage Statistics and Analytics
  analytics: {
    // Usage tracking
    usage: {
      totalAccesses: { type: Number, default: 0 },
      uniqueUsers: { type: Number, default: 0 },
      lastAccessed: Date,
      popularityScore: { type: Number, min: 0, max: 100, default: 0 },
      
      // Usage by provider
      providerUsage: [{
        providerId: String,
        accessCount: Number,
        lastAccess: Date,
        avgDataQuality: Number
      }],
      
      // Usage trends
      monthlyStats: [{
        month: String, // YYYY-MM format
        accesses: Number,
        uniqueUsers: Number,
        dataVolume: Number,
        avgQuality: Number
      }]
    },
    
    // Performance analytics
    performance: {
      benchmarks: [{
        date: Date,
        providerId: String,
        metrics: {
          responseTime: Number,
          successRate: Number,
          dataQuality: Number,
          cost: Number
        },
        testType: String,
        notes: String
      }],
      
      trends: {
        qualityTrend: String, // 'improving', 'stable', 'degrading'
        reliabilityTrend: String,
        accessibilityTrend: String,
        lastAnalyzed: Date
      }
    }
  },
  
  // Discovery and Monitoring
  discovery: {
    // How was this source discovered
    discoveryMethod: {
      type: String,
      enum: ['manual_addition', 'automated_crawl', 'provider_catalog', 'user_suggestion', 'api_discovery', 'link_analysis'],
      default: 'manual_addition'
    },
    
    discoveredBy: String,
    discoveredDate: { type: Date, default: Date.now },
    
    // Monitoring configuration
    monitoring: {
      enabled: { type: Boolean, default: true },
      frequency: {
        type: String,
        enum: ['hourly', 'daily', 'weekly', 'monthly'],
        default: 'daily'
      },
      
      checks: [{
        type: {
          type: String,
          enum: ['availability', 'structure', 'content_change', 'quality', 'performance']
        },
        enabled: Boolean,
        threshold: mongoose.Schema.Types.Mixed,
        lastCheck: Date,
        status: String
      }],
      
      alerts: [{
        condition: String,
        recipients: [String],
        severity: String,
        enabled: { type: Boolean, default: true }
      }]
    },
    
    // Related sources
    relationships: [{
      sourceId: String,
      relationship: {
        type: String,
        enum: ['duplicate', 'mirror', 'subset', 'superset', 'related', 'derived', 'federated']
      },
      confidence: { type: Number, min: 0, max: 1 },
      description: String
    }]
  },
  
  // Tags and Metadata
  metadata: {
    tags: [String],
    keywords: [String],
    
    // Business metadata
    businessValue: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium'
    },
    
    strategicImportance: {
      type: String,
      enum: ['strategic', 'important', 'useful', 'optional'],
      default: 'useful'
    },
    
    // Technical metadata
    version: { type: String, default: '1.0.0' },
    lastValidated: Date,
    validatedBy: String,
    
    // Contact information
    contact: {
      owner: String,
      email: String,
      organization: String,
      website: String
    },
    
    // Notes and comments
    notes: String,
    internalComments: String
  },
  
  // Status and Lifecycle
  status: {
    overall: {
      type: String,
      enum: ['active', 'inactive', 'deprecated', 'testing', 'maintenance', 'blocked'],
      default: 'active'
    },
    
    availability: {
      type: String,
      enum: ['available', 'unavailable', 'limited', 'maintenance', 'unknown'],
      default: 'available'
    },
    
    lastStatusCheck: Date,
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      reason: String,
      changedBy: String
    }],
    
    // Lifecycle management
    lifecycle: {
      stage: {
        type: String,
        enum: ['discovery', 'evaluation', 'integration', 'production', 'maintenance', 'deprecation'],
        default: 'discovery'
      },
      
      nextReview: Date,
      retentionPeriod: Number, // days
      archiveDate: Date
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
DataSourceCatalogSchema.index({ sourceId: 1 });
DataSourceCatalogSchema.index({ name: 1 });
DataSourceCatalogSchema.index({ 'classification.type': 1 });
DataSourceCatalogSchema.index({ 'classification.category': 1 });
DataSourceCatalogSchema.index({ 'status.overall': 1 });
DataSourceCatalogSchema.index({ 'providers.providerId': 1 });

// Compound indexes
DataSourceCatalogSchema.index({ 'classification.type': 1, 'status.overall': 1 });
DataSourceCatalogSchema.index({ 'classification.category': 1, 'quality.score.overall': -1 });
DataSourceCatalogSchema.index({ 'providers.providerId': 1, 'providers.status': 1 });

// Geospatial index
DataSourceCatalogSchema.index({ 'content.geographic.coordinates': '2dsphere' });

// Text index for search
DataSourceCatalogSchema.index({
  name: 'text',
  displayName: 'text',
  description: 'text',
  'metadata.tags': 'text',
  'metadata.keywords': 'text',
  'content.topics.name': 'text'
});

// Virtual for best provider
DataSourceCatalogSchema.virtual('bestProvider').get(function() {
  if (!this.providers.length) return null;
  
  return this.providers
    .filter(p => p.status === 'active')
    .sort((a, b) => {
      // Sort by performance score (combination of success rate and response time)
      const scoreA = (a.performance.successRate || 0) - (a.performance.avgResponseTime || 0) / 1000;
      const scoreB = (b.performance.successRate || 0) - (b.performance.avgResponseTime || 0) / 1000;
      return scoreB - scoreA;
    })[0];
});

// Virtual for availability status
DataSourceCatalogSchema.virtual('isAvailable').get(function() {
  return this.status.overall === 'active' && 
         this.status.availability === 'available' &&
         this.providers.some(p => p.status === 'active');
});

// Virtual for quality grade
DataSourceCatalogSchema.virtual('qualityGrade').get(function() {
  const score = this.quality.score.overall || 0;
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
});

// Instance Methods

/**
 * Get active providers for this source
 * @returns {Array} - Active providers
 */
DataSourceCatalogSchema.methods.getActiveProviders = function() {
  return this.providers.filter(p => p.status === 'active');
};

/**
 * Get recommended provider for this source
 * @returns {Object|null} - Recommended provider or null
 */
DataSourceCatalogSchema.methods.getRecommendedProvider = function() {
  const recommended = this.providers.find(p => p.recommended && p.status === 'active');
  return recommended || this.bestProvider;
};

/**
 * Update quality metrics
 * @param {Object} metrics - New quality metrics
 * @returns {Promise} - Saved source
 */
DataSourceCatalogSchema.methods.updateQualityMetrics = function(metrics) {
  this.quality.score = { ...this.quality.score, ...metrics };
  this.quality.score.lastAssessed = new Date();
  return this.save();
};

/**
 * Add usage statistics
 * @param {string} providerId - Provider ID
 * @param {Object} stats - Usage statistics
 * @returns {Promise} - Saved source
 */
DataSourceCatalogSchema.methods.addUsageStats = function(providerId, stats) {
  this.analytics.usage.totalAccesses += 1;
  this.analytics.usage.lastAccessed = new Date();
  
  // Update provider usage
  let providerUsage = this.analytics.usage.providerUsage.find(p => p.providerId === providerId);
  if (providerUsage) {
    providerUsage.accessCount += 1;
    providerUsage.lastAccess = new Date();
  } else {
    this.analytics.usage.providerUsage.push({
      providerId,
      accessCount: 1,
      lastAccess: new Date(),
      avgDataQuality: stats.dataQuality || 0
    });
  }
  
  return this.save();
};

/**
 * Check if source contains PII
 * @returns {boolean} - True if source contains PII
 */
DataSourceCatalogSchema.methods.containsPII = function() {
  return this.access.privacy.containsPII;
};

/**
 * Get compliance status
 * @returns {Object} - Compliance status object
 */
DataSourceCatalogSchema.methods.getComplianceStatus = function() {
  return {
    gdpr: this.access.privacy.gdprCompliant,
    ccpa: this.access.privacy.ccpaCompliant,
    containsPII: this.access.privacy.containsPII,
    license: this.access.legal.license,
    restrictions: this.access.legal.restrictions.length
  };
};

// Static Methods

/**
 * Generate next source ID
 * @returns {Promise<string>} - Next source ID
 */
DataSourceCatalogSchema.statics.generateSourceId = async function() {
  const count = await this.countDocuments();
  const nextNumber = count + 1;
  return `SRC${nextNumber.toString().padStart(8, '0')}`;
};

/**
 * Find sources by type and category
 * @param {string} type - Source type
 * @param {string} category - Source category
 * @returns {Promise<DataSourceCatalog[]>} - Array of sources
 */
DataSourceCatalogSchema.statics.findByTypeAndCategory = function(type, category) {
  return this.find({
    'classification.type': type,
    'classification.category': category,
    'status.overall': 'active'
  }).sort({ 'quality.score.overall': -1 });
};

/**
 * Find sources with specific provider
 * @param {string} providerId - Provider ID
 * @returns {Promise<DataSourceCatalog[]>} - Array of sources
 */
DataSourceCatalogSchema.statics.findByProvider = function(providerId) {
  return this.find({
    'providers.providerId': providerId,
    'providers.status': 'active',
    'status.overall': 'active'
  });
};

/**
 * Search sources by keywords
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<DataSourceCatalog[]>} - Array of matching sources
 */
DataSourceCatalogSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    'status.overall': 'active',
    ...filters
  };
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

/**
 * Get high-quality sources
 * @param {number} minScore - Minimum quality score (default: 80)
 * @returns {Promise<DataSourceCatalog[]>} - Array of high-quality sources
 */
DataSourceCatalogSchema.statics.getHighQualitySources = function(minScore = 80) {
  return this.find({
    'quality.score.overall': { $gte: minScore },
    'status.overall': 'active'
  }).sort({ 'quality.score.overall': -1 });
};

module.exports = mongoose.model('DataSourceCatalog', DataSourceCatalogSchema);