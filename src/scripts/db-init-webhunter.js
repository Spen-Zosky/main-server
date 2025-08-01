#!/usr/bin/env node

/**
 * Web-Hunter Database Initialization Script
 * Initializes MongoDB with Web-Hunter framework schema and sample data
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import all Web-Hunter models
const {
  User,
  ProviderIntegration,
  DataSourceCatalog,
  OrchestrationWorkflow,
  DataQualityMonitor,
  WebHunterAnalytics
} = require('../models');

// Configuration
const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/main-server',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // Sample data configuration
  sampleData: {
    createSampleProviders: true,
    createSampleSources: true,
    createSampleWorkflows: true,
    createSampleMonitors: true,
    createSampleAnalytics: true
  }
};

/**
 * Initialize database connection
 */
async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('✅ Connected to MongoDB successfully');
    
    // Test connection
    const db = mongoose.connection.db;
    const admin = db.admin();
    const info = await admin.serverStatus();
    console.log(`📊 MongoDB Version: ${info.version}`);
    console.log(`🗄️ Database: ${db.databaseName}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

/**
 * Create database indexes for optimal performance
 */
async function createIndexes() {
  console.log('\n🔧 Creating database indexes...');
  
  try {
    // Provider Integration indexes
    console.log('Creating ProviderIntegration indexes...');
    await ProviderIntegration.collection.createIndex({ providerId: 1 }, { unique: true });
    await ProviderIntegration.collection.createIndex({ name: 1 });
    await ProviderIntegration.collection.createIndex({ 'classification.tier': 1, 'status.connection': 1 });
    await ProviderIntegration.collection.createIndex({ 'classification.category': 1, 'classification.priority': 1 });
    
    // Data Source Catalog indexes
    console.log('Creating DataSourceCatalog indexes...');
    await DataSourceCatalog.collection.createIndex({ sourceId: 1 }, { unique: true });
    await DataSourceCatalog.collection.createIndex({ name: 1 });
    await DataSourceCatalog.collection.createIndex({ 'classification.type': 1, 'status.overall': 1 });
    await DataSourceCatalog.collection.createIndex({ 'providers.providerId': 1, 'providers.status': 1 });
    await DataSourceCatalog.collection.createIndex({ 'content.geographic.coordinates': '2dsphere' });
    
    // Orchestration Workflow indexes
    console.log('Creating OrchestrationWorkflow indexes...');
    await OrchestrationWorkflow.collection.createIndex({ workflowId: 1 }, { unique: true });
    await OrchestrationWorkflow.collection.createIndex({ 'security.owner': 1, 'execution.status': 1 });
    await OrchestrationWorkflow.collection.createIndex({ 'execution.nextExecution': 1, 'configuration.schedule.enabled': 1 });
    
    // Data Quality Monitor indexes
    console.log('Creating DataQualityMonitor indexes...');
    await DataQualityMonitor.collection.createIndex({ monitorId: 1 }, { unique: true });
    await DataQualityMonitor.collection.createIndex({ 'scope.target.type': 1, 'status.overall': 1 });
    await DataQualityMonitor.collection.createIndex({ 'currentStatus.grade': 1, 'currentStatus.lastAssessment': -1 });
    
    // WebHunter Analytics indexes
    console.log('Creating WebHunterAnalytics indexes...');
    await WebHunterAnalytics.collection.createIndex({ analyticsId: 1 }, { unique: true });
    await WebHunterAnalytics.collection.createIndex({ reportType: 1, 'period.startDate': -1 });
    await WebHunterAnalytics.collection.createIndex({ 'timeSeries.timestamp': 1 });
    
    console.log('✅ All indexes created successfully');
    return true;
  } catch (error) {
    console.error('❌ Index creation failed:', error.message);
    return false;
  }
}

/**
 * Create sample provider integrations based on our research
 */
async function createSampleProviders() {
  console.log('\n🌐 Creating sample provider integrations...');
  
  const sampleProviders = [
    {
      name: 'Bright Data',
      displayName: 'Bright Data - Global Infrastructure Leader',
      description: 'Enterprise-grade web scraping infrastructure with 150M+ IP addresses',
      classification: {
        tier: 'enterprise_champion',
        category: 'web_scraping',
        priority: 'critical',
        specializations: ['e_commerce', 'social_media', 'financial_data', 'government_sources']
      },
      integration: {
        api: {
          baseUrl: 'https://api.brightdata.com',
          version: 'v1',
          rateLimits: {
            requestsPerSecond: 100,
            requestsPerMinute: 6000,
            requestsPerHour: 360000,
            requestsPerDay: 8640000,
            burstLimit: 200
          }
        },
        authentication: {
          type: 'api_key',
          apiKey: {
            headerName: 'Authorization',
            prefix: 'Bearer '
          }
        }
      },
      capabilities: {
        dataSources: [{
          type: 'websites',
          coverage: {
            geographic: ['US', 'EU', 'AS', 'OC'],
            languages: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
            volume: '150M+ IP addresses'
          },
          quality: 'excellent'
        }],
        features: [{
          name: 'JavaScript Rendering',
          type: 'javascript_rendering',
          supported: true
        }, {
          name: 'CAPTCHA Solving',
          type: 'captcha_solving',
          supported: true,
          additionalCost: true
        }]
      },
      pricing: {
        model: 'tiered',
        tiers: [{
          name: 'Enterprise',
          price: { amount: 2000, currency: 'USD', period: 'monthly' },
          limits: { requests: 1000000 },
          recommended: true
        }]
      },
      status: {
        connection: 'connected',
        health: {
          lastCheck: new Date(),
          metrics: {
            avgResponseTime: 250,
            successRate: 99.8,
            errorRate: 0.2
          }
        }
      }
    },
    
    {
      name: 'Apify',
      displayName: 'Apify - Ecosystem & Marketplace Leader',
      description: 'Comprehensive automation platform with 4,000+ ready-made scrapers',
      classification: {
        tier: 'enterprise_champion',
        category: 'web_scraping',
        priority: 'high',
        specializations: ['e_commerce', 'social_media', 'real_time_data']
      },
      integration: {
        api: {
          baseUrl: 'https://api.apify.com',
          version: 'v2',
          rateLimits: {
            requestsPerSecond: 50,
            requestsPerMinute: 3000,
            requestsPerHour: 180000,
            requestsPerDay: 4320000
          }
        },
        authentication: {
          type: 'bearer_token'
        }
      },
      pricing: {
        model: 'tiered',
        tiers: [{
          name: 'Business',
          price: { amount: 299, currency: 'USD', period: 'monthly' },
          limits: { requests: 5000000 }
        }]
      },
      status: {
        connection: 'connected',
        health: {
          lastCheck: new Date(),
          metrics: {
            avgResponseTime: 180,
            successRate: 98.5,
            errorRate: 1.5
          }
        }
      }
    },
    
    {
      name: 'OpenAlex',
      displayName: 'OpenAlex - Academic Research Champion',
      description: 'Comprehensive academic research database with 200M+ papers',
      classification: {
        tier: 'specialized_solution',
        category: 'academic_research',
        priority: 'critical',
        specializations: ['academic_papers']
      },
      integration: {
        api: {
          baseUrl: 'https://api.openalex.org',
          version: 'v1',
          rateLimits: {
            requestsPerSecond: 10,
            requestsPerMinute: 600,
            requestsPerHour: 36000
          }
        },
        authentication: {
          type: 'none'
        }
      },
      pricing: {
        model: 'free'
      },
      status: {
        connection: 'connected',
        health: {
          lastCheck: new Date(),
          metrics: {
            avgResponseTime: 120,
            successRate: 99.9,
            errorRate: 0.1
          }
        }
      }
    }
  ];
  
  try {
    for (const providerData of sampleProviders) {
      const providerId = await ProviderIntegration.generateProviderId();
      const provider = new ProviderIntegration({
        providerId,
        ...providerData
      });
      
      await provider.save();
      console.log(`✅ Created provider: ${provider.displayName} (${providerId})`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Sample provider creation failed:', error.message);
    return false;
  }
}

/**
 * Create sample data sources
 */
async function createSampleSources() {
  console.log('\n📊 Creating sample data sources...');
  
  const providers = await ProviderIntegration.find({}).limit(3);
  if (providers.length === 0) {
    console.log('⚠️ No providers found, skipping source creation');
    return false;
  }
  
  const sampleSources = [
    {
      name: 'Amazon Product Data',
      displayName: 'Amazon E-commerce Product Information',
      description: 'Comprehensive product data from Amazon marketplace',
      classification: {
        type: 'website',
        category: 'commercial',
        industry: ['retail'],
        dataTypes: ['structured', 'text', 'images'],
        accessibility: 'public'
      },
      technical: {
        primaryUrl: 'https://www.amazon.com',
        protocol: 'https',
        structure: {
          format: 'html',
          selectors: [
            { name: 'title', selector: '#productTitle', dataType: 'text' },
            { name: 'price', selector: '.a-price-whole', dataType: 'number' },
            { name: 'rating', selector: '.a-icon-alt', dataType: 'number' }
          ]
        },
        updateFrequency: 'hourly'
      },
      quality: {
        score: {
          overall: 85,
          completeness: 90,
          accuracy: 85,
          consistency: 80,
          timeliness: 90
        }
      },
      providers: [{
        providerId: providers[0].providerId,
        providerName: providers[0].name,
        accessMethod: 'web_scraping',
        priority: 1,
        recommended: true,
        status: 'active'
      }]
    },
    
    {
      name: 'Academic Papers Database',
      displayName: 'Scientific Literature Repository',
      description: 'Comprehensive database of academic papers and research',
      classification: {
        type: 'api',
        category: 'academic',
        industry: ['education', 'technology'],
        dataTypes: ['structured', 'text'],
        accessibility: 'public'
      },
      technical: {
        primaryUrl: 'https://api.openalex.org/works',
        protocol: 'https',
        structure: {
          format: 'json',
          endpoints: [{
            path: '/works',
            method: 'GET',
            parameters: { search: 'string', per_page: 'number' }
          }]
        },
        updateFrequency: 'daily'
      },
      quality: {
        score: {
          overall: 95,
          completeness: 95,
          accuracy: 98,
          consistency: 92,
          timeliness: 95
        }
      },
      providers: [{
        providerId: providers[2].providerId,
        providerName: providers[2].name,
        accessMethod: 'direct_api',
        priority: 1,
        recommended: true,
        status: 'active'
      }]
    }
  ];
  
  try {
    for (const sourceData of sampleSources) {
      const sourceId = await DataSourceCatalog.generateSourceId();
      const source = new DataSourceCatalog({
        sourceId,
        ...sourceData,
        status: {
          overall: 'active',
          availability: 'available'
        }
      });
      
      await source.save();
      console.log(`✅ Created source: ${source.displayName} (${sourceId})`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Sample source creation failed:', error.message);
    return false;
  }
}

/**
 * Create sample orchestration workflow
 */
async function createSampleWorkflows() {
  console.log('\n🔄 Creating sample workflows...');
  
  // Find an admin user or create one
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = new User({
      username: 'admin',
      email: 'admin@webhunter.local',
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator'
      }
    });
    await adminUser.save();
    console.log('✅ Created admin user for workflow ownership');
  }
  
  const sources = await DataSourceCatalog.find({}).limit(2);
  const providers = await ProviderIntegration.find({}).limit(2);
  
  if (sources.length === 0 || providers.length === 0) {
    console.log('⚠️ Insufficient sources/providers, skipping workflow creation');
    return false;
  }
  
  const sampleWorkflow = {
    name: 'E-commerce Data Aggregation',
    displayName: 'Multi-Provider E-commerce Intelligence',
    description: 'Aggregate product data from multiple e-commerce platforms',
    classification: {
      type: 'data_aggregation',
      complexity: 'moderate',
      priority: 'high',
      businessFunction: 'business_intelligence'
    },
    configuration: {
      strategy: {
        execution: 'parallel',
        failover: {
          enabled: true,
          strategy: 'fast_failover',
          maxRetries: 3
        }
      },
      dataFlow: {
        inputSources: [{
          sourceId: sources[0].sourceId,
          providerId: providers[0].providerId,
          priority: 1,
          config: {
            extractionMethod: 'web_scraping',
            parameters: { categories: ['electronics', 'books'] }
          },
          validation: {
            required: true,
            minRecords: 100,
            qualityThreshold: 80
          },
          status: 'active'
        }],
        processing: {
          steps: [{
            stepId: 'step_001',
            name: 'Data Cleaning',
            type: 'clean',
            order: 1,
            config: {
              parameters: {
                removeEmptyRecords: true,
                removeDuplicates: true
              }
            },
            enabled: true
          }]
        },
        outputs: [{
          outputId: 'output_001',
          name: 'Cleaned Product Data',
          type: 'database',
          destination: {
            database: {
              collection: 'products_aggregated',
              insertStrategy: 'upsert'
            }
          },
          enabled: true
        }]
      },
      schedule: {
        type: 'interval',
        interval: {
          value: 6,
          unit: 'hours'
        },
        enabled: true
      }
    },
    execution: {
      status: 'scheduled',
      statistics: {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0
      }
    },
    security: {
      owner: adminUser._id,
      dataClassification: 'internal'
    }
  };
  
  try {
    const workflowId = await OrchestrationWorkflow.generateWorkflowId();
    const workflow = new OrchestrationWorkflow({
      workflowId,
      ...sampleWorkflow
    });
    
    await workflow.save();
    console.log(`✅ Created workflow: ${workflow.displayName} (${workflowId})`);
    
    return true;
  } catch (error) {
    console.error('❌ Sample workflow creation failed:', error.message);
    return false;
  }
}

/**
 * Create sample data quality monitor
 */
async function createSampleMonitors() {
  console.log('\n🔍 Creating sample quality monitors...');
  
  const sources = await DataSourceCatalog.find({}).limit(1);
  if (sources.length === 0) {
    console.log('⚠️ No sources found, skipping monitor creation');
    return false;
  }
  
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = await User.findOne();
  }
  
  const sampleMonitor = {
    name: 'E-commerce Data Quality Monitor',
    description: 'Monitor data quality for e-commerce product information',
    scope: {
      target: {
        type: 'source',
        sourceId: sources[0].sourceId,
        name: sources[0].name
      },
      dimensions: ['completeness', 'accuracy', 'consistency', 'validity'],
      frequency: 'daily'
    },
    qualityRules: [{
      ruleId: 'rule_001',
      name: 'Price Completeness',
      description: 'Ensure all products have price information',
      dimension: 'completeness',
      category: 'field_level',
      specification: {
        field: 'price',
        dataType: 'number'
      },
      thresholds: {
        critical: 50,
        warning: 70,
        target: 90,
        excellent: 95
      },
      weight: 2,
      severity: 'high',
      enabled: true
    }],
    currentStatus: {
      overallScore: 85,
      dimensionScores: {
        completeness: 90,
        accuracy: 85,
        consistency: 80,
        validity: 85
      },
      grade: 'B',
      status: 'good',
      lastAssessment: new Date()
    },
    security: {
      owner: adminUser._id,
      visibility: 'team'
    },
    status: {
      overall: 'active',
      monitoring: 'running'
    }
  };
  
  try {
    const monitorId = await DataQualityMonitor.generateMonitorId();
    const monitor = new DataQualityMonitor({
      monitorId,
      ...sampleMonitor
    });
    
    await monitor.save();
    console.log(`✅ Created monitor: ${monitor.name} (${monitorId})`);
    
    return true;
  } catch (error) {
    console.error('❌ Sample monitor creation failed:', error.message);
    return false;
  }
}

/**
 * Create sample analytics report
 */
async function createSampleAnalytics() {
  console.log('\n📈 Creating sample analytics...');
  
  const providers = await ProviderIntegration.find({}).limit(2);
  const workflows = await OrchestrationWorkflow.find({}).limit(1);
  
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = await User.findOne();
  }
  
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  
  const sampleAnalytics = {
    reportType: 'system_overview',
    name: 'Monthly System Overview',
    description: 'Comprehensive system performance and usage analytics',
    period: {
      type: 'monthly',
      startDate,
      endDate: now,
      granularity: 'day'
    },
    scope: {
      entities: [{
        type: 'global',
        included: true
      }]
    },
    systemMetrics: {
      health: {
        overallScore: 87,
        providers: 92,
        workflows: 85,
        dataQuality: 84,
        compliance: 90,
        trend: 'improving'
      },
      performance: {
        avgResponseTime: 250,
        p95ResponseTime: 800,
        requestsPerSecond: 45,
        errorRate: 1.2,
        performanceTrend: 'stable',
        reliability: 98.8
      }
    },
    providerMetrics: providers.map(provider => ({
      providerId: provider.providerId,
      providerName: provider.name,
      performance: {
        totalRequests: 15000,
        successfulRequests: 14850,
        failedRequests: 150,
        successRate: 99,
        avgResponseTime: 200,
        uptime: 99.8,
        dataQualityScore: 88
      },
      costs: {
        totalCost: 1250,
        costPerRequest: 0.083,
        currency: 'USD'
      },
      usage: {
        totalDataVolume: 5000000000, // 5GB
        topSources: [{
          sourceId: 'SRC00000001',
          sourceName: 'Amazon Product Data',
          requestCount: 8000,
          dataVolume: 3000000000
        }]
      }
    })),
    costMetrics: {
      summary: {
        totalCost: 2500,
        currency: 'USD',
        providerCosts: 2000,
        infrastructureCosts: 300,
        operationalCosts: 200,
        costPerRecord: 0.05
      }
    },
    security: {
      owner: adminUser._id,
      visibility: 'organization'
    }
  };
  
  try {
    const analyticsId = await WebHunterAnalytics.generateAnalyticsId();
    const analytics = new WebHunterAnalytics({
      analyticsId,
      ...sampleAnalytics
    });
    
    await analytics.save();
    console.log(`✅ Created analytics: ${analytics.name} (${analyticsId})`);
    
    return true;
  } catch (error) {
    console.error('❌ Sample analytics creation failed:', error.message);
    return false;
  }
}

/**
 * Verify database setup
 */
async function verifySetup() {
  console.log('\n🔍 Verifying database setup...');
  
  try {
    const counts = {
      providers: await ProviderIntegration.countDocuments(),
      sources: await DataSourceCatalog.countDocuments(),
      workflows: await OrchestrationWorkflow.countDocuments(),
      monitors: await DataQualityMonitor.countDocuments(),
      analytics: await WebHunterAnalytics.countDocuments()
    };
    
    console.log('📊 Document counts:');
    console.log(`   • Providers: ${counts.providers}`);
    console.log(`   • Sources: ${counts.sources}`);
    console.log(`   • Workflows: ${counts.workflows}`);
    console.log(`   • Monitors: ${counts.monitors}`);
    console.log(`   • Analytics: ${counts.analytics}`);
    
    // Test basic queries
    const sampleProvider = await ProviderIntegration.findOne();
    const sampleSource = await DataSourceCatalog.findOne();
    
    if (sampleProvider && sampleSource) {
      console.log('✅ Database queries working correctly');
      console.log(`   • Sample Provider: ${sampleProvider.name}`);
      console.log(`   • Sample Source: ${sampleSource.name}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    return false;
  }
}

