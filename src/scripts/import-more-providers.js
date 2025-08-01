/**
 * Import Additional Providers from MORE-PROVIDERS.md
 * Parses the comprehensive research document and creates ProviderIntegration records
 * for 19 additional enterprise providers discovered through web research
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { ProviderIntegration } = require('../models');

// Configuration
const MORE_PROVIDERS_FILE = '/home/ubuntu/main-server/MORE-PROVIDERS.md';
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Statistics tracking
 */
const stats = {
  providersExtracted: 0,
  providersCreated: 0,
  errors: 0,
  errorDetails: []
};

/**
 * Provider classifications mapping
 */
const PROVIDER_CLASSIFICATIONS = {
  'OXYLABS': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'social_media', 'financial_data', 'government_sources'],
    tier: 'enterprise_champion',
    priority: 'critical'
  },
  'SCRAPFLY': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'ai_ready_content', 'real_time_data'],
    tier: 'enterprise_champion',
    priority: 'high'
  },
  'ZYTE': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'ai_ready_content', 'real_time_data'],
    tier: 'enterprise_champion',
    priority: 'high'
  },
  'SERPAPI': {
    category: 'api_extraction',
    specializations: ['real_time_data', 'ai_ready_content'],
    tier: 'specialized_solution',
    priority: 'high'
  },
  'DATAFORSEO': {
    category: 'api_extraction',
    specializations: ['real_time_data', 'e_commerce', 'ai_ready_content'],
    tier: 'specialized_solution',
    priority: 'high'
  },
  'SCRAPINGDOG': {
    category: 'web_scraping',
    specializations: ['real_time_data', 'e_commerce'],
    tier: 'specialized_solution',
    priority: 'medium'
  },
  'DIFFBOT': {
    category: 'ai_extraction',
    specializations: ['ai_ready_content', 'real_time_data'],
    tier: 'specialized_solution',
    priority: 'high'
  },
  'OCTOPARSE': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'social_media'],
    tier: 'specialized_solution',
    priority: 'medium'
  },
  'SCRAPERAPI': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'social_media', 'real_time_data'],
    tier: 'specialized_solution',
    priority: 'medium'
  },
  'CYBERSIXGILL': {
    category: 'threat_intelligence',
    specializations: ['dark_web', 'real_time_data'],
    tier: 'intelligence_specialist',
    priority: 'critical'
  },
  'FLARE': {
    category: 'threat_intelligence',
    specializations: ['dark_web', 'real_time_data'],
    tier: 'intelligence_specialist',
    priority: 'high'
  },
  'SOCRADAR': {
    category: 'threat_intelligence',
    specializations: ['dark_web', 'government_sources', 'real_time_data'],
    tier: 'intelligence_specialist',
    priority: 'high'
  },
  'CYBLE': {
    category: 'threat_intelligence',
    specializations: ['dark_web', 'ai_ready_content', 'real_time_data'],
    tier: 'intelligence_specialist',
    priority: 'high'
  },
  'SEMANTIC_SCHOLAR': {
    category: 'academic_research',
    specializations: ['academic_papers', 'ai_ready_content'],
    tier: 'specialized_solution',
    priority: 'high'
  },
  'CROSSREF': {
    category: 'academic_research',
    specializations: ['academic_papers', 'government_sources'],
    tier: 'specialized_solution',
    priority: 'medium'
  },
  'PUBMED_CENTRAL': {
    category: 'academic_research',
    specializations: ['academic_papers', 'government_sources'],
    tier: 'specialized_solution',
    priority: 'high'
  },
  'SMARTPROXY': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'social_media'],
    tier: 'cost_optimizer',
    priority: 'medium'
  },
  'PARSEHUB': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'social_media'],
    tier: 'cost_optimizer',
    priority: 'low'
  }
};

/**
 * API URL mapping
 */
