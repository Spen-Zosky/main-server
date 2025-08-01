/**
 * NOSE Research Team Controller
 * Handles team management for research projects
 */

const { ResearchProject } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const logger = require('../../utils/logger');

/**
 * Get team members for a research project
 * @route GET /api/v1/nose/projects/:projectId/team
 */
const getTeamMembers = handleAsync(async (req, res) => {
  const { projectId } = req.params;

  const project = await ResearchProject.findOne({ projectId })
    .populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName email')
    .populate('team.coInvestigators.userId', 'profile.firstName profile.lastName email')
    .populate('team.students.userId', 'profile.firstName profile.lastName email');

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  const teamData = {
    projectId,
    projectTitle: project.title,
    principalInvestigator: {
      userId: project.team.principalInvestigator.userId._id,
      name: `${project.team.principalInvestigator.userId.profile.firstName} ${project.team.principalInvestigator.userId.profile.lastName}`,
      email: project.team.principalInvestigator.userId.email,
      role: project.team.principalInvestigator.role,
      affiliationInstitution: project.team.principalInvestigator.affiliationInstitution,
      contactEmail: project.team.principalInvestigator.contactEmail
    },
    coInvestigators: project.team.coInvestigators.map(co => ({
      _id: co._id,
      userId: co.userId._id,
      name: `${co.userId.profile.firstName} ${co.userId.profile.lastName}`,
      email: co.userId.email,
      role: co.role,
      affiliationInstitution: co.affiliationInstitution,
      expertise: co.expertise,
      contributionPercentage: co.contributionPercentage,
      joinedDate: co.joinedDate,
      status: co.status
    })),
    students: project.team.students.map(student => ({
      _id: student._id,
      userId: student.userId._id,
      name: `${student.userId.profile.firstName} ${student.userId.profile.lastName}`,
      email: student.userId.email,
      level: student.level,
      supervisor: student.supervisor,
      joinedDate: student.joinedDate,
      expectedGraduationDate: student.expectedGraduationDate,
      thesisTitle: student.thesisTitle,
      status: student.status
    })),
    externalCollaborators: project.team.externalCollaborators,
    teamSize: project.teamSize,
    activeMembers: project.getActiveTeamMembers().length
  };

  res.json({
    success: true,
    message: 'Team members retrieved successfully',
    data: teamData
  });
});

/**
 * Add team member to research project
 * @route POST /api/v1/nose/projects/:projectId/team
 */
