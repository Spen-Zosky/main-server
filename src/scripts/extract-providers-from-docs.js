/**
 * Extract Providers from Web-Hunter Documentation
 * Parses comprehensive provider research reports and creates structured provider data
 * for import into ProviderIntegration database model
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { ProviderIntegration } = require('../models');

// Configuration
const DOCS_PATH = '/home/ubuntu/main-server/docs/web-hunter-domain';
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Provider extraction patterns and mappings
 */
const PROVIDER_PATTERNS = {
  // Tier classification patterns
  tierPatterns: {
    'TIER 1: ENTERPRISE CHAMPIONS': 'enterprise_champion', 
    'TIER 2: SPECIALIZED SOLUTIONS': 'specialized_solution',
    'DEEP WEB & INTELLIGENCE SPECIALISTS': 'intelligence_specialist',
    'THREAT INTELLIGENCE': 'intelligence_specialist',
    'DARKINT DATABASE': 'intelligence_specialist'
  },
  
  // Provider name extraction patterns
  namePatterns: [
    /###\s*🏆\s*\*\*(.*?)\*\*\s*-\s*(.*)/,  // 🏆 **BRIGHT DATA** - GLOBAL INFRASTRUCTURE LEADER
    /###\s*🚀\s*\*\*(.*?)\*\*\s*-\s*(.*)/,  // 🚀 **APIFY** - ECOSYSTEM & MARKETPLACE LEADER  
    /###\s*🎓\s*\*\*(.*?)\*\*\s*-\s*(.*)/,  // 🎓 **OPENALEX** - ACADEMIC RESEARCH CHAMPION
    /###\s*🤖\s*\*\*(.*?)\*\*\s*-\s*(.*)/,  // 🤖 **SCRAPEGRAPHAI** - AI EXTRACTION PIONEER
    /###\s*🔥\s*\*\*(.*?)\*\*\s*-\s*(.*)/,  // 🔥 **FIRECRAWL** - LLM-READY SPECIALIST
    /###\s*🕵️\s*\*\*(.*?)\*\*\s*-\s*(.*)/,  // 🕵️ **RECORDED FUTURE** - THREAT INTELLIGENCE LEADER
    /###\s*🦉\s*\*\*(.*?)\*\*\s*-\s*(.*)/   // 🦉 **DARKOWL** - DARKINT DATABASE
  ],
  
  // Pricing extraction patterns
  pricingPatterns: [
    /Entry Level:\s*\$(\d+)\/month/i,
    /Pay-as-you-go:\s*\$(\d+(?:\.\d+)?)\s*per\s*1,?000/i,
    /Enterprise:\s*\$(\d+)\+?\/month/i,
    /Personal:\s*\$(\d+)\/month/i,
    /Team:\s*\$(\d+)\/month/i,
    /Business:\s*\$(\d+)\/month/i,
    /API Access:\s*FREE/i,
    /From\s*\$(\d+)\/month/i,
    /\$(\d+)\/month minimum/i,
    /Custom pricing.*\$(\d+)/i
  ],
  
  // API capabilities patterns
  apiPatterns: [
    /REST API/i,
    /GraphQL/i,
    /WebSockets/i,
    /SDK.*Python/i,
    /SDK.*JavaScript/i,
    /SDK.*Java/i,
    /OAuth 2\.0/i,
    /JWT/i,
    /API.*Key/i
  ],
  
  // Coverage and features patterns
  coveragePatterns: [
    /(\d+)M\+?\s*(?:IP|records|articles|papers)/i,
    /(\d+)\+?\s*countries/i,
    /(\d+)k\+?\s*(?:scrapers|sources|venues)/i,
    /99\.(\d+)%\s*uptime/i
  ]
};

/**
 * Provider classification mappings (aligned with ProviderIntegration schema)
 */
