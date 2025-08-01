#!/usr/bin/env node

/**
 * Web-Hunter Database Status Check Script
 * Provides comprehensive status information about the Web-Hunter database
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
  }
};

/**
 * Connect to database
 */
async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Get database server information
 */
async function getDatabaseInfo() {
  try {
    const db = mongoose.connection.db;
    const admin = db.admin();
    const serverStatus = await admin.serverStatus();
    const dbStats = await db.stats();
    
    return {
      version: serverStatus.version,
      uptime: serverStatus.uptime,
      connections: serverStatus.connections,
      database: {
        name: db.databaseName,
        collections: dbStats.collections,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexSize: dbStats.indexSize,
        totalSize: dbStats.dataSize + dbStats.indexSize
      }
    };
  } catch (error) {
    console.error('❌ Failed to get database info:', error.message);
    return null;
  }
}

/**
 * Get collection statistics
 */
async function getCollectionStats() {
  const collections = [
    { name: 'Users', model: User },
    { name: 'Provider Integrations', model: ProviderIntegration },
    { name: 'Data Source Catalog', model: DataSourceCatalog },
    { name: 'Orchestration Workflows', model: OrchestrationWorkflow },
    { name: 'Data Quality Monitors', model: DataQualityMonitor },
    { name: 'WebHunter Analytics', model: WebHunterAnalytics }
  ];
  
  const stats = [];
  
  for (const collection of collections) {
    try {
      const count = await collection.model.countDocuments();
      const collectionStats = await mongoose.connection.db.collection(collection.model.collection.name).stats();
      
      stats.push({
        name: collection.name,
        collectionName: collection.model.collection.name,
        count,
        size: collectionStats.size || 0,
        avgObjSize: collectionStats.avgObjSize || 0,
        storageSize: collectionStats.storageSize || 0,
        totalIndexSize: collectionStats.totalIndexSize || 0,
        nindexes: collectionStats.nindexes || 0
      });
    } catch (error) {
      stats.push({
        name: collection.name,
        collectionName: collection.model.collection.name,
        count: 0,
        error: error.message
      });
    }
  }
  
  return stats;
}

/**
 * Check index status
 */
async function getIndexStatus() {
  const collections = [
    { name: 'ProviderIntegration', model: ProviderIntegration },
    { name: 'DataSourceCatalog', model: DataSourceCatalog },
    { name: 'OrchestrationWorkflow', model: OrchestrationWorkflow },
    { name: 'DataQualityMonitor', model: DataQualityMonitor },
    { name: 'WebHunterAnalytics', model: WebHunterAnalytics }
  ];
  
  const indexStatus = [];
  
  for (const collection of collections) {
    try {
      const indexes = await collection.model.collection.getIndexes();
      const indexNames = Object.keys(indexes);
      
      indexStatus.push({
        collection: collection.name,
        indexCount: indexNames.length,
        indexes: indexNames.map(name => ({
          name,
          keys: indexes[name]
        }))
      });
    } catch (error) {
      indexStatus.push({
        collection: collection.name,
        error: error.message
      });
    }
  }
  
  return indexStatus;
}

/**
 * Get Web-Hunter specific metrics
 */