const addTeamMember = handleAsync(async (req, res) => {
  const { projectId } = req.params;
  const { memberType, memberData } = req.body;

  const project = await ResearchProject.findOne({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  let addedMember;

  switch (memberType) {
    case 'coInvestigator':
      // Check if user is already a co-investigator
      const existingCoInv = project.team.coInvestigators.find(
        co => co.userId.toString() === memberData.userId
      );
      if (existingCoInv) {
        throw new ApiError(400, 'User is already a co-investigator on this project');
      }

      addedMember = {
        userId: memberData.userId,
        role: memberData.role || 'Co-Investigator',
        affiliationInstitution: memberData.affiliationInstitution,
        expertise: memberData.expertise || [],
        contributionPercentage: memberData.contributionPercentage || 0,
        joinedDate: new Date(),
        status: 'active'
      };

      project.team.coInvestigators.push(addedMember);
      break;

    case 'student':
      // Check if user is already a student on this project
      const existingStudent = project.team.students.find(
        student => student.userId.toString() === memberData.userId
      );
      if (existingStudent) {
        throw new ApiError(400, 'User is already a student on this project');
      }

      addedMember = {
        userId: memberData.userId,
        level: memberData.level,
        supervisor: memberData.supervisor || project.team.principalInvestigator.userId,
        joinedDate: new Date(),
        expectedGraduationDate: memberData.expectedGraduationDate,
        thesisTitle: memberData.thesisTitle,
        status: 'active'
      };

      project.team.students.push(addedMember);
      break;

    case 'externalCollaborator':
      // Check if external collaborator already exists
      const existingExternal = project.team.externalCollaborators.find(
        ext => ext.email === memberData.email
      );
      if (existingExternal) {
        throw new ApiError(400, 'External collaborator with this email already exists');
      }

      addedMember = {
        name: memberData.name,
        email: memberData.email,
        institution: memberData.institution,
        role: memberData.role,
        expertise: memberData.expertise || [],
        contactInfo: memberData.contactInfo || {}
      };

      project.team.externalCollaborators.push(addedMember);
      break;

    default:
      throw new ApiError(400, 'Invalid member type. Must be coInvestigator, student, or externalCollaborator');
  }

  project.audit.updatedBy = req.user.id;
  await project.save();

  // Populate the added member for response
  if (memberType !== 'externalCollaborator') {
    await project.populate(`team.${memberType}s.userId`, 'profile.firstName profile.lastName email');
  }

  logger.info('Team member added', {
    projectId,
    memberType,
    userId: req.user.id,
    addedUserId: memberData.userId
  });

  res.status(201).json({
    success: true,
    message: `${memberType} added successfully`,
    data: {
      projectId,
      memberType,
      addedMember: addedMember._id || addedMember.email
    }
  });
});

/**
 * Update team member
 * @route PUT /api/v1/nose/projects/:projectId/team/:memberId
 */
const updateTeamMember = handleAsync(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { memberType, updates } = req.body;

  const project = await ResearchProject.findOne({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  let updatedMember;

  switch (memberType) {
    case 'coInvestigator':
      const coInvIndex = project.team.coInvestigators.findIndex(
        co => co._id.toString() === memberId
      );
      
      if (coInvIndex === -1) {
        throw new ApiError(404, 'Co-investigator not found');
      }

      // Update co-investigator
      Object.keys(updates).forEach(key => {
        if (key !== 'userId') { // Don't allow changing userId
          project.team.coInvestigators[coInvIndex][key] = updates[key];
        }
      });

      updatedMember = project.team.coInvestigators[coInvIndex];
      break;

    case 'student':
      const studentIndex = project.team.students.findIndex(
        student => student._id.toString() === memberId
      );
      
      if (studentIndex === -1) {
        throw new ApiError(404, 'Student not found');
      }

      // Update student
      Object.keys(updates).forEach(key => {
        if (key !== 'userId') { // Don't allow changing userId
          project.team.students[studentIndex][key] = updates[key];
        }
      });

      updatedMember = project.team.students[studentIndex];
      break;

    case 'externalCollaborator':
      const extIndex = project.team.externalCollaborators.findIndex(
        ext => ext._id.toString() === memberId
      );
      
      if (extIndex === -1) {
        throw new ApiError(404, 'External collaborator not found');
      }

      // Update external collaborator
      Object.keys(updates).forEach(key => {
        project.team.externalCollaborators[extIndex][key] = updates[key];
      });

      updatedMember = project.team.externalCollaborators[extIndex];
      break;

    default:
      throw new ApiError(400, 'Invalid member type');
  }

  project.audit.updatedBy = req.user.id;
  await project.save();

  logger.info('Team member updated', {
    projectId,
    memberId,
    memberType,
    userId: req.user.id,
    updatedFields: Object.keys(updates)
  });

  res.json({
    success: true,
    message: `${memberType} updated successfully`,
    data: {
      projectId,
      memberId,
      memberType,
      updatedMember
    }
  });
});

/**
 * Remove team member
 * @route DELETE /api/v1/nose/projects/:projectId/team/:memberId
 */
const removeTeamMember = handleAsync(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { memberType } = req.query;

  if (!memberType) {
    throw new ApiError(400, 'memberType query parameter is required');
  }

  const project = await ResearchProject.findOne({ projectId });

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  let removed = false;

  switch (memberType) {
    case 'coInvestigator':
      const coInvIndex = project.team.coInvestigators.findIndex(
        co => co._id.toString() === memberId
      );
      
      if (coInvIndex !== -1) {
        project.team.coInvestigators.splice(coInvIndex, 1);
        removed = true;
      }
      break;

    case 'student':
      const studentIndex = project.team.students.findIndex(
        student => student._id.toString() === memberId
      );
      
      if (studentIndex !== -1) {
        project.team.students.splice(studentIndex, 1);
        removed = true;
      }
      break;

    case 'externalCollaborator':
      const extIndex = project.team.externalCollaborators.findIndex(
        ext => ext._id.toString() === memberId
      );
      
      if (extIndex !== -1) {
        project.team.externalCollaborators.splice(extIndex, 1);
        removed = true;
      }
      break;

    default:
      throw new ApiError(400, 'Invalid member type');
  }

  if (!removed) {
    throw new ApiError(404, `${memberType} not found`);
  }

  project.audit.updatedBy = req.user.id;
  await project.save();

  logger.info('Team member removed', {
    projectId,
    memberId,
    memberType,
    userId: req.user.id
  });

  res.json({
    success: true,
    message: `${memberType} removed successfully`,
    data: {
      projectId,
      memberId,
      memberType,
      newTeamSize: project.teamSize
    }
  });
});

/**
 * Get team collaboration statistics
 * @route GET /api/v1/nose/projects/:projectId/team/stats
 */
const getTeamStats = handleAsync(async (req, res) => {
  const { projectId } = req.params;

  const project = await ResearchProject.findOne({ projectId })
    .populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName')
    .populate('team.coInvestigators.userId', 'profile.firstName profile.lastName')
    .populate('team.students.userId', 'profile.firstName profile.lastName');

  if (!project) {
    throw new ApiError(404, 'Research project not found');
  }

  const stats = {
    teamComposition: {
      principalInvestigator: 1,
      coInvestigators: project.team.coInvestigators.length,
      students: project.team.students.length,
      externalCollaborators: project.team.externalCollaborators.length,
      total: project.teamSize
    },
    statusDistribution: {
      active: project.getActiveTeamMembers().length,
      inactive: project.team.coInvestigators.filter(co => co.status === 'inactive').length +
                project.team.students.filter(s => s.status !== 'active').length
    },
    studentLevels: project.team.students.reduce((acc, student) => {
      acc[student.level] = (acc[student.level] || 0) + 1;
      return acc;
    }, {}),
    institutionDistribution: getInstitutionDistribution(project),
    expertiseAreas: getExpertiseAreas(project),
    joinDates: {
      newest: Math.max(...project.team.coInvestigators.map(co => new Date(co.joinedDate).getTime())),
      oldest: Math.min(...project.team.coInvestigators.map(co => new Date(co.joinedDate).getTime()))
    }
  };

  res.json({
    success: true,
    message: 'Team statistics retrieved successfully',
    data: stats
  });
});

// Helper Functions

function getInstitutionDistribution(project) {
  const institutions = {};
  
  // Count PI institution
  if (project.team.principalInvestigator.affiliationInstitution) {
    const inst = project.team.principalInvestigator.affiliationInstitution;
    institutions[inst] = (institutions[inst] || 0) + 1;
  }

  // Count co-investigator institutions
  project.team.coInvestigators.forEach(co => {
    if (co.affiliationInstitution) {
      institutions[co.affiliationInstitution] = (institutions[co.affiliationInstitution] || 0) + 1;
    }
  });

  // Count external collaborator institutions
  project.team.externalCollaborators.forEach(ext => {
    if (ext.institution) {
      institutions[ext.institution] = (institutions[ext.institution] || 0) + 1;
    }
  });

  return institutions;
}

function getExpertiseAreas(project) {
  const expertise = new Set();

  // Collect co-investigator expertise
  project.team.coInvestigators.forEach(co => {
    if (co.expertise && Array.isArray(co.expertise)) {
      co.expertise.forEach(exp => expertise.add(exp));
    }
  });

  // Collect external collaborator expertise
  project.team.externalCollaborators.forEach(ext => {
    if (ext.expertise && Array.isArray(ext.expertise)) {
      ext.expertise.forEach(exp => expertise.add(exp));
    }
  });

  return Array.from(expertise);
}

module.exports = {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  getTeamStats
};