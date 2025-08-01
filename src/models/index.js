/**
 * Models Index - Central export for all database models
 * Main Server Platform - Enterprise Database Models
 */

const User = require('./User');
const Employee = require('./Employee');
const ResearchProject = require('./ResearchProject');
const DataMiningJob = require('./DataMiningJob');

// Web-Hunter Framework Models
const ProviderIntegration = require('./ProviderIntegration');
const DataSourceCatalog = require('./DataSourceCatalog');
const OrchestrationWorkflow = require('./OrchestrationWorkflow');
const DataQualityMonitor = require('./DataQualityMonitor');
const WebHunterAnalytics = require('./WebHunterAnalytics');

// Export all models for easy import
module.exports = {
  // Core Models
  User,
  Employee,
  ResearchProject,
  DataMiningJob,
  
  // Web-Hunter Framework Models
  ProviderIntegration,
  DataSourceCatalog,
  OrchestrationWorkflow,
  DataQualityMonitor,
  WebHunterAnalytics
};

/**
 * Model Usage Examples:
 * 
 * // Import all models
 * const { User, Employee, ResearchProject, DataMiningJob, ProviderIntegration, DataSourceCatalog, OrchestrationWorkflow, DataQualityMonitor, WebHunterAnalytics } = require('./models');
 * 
 * // Import specific model
 * const User = require('./models/User');
 * const ProviderIntegration = require('./models/ProviderIntegration');
 * 
 * // Create new instances
 * const user = new User({ username: 'john_doe', email: 'john@example.com' });
 * const employee = new Employee({ userId: user._id, employeeId: 'EMP000001' });
 * const project = new ResearchProject({ title: 'AI Research', projectId: 'PROJ000001' });
 * const job = new DataMiningJob({ name: 'Web Scraping Job', jobId: 'JOB00000001' });
 * 
 * // Web-Hunter Framework instances
 * const provider = new ProviderIntegration({ name: 'Bright Data', providerId: 'PROV000001' });
 * const source = new DataSourceCatalog({ name: 'E-commerce Data', sourceId: 'SRC00000001' });
 * const workflow = new OrchestrationWorkflow({ name: 'Multi-Provider Workflow', workflowId: 'WF00000001' });
 * const monitor = new DataQualityMonitor({ name: 'Quality Monitor', monitorId: 'DQM0000001' });
 * const analytics = new WebHunterAnalytics({ name: 'System Analytics', analyticsId: 'WHA00000001' });
 */

// Model relationship helpers
const ModelRelations = {
  /**
   * Get user with all associated data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User with related data
   */
  async getUserWithAssociations(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    const [employee, projects, jobs] = await Promise.all([
      Employee.findOne({ userId }),
      ResearchProject.find({ 'team.principalInvestigator.userId': userId }),
      DataMiningJob.find({ 'security.owner': userId })
    ]);

    return {
      user,
      employee,
      projects: projects || [],
      jobs: jobs || []
    };
  },

  /**
   * Initialize framework permissions for user
   * @param {string} userId - User ID
   * @param {Array} frameworks - Array of framework names
   * @returns {Promise<User>} - Updated user
   */
  async initializeFrameworkPermissions(userId, frameworks = []) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    frameworks.forEach(framework => {
      if (user.frameworks[framework]) {
        user.frameworks[framework].enabled = true;
      }
    });

    return user.save();
  },

  /**
   * Clean up user data across all models
   * @param {string} userId - User ID to clean up
   * @returns {Promise<Object>} - Cleanup results
   */
  async cleanupUserData(userId) {
    const results = {};

    // Update employee records
    results.employee = await Employee.updateMany(
      { userId },
      { status: 'terminated' }
    );

    // Update research projects
    results.projects = await ResearchProject.updateMany(
      { 'team.principalInvestigator.userId': userId },
      { $set: { 'team.principalInvestigator.status': 'inactive' } }
    );

    // Update data mining jobs
    results.jobs = await DataMiningJob.updateMany(
      { 'security.owner': userId },
      { 'execution.status': 'cancelled' }
    );

    return results;
  }
};

// Export relations helper
module.exports.ModelRelations = ModelRelations;

// Export model names for dynamic access
module.exports.MODEL_NAMES = {
  // Core Models
  USER: 'User',
  EMPLOYEE: 'Employee',
  RESEARCH_PROJECT: 'ResearchProject',
  DATA_MINING_JOB: 'DataMiningJob',
  
  // Web-Hunter Framework Models
  PROVIDER_INTEGRATION: 'ProviderIntegration',
  DATA_SOURCE_CATALOG: 'DataSourceCatalog',
  ORCHESTRATION_WORKFLOW: 'OrchestrationWorkflow',
  DATA_QUALITY_MONITOR: 'DataQualityMonitor',
  WEBHUNTER_ANALYTICS: 'WebHunterAnalytics'
};

// Framework-specific model mappings
module.exports.FRAMEWORK_MODELS = {
  'ai-hrms': ['User', 'Employee'],
  'nose': ['User', 'ResearchProject'],
  'web-hunter': ['User', 'DataMiningJob', 'ProviderIntegration', 'DataSourceCatalog', 'OrchestrationWorkflow', 'DataQualityMonitor', 'WebHunterAnalytics']
};

console.log('✅ Enterprise Database Models Loaded Successfully');
console.log('📊 Core Models: User, Employee, ResearchProject, DataMiningJob');
console.log('🕷️ Web-Hunter Models: ProviderIntegration, DataSourceCatalog, OrchestrationWorkflow, DataQualityMonitor, WebHunterAnalytics');
console.log('🔧 Framework Support: AI-HRMS, NOSE Research, Web-Hunter');
console.log('🎯 Total Models: 9 | Web-Hunter Specific: 5');