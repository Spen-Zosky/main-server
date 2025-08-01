/**
 * NOSE Research Publication Validation Schemas
 * Express-validator schemas for publication management operations
 */

const { body, param, query } = require('express-validator');

/**
 * Validation for creating a publication
 */
const createPublication = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  body('title')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Publication title must be between 10 and 500 characters'),

  body('authors')
    .isArray({ min: 1 })
    .withMessage('At least one author is required'),

  body('authors.*.order')
    .isInt({ min: 1 })
    .withMessage('Author order must be a positive integer'),

  body('authors.*.isCorresponding')
    .isBoolean()
    .withMessage('isCorresponding must be a boolean'),

  // Internal author validation
  body('authors.*.userId')
    .if((value, { req, location, path }) => {
      const authorIndex = path.split('.')[1];
      return !req.body.authors[authorIndex].name; // If no name provided, userId is required
    })
    .isMongoId()
    .withMessage('Valid user ID is required for internal authors'),

  // External author validation
  body('authors.*.name')
    .if((value, { req, location, path }) => {
      const authorIndex = path.split('.')[1];
      return !req.body.authors[authorIndex].userId; // If no userId provided, name is required
    })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name is required for external authors and must be between 2 and 100 characters'),

  body('publicationType')
    .isIn(['journal_article', 'conference_paper', 'book_chapter', 'book', 'thesis', 'report', 'patent'])
    .withMessage('Invalid publication type'),

  body('status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'])
    .withMessage('Invalid publication status'),

  // Venue validation
  body('venue.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Venue name must be between 2 and 200 characters'),

  body('venue.type')
    .optional()
    .isIn(['journal', 'conference', 'workshop', 'book', 'repository'])
    .withMessage('Invalid venue type'),

  body('venue.impactFactor')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Impact factor must be a positive number'),

  body('venue.ranking')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Venue ranking must be between 1 and 10 characters'),

  // Date validations
  body('dates.submitted')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid submission date is required'),

  body('dates.accepted')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid acceptance date is required'),

  body('dates.published')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid publication date is required'),

  // Identifier validations
  body('identifiers.doi')
    .optional()
    .matches(/^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/)
    .withMessage('Invalid DOI format'),

  body('identifiers.pmid')
    .optional()
    .isNumeric()
    .withMessage('PMID must be numeric'),

  body('identifiers.arxivId')
    .optional()
    .matches(/^\d{4}\.\d{4,5}(v\d+)?$/)
    .withMessage('Invalid arXiv ID format'),

  body('identifiers.isbn')
    .optional()
    .matches(/^(97[89])?\d{9}(\d|X)$/)
    .withMessage('Invalid ISBN format'),

  // URL validations
  body('urls.manuscript')
    .optional()
    .isURL()
    .withMessage('Manuscript URL must be valid'),

  body('urls.supplementary')
    .optional()
    .isURL()
    .withMessage('Supplementary URL must be valid'),

  body('urls.data')
    .optional()
    .isURL()
    .withMessage('Data URL must be valid'),

  body('urls.code')
    .optional()
    .isURL()
    .withMessage('Code URL must be valid'),

  body('citationCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Citation count must be a non-negative integer'),

  // Abstract validation (if provided)
  body('abstract')
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Abstract must be between 50 and 5000 characters'),

  // Keywords validation
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),

  body('keywords.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each keyword must be between 2 and 50 characters')
];

/**
 * Validation for updating a publication
 */
const updatePublication = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  param('publicationId')
    .isMongoId()
    .withMessage('Invalid publication ID format'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Publication title must be between 10 and 500 characters'),

  body('authors')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one author is required'),

  body('authors.*.order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Author order must be a positive integer'),

  body('authors.*.isCorresponding')
    .optional()
    .isBoolean()
    .withMessage('isCorresponding must be a boolean'),

  body('publicationType')
    .optional()
    .isIn(['journal_article', 'conference_paper', 'book_chapter', 'book', 'thesis', 'report', 'patent'])
    .withMessage('Invalid publication type'),

  body('status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'])
    .withMessage('Invalid publication status'),

  body('venue.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Venue name must be between 2 and 200 characters'),

  body('venue.type')
    .optional()
    .isIn(['journal', 'conference', 'workshop', 'book', 'repository'])
    .withMessage('Invalid venue type'),

  body('venue.impactFactor')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Impact factor must be a positive number'),

  body('dates.submitted')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid submission date is required'),

  body('dates.accepted')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid acceptance date is required'),

  body('dates.published')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid publication date is required'),

  body('identifiers.doi')
    .optional()
    .matches(/^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/)
    .withMessage('Invalid DOI format'),

  body('identifiers.pmid')
    .optional()
    .isNumeric()
    .withMessage('PMID must be numeric'),

  body('citationCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Citation count must be a non-negative integer'),

  body('abstract')
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Abstract must be between 50 and 5000 characters'),

  // Date consistency validation
  body()
    .custom((body) => {
      if (body.dates) {
        const { submitted, accepted, published } = body.dates;
        
        if (submitted && accepted && new Date(accepted) < new Date(submitted)) {
          throw new Error('Acceptance date cannot be before submission date');
        }
        
        if (accepted && published && new Date(published) < new Date(accepted)) {
          throw new Error('Publication date cannot be before acceptance date');
        }
        
        if (submitted && published && new Date(published) < new Date(submitted)) {
          throw new Error('Publication date cannot be before submission date');
        }
      }
      return true;
    })
];