async function getWebHunterMetrics() {
  try {
    const metrics = {};
    
    // Provider metrics
    const providers = await ProviderIntegration.find({});
    metrics.providers = {
      total: providers.length,
      connected: providers.filter(p => p.status.connection === 'connected').length,
      byTier: {},
      byCategory: {}
    };
    
    providers.forEach(p => {
      metrics.providers.byTier[p.classification.tier] = (metrics.providers.byTier[p.classification.tier] || 0) + 1;
      metrics.providers.byCategory[p.classification.category] = (metrics.providers.byCategory[p.classification.category] || 0) + 1;
    });
    
    // Source metrics
    const sources = await DataSourceCatalog.find({});
    metrics.sources = {
      total: sources.length,
      active: sources.filter(s => s.status.overall === 'active').length,
      byType: {},
      byCategory: {}
    };
    
    sources.forEach(s => {
      metrics.sources.byType[s.classification.type] = (metrics.sources.byType[s.classification.type] || 0) + 1;
      metrics.sources.byCategory[s.classification.category] = (metrics.sources.byCategory[s.classification.category] || 0) + 1;
    });
    
    // Workflow metrics
    const workflows = await OrchestrationWorkflow.find({});
    metrics.workflows = {
      total: workflows.length,
      running: workflows.filter(w => w.execution.status === 'running').length,
      scheduled: workflows.filter(w => w.execution.status === 'scheduled').length,
      byType: {}
    };
    
    workflows.forEach(w => {
      metrics.workflows.byType[w.classification.type] = (metrics.workflows.byType[w.classification.type] || 0) + 1;
    });
    
    // Quality monitor metrics
    const monitors = await DataQualityMonitor.find({});
    metrics.qualityMonitors = {
      total: monitors.length,
      active: monitors.filter(m => m.status.overall === 'active').length,
      avgQualityScore: monitors.length > 0 ? 
        monitors.reduce((sum, m) => sum + (m.currentStatus.overallScore || 0), 0) / monitors.length : 0
    };
    
    // Analytics metrics
    const analytics = await WebHunterAnalytics.find({});
    metrics.analytics = {
      total: analytics.length,
      byType: {}
    };
    
    analytics.forEach(a => {
      metrics.analytics.byType[a.reportType] = (metrics.analytics.byType[a.reportType] || 0) + 1;
    });
    
    return metrics;
  } catch (error) {
    console.error('❌ Failed to get Web-Hunter metrics:', error.message);
    return null;
  }
}

/**
 * Format bytes for display
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format uptime for display
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Display database status
 */
