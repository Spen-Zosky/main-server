/**
 * Debug MongoDB connection and DataSourceCatalog model
 */
const mongoose = require('mongoose');
const { DataSourceCatalog } = require('../models');

async function debugConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/main_server_platform_test');
    console.log('✅ Connected to MongoDB:', mongoose.connection.name);
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    
    // Check model registration
    console.log('🔍 Checking model registration...');
    console.log('DataSourceCatalog model:', !!DataSourceCatalog);
    console.log('Model name:', DataSourceCatalog.modelName);
    console.log('Collection name:', DataSourceCatalog.collection.name);
    
    // List all collections
    console.log('\n📁 Listing all collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Check if datasourcecatalogs collection exists
    const dsCollection = collections.find(col => col.name === 'datasourcecatalogs');
    console.log('\n🔍 DataSourceCatalog collection exists:', !!dsCollection);
    
    // Try to count documents in DataSourceCatalog
    const count = await DataSourceCatalog.countDocuments();
    console.log('📊 DataSourceCatalog documents count:', count);
    
    // Try to find any document
    const sample = await DataSourceCatalog.findOne();
    console.log('🔍 Sample document exists:', !!sample);
    
    if (sample) {
      console.log('Sample document:', {
        sourceId: sample.sourceId,
        name: sample.name,
        type: sample.classification.type
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

debugConnection();