const PROVIDER_CLASSIFICATIONS = {
  'BRIGHT DATA': {
    category: 'web_scraping',
    specializations: ['e_commerce', 'social_media', 'financial_data', 'government_sources'],
    tier: 'enterprise_champion',
    priority: 'critical'
  },
  'APIFY': {
    category: 'web_scraping', 
    specializations: ['e_commerce', 'social_media', 'ai_ready_content'],
    tier: 'enterprise_champion',
    priority: 'critical'
  },
  'OPENALEX': {
    category: 'academic_research',
    specializations: ['academic_papers', 'ai_ready_content'],
    tier: 'enterprise_champion', 
    priority: 'high'
  },
  'SCRAPEGRAPHAI': {
    category: 'ai_extraction',
    specializations: ['ai_ready_content', 'real_time_data'],
    tier: 'specialized_solution',
    priority: 'high'
  },
  'FIRECRAWL': {
    category: 'ai_extraction',
    specializations: ['ai_ready_content', 'e_commerce'],
    tier: 'specialized_solution',
    priority: 'medium'
  },
  'RECORDED FUTURE': {
    category: 'threat_intelligence',
    specializations: ['dark_web', 'real_time_data'],
    tier: 'intelligence_specialist',
    priority: 'high'
  },
  'DARKOWL': {
    category: 'threat_intelligence',
    specializations: ['dark_web', 'government_sources'],
    tier: 'intelligence_specialist', 
    priority: 'medium'
  }
};

/**
 * Statistics tracking
 */
const stats = {
  documentsProcessed: 0,
  providersExtracted: 0,
  providersCreated: 0,
  errors: 0,
  errorDetails: []
};

/**
 * Extract provider information from text content
 */
function extractProviderInfo(content, filename) {
  const providers = [];
  const lines = content.split('\n');
  
  let currentProvider = null;
  let currentTier = null;
  let inProviderSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect tier classification
    for (const [pattern, tier] of Object.entries(PROVIDER_PATTERNS.tierPatterns)) {
      if (line.includes(pattern)) {
        currentTier = tier;
        break;
      }
    }
    
    // Detect provider headers
    for (const pattern of PROVIDER_PATTERNS.namePatterns) {
      const match = line.match(pattern);
      if (match) {
        // Save previous provider if exists
        if (currentProvider) {
          providers.push(currentProvider);
        }
        
        // Start new provider
        const providerName = match[1].trim();
        const providerDescription = match[2].trim();
        
        currentProvider = {
          providerId: generateProviderId(providerName, i + 1),
          name: providerName,
          displayName: `${providerName} - ${providerDescription}`,
          description: providerDescription,
          tier: currentTier || 'specialized_solution',
          classification: PROVIDER_CLASSIFICATIONS[providerName] || getDefaultClassification(providerName),
          extractedFrom: filename,
          rawContent: [],
          pricing: {},
          capabilities: [],
          coverage: {}
        };
        
        inProviderSection = true;
        break;
      }
    }
    
    // Collect content for current provider
    if (inProviderSection && currentProvider) {
      currentProvider.rawContent.push(line);
      
      // Extract pricing information
      for (const pattern of PROVIDER_PATTERNS.pricingPatterns) {
        const match = line.match(pattern);
        if (match) {
          if (pattern.source.includes('Entry Level')) {
            currentProvider.pricing.entryLevel = parseInt(match[1]);
          } else if (pattern.source.includes('Pay-as-you-go')) {
            currentProvider.pricing.payPerThousand = parseFloat(match[1]);
          } else if (pattern.source.includes('Enterprise')) {
            currentProvider.pricing.enterprise = parseInt(match[1]);
          } else if (pattern.source.includes('Personal')) {
            currentProvider.pricing.personal = parseInt(match[1]);
          } else if (pattern.source.includes('Team')) {
            currentProvider.pricing.team = parseInt(match[1]);
          } else if (pattern.source.includes('Business')) {
            currentProvider.pricing.business = parseInt(match[1]);
          } else if (pattern.source.includes('FREE')) {
            currentProvider.pricing.free = true;
          } else if (pattern.source.includes('minimum')) {
            currentProvider.pricing.minimum = parseInt(match[1]);
          } else if (match[1]) {
            currentProvider.pricing.starting = parseInt(match[1]);
          }
        }
      }
      
      // Extract API capabilities
      for (const pattern of PROVIDER_PATTERNS.apiPatterns) {
        if (pattern.test(line)) {
          const capability = pattern.source.replace(/[\\^$*+?.()|[\]{}]/g, '').toLowerCase();
          if (!currentProvider.capabilities.includes(capability)) {
            currentProvider.capabilities.push(capability);
          }
        }
      }
      
      // Extract coverage metrics
      for (const pattern of PROVIDER_PATTERNS.coveragePatterns) {
        const match = line.match(pattern);
        if (match) {
          if (line.includes('IP') || line.includes('records')) {
            currentProvider.coverage.records = `${match[1]}M+`;
          } else if (line.includes('countries')) {
            currentProvider.coverage.countries = parseInt(match[1]);
          } else if (line.includes('uptime')) {
            currentProvider.coverage.uptime = parseFloat(`99.${match[1]}`);
          }
        }
      }
      
      // End provider section on next tier or new provider
      if (line.startsWith('##') || line.startsWith('---')) {
        inProviderSection = false;
      }
    }
  }
  
  // Add final provider
  if (currentProvider) {
    providers.push(currentProvider);
  }
  
  return providers;
}

