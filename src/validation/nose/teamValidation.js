/**
 * NOSE Research Team Validation Schemas
 * Express-validator schemas for team management operations
 */

const { body, param, query } = require('express-validator');

/**
 * Validation for adding team member
 */
const addTeamMember = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  body('memberType')
    .isIn(['coInvestigator', 'student', 'externalCollaborator'])
    .withMessage('Member type must be coInvestigator, student, or externalCollaborator'),

  // Co-investigator validations
  body('memberData.userId')
    .if(body('memberType').equals('coInvestigator'))
    .isMongoId()
    .withMessage('Valid user ID is required for co-investigator'),

  body('memberData.role')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),

  body('memberData.affiliationInstitution')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution name must be between 2 and 200 characters'),

  body('memberData.expertise')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .isArray()
    .withMessage('Expertise must be an array'),

  body('memberData.expertise.*')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each expertise area must be between 2 and 100 characters'),

  body('memberData.contributionPercentage')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Contribution percentage must be between 0 and 100'),

  // Student validations
  body('memberData.userId')
    .if(body('memberType').equals('student'))
    .isMongoId()
    .withMessage('Valid user ID is required for student'),

  body('memberData.level')
    .if(body('memberType').equals('student'))
    .isIn(['undergraduate', 'graduate', 'phd', 'postdoc'])
    .withMessage('Student level must be undergraduate, graduate, phd, or postdoc'),

  body('memberData.supervisor')
    .if(body('memberType').equals('student'))
    .optional()
    .isMongoId()
    .withMessage('Supervisor must be a valid user ID'),

  body('memberData.expectedGraduationDate')
    .if(body('memberType').equals('student'))
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid expected graduation date is required'),

  body('memberData.thesisTitle')
    .if(body('memberType').equals('student'))
    .optional()
    .trim()
    .isLength({ min: 5, max: 300 })
    .withMessage('Thesis title must be between 5 and 300 characters'),

  // External collaborator validations
  body('memberData.name')
    .if(body('memberType').equals('externalCollaborator'))
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('External collaborator name is required and must be between 2 and 100 characters'),

  body('memberData.email')
    .if(body('memberType').equals('externalCollaborator'))
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required for external collaborator'),

  body('memberData.institution')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution name must be between 2 and 200 characters'),

  body('memberData.role')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),

  body('memberData.expertise')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .isArray()
    .withMessage('Expertise must be an array'),

  body('memberData.contactInfo.phone')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),

  body('memberData.contactInfo.address')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters')
];

/**
 * Validation for updating team member
 */
const updateTeamMember = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  param('memberId')
    .isMongoId()
    .withMessage('Invalid member ID format'),

  body('memberType')
    .isIn(['coInvestigator', 'student', 'externalCollaborator'])
    .withMessage('Member type must be coInvestigator, student, or externalCollaborator'),

  // General update validations
  body('updates')
    .isObject()
    .withMessage('Updates must be an object'),

  // Co-investigator update validations
  body('updates.role')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),

  body('updates.affiliationInstitution')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution name must be between 2 and 200 characters'),

  body('updates.expertise')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .isArray()
    .withMessage('Expertise must be an array'),

  body('updates.contributionPercentage')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Contribution percentage must be between 0 and 100'),

  body('updates.status')
    .if(body('memberType').equals('coInvestigator'))
    .optional()
    .isIn(['active', 'inactive', 'left'])
    .withMessage('Status must be active, inactive, or left'),

  // Student update validations
  body('updates.level')
    .if(body('memberType').equals('student'))
    .optional()
    .isIn(['undergraduate', 'graduate', 'phd', 'postdoc'])
    .withMessage('Student level must be undergraduate, graduate, phd, or postdoc'),

  body('updates.supervisor')
    .if(body('memberType').equals('student'))
    .optional()
    .isMongoId()
    .withMessage('Supervisor must be a valid user ID'),

  body('updates.expectedGraduationDate')
    .if(body('memberType').equals('student'))
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid expected graduation date is required'),

  body('updates.thesisTitle')
    .if(body('memberType').equals('student'))
    .optional()
    .trim()
    .isLength({ min: 5, max: 300 })
    .withMessage('Thesis title must be between 5 and 300 characters'),

  body('updates.status')
    .if(body('memberType').equals('student'))
    .optional()
    .isIn(['active', 'completed', 'withdrawn'])
    .withMessage('Student status must be active, completed, or withdrawn'),

  // External collaborator update validations
  body('updates.name')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('updates.email')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('updates.institution')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution name must be between 2 and 200 characters'),

  body('updates.role')
    .if(body('memberType').equals('externalCollaborator'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),

  // Prevent updating userId
  body('updates.userId')
    .not()
    .exists()
    .withMessage('User ID cannot be updated')
];

/**
 * Validation for removing team member
 */
const removeTeamMember = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  param('memberId')
    .isMongoId()
    .withMessage('Invalid member ID format'),

  query('memberType')
    .isIn(['coInvestigator', 'student', 'externalCollaborator'])
    .withMessage('Member type query parameter is required and must be coInvestigator, student, or externalCollaborator')
];

/**
 * Validation for team member queries
 */
const teamMemberQuery = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  query('includeInactive')
    .optional()
    .isBoolean()
    .withMessage('includeInactive must be a boolean'),

  query('memberType')
    .optional()
    .isIn(['coInvestigator', 'student', 'externalCollaborator'])
    .withMessage('Member type filter must be coInvestigator, student, or externalCollaborator'),

  query('expertise')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Expertise filter must be between 2 and 100 characters'),

  query('institution')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution filter must be between 2 and 200 characters')
];

/**
 * Validation for role assignment
 */
const assignRole = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  param('memberId')
    .isMongoId()
    .withMessage('Invalid member ID format'),

  body('role')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),

  body('memberType')
    .isIn(['coInvestigator', 'student', 'externalCollaborator'])
    .withMessage('Member type must be specified'),

  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),

  body('permissions.*')
    .optional()
    .isIn(['view', 'edit', 'delete', 'manage_team', 'manage_publications'])
    .withMessage('Invalid permission type')
];

/**
 * Validation for bulk team operations
 */
const bulkTeamOperation = [
  param('projectId')
    .matches(/^PROJ[0-9]{6}$/)
    .withMessage('Invalid project ID format'),

  body('operation')
    .isIn(['update_status', 'update_role', 'remove', 'assign_permissions'])
    .withMessage('Invalid bulk operation type'),

  body('memberIds')
    .isArray({ min: 1 })
    .withMessage('At least one member ID is required'),

  body('memberIds.*')
    .isMongoId()
    .withMessage('All member IDs must be valid'),

  body('operationData')
    .isObject()
    .withMessage('Operation data must be an object'),

  // Specific validations based on operation type
  body('operationData.status')
    .if(body('operation').equals('update_status'))
    .isIn(['active', 'inactive', 'left', 'completed', 'withdrawn'])
    .withMessage('Invalid status for bulk update'),

  body('operationData.role')
    .if(body('operation').equals('update_role'))
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),

  body('operationData.permissions')
    .if(body('operation').equals('assign_permissions'))
    .isArray()
    .withMessage('Permissions must be an array'),

  body('operationData.permissions.*')
    .if(body('operation').equals('assign_permissions'))
    .isIn(['view', 'edit', 'delete', 'manage_team', 'manage_publications'])
    .withMessage('Invalid permission type')
];

module.exports = {
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  teamMemberQuery,
  assignRole,
  bulkTeamOperation
};