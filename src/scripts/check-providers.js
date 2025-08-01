/**
 * Check ProviderIntegration collection
 */
const mongoose = require('mongoose');
const { ProviderIntegration } = require('../models');

async function checkProviders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/main_server_platform_test');
    console.log('✅ Connected to MongoDB');
    
    // Count providers
    const count = await ProviderIntegration.countDocuments();
    console.log(`📊 Total ProviderIntegration documents: ${count}`);
    
    // Find recent providers from MORE-PROVIDERS import
    const providers = await ProviderIntegration.find({
      providerId: { $regex: /^PROV0001/ }
    }).select('providerId name classification.tier classification.category');
    
    console.log('\n🔍 Recently imported providers:');
    providers.forEach(provider => {
      console.log(`   ${provider.providerId}: ${provider.name} (${provider.classification.tier} - ${provider.classification.category})`);
    });
    
    // Check tier distribution
    const tierStats = await ProviderIntegration.aggregate([
      { $group: { _id: '$classification.tier', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📊 Provider tier distribution:');
    tierStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} providers`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkProviders();