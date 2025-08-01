#!/usr/bin/env node

/**
 * Web-Hunter Database Reset Script
 * Safely resets the Web-Hunter database by dropping collections and clearing data
 */

const mongoose = require('mongoose');
const readline = require('readline');
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
 * Create readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Ask user for confirmation
 */
function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = createReadlineInterface();
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

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
 * Get current database statistics
 */
async function getDatabaseStats() {
  try {
    const collections = [
      { name: 'Users', model: User },
      { name: 'Provider Integrations', model: ProviderIntegration },
      { name: 'Data Source Catalog', model: DataSourceCatalog },
      { name: 'Orchestration Workflows', model: OrchestrationWorkflow },
      { name: 'Data Quality Monitors', model: DataQualityMonitor },
      { name: 'WebHunter Analytics', model: WebHunterAnalytics }
    ];
    
    const stats = [];
    let totalDocuments = 0;
    
    for (const collection of collections) {
      try {
        const count = await collection.model.countDocuments();
        totalDocuments += count;
        
        stats.push({
          name: collection.name,
          collectionName: collection.model.collection.name,
          count,
          hasData: count > 0
        });
      } catch (error) {
        stats.push({
          name: collection.name,
          collectionName: collection.model.collection.name,
          count: 0,
          hasData: false,
          error: error.message
        });
      }
    }
    
    return { stats, totalDocuments };
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
    return { stats: [], totalDocuments: 0 };
  }
}

/**
 * Reset specific collection
 */
async function resetCollection(model, name) {
  try {
    const result = await model.deleteMany({});
    console.log(`✅ Cleared ${name}: ${result.deletedCount} documents deleted`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to clear ${name}:`, error.message);
    return false;
  }
}

/**
 * Reset Web-Hunter specific collections
 */
async function resetWebHunterCollections() {
  console.log('\n🧹 Resetting Web-Hunter collections...');
  
  const collections = [
    { model: WebHunterAnalytics, name: 'WebHunter Analytics' },
    { model: DataQualityMonitor, name: 'Data Quality Monitors' },
    { model: OrchestrationWorkflow, name: 'Orchestration Workflows' },
    { model: DataSourceCatalog, name: 'Data Source Catalog' },
    { model: ProviderIntegration, name: 'Provider Integrations' }
  ];
  
  let successCount = 0;
  let totalCount = collections.length;
  
  for (const collection of collections) {
    const success = await resetCollection(collection.model, collection.name);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Reset Summary: ${successCount}/${totalCount} collections reset successfully`);
  return successCount === totalCount;
}

/**
 * Reset all collections (including core models)
 */
async function resetAllCollections() {
  console.log('\n🧹 Resetting ALL collections...');
  
  const collections = [
    { model: WebHunterAnalytics, name: 'WebHunter Analytics' },
    { model: DataQualityMonitor, name: 'Data Quality Monitors' },
    { model: OrchestrationWorkflow, name: 'Orchestration Workflows' },
    { model: DataSourceCatalog, name: 'Data Source Catalog' },
    { model: ProviderIntegration, name: 'Provider Integrations' },
    { model: User, name: 'Users' }
  ];
  
  let successCount = 0;
  let totalCount = collections.length;
  
  for (const collection of collections) {
    const success = await resetCollection(collection.model, collection.name);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Reset Summary: ${successCount}/${totalCount} collections reset successfully`);
  return successCount === totalCount;
}

/**
 * Drop database indexes
 */
async function dropIndexes() {
  console.log('\n🔧 Dropping custom indexes...');
  
  const collections = [
    { model: ProviderIntegration, name: 'Provider Integrations' },
    { model: DataSourceCatalog, name: 'Data Source Catalog' },
    { model: OrchestrationWorkflow, name: 'Orchestration Workflows' },
    { model: DataQualityMonitor, name: 'Data Quality Monitors' },
    { model: WebHunterAnalytics, name: 'WebHunter Analytics' }
  ];
  
  for (const collection of collections) {
    try {
      await collection.model.collection.dropIndexes();
      console.log(`✅ Dropped indexes for ${collection.name}`);
    } catch (error) {
      if (error.message.includes('ns not found')) {
        console.log(`ℹ️  No indexes to drop for ${collection.name} (collection doesn't exist)`);
      } else {
        console.error(`❌ Failed to drop indexes for ${collection.name}:`, error.message);
      }
    }
  }
}

/**
 * Create backup before reset
 */
async function createBackup() {
  console.log('\n💾 Creating backup before reset...');
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `webhunter-backup-${timestamp}`;
    
    // This is a simplified backup - in production you'd use mongodump
    const stats = await getDatabaseStats();
    
    if (stats.totalDocuments > 0) {
      console.log(`ℹ️  Would create backup: ${backupName}`);
      console.log(`   Total documents to backup: ${stats.totalDocuments}`);
      console.log('   (Full backup implementation requires mongodump/mongorestore)');
    } else {
      console.log('ℹ️  No data to backup - database is empty');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Backup creation failed:', error.message);
    return false;
  }
}

/**
 * Verify reset completion
 */