/**
 * Generate provider ID (6 digits as required by schema PROV000000)
 */
function generateProviderId(name, index = 1) {
  // Use a simple numerical ID based on index
  const id = String(index).padStart(6, '0');
  return `PROV${id}`;
}

/**
 * Get default classification for unknown providers
 */
function getDefaultClassification(name) {
  return {
    category: 'data_provider',
    specializations: ['general'],
    tier: 'specialized_solution',
    priority: 10
  };
}

/**
 * Transform extracted provider to ProviderIntegration format
 */
function transformToProviderIntegration(extracted) {
  const classification = extracted.classification;
  
  return {
    providerId: extracted.providerId,
    name: extracted.name,
    displayName: extracted.displayName,
    description: extracted.description,
    
    classification: {
      tier: classification.tier,
      category: classification.category,
      specializations: classification.specializations,
      priority: classification.priority
    },
    
    integration: {
      api: {
        baseUrl: generateBaseUrl(extracted.name),
        version: 'v1',
        protocol: 'https',
        format: 'json',
        
      },
      
      authentication: {
        type: extracted.pricing.free ? 'none' : 'api_key',
        apiKey: {
          headerName: 'X-API-Key',
          prefix: 'Bearer '
        }
      },
      
      sdks: [{
        language: 'javascript',
        version: '1.0.0',
        quality: 'good'
      }, {
        language: 'python', 
        version: '1.0.0',
        quality: 'good'
      }],
      
      dataFormats: {
        input: ['json'],
        output: ['json', 'csv']
      }
    },
    
    capabilities: {
      dataSources: [{
        type: 'websites',
        coverage: {
          geographic: ['US', 'EU', 'GLOBAL'],
          languages: ['en', 'es', 'fr', 'de'],
          volume: extracted.coverage.records || '1M+ records'
        },
        quality: 'good'
      }],
      
      features: [{
        name: 'javascript_rendering',
        enabled: true,
        description: 'JavaScript rendering capability'
      }, {
        name: 'proxy_rotation', 
        enabled: true,
        description: 'Automatic proxy rotation'
      }],
      
      performance: {
        concurrent: classification.tier === 'enterprise_champion' ? 100 : 10,
        throughput: classification.tier === 'enterprise_champion' ? 1000 : 100,
        reliability: extracted.coverage.uptime ? extracted.coverage.uptime / 100 : 0.95
      },
      
      compliance: {
        gdpr: classification.tier === 'enterprise_champion',
        ccpa: classification.tier === 'enterprise_champion',
        sox: classification.tier === 'enterprise_champion',
        certifications: classification.tier === 'enterprise_champion' ? ['SOC2', 'ISO27001'] : []
      }
    },
    
    pricing: {
      model: extracted.pricing.free ? 'free' : 'subscription',
      currency: 'USD',
      
      tiers: generatePricingTiers(extracted.pricing, classification),
      
      billing: {
        methods: ['credit_card'],
        cycle: 'monthly'
      }
    },
    
    performance: {
      uptime: {
        target: extracted.coverage.uptime || 99.5,
        measured: extracted.coverage.uptime || 99.5,
        sla: classification.tier === 'enterprise_champion'
      },
      
      latency: {
        average: classification.tier === 'enterprise_champion' ? 200 : 500,
        p95: classification.tier === 'enterprise_champion' ? 500 : 1000
      },
      
      reliability: {
        successRate: classification.tier === 'enterprise_champion' ? 99.2 : 95.0,
        errorRate: classification.tier === 'enterprise_champion' ? 0.8 : 5.0
      }
    },
    
    monitoring: {
      healthCheck: {
        enabled: true,
        endpoint: `${generateBaseUrl(extracted.name)}/health`,
        interval: 300,
        timeout: 30000
      },
      
      metrics: {
        enabled: true,
        retention: 90
      }
    },
    
    status: {
      connection: 'connected',
      health: {
        overall: 'healthy',
        lastCheck: new Date(),
        issues: []
      },
      environment: 'production'
    },
    
    metadata: {
      tags: [classification.tier, classification.category, ...classification.specializations],
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      
      contact: {
        support: `support@${extracted.name.toLowerCase().replace(/\s+/g, '')}.com`,
        documentation: `${generateBaseUrl(extracted.name)}/docs`
      },
      
      notes: `Extracted from Web-Hunter documentation: ${extracted.extractedFrom}`,
      
      importMetadata: {
        source: 'web-hunter-documentation-extraction',
        extractedFrom: extracted.extractedFrom,
        capabilities: extracted.capabilities,
        coverage: extracted.coverage,
        pricing: extracted.pricing
      }
    },
    
    security: {
      encryption: {
        inTransit: true,
        atRest: false
      },
      
      access: {
        internal: true,
        external: false
      }
    }
  };
}

