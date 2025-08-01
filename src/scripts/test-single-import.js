/**
 * Test single DataSource import for debugging
 */
const mongoose = require('mongoose');
const { DataSourceCatalog } = require('../models');

async function testSingleImport() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/main_server_platform_test');
    console.log('✅ Connected to MongoDB:', mongoose.connection.name);
    
    // Test data source
    const testSource = {
      sourceId: 'SRC00000001',
      name: 'Test Library',
      displayName: 'Test Library',
      description: 'Test academic library source',
      
      classification: {
        type: 'academic',
        category: 'government',
        industry: ['education'],
        dataTypes: ['text', 'documents'],
        accessibility: 'public'
      },
      
      technical: {
        primaryUrl: 'https://example.com',
        alternativeUrls: [],
        protocol: 'https',
        structure: {
          format: 'html',
          encoding: 'utf-8'
        },
        rateLimit: {
          requestsPerSecond: 1,
          requestsPerDay: 1000,
          burstLimit: 5
        }
      },
      
      content: {
        geographic: {
          country: 'Italia',
          region: 'Europe',
          coordinates: null
        },
        languages: ['it', 'en'],
        topics: ['biblioteca', 'library'],
        updateFrequency: 'unknown',
        coverage: 'partial'
      },
      
      access: {
        authentication: {
          required: false,
          methods: ['none']
        },
        pricing: {
          model: 'free',
          currency: 'EUR'
        },
        limits: {
          daily: 1000,
          monthly: 30000
        }
      },
      
      quality: {
        score: {
          overall: 75,
          reliability: 80,
          completeness: 70,
          accuracy: 75,
          timeliness: 70
        },
        verified: false,
        lastAssessment: new Date()
      },
      
      providers: [],
      
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        lastAccessed: null,
        averageResponseTime: 0
      },
      
      status: {
        overall: 'active',
        lastChecked: new Date(),
        uptime: 95.0,
        issues: []
      },
      
      metadata: {
        tags: ['test', 'biblioteca'],
        keywords: ['test', 'library'],
        importSource: 'TEST',
        importDate: new Date(),
        originalData: {}
      },
      
      security: {
        owner: null,
        visibility: 'public',
        permissions: {
          read: ['admin', 'manager', 'analyst', 'user'],
          write: ['admin', 'manager'],
          delete: ['admin']
        }
      }
    };
    
    console.log('🧪 Testing DataSource creation...');
    console.log('Schema validation...');
    
    // Validate the data first
    const instance = new DataSourceCatalog(testSource);
    const validationError = instance.validateSync();
    
    if (validationError) {
      console.error('❌ Validation failed:', validationError.message);
      console.error('Errors:', validationError.errors);
      return;
    }
    
    console.log('✅ Validation passed');
    
    // Try to save
    const saved = await DataSourceCatalog.create(testSource);
    console.log('✅ Successfully created:', saved.sourceId);
    
    // Count documents
    const count = await DataSourceCatalog.countDocuments();
    console.log('📊 Total documents in collection:', count);
    
    // Find and display
    const found = await DataSourceCatalog.findOne({ sourceId: 'SRC00000001' });
    console.log('🔍 Found document:', {
      sourceId: found.sourceId,
      name: found.name,
      type: found.classification.type,
      country: found.content.geographic.country
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testSingleImport();