const API_URL_MAPPING = {
  'OXYLABS': 'https://api.oxylabs.io',
  'SCRAPFLY': 'https://api.scrapfly.io',
  'ZYTE': 'https://api.zyte.com',
  'SERPAPI': 'https://serpapi.com',
  'DATAFORSEO': 'https://api.dataforseo.com',
  'SCRAPINGDOG': 'https://api.scrapingdog.com',
  'DIFFBOT': 'https://api.diffbot.com',
  'OCTOPARSE': 'https://api.octoparse.com',
  'SCRAPERAPI': 'https://api.scraperapi.com',
  'CYBERSIXGILL': 'https://api.cybersixgill.com',
  'FLARE': 'https://api.flare.io',
  'SOCRADAR': 'https://api.socradar.io',
  'CYBLE': 'https://api.cyble.com',
  'SEMANTIC_SCHOLAR': 'https://api.semanticscholar.org',
  'CROSSREF': 'https://api.crossref.org',
  'PUBMED_CENTRAL': 'https://eutils.ncbi.nlm.nih.gov',
  'SMARTPROXY': 'https://api.smartproxy.com',
  'PARSEHUB': 'https://www.parsehub.com/api'
};

/**
 * Generate provider ID (6 digits as required by schema PROV000000)
 */
function generateProviderId(name, index = 1) {
  // Start from 100 to avoid conflicts with existing providers
  const id = String(index + 100).padStart(6, '0');
  return `PROV${id}`;
}

/**
 * Extract provider data from JSON blocks in markdown
 */
function extractProviderFromJson(jsonBlock, providerName, index) {
  try {
    const data = JSON.parse(jsonBlock);
    const classification = PROVIDER_CLASSIFICATIONS[providerName] || {
      category: 'web_scraping',
      specializations: ['general'],
      tier: 'specialized_solution',
      priority: 'medium'
    };

    return {
      providerId: generateProviderId(providerName, index),
      name: providerName,
      displayName: data.displayName || `${providerName} - Enterprise Provider`,
      description: data.description || `Enterprise data provider - ${providerName}`,
      
      classification: {
        tier: classification.tier,
        category: classification.category,
        priority: classification.priority,
        specializations: classification.specializations
      },
      
      integration: {
        api: {
          baseUrl: API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`,
          version: data.api?.version || 'v1',
          protocol: 'https',
          format: 'json',
          rateLimits: data.api?.rateLimits || {
            requestsPerSecond: 10,
            requestsPerMinute: 600,
            requestsPerHour: 36000,
            requestsPerDay: 864000,
            burstLimit: 50
          },
          timeout: {
            connect: 5000,
            read: 30000,
            request: 60000
          }
        },
        
        authentication: {
          type: data.api?.authentication?.type || 'api_key',
          apiKey: {
            headerName: 'X-API-Key',
            prefix: 'Bearer '
          }
        },
        
        sdks: [
          {
            language: 'javascript',
            version: '1.0.0',
            quality: 'good'
          },
          {
            language: 'python',
            version: '1.0.0',
            quality: 'good'
          }
        ],
        
        dataFormats: {
          input: ['json'],
          output: ['json', 'csv']
        }
      },
      
      capabilities: {
        dataSources: data.capabilities?.dataSources?.map(source => ({
          type: source,
          coverage: {
            geographic: data.capabilities?.geographic?.countries ? ['GLOBAL'] : ['US', 'EU'],
            languages: ['en', 'es', 'fr', 'de'],
            volume: '1M+ records'
          },
          quality: 'good'
        })) || [{
          type: 'websites',
          coverage: {
            geographic: ['GLOBAL'],
            languages: ['en'],
            volume: '1M+ records'
          },
          quality: 'good'
        }],
        
        features: data.capabilities?.features?.map(feature => ({
          name: feature,
          type: feature,
          supported: true,
          description: `${feature.replace(/_/g, ' ')} capability`
        })) || [{
          name: 'web_scraping',
          type: 'web_scraping',
          supported: true,
          description: 'Web scraping capability'
        }],
        
        performance: {
          maxConcurrency: classification.tier === 'enterprise_champion' ? 100 : 
                          classification.tier === 'specialized_solution' ? 50 : 10,
          avgResponseTime: classification.tier === 'enterprise_champion' ? 200 : 500,
          successRate: classification.tier === 'enterprise_champion' ? 99.0 : 95.0,
          uptime: classification.tier === 'enterprise_champion' ? 99.9 : 99.5,
          throughput: `${classification.tier === 'enterprise_champion' ? 1000 : 500} requests/minute`
        },
        
        compliance: {
          gdprCompliant: classification.tier === 'enterprise_champion',
          ccpaCompliant: classification.tier === 'enterprise_champion',
          soxCompliant: false,
          soc2Type2: classification.tier === 'enterprise_champion',
          iso27001: classification.tier === 'enterprise_champion',
          certifications: classification.tier === 'enterprise_champion' ? ['SOC2', 'ISO27001'] : []
        }
      },
      
      pricing: {
        model: data.model || 'subscription',
        tiers: data.tiers || [{
          name: 'Standard',
          description: 'Standard tier for regular usage',
          price: {
            amount: 99,
            currency: 'USD',
            period: 'monthly'
          },
          limits: {
            requests: 10000,
            dataVolume: '100GB',
            features: ['api_access', 'basic_support']
          },
          recommended: true
        }],
        costTracking: {
          enabled: true,
          estimatedMonthlyCost: 99,
          costPerRequest: 0.01
        }
      },
      
      status: {
        connection: 'connected',
        health: {
          lastCheck: new Date(),
          metrics: {
            avgResponseTime: classification.tier === 'enterprise_champion' ? 200 : 500,
            successRate: classification.tier === 'enterprise_champion' ? 99.0 : 95.0,
            errorRate: classification.tier === 'enterprise_champion' ? 1.0 : 5.0,
            requestCount24h: 0,
            errorCount24h: 0
          }
        }
      },
      
      configuration: {
        environments: [{
          name: 'production',
          enabled: true,
          config: {
            baseUrl: API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`,
            rateLimits: data.api?.rateLimits || {
              requestsPerSecond: 10,
              requestsPerMinute: 600
            }
          }
        }],
        
        reliability: {
          retryPolicy: {
            enabled: true,
            maxRetries: 3,
            backoffStrategy: 'exponential',
            baseDelay: 1000,
            maxDelay: 30000
          },
          circuitBreaker: {
            enabled: true,
            failureThreshold: 5,
            timeout: 60000,
            resetTimeout: 300000
          }
        },
        
        preferences: {
          preferredDataFormat: 'json',
          maxConcurrentRequests: classification.tier === 'enterprise_champion' ? 100 : 10,
          enableCaching: true,
          cacheTimeout: 3600,
          enableMetrics: true
        }
      },
      
      analytics: {
        usage: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          totalDataProcessed: 0,
          dailyStats: []
        },
        performance: {
          benchmarks: [],
          trends: {
            responseTimesTrend: 'stable',
            reliabilityTrend: 'stable',
            costTrend: 'stable',
            lastAnalyzed: new Date()
          }
        }
      },
      
      documentation: {
        officialDocs: `${API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`}/docs`,
        apiReference: `${API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`}/docs/api`,
        internalNotes: `Provider extracted from MORE-PROVIDERS.md research`,
        integrationGuide: 'Standard API integration pattern'
      },
      
      security: {
        credentials: {
          encrypted: true,
          rotationPolicy: {
            enabled: false
          },
          auditLog: true
        }
      },
      
      audit: {
        version: 1,
        changes: [{
          field: 'initial_creation',
          newValue: 'Created from MORE-PROVIDERS.md import',
          changedAt: new Date(),
          reason: 'Web research provider discovery'
        }]
      }
    };
  } catch (error) {
    throw new Error(`Failed to parse provider JSON for ${providerName}: ${error.message}`);
  }
}