/**
 * Generate base URL for provider
 */
function generateBaseUrl(name) {
  const urlMap = {
    'BRIGHT DATA': 'https://api.brightdata.com',
    'APIFY': 'https://api.apify.com',
    'OPENALEX': 'https://api.openalex.org',
    'SCRAPEGRAPHAI': 'https://api.scrapegraphai.com',
    'FIRECRAWL': 'https://api.firecrawl.dev',
    'RECORDED FUTURE': 'https://api.recordedfuture.com',
    'DARKOWL': 'https://api.darkowl.com'
  };
  
  return urlMap[name] || `https://api.${name.toLowerCase().replace(/\s+/g, '')}.com`;
}

/**
 * Generate pricing tiers based on extracted data
 */
function generatePricingTiers(pricing, classification) {
  const tiers = [];
  
  if (pricing.free) {
    tiers.push({
      name: 'Free',
      price: { amount: 0, currency: 'USD', period: 'monthly' },
      limits: {
        requests: 1000,
        dataSources: 5,
        concurrent: 1
      },
      features: ['basic_api', 'community_support']
    });
  }
  
  if (pricing.entryLevel) {
    tiers.push({
      name: 'Professional',
      price: { amount: pricing.entryLevel, currency: 'USD', period: 'monthly' },
      limits: {
        requests: 10000,
        dataSources: 'unlimited',
        concurrent: 5
      },
      features: ['full_api', 'email_support', 'analytics']
    });
  }
  
  if (pricing.enterprise) {
    tiers.push({
      name: 'Enterprise',
      price: { amount: pricing.enterprise, currency: 'USD', period: 'monthly' },
      limits: {
        requests: 'unlimited',
        dataSources: 'unlimited', 
        concurrent: 'unlimited'
      },
      features: ['full_api', '24/7_support', 'dedicated_manager', 'custom_integration', 'sla']
    });
  }
  
  // Default tier if no pricing found
  if (tiers.length === 0) {
    tiers.push({
      name: 'Standard',
      price: { amount: 99, currency: 'USD', period: 'monthly' },
      limits: {
        requests: 5000,
        dataSources: 10,
        concurrent: 3
      },
      features: ['api_access', 'email_support']
    });
  }
  
  return tiers;
}

/**
 * Process all documentation files
 */