/**
 * Validation for publication queries
 */
const publicationQuery = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  query('status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'])
    .withMessage('Invalid status filter'),

  query('publicationType')
    .optional()
    .isIn(['journal_article', 'conference_paper', 'book_chapter', 'book', 'thesis', 'report', 'patent'])
    .withMessage('Invalid publication type filter'),

  query('venueType')
    .optional()
    .isIn(['journal', 'conference', 'workshop', 'book', 'repository'])
    .withMessage('Invalid venue type filter'),

  query('yearFrom')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid year range'),

  query('yearTo')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid year range'),

  query('minCitations')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum citations must be a non-negative integer'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'publishedDate', 'citationCount'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

/**
 * Validation for publication search
 */
const searchPublications = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),

  query('filters.status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'])
    .withMessage('Invalid status filter'),

  query('filters.publicationType')
    .optional()
    .isIn(['journal_article', 'conference_paper', 'book_chapter', 'book', 'thesis', 'report', 'patent'])
    .withMessage('Invalid publication type filter'),

  query('filters.venueType')
    .optional()
    .isIn(['journal', 'conference', 'workshop', 'book', 'repository'])
    .withMessage('Invalid venue type filter'),

  query('searchFields')
    .optional()
    .isArray()
    .withMessage('Search fields must be an array'),

  query('searchFields.*')
    .optional()
    .isIn(['title', 'abstract', 'venue', 'authors', 'keywords'])
    .withMessage('Invalid search field')
];

/**
 * Validation for citation update
 */
const updateCitations = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  param('publicationId')
    .isMongoId()
    .withMessage('Invalid publication ID format'),

  body('citationCount')
    .isInt({ min: 0 })
    .withMessage('Citation count must be a non-negative integer'),

  body('citationSource')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Citation source must be between 2 and 100 characters'),

  body('lastUpdated')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid last updated date is required')
];

/**
 * Validation for publication export
 */
const exportPublications = [
  query('format')
    .optional()
    .isIn(['json', 'csv', 'bibtex', 'ris'])
    .withMessage('Export format must be json, csv, bibtex, or ris'),

  query('projectId')
    .optional()
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  query('status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'])
    .withMessage('Invalid status filter'),

  query('publicationType')
    .optional()
    .isIn(['journal_article', 'conference_paper', 'book_chapter', 'book', 'thesis', 'report', 'patent'])
    .withMessage('Invalid publication type filter'),

  query('dateFrom')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid from date is required'),

  query('dateTo')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid to date is required')
    .custom((value, { req }) => {
      if (req.query.dateFrom && new Date(value) <= new Date(req.query.dateFrom)) {
        throw new Error('To date must be after from date');
      }
      return true;
    }),

  query('includeUnpublished')
    .optional()
    .isBoolean()
    .withMessage('includeUnpublished must be a boolean'),

  query('minCitations')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum citations must be a non-negative integer')
];

/**
 * Validation for bulk publication operations
 */
const bulkPublicationOperation = [
  body('operation')
    .isIn(['update_status', 'update_venue', 'delete', 'export'])
    .withMessage('Invalid bulk operation type'),

  body('publicationIds')
    .isArray({ min: 1 })
    .withMessage('At least one publication ID is required'),

  body('publicationIds.*')
    .isMongoId()
    .withMessage('All publication IDs must be valid'),

  body('operationData')
    .isObject()
    .withMessage('Operation data must be an object'),

  // Status update validation
  body('operationData.status')
    .if(body('operation').equals('update_status'))
    .isIn(['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'])
    .withMessage('Invalid status for bulk update'),

  // Venue update validation
  body('operationData.venue.name')
    .if(body('operation').equals('update_venue'))
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Venue name must be between 2 and 200 characters'),

  body('operationData.venue.type')
    .if(body('operation').equals('update_venue'))
    .optional()
    .isIn(['journal', 'conference', 'workshop', 'book', 'repository'])
    .withMessage('Invalid venue type')
];

module.exports = {
  createPublication,
  updatePublication,
  publicationQuery,
  searchPublications,
  updateCitations,
  exportPublications,
  bulkPublicationOperation
};