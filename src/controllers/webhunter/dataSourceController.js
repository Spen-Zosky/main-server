/**
 * Web-Hunter Data Source Catalog Controller
 * Manages data sources with quality metrics and provider mappings
 */

const { DataSourceCatalog } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get all data sources with filtering and pagination
 * @route GET /api/v1/webhunter/sources
 */
const getAllSources = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    type,
    category,
    industry,
    provider,
    qualityMin,
    geographic,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = buildFilter({
    'classification.type': type,
    'classification.category': category,
    'classification.industry': industry ? { $in: [industry] } : null,
    'providers.providerId': provider,
    'quality.score.overall': qualityMin ? { $gte: parseInt(qualityMin) } : null,
    'content.geographic.regions': geographic ? { $in: [geographic] } : null,
    search: search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sourceId: { $regex: search, $options: 'i' } }
      ]
    } : null
  });

  // Pagination options
  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
  };

  const result = await paginate(DataSourceCatalog, filter, options);

  logger.info('Data sources retrieved', {
    userId: req.user.id,
    count: result.docs.length,
    totalDocs: result.totalDocs,
    filter
  });

  res.json({
    success: true,
    message: 'Data sources retrieved successfully',
    data: result.docs,
    pagination: {
      total: result.totalDocs,
      pages: result.totalPages,
      page: result.page,
      limit: result.limit,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage
    }
  });
});

/**
 * Get data source by ID
 * @route GET /api/v1/webhunter/sources/:sourceId
 */
const getSourceById = handleAsync(async (req, res) => {
  const { sourceId } = req.params;
  const { include } = req.query;

  let query = DataSourceCatalog.findOne({ sourceId });

  // Handle include parameter for related data
  if (include && include.includes('providers')) {
    // In a real implementation, this would populate provider details
    query = query.populate('providers.providerId');
  }

  const source = await query;

  if (!source) {
    throw new ApiError(404, 'Data source not found');
  }

  logger.info('Data source retrieved', {
    sourceId,
    userId: req.user.id,
    action: 'view_source'
  });

  res.json({
    success: true,
    message: 'Data source retrieved successfully',
    data: source
  });
});

/**
 * Create new data source
 * @route POST /api/v1/webhunter/sources
 */
const createSource = handleAsync(async (req, res) => {
  const sourceData = {
    ...req.body,
    sourceId: await DataSourceCatalog.generateSourceId(),
    'audit.createdBy': req.user.id
  };

  const source = new DataSourceCatalog(sourceData);
  await source.save();

  logger.info('Data source created', {
    sourceId: source.sourceId,
    userId: req.user.id,
    name: source.name
  });

  res.status(201).json({
    success: true,
    message: 'Data source created successfully',
    data: source
  });
});

/**
 * Update data source
 * @route PUT /api/v1/webhunter/sources/:sourceId
 */
const updateSource = handleAsync(async (req, res) => {
  const { sourceId } = req.params;
  const updates = {
    ...req.body,
    'audit.updatedBy': req.user.id
  };

  const source = await DataSourceCatalog.findOneAndUpdate(
    { sourceId },
    updates,
    { new: true, runValidators: true }
  );

  if (!source) {
    throw new ApiError(404, 'Data source not found');
  }

  logger.info('Data source updated', {
    sourceId,
    userId: req.user.id,
    updatedFields: Object.keys(req.body)
  });

  res.json({
    success: true,
    message: 'Data source updated successfully',
    data: source
  });
});

/**
 * Delete data source
 * @route DELETE /api/v1/webhunter/sources/:sourceId
 */
const deleteSource = handleAsync(async (req, res) => {
  const { sourceId } = req.params;

  const source = await DataSourceCatalog.findOneAndDelete({ sourceId });

  if (!source) {
    throw new ApiError(404, 'Data source not found');
  }

  logger.info('Data source deleted', {
    sourceId,
    userId: req.user.id,
    name: source.name
  });

  res.json({
    success: true,
    message: 'Data source deleted successfully'
  });
});

/**
 * Update source provider mapping
 * @route PUT /api/v1/webhunter/sources/:sourceId/providers/:providerId
 */
const updateSourceProvider = handleAsync(async (req, res) => {
  const { sourceId, providerId } = req.params;
  const providerUpdate = req.body;

  const source = await DataSourceCatalog.findOne({ sourceId });

  if (!source) {
    throw new ApiError(404, 'Data source not found');
  }

  // Find and update the specific provider mapping
  const providerIndex = source.providers.findIndex(p => p.providerId === providerId);

  if (providerIndex === -1) {
    // Add new provider mapping
    source.providers.push({
      providerId,
      ...providerUpdate,
      addedDate: new Date()
    });
  } else {
    // Update existing provider mapping
    source.providers[providerIndex] = {
      ...source.providers[providerIndex].toObject(),
      ...providerUpdate,
      updatedDate: new Date()
    };
  }

  source.audit.updatedBy = req.user.id;
  await source.save();

  logger.info('Source provider mapping updated', {
    sourceId,
    providerId,
    userId: req.user.id,
    action: providerIndex === -1 ? 'added' : 'updated'
  });

  res.json({
    success: true,
    message: 'Provider mapping updated successfully',
    data: source.providers.find(p => p.providerId === providerId)
  });
});