async function extractProvidersFromDocumentation() {
  console.log('🔍 Starting Provider Extraction from Web-Hunter Documentation...');
  console.log(`📁 Docs Path: ${DOCS_PATH}`);
  console.log(`🔧 Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE EXTRACTION'}`);
  
  const docFiles = [
    '01-COMPREHENSIVE-PROVIDER-RESEARCH-REPORT.md',
    'ENTERPRISE-DATA-MINING-PROVIDERS-MATRIX-2025-01.md',
    'ENTERPRISE-DATA-MINING-PROVIDERS-MATRIX-2025-02.md',
    '02-API-INTEGRATION-ARCHITECTURE-ANALYSIS.md'
  ];
  
  const allProviders = [];
  
  // Process each documentation file
  for (const filename of docFiles) {
    const filePath = path.join(DOCS_PATH, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      continue;
    }
    
    console.log(`\n📄 Processing: ${filename}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const extractedProviders = extractProviderInfo(content, filename);
      
      console.log(`   📊 Providers extracted: ${extractedProviders.length}`);
      
      extractedProviders.forEach(provider => {
        console.log(`   🔍 Found: ${provider.name} (${provider.tier})`);
      });
      
      allProviders.push(...extractedProviders);
      stats.documentsProcessed++;
      stats.providersExtracted += extractedProviders.length;
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
      stats.errors++;
      stats.errorDetails.push({
        file: filename,
        error: error.message
      });
    }
  }
  
  // Deduplicate providers by name
  const uniqueProviders = allProviders.reduce((acc, current) => {
    const existing = acc.find(p => p.name === current.name);
    if (!existing) {
      acc.push(current);
    } else {
      // Merge information from multiple sources
      existing.rawContent.push(...current.rawContent);
      existing.capabilities.push(...current.capabilities);
      existing.capabilities = [...new Set(existing.capabilities)]; // Remove duplicates
    }
    return acc;
  }, []);
  
  console.log(`\n📊 Extraction Summary:`);
  console.log(`   Documents processed: ${stats.documentsProcessed}`);
  console.log(`   Total providers found: ${stats.providersExtracted}`);
  console.log(`   Unique providers: ${uniqueProviders.length}`);
  console.log(`   Errors: ${stats.errors}`);
  
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - Providers would be created:');
    uniqueProviders.forEach((provider, index) => {
      console.log(`   ${index + 1}. ${provider.name} (${provider.tier})`);
      console.log(`      Capabilities: ${provider.capabilities.join(', ')}`);
      console.log(`      Pricing: ${JSON.stringify(provider.pricing)}`);
    });
    return { stats, providers: uniqueProviders };
  }
  
  // Connect to MongoDB and create providers
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/main_server_platform_test');
  console.log('✅ Connected to MongoDB');
  
  console.log('\n💾 Creating ProviderIntegration documents...');
  
  for (let index = 0; index < uniqueProviders.length; index++) {
    const extractedProvider = uniqueProviders[index];
    try {
      // Fix the provider ID with correct index
      extractedProvider.providerId = generateProviderId(extractedProvider.name, index + 1);
      const providerData = transformToProviderIntegration(extractedProvider);
      
      // Check if provider already exists
      const existing = await ProviderIntegration.findOne({ providerId: providerData.providerId });
      
      if (existing) {
        console.log(`   ⚠️  Provider exists: ${providerData.name} - Updating...`);
        await ProviderIntegration.findOneAndUpdate(
          { providerId: providerData.providerId },
          providerData,
          { new: true }
        );
      } else {
        const created = await ProviderIntegration.create(providerData);
        console.log(`   ✅ Created: ${created.name} (${created.providerId})`);
      }
      
      stats.providersCreated++;
      
    } catch (error) {
      console.error(`   ❌ Failed to create ${extractedProvider.name}:`, error.message);
      stats.errors++;
      stats.errorDetails.push({
        provider: extractedProvider.name,
        error: error.message
      });
    }
  }
  
  console.log('\n🎉 Provider Extraction Complete!');
  console.log(`   Successfully created/updated: ${stats.providersCreated}`);
  console.log(`   Total errors: ${stats.errors}`);
  
  if (stats.errors > 0) {
    console.log('\n❌ Error Details:');
    stats.errorDetails.forEach(err => {
      console.log(`   ${err.file || err.provider}: ${err.error}`);
    });
  }
  
  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
  
  return { stats, providers: uniqueProviders };
}

/**
 * Main execution
 */
if (require.main === module) {
  extractProvidersFromDocumentation()
    .then((result) => {
      console.log('\n✅ Provider extraction completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Provider extraction failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  extractProvidersFromDocumentation,
  extractProviderInfo,
  transformToProviderIntegration,
  PROVIDER_CLASSIFICATIONS
};