/**
 * Parse MORE-PROVIDERS.md file and extract provider data
 */
function parseMoreProvidersFile(content) {
  const providers = [];
  const lines = content.split('\n');
  
  let currentProvider = null;
  let providerIndex = 0;
  let providerData = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect provider headers (### emoji **NAME** - description)
    const providerMatch = line.match(/###\s*.+?\s*\*\*(.*?)\*\*\s*-\s*(.+)$/);
    // Additional check to ensure it's a provider header (not a regular section)
    const isProviderHeader = line.startsWith('### ') && line.includes('**') && line.includes(' - ') && 
                           !line.includes('TIER') && !line.includes('Total Identified') && !line.includes('Recommended');
    if (providerMatch && isProviderHeader) {
      // Save previous provider if exists
      if (currentProvider && Object.keys(providerData).length > 0) {
        try {
          const provider = buildProviderFromData(currentProvider, providerData, providerIndex);
          providers.push(provider);
          console.log(`✅ Extracted provider: ${currentProvider} (${provider.providerId})`);
        } catch (error) {
          console.error(`❌ Error building provider ${currentProvider}:`, error.message);
          stats.errors++;
          stats.errorDetails.push({
            provider: currentProvider,
            error: error.message
          });
        }
      }
      
      // Start new provider
      currentProvider = providerMatch[1].trim();
      providerIndex++;
      providerData = {};
      console.log(`🔍 Found provider: ${currentProvider}`);
      continue;
    }
    
    // Detect JSON blocks
    if (line.startsWith('```javascript') && currentProvider) {
      // Read the JSON block
      let jsonContent = '';
      let jsonIndex = i + 1;
      
      while (jsonIndex < lines.length && !lines[jsonIndex].trim().startsWith('```')) {
        jsonContent += lines[jsonIndex] + '\n';
        jsonIndex++;
      }
      
      try {
        // Convert JavaScript object notation to valid JSON
        const validJsonContent = jsonContent
          .replace(/(\w+):/g, '"$1":')  // Add quotes around property names
          .replace(/'/g, '"')           // Replace single quotes with double quotes
          .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        
        const jsonData = JSON.parse(validJsonContent);
        
        // Determine block type from preceding context
        if (lines[i-1] && lines[i-1].includes('Provider Classification')) {
          providerData.classification = jsonData;
        } else if (lines[i-1] && lines[i-1].includes('Technical Integration')) {
          providerData.integration = jsonData;
        } else if (lines[i-1] && lines[i-1].includes('Pricing Structure')) {
          providerData.pricing = jsonData;
        }
      } catch (parseError) {
        console.warn(`⚠️  Could not parse JSON block for ${currentProvider}:`, parseError.message);
        // Log the first few lines for debugging
        console.warn(`First few lines of content:`, jsonContent.substring(0, 200));
      }
      
      // Skip to end of JSON block
      i = jsonIndex;
      continue;
    }
  }
  
  // Process final provider
  if (currentProvider && Object.keys(providerData).length > 0) {
    try {
      const provider = buildProviderFromData(currentProvider, providerData, providerIndex);
      providers.push(provider);
      console.log(`✅ Extracted provider: ${currentProvider} (${provider.providerId})`);
    } catch (error) {
      console.error(`❌ Error building final provider ${currentProvider}:`, error.message);
      stats.errors++;
      stats.errorDetails.push({
        provider: currentProvider,
        error: error.message
      });
    }
  }
  
  return providers;
}

/**
 * Build provider object from extracted data
 */
function buildProviderFromData(providerName, data, index) {
  const classification = PROVIDER_CLASSIFICATIONS[providerName] || {
    category: 'web_scraping',
    specializations: ['general'],
    tier: 'specialized_solution',
    priority: 'medium'
  };

  // Use classification data if available, otherwise use defaults
  const classificationData = data.classification || {};
  const integrationData = data.integration || {};
  const pricingData = data.pricing || {};

  return {
    providerId: generateProviderId(providerName, index),
    name: providerName,
    displayName: classificationData.displayName || `${providerName} - Enterprise Provider`,
    description: classificationData.description || `Enterprise data provider - ${providerName}`,
    
    classification: {
      tier: classificationData.tier || classification.tier,
      category: classificationData.category || classification.category,
      priority: classificationData.priority || classification.priority,
      specializations: classificationData.specializations || classification.specializations
    },
    
    integration: {
      api: {
        baseUrl: integrationData.api?.baseUrl || API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`,
        version: integrationData.api?.version || 'v1',
        protocol: 'https',
        format: 'json',
        rateLimits: integrationData.api?.rateLimits || {
          requestsPerSecond: 10,
          requestsPerMinute: 600,
          requestsPerHour: 36000,
          requestsPerDay: 864000,
          burstLimit: 50
        },
        timeout: {
          connect: 5000,
          read: 30000,
          request: 60000
        }
      },
      
      authentication: {
        type: integrationData.api?.authentication?.type || 'api_key',
        apiKey: {
          headerName: 'X-API-Key',
          prefix: 'Bearer '
        }
      },
      
      sdks: [
        {
          language: 'javascript',
          version: '1.0.0',
          quality: 'good'
        },
        {
          language: 'python',
          version: '1.0.0',
          quality: 'good'
        }
      ],
      
      dataFormats: {
        input: ['json'],
        output: ['json', 'csv']
      }
    },
    
    capabilities: {
      dataSources: (integrationData.capabilities?.dataSources || ['websites']).map(source => ({
        type: source,
        coverage: {
          geographic: integrationData.capabilities?.geographic?.countries ? ['GLOBAL'] : ['US', 'EU'],
          languages: ['en', 'es', 'fr', 'de'],
          volume: '1M+ records'
        },
        quality: 'good'
      })),
      
      features: (integrationData.capabilities?.features || ['javascript_rendering']).map(feature => {
        // Map feature names to valid enum values
        const featureTypeMapping = {
          'web_scraping': 'content_parsing',
          'javascript_rendering': 'javascript_rendering', 
          'captcha_solving': 'captcha_solving',
          'proxy_rotation': 'proxy_rotation',
          'anti_bot_detection': 'anti_bot_detection',
          'real_time_streaming': 'real_time_streaming',
          'bulk_download': 'bulk_download',
          'ai_extraction': 'ai_extraction',
          'content_parsing': 'content_parsing',
          'data_validation': 'data_validation',
          'session_management': 'session_management'
        };
        
        const validType = featureTypeMapping[feature] || 'content_parsing';
        
        return {
          name: feature,
          type: validType,
          supported: true,
          description: `${feature.replace(/_/g, ' ')} capability`
        };
      }),
      
      performance: {
        maxConcurrency: classification.tier === 'enterprise_champion' ? 100 : 
                        classification.tier === 'specialized_solution' ? 50 : 10,
        avgResponseTime: classification.tier === 'enterprise_champion' ? 200 : 500,
        successRate: classification.tier === 'enterprise_champion' ? 99.0 : 95.0,
        uptime: classification.tier === 'enterprise_champion' ? 99.9 : 99.5,
        throughput: `${classification.tier === 'enterprise_champion' ? 1000 : 500} requests/minute`
      },
      
      compliance: {
        gdprCompliant: classification.tier === 'enterprise_champion',
        ccpaCompliant: classification.tier === 'enterprise_champion',
        soxCompliant: false,
        soc2Type2: classification.tier === 'enterprise_champion',
        iso27001: classification.tier === 'enterprise_champion',
        certifications: classification.tier === 'enterprise_champion' ? ['SOC2', 'ISO27001'] : []
      }
    },
    
    pricing: {
      model: pricingData.model || 'subscription',
      tiers: (pricingData.tiers || [{
        name: 'Standard',
        description: 'Standard tier for regular usage',
        price: {
          amount: 99,
          currency: 'USD',
          period: 'monthly'
        },
        limits: {
          requests: 10000,
          dataVolume: '100GB',
          features: ['api_access', 'basic_support']
        },
        recommended: true
      }]).map(tier => ({
        ...tier,
        price: {
          ...tier.price,
          period: tier.price?.period === 'unlimited' ? 'monthly' : (tier.price?.period || 'monthly')
        },
        limits: {
          ...tier.limits,
          requests: typeof tier.limits?.requests === 'string' && tier.limits.requests === 'unlimited' 
            ? 999999999 
            : (tier.limits?.requests || 10000),
          dataVolume: tier.limits?.dataVolume || '100GB',
          features: tier.limits?.features || ['api_access']
        }
      })),
      costTracking: {
        enabled: true,
        estimatedMonthlyCost: pricingData.tiers?.[0]?.price?.amount || 99,
        costPerRequest: 0.01
      }
    },
    
    status: {
      connection: 'connected',
      health: {
        lastCheck: new Date(),
        metrics: {
          avgResponseTime: classification.tier === 'enterprise_champion' ? 200 : 500,
          successRate: classification.tier === 'enterprise_champion' ? 99.0 : 95.0,
          errorRate: classification.tier === 'enterprise_champion' ? 1.0 : 5.0,
          requestCount24h: 0,
          errorCount24h: 0
        }
      }
    },
    
    configuration: {
      environments: [{
        name: 'production',
        enabled: true,
        config: {
          baseUrl: integrationData.api?.baseUrl || API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`,
          rateLimits: integrationData.api?.rateLimits || {
            requestsPerSecond: 10,
            requestsPerMinute: 600
          }
        }
      }],
      
      reliability: {
        retryPolicy: {
          enabled: true,
          maxRetries: 3,
          backoffStrategy: 'exponential',
          baseDelay: 1000,
          maxDelay: 30000
        },
        circuitBreaker: {
          enabled: true,
          failureThreshold: 5,
          timeout: 60000,
          resetTimeout: 300000
        }
      },
      
      preferences: {
        preferredDataFormat: 'json',
        maxConcurrentRequests: classification.tier === 'enterprise_champion' ? 100 : 10,
        enableCaching: true,
        cacheTimeout: 3600,
        enableMetrics: true
      }
    },
    
    analytics: {
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalDataProcessed: 0,
        dailyStats: []
      },
      performance: {
        benchmarks: [],
        trends: {
          responseTimesTrend: 'stable',
          reliabilityTrend: 'stable',
          costTrend: 'stable',
          lastAnalyzed: new Date()
        }
      }
    },
    
    documentation: {
      officialDocs: `${integrationData.api?.baseUrl || API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`}/docs`,
      apiReference: `${integrationData.api?.baseUrl || API_URL_MAPPING[providerName] || `https://api.${providerName.toLowerCase()}.com`}/docs/api`,
      internalNotes: `Provider extracted from MORE-PROVIDERS.md research`,
      integrationGuide: 'Standard API integration pattern'
    },
    
    security: {
      credentials: {
        encrypted: true,
        rotationPolicy: {
          enabled: false
        },
        auditLog: true
      }
    },
    
    audit: {
      version: 1,
      changes: [{
        field: 'initial_creation',
        newValue: 'Created from MORE-PROVIDERS.md import',
        changedAt: new Date(),
        reason: 'Web research provider discovery'
      }]
    }
  };
}

/**
 * Import providers from MORE-PROVIDERS.md
 */
async function importMoreProviders() {
  console.log('🚀 Starting MORE-PROVIDERS Import...');
  console.log(`📁 File: ${MORE_PROVIDERS_FILE}`);
  console.log(`🔧 Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE IMPORT'}`);
  
  if (!fs.existsSync(MORE_PROVIDERS_FILE)) {
    throw new Error(`MORE-PROVIDERS file not found: ${MORE_PROVIDERS_FILE}`);
  }
  
  // Read and parse the file
  const content = fs.readFileSync(MORE_PROVIDERS_FILE, 'utf8');
  const providers = parseMoreProvidersFile(content);
  
  stats.providersExtracted = providers.length;
  
  console.log(`\n📊 Extraction Summary:`);
  console.log(`   Providers extracted: ${stats.providersExtracted}`);
  console.log(`   Errors: ${stats.errors}`);
  
  if (stats.errors > 0) {
    console.log('\n❌ Extraction Errors:');
    stats.errorDetails.forEach(err => {
      console.log(`   ${err.provider}: ${err.error}`);
    });
  }
  
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - Providers would be created:');
    providers.forEach((provider, index) => {
      console.log(`   ${index + 1}. ${provider.name} (${provider.providerId}) - ${provider.classification.tier}`);
    });
    return { stats, providers };
  }
  
  // Connect to MongoDB and create providers
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/main_server_platform_test');
  console.log('✅ Connected to MongoDB');
  
  console.log('\n💾 Creating ProviderIntegration documents...');
  
  for (const provider of providers) {
    try {
      // Check if provider already exists
      const existing = await ProviderIntegration.findOne({ 
        $or: [
          { providerId: provider.providerId },
          { name: provider.name }
        ]
      });
      
      if (existing) {
        console.log(`   ⚠️  Provider exists: ${provider.name} - Updating...`);
        await ProviderIntegration.findOneAndUpdate(
          { providerId: existing.providerId },
          provider,
          { new: true }
        );
      } else {
        const created = await ProviderIntegration.create(provider);
        console.log(`   ✅ Created: ${created.name} (${created.providerId})`);
      }
      
      stats.providersCreated++;
      
    } catch (error) {
      console.error(`   ❌ Failed to create ${provider.name}:`, error.message);
      stats.errors++;
      stats.errorDetails.push({
        provider: provider.name,
        error: error.message
      });
    }
  }
  
  console.log('\n🎉 MORE-PROVIDERS Import Complete!');
  console.log(`   Successfully created/updated: ${stats.providersCreated}`);
  console.log(`   Total errors: ${stats.errors}`);
  
  if (stats.errors > 0) {
    console.log('\n❌ Import Errors:');
    stats.errorDetails.forEach(err => {
      console.log(`   ${err.provider}: ${err.error}`);
    });
  }
  
  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
  
  return { stats, providers };
}

/**
 * Main execution
 */
if (require.main === module) {
  importMoreProviders()
    .then((result) => {
      console.log('\n✅ MORE-PROVIDERS import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ MORE-PROVIDERS import failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  importMoreProviders,
  parseMoreProvidersFile,
  extractProviderFromJson,
  PROVIDER_CLASSIFICATIONS,
  API_URL_MAPPING
};