/**
 * Perform quality assessment on data source
 * @route POST /api/v1/webhunter/sources/:sourceId/quality-check
 */
const performQualityCheck = handleAsync(async (req, res) => {
  const { sourceId } = req.params;

  const source = await DataSourceCatalog.findOne({ sourceId });

  if (!source) {
    throw new ApiError(404, 'Data source not found');
  }

  // Simulate quality assessment (in real implementation, this would perform actual checks)
  const qualityAssessment = {
    sourceId,
    overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
    scores: {
      completeness: Math.floor(Math.random() * 20) + 80, // 80-100
      accuracy: Math.floor(Math.random() * 30) + 70, // 70-100
      consistency: Math.floor(Math.random() * 25) + 75, // 75-100
      timeliness: Math.floor(Math.random() * 20) + 80, // 80-100
    },
    issues: [],
    assessedAt: new Date()
  };

  // Add issues based on low scores
  if (qualityAssessment.scores.completeness < 85) {
    qualityAssessment.issues.push({
      type: 'data_completeness',
      severity: 'medium',
      description: 'Some fields have missing data'
    });
  }

  if (qualityAssessment.scores.accuracy < 80) {
    qualityAssessment.issues.push({
      type: 'data_accuracy',
      severity: 'high',
      description: 'Data accuracy below acceptable threshold'
    });
  }

  // Update source quality scores
  await DataSourceCatalog.findOneAndUpdate(
    { sourceId },
    {
      'quality.score': qualityAssessment.scores,
      'quality.lastAssessment': qualityAssessment.assessedAt,
      'audit.updatedBy': req.user.id
    }
  );

  logger.info('Quality assessment performed', {
    sourceId,
    userId: req.user.id,
    overallScore: qualityAssessment.overallScore,
    issuesCount: qualityAssessment.issues.length
  });

  res.json({
    success: true,
    message: 'Quality assessment completed successfully',
    data: qualityAssessment
  });
});

/**
 * Get data sources by type
 * @route GET /api/v1/webhunter/sources/type/:type
 */
const getSourcesByType = handleAsync(async (req, res) => {
  const { type } = req.params;
  const { category, qualityMin = 70 } = req.query;

  const filter = {
    'classification.type': type,
    'quality.score.overall': { $gte: parseInt(qualityMin) }
  };

  if (category) {
    filter['classification.category'] = category;
  }

  const sources = await DataSourceCatalog.find(filter)
    .select('sourceId name displayName classification quality status')
    .sort({ 'quality.score.overall': -1 });

  res.json({
    success: true,
    message: `${type} sources retrieved successfully`,
    data: sources,
    count: sources.length
  });
});

/**
 * Get source provider performance
 * @route GET /api/v1/webhunter/sources/:sourceId/provider-performance
 */
const getSourceProviderPerformance = handleAsync(async (req, res) => {
  const { sourceId } = req.params;

  const source = await DataSourceCatalog.findOne({ sourceId });

  if (!source) {
    throw new ApiError(404, 'Data source not found');
  }

  // Simulate provider performance data
  const providerPerformance = source.providers.map(provider => ({
    providerId: provider.providerId,
    providerName: provider.providerName,
    accessMethod: provider.accessMethod,
    priority: provider.priority,
    recommended: provider.recommended,
    status: provider.status,
    performance: {
      successRate: Math.random() * 10 + 90, // 90-100%
      avgResponseTime: Math.floor(Math.random() * 300) + 100, // 100-400ms
      dataQuality: Math.floor(Math.random() * 20) + 80, // 80-100
      costPerRequest: Math.random() * 0.1, // $0.00-$0.10
      uptime: Math.random() * 5 + 95, // 95-100%
      lastUpdated: new Date()
    }
  }));

  res.json({
    success: true,
    message: 'Provider performance data retrieved successfully',
    data: {
      sourceId,
      sourceName: source.name,
      providerPerformance
    }
  });
});

/**
 * Search data sources
 * @route GET /api/v1/webhunter/search/sources
 */
const searchSources = handleAsync(async (req, res) => {
  const { q, filters = {} } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const searchFilter = {
    $text: { $search: q },
    ...buildFilter(filters)
  };

  const sources = await DataSourceCatalog.find(searchFilter)
    .select('sourceId name displayName classification quality status')
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);

  res.json({
    success: true,
    message: 'Search completed successfully',
    data: sources,
    count: sources.length
  });
});

module.exports = {
  getAllSources,
  getSourceById,
  createSource,
  updateSource,
  deleteSource,
  updateSourceProvider,
  performQualityCheck,
  getSourcesByType,
  getSourceProviderPerformance,
  searchSources
};