async function verifyReset() {
  console.log('\n🔍 Verifying reset completion...');
  
  const { stats, totalDocuments } = await getDatabaseStats();
  
  console.log('Collection Status:');
  stats.forEach(stat => {
    if (stat.error) {
      console.log(`  ❌ ${stat.name}: ERROR - ${stat.error}`);
    } else if (stat.count === 0) {
      console.log(`  ✅ ${stat.name}: Empty (${stat.count} documents)`);
    } else {
      console.log(`  ⚠️  ${stat.name}: Not empty (${stat.count} documents)`);
    }
  });
  
  if (totalDocuments === 0) {
    console.log('\n✅ Reset completed successfully - all collections are empty');
    return true;
  } else {
    console.log(`\n⚠️  Reset incomplete - ${totalDocuments} documents remain`);
    return false;
  }
}

/**
 * Display reset options
 */
function displayResetOptions() {
  console.log('\n📋 RESET OPTIONS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. Reset Web-Hunter collections only (keeps Users)');
  console.log('2. Reset ALL collections (including Users)');
  console.log('3. Drop indexes only');
  console.log('4. Show current status and exit');
  console.log('5. Cancel reset operation');
}

/**
 * Main reset function
 */
async function resetDatabase() {
  console.log('🗑️  Web-Hunter Database Reset Tool\n');
  
  // Connect to database
  const connected = await connectDatabase();
  if (!connected) {
    process.exit(1);
  }
  
  try {
    // Show current database status
    console.log('📊 CURRENT DATABASE STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const { stats, totalDocuments } = await getDatabaseStats();
    
    console.log('Collection Name                 | Documents | Status');
    console.log('─────────────────────────────────────────────────────');
    
    stats.forEach(stat => {
      if (stat.error) {
        console.log(`${stat.name.padEnd(30)} | ERROR     | ${stat.error}`);
      } else {
        const count = stat.count.toString().padStart(9);
        const status = stat.hasData ? 'HAS DATA' : 'EMPTY';
        console.log(`${stat.name.padEnd(30)} | ${count} | ${status}`);
      }
    });
    
    console.log(`\nTotal Documents: ${totalDocuments.toLocaleString()}`);
    
    if (totalDocuments === 0) {
      console.log('\n✅ Database is already empty - no reset needed');
      process.exit(0);
    }
    
    // Check if we have command line arguments
    const args = process.argv.slice(2);
    const forceMode = args.includes('--force') || args.includes('-f');
    const webHunterOnly = args.includes('--webhunter-only') || args.includes('--wh');
    const indexesOnly = args.includes('--indexes-only') || args.includes('-i');
    
    let resetOption;
    
    if (forceMode) {
      if (indexesOnly) {
        resetOption = '3';
      } else if (webHunterOnly) {
        resetOption = '1';
      } else {
        resetOption = '2';
      }
      console.log(`\n⚡ Force mode: Executing reset option ${resetOption}`);
    } else {
      // Interactive mode
      displayResetOptions();
      resetOption = await askConfirmation('\nSelect reset option (1-5): ');
    }
    
    switch (resetOption) {
      case '1':
        console.log('\n🎯 Selected: Reset Web-Hunter collections only');
        if (!forceMode) {
          const confirm = await askConfirmation('\n⚠️  This will delete all Web-Hunter data but preserve Users. Continue? (yes/no): ');
          if (confirm !== 'yes') {
            console.log('❌ Reset cancelled by user');
            process.exit(0);
          }
        }
        
        await resetWebHunterCollections();
        await verifyReset();
        break;
        
      case '2':
        console.log('\n🎯 Selected: Reset ALL collections');
        if (!forceMode) {
          const confirm = await askConfirmation('\n⚠️  This will delete ALL data including Users. Continue? (yes/no): ');
          if (confirm !== 'yes') {
            console.log('❌ Reset cancelled by user');
            process.exit(0);
          }
        }
        
        await createBackup();
        await resetAllCollections();
        await verifyReset();
        break;
        
      case '3':
        console.log('\n🎯 Selected: Drop indexes only');
        if (!forceMode) {
          const confirm = await askConfirmation('\n⚠️  This will drop custom indexes (data will remain). Continue? (yes/no): ');
          if (confirm !== 'yes') {
            console.log('❌ Reset cancelled by user');
            process.exit(0);
          }
        }
        
        await dropIndexes();
        console.log('\n✅ Index drop completed');
        break;
        
      case '4':
        console.log('\n✅ Status displayed - exiting without changes');
        process.exit(0);
        break;
        
      case '5':
      default:
        console.log('\n❌ Reset operation cancelled');
        process.exit(0);
        break;
    }
    
    console.log('\n🎉 Database reset completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run "npm run db:init:webhunter" to initialize with sample data');
    console.log('   2. Run "npm run webhunter:status" to verify the reset');
    console.log('   3. Restart your application services');
    
  } catch (error) {
    console.error('\n❌ Database reset failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run reset if called directly
if (require.main === module) {
  resetDatabase().catch(error => {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  });
}

module.exports = {
  resetDatabase,
  resetWebHunterCollections,
  resetAllCollections,
  dropIndexes,
  getDatabaseStats,
  verifyReset
};