/**
 * Main initialization function
 */
async function initializeDatabase() {
  console.log('🚀 Starting Web-Hunter Database Initialization...\n');
  
  // Connect to database
  const connected = await connectDatabase();
  if (!connected) {
    process.exit(1);
  }
  
  try {
    // Create indexes
    await createIndexes();
    
    // Create sample data if enabled
    if (config.sampleData.createSampleProviders) {
      await createSampleProviders();
    }
    
    if (config.sampleData.createSampleSources) {
      await createSampleSources();
    }
    
    if (config.sampleData.createSampleWorkflows) {
      await createSampleWorkflows();
    }
    
    if (config.sampleData.createSampleMonitors) {
      await createSampleMonitors();
    }
    
    if (config.sampleData.createSampleAnalytics) {
      await createSampleAnalytics();
    }
    
    // Verify setup
    await verifySetup();
    
    console.log('\n🎉 Web-Hunter database initialization completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start the Web-Hunter backend service');
    console.log('   2. Configure provider API credentials');
    console.log('   3. Test data source connections');
    console.log('   4. Review workflow configurations');
    console.log('   5. Set up monitoring alerts');
    
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
}

// Run initialization if called directly
if (require.main === module) {
  initializeDatabase().catch(error => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
}

module.exports = {
  initializeDatabase,
  connectDatabase,
  createIndexes,
  createSampleProviders,
  createSampleSources,
  createSampleWorkflows,
  createSampleMonitors,
  createSampleAnalytics,
  verifySetup
};