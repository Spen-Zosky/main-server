/**
 * NOSE Research Publication Controller
 * Handles research publication management
 */

const { ResearchProject } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get publications for a research project
 * @route GET /api/v1/nose/projects/:projectId/publications
 */
const getPublications = handleAsync(async (req, res) => {
  const { projectId } = req.params;
  const {
    page = 1,
    limit = 20,
    status,
    publicationType,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const project = await ResearchProject.findOne({ projectId })
    .populate('publications.authors.userId', 'profile.firstName profile.lastName email');

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  let publications = project.publications;

  // Apply filters
  if (status) {
    publications = publications.filter(pub => pub.status === status);
  }

  if (publicationType) {
    publications = publications.filter(pub => pub.publicationType === publicationType);
  }

  // Apply sorting
  publications.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle nested date fields
    if (sortBy === 'publishedDate') {
      aValue = a.dates?.published;
      bValue = b.dates?.published;
    }

    if (!aValue && !bValue) return 0;
    if (!aValue) return 1;
    if (!bValue) return -1;

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPublications = publications.slice(startIndex, endIndex);

  const response = {
    publications: paginatedPublications,
    pagination: {
      total: publications.length,
      pages: Math.ceil(publications.length / limit),
      page: parseInt(page),
      limit: parseInt(limit),
      hasNext: endIndex < publications.length,
      hasPrev: page > 1
    },
    summary: {
      totalPublications: project.publications.length,
      byStatus: getPublicationStatusDistribution(project.publications),
      byType: getPublicationTypeDistribution(project.publications),
      totalCitations: project.publications.reduce((sum, pub) => sum + (pub.citationCount || 0), 0)
    }
  };

  res.json({
    success: true,
    message: 'Publications retrieved successfully',
    data: response
  });
});

/**
 * Get specific publication by ID
 * @route GET /api/v1/nose/projects/:projectId/publications/:publicationId
 */
const getPublicationById = handleAsync(async (req, res) => {
  const { projectId, publicationId } = req.params;

  const project = await ResearchProject.findOne({ projectId })
    .populate('publications.authors.userId', 'profile.firstName profile.lastName email');

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  const publication = project.publications.id(publicationId);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  // Enrich publication data
  const enrichedPublication = {
    ...publication.toObject(),
    projectInfo: {
      projectId: project.projectId,
      title: project.title,
      principalInvestigator: project.team.principalInvestigator
    },
    metrics: {
      citationCount: publication.citationCount || 0,
      lastCitationUpdate: publication.lastCitationUpdate
    }
  };

  res.json({
    success: true,
    message: 'Publication retrieved successfully',
    data: enrichedPublication
  });
});

/**
 * Create new publication
 * @route POST /api/v1/nose/projects/:projectId/publications
 */
const createPublication = handleAsync(async (req, res) => {
  const { projectId } = req.params;
  const publicationData = req.body;

  const project = await ResearchProject.findOne({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  // Validate author order uniqueness
  const authorOrders = publicationData.authors.map(author => author.order);
  const uniqueOrders = [...new Set(authorOrders)];
  
  if (authorOrders.length !== uniqueOrders.length) {
    throw new ApiError(400, 'Author order numbers must be unique');
  }

  // Ensure at least one corresponding author
  const correspondingAuthors = publicationData.authors.filter(author => author.isCorresponding);
  if (correspondingAuthors.length === 0) {
    throw new ApiError(400, 'At least one corresponding author is required');
  }

  // Sort authors by order
  publicationData.authors.sort((a, b) => a.order - b.order);

  // Add the publication
  const newPublication = project.publications.create(publicationData);
  project.publications.push(newPublication);

  project.audit.updatedBy = req.user.id;
  await project.save();

  // Populate the new publication
  await project.populate('publications.authors.userId', 'profile.firstName profile.lastName email');
  
  const createdPublication = project.publications.id(newPublication._id);

  logger.info('Publication created', {
    projectId,
    publicationId: newPublication._id,
    title: publicationData.title,
    userId: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Publication created successfully',
    data: createdPublication
  });
});

/**
 * Update publication
 * @route PUT /api/v1/nose/projects/:projectId/publications/:publicationId
 */
const updatePublication = handleAsync(async (req, res) => {
  const { projectId, publicationId } = req.params;
  const updates = req.body;

  const project = await ResearchProject.findOne({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  const publication = project.publications.id(publicationId);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  // Validate author updates if provided
  if (updates.authors) {
    const authorOrders = updates.authors.map(author => author.order);
    const uniqueOrders = [...new Set(authorOrders)];
    
    if (authorOrders.length !== uniqueOrders.length) {
      throw new ApiError(400, 'Author order numbers must be unique');
    }

    const correspondingAuthors = updates.authors.filter(author => author.isCorresponding);
    if (correspondingAuthors.length === 0) {
      throw new ApiError(400, 'At least one corresponding author is required');
    }

    updates.authors.sort((a, b) => a.order - b.order);
  }

  // Update publication fields
  Object.keys(updates).forEach(key => {
    if (key !== '_id') {
      publication[key] = updates[key];
    }
  });

  // Update last citation update if citation count changed
  if (updates.citationCount !== undefined) {
    publication.lastCitationUpdate = new Date();
  }

  project.audit.updatedBy = req.user.id;
  await project.save();

  // Populate the updated publication
  await project.populate('publications.authors.userId', 'profile.firstName profile.lastName email');
  
  const updatedPublication = project.publications.id(publicationId);

  logger.info('Publication updated', {
    projectId,
    publicationId,
    userId: req.user.id,
    updatedFields: Object.keys(updates)
  });

  res.json({
    success: true,
    message: 'Publication updated successfully',
    data: updatedPublication
  });
});

/**
 * Delete publication
 * @route DELETE /api/v1/nose/projects/:projectId/publications/:publicationId
 */
const deletePublication = handleAsync(async (req, res) => {
  const { projectId, publicationId } = req.params;

  const project = await ResearchProject.findOne({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  const publication = project.publications.id(publicationId);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  const publicationTitle = publication.title;
  
  // Remove the publication
  project.publications.pull(publicationId);
  
  project.audit.updatedBy = req.user.id;
  await project.save();

  logger.info('Publication deleted', {
    projectId,
    publicationId,
    title: publicationTitle,
    userId: req.user.id
  });

  res.json({
    success: true,
    message: 'Publication deleted successfully',
    data: {
      projectId,
      publicationId,
      remainingPublications: project.publications.length
    }
  });
});

/**
 * Search publications across all projects
 * @route GET /api/v1/nose/search/publications
 */
const searchPublications = handleAsync(async (req, res) => {
  const { q, filters = {} } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const searchFilter = buildFilter(filters);
  
  const projects = await ResearchProject.find(searchFilter)
    .populate('publications.authors.userId', 'profile.firstName profile.lastName email');

  // Extract and filter publications
  const allPublications = [];
  projects.forEach(project => {
    project.publications.forEach(publication => {
      const publicationData = publication.toObject();
      
      // Check if publication matches search query
      const matchesTitle = publication.title.toLowerCase().includes(q.toLowerCase());
      const matchesAbstract = publication.abstract && 
        publication.abstract.toLowerCase().includes(q.toLowerCase());
      const matchesVenue = publication.venue?.name && 
        publication.venue.name.toLowerCase().includes(q.toLowerCase());
      
      if (matchesTitle || matchesAbstract || matchesVenue) {
        allPublications.push({
          ...publicationData,
          projectInfo: {
            projectId: project.projectId,
            title: project.title
          }
        });
      }
    });
  });

  // Sort by relevance (title matches first, then by citation count)
  allPublications.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(q.toLowerCase());
    const bTitle = b.title.toLowerCase().includes(q.toLowerCase());
    
    if (aTitle && !bTitle) return -1;
    if (!aTitle && bTitle) return 1;
    
    return (b.citationCount || 0) - (a.citationCount || 0);
  });

  res.json({
    success: true,
    message: 'Publication search completed successfully',
    data: allPublications.slice(0, 50), // Limit to 50 results
    count: allPublications.length
  });
});

/**
 * Export publications
 * @route GET /api/v1/nose/export/publications
 */
const exportPublications = handleAsync(async (req, res) => {
  const { format = 'json', projectId, filters = {} } = req.query;

  let searchFilter = buildFilter(filters);
  
  // If projectId is specified, filter by that project
  if (projectId) {
    searchFilter.projectId = projectId;
  }

  const projects = await ResearchProject.find(searchFilter)
    .populate('publications.authors.userId', 'profile.firstName profile.lastName email');

  // Extract all publications
  const allPublications = [];
  projects.forEach(project => {
    project.publications.forEach(publication => {
      allPublications.push({
        ...publication.toObject(),
        projectInfo: {
          projectId: project.projectId,
          title: project.title,
          principalInvestigator: project.team.principalInvestigator
        }
      });
    });
  });

  if (format === 'bibtex') {
    // Convert to BibTeX format
    const bibtexEntries = allPublications.map(pub => generateBibtexEntry(pub));
    const bibtex = bibtexEntries.join('\n\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="publications_${new Date().toISOString().split('T')[0]}.bib"`);
    res.send(bibtex);
  } else if (format === 'csv') {
    // Convert to CSV format
    const csvData = allPublications.map(pub => ({
      title: pub.title,
      authors: pub.authors.map(a => a.name || `${a.userId?.profile?.firstName} ${a.userId?.profile?.lastName}`).join('; '),
      publicationType: pub.publicationType,
      venue: pub.venue?.name || '',
      status: pub.status,
      publishedDate: pub.dates?.published || '',
      doi: pub.identifiers?.doi || '',
      citationCount: pub.citationCount || 0,
      projectId: pub.projectInfo.projectId,
      projectTitle: pub.projectInfo.title
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="publications_${new Date().toISOString().split('T')[0]}.csv"`);
    
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    
    res.send(csv);
  } else {
    res.json({
      success: true,
      message: 'Publications exported successfully',
      data: allPublications,
      exportDate: new Date().toISOString(),
      count: allPublications.length
    });
  }

  logger.info('Publications exported', {
    userId: req.user.id,
    format,
    count: allPublications.length,
    projectId: projectId || 'all'
  });
});

// Helper Functions

function getPublicationStatusDistribution(publications) {
  return publications.reduce((acc, pub) => {
    acc[pub.status] = (acc[pub.status] || 0) + 1;
    return acc;
  }, {});
}

function getPublicationTypeDistribution(publications) {
  return publications.reduce((acc, pub) => {
    acc[pub.publicationType] = (acc[pub.publicationType] || 0) + 1;
    return acc;
  }, {});
}

function generateBibtexEntry(publication) {
  const type = getBibtexType(publication.publicationType);
  const key = generateBibtexKey(publication);
  
  let entry = `@${type}{${key},\n`;
  entry += `  title = {${publication.title}},\n`;
  
  if (publication.authors && publication.authors.length > 0) {
    const authors = publication.authors
      .sort((a, b) => a.order - b.order)
      .map(a => a.name || `${a.userId?.profile?.firstName} ${a.userId?.profile?.lastName}`)
      .join(' and ');
    entry += `  author = {${authors}},\n`;
  }
  
  if (publication.venue?.name) {
    if (publication.publicationType === 'journal_article') {
      entry += `  journal = {${publication.venue.name}},\n`;
    } else if (publication.publicationType === 'conference_paper') {
      entry += `  booktitle = {${publication.venue.name}},\n`;
    }
  }
  
  if (publication.dates?.published) {
    const year = new Date(publication.dates.published).getFullYear();
    entry += `  year = {${year}},\n`;
  }
  
  if (publication.identifiers?.doi) {
    entry += `  doi = {${publication.identifiers.doi}},\n`;
  }
  
  entry = entry.slice(0, -2) + '\n'; // Remove trailing comma
  entry += '}';
  
  return entry;
}

function getBibtexType(publicationType) {
  const typeMapping = {
    'journal_article': 'article',
    'conference_paper': 'inproceedings',
    'book_chapter': 'inbook',
    'book': 'book',
    'thesis': 'phdthesis',
    'report': 'techreport',
    'patent': 'misc'
  };
  
  return typeMapping[publicationType] || 'misc';
}

function generateBibtexKey(publication) {
  const firstAuthor = publication.authors?.find(a => a.order === 1);
  const authorName = firstAuthor?.name || 
    `${firstAuthor?.userId?.profile?.firstName}${firstAuthor?.userId?.profile?.lastName}` || 
    'Unknown';
  
  const year = publication.dates?.published ? 
    new Date(publication.dates.published).getFullYear() : 
    new Date().getFullYear();
  
  const titleWords = publication.title.split(' ').slice(0, 2).join('');
  
  return `${authorName.replace(/\s+/g, '')}${year}${titleWords}`.replace(/[^a-zA-Z0-9]/g, '');
}

module.exports = {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  searchPublications,
  exportPublications
};