async function displayStatus() {
  console.log('🔍 Web-Hunter Database Status Check\n');
  
  // Connect to database
  const connected = await connectDatabase();
  if (!connected) {
    console.log('❌ Database Status: DISCONNECTED');
    process.exit(1);
  }
  
  console.log('✅ Database Status: CONNECTED\n');
  
  try {
    // Database Information
    console.log('📊 DATABASE INFORMATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const dbInfo = await getDatabaseInfo();
    if (dbInfo) {
      console.log(`Database Name:     ${dbInfo.database.name}`);
      console.log(`MongoDB Version:   ${dbInfo.version}`);
      console.log(`Server Uptime:     ${formatUptime(dbInfo.uptime)}`);
      console.log(`Active Connections: ${dbInfo.connections.current}/${dbInfo.connections.available}`);
      console.log(`Collections:       ${dbInfo.database.collections}`);
      console.log(`Data Size:         ${formatBytes(dbInfo.database.dataSize)}`);
      console.log(`Storage Size:      ${formatBytes(dbInfo.database.storageSize)}`);
      console.log(`Index Size:        ${formatBytes(dbInfo.database.indexSize)}`);
      console.log(`Total Size:        ${formatBytes(dbInfo.database.totalSize)}`);
    }
    
    // Collection Statistics
    console.log('\n📋 COLLECTION STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const collectionStats = await getCollectionStats();
    console.log('Collection Name                 | Documents | Data Size  | Indexes | Storage Size');
    console.log('─────────────────────────────────────────────────────────────────────────────────');
    
    collectionStats.forEach(stat => {
      if (stat.error) {
        console.log(`${stat.name.padEnd(30)} | ERROR: ${stat.error}`);
      } else {
        const name = stat.name.padEnd(30);
        const count = stat.count.toString().padStart(9);
        const dataSize = formatBytes(stat.size).padStart(10);
        const indexes = stat.nindexes.toString().padStart(7);
        const storageSize = formatBytes(stat.storageSize).padStart(12);
        
        console.log(`${name} | ${count} | ${dataSize} | ${indexes} | ${storageSize}`);
      }
    });
    
    // Web-Hunter Metrics
    console.log('\n🕷️ WEB-HUNTER METRICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const metrics = await getWebHunterMetrics();
    if (metrics) {
      // Provider Integration Status
      console.log('Provider Integrations:');
      console.log(`  Total:      ${metrics.providers.total}`);
      console.log(`  Connected:  ${metrics.providers.connected}`);
      console.log(`  By Tier:    ${Object.entries(metrics.providers.byTier).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
      console.log(`  By Category: ${Object.entries(metrics.providers.byCategory).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
      
      // Data Sources Status
      console.log('\nData Sources:');
      console.log(`  Total:      ${metrics.sources.total}`);
      console.log(`  Active:     ${metrics.sources.active}`);
      console.log(`  By Type:    ${Object.entries(metrics.sources.byType).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
      console.log(`  By Category: ${Object.entries(metrics.sources.byCategory).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
      
      // Workflows Status
      console.log('\nOrchestration Workflows:');
      console.log(`  Total:      ${metrics.workflows.total}`);
      console.log(`  Running:    ${metrics.workflows.running}`);
      console.log(`  Scheduled:  ${metrics.workflows.scheduled}`);
      console.log(`  By Type:    ${Object.entries(metrics.workflows.byType).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
      
      // Quality Monitors Status
      console.log('\nData Quality Monitors:');
      console.log(`  Total:      ${metrics.qualityMonitors.total}`);
      console.log(`  Active:     ${metrics.qualityMonitors.active}`);
      console.log(`  Avg Quality Score: ${metrics.qualityMonitors.avgQualityScore.toFixed(1)}%`);
      
      // Analytics Status
      console.log('\nAnalytics Reports:');
      console.log(`  Total:      ${metrics.analytics.total}`);
      console.log(`  By Type:    ${Object.entries(metrics.analytics.byType).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
    }
    
    // Index Status
    console.log('\n🔍 INDEX STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const indexStatus = await getIndexStatus();
    indexStatus.forEach(status => {
      if (status.error) {
        console.log(`${status.collection}: ERROR - ${status.error}`);
      } else {
        console.log(`${status.collection}: ${status.indexCount} indexes`);
        status.indexes.forEach(index => {
          const keys = Object.keys(index.keys).join(', ');
          console.log(`  • ${index.name}: {${keys}}`);
        });
      }
    });
    
    // Health Summary
    console.log('\n🏥 HEALTH SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const totalDocuments = collectionStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
    const hasErrors = collectionStats.some(stat => stat.error);
    
    if (hasErrors) {
      console.log('⚠️  Status: WARNING - Some collections have errors');
    } else if (totalDocuments === 0) {
      console.log('ℹ️  Status: EMPTY - Database is initialized but contains no data');
      console.log('   Run "npm run db:init:webhunter" to populate with sample data');
    } else {
      console.log('✅ Status: HEALTHY - All collections accessible and populated');
      console.log(`   Total Documents: ${totalDocuments.toLocaleString()}`);
      console.log(`   Web-Hunter Framework: ${metrics ? 'OPERATIONAL' : 'NOT CONFIGURED'}`);
    }
    
    console.log('\n📋 QUICK COMMANDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Initialize database:    npm run db:init:webhunter');
    console.log('Reset database:         npm run webhunter:reset');
    console.log('Check status:           npm run webhunter:status');
    console.log('Backup database:        npm run db:backup');
    console.log('Restore database:       npm run db:restore');
    
  } catch (error) {
    console.error('\n❌ Status check failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run status check if called directly
if (require.main === module) {
  displayStatus().catch(error => {
    console.error('❌ Status check failed:', error);
    process.exit(1);
  });
}

module.exports = {
  displayStatus,
  connectDatabase,
  getDatabaseInfo,
  getCollectionStats,
  getIndexStatus,
  getWebHunterMetrics
};