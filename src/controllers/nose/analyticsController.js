/**
 * NOSE Research Analytics Controller
 * Handles research analytics, metrics, and dashboard data
 */

const { ResearchProject } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const logger = require('../../utils/logger');

/**
 * Get research dashboard analytics
 * @route GET /api/v1/nose/analytics/dashboard
 */
const getDashboard = handleAsync(async (req, res) => {
  const userId = req.user.id;

  // Get user's projects
  const userProjects = await ResearchProject.find({
    $or: [
      { 'team.principalInvestigator.userId': userId },
      { 'team.coInvestigators.userId': userId },
      { 'team.students.userId': userId }
    ]
  });

  const projectIds = userProjects.map(p => p._id);

  // Calculate dashboard metrics
  const [
    totalProjects,
    activeProjects,
    completedProjects,
    totalPublications,
    totalFunding,
    healthDistribution,
    recentActivity
  ] = await Promise.all([
    userProjects.length,
    userProjects.filter(p => p.status === 'active').length,
    userProjects.filter(p => p.status === 'completed').length,
    userProjects.reduce((sum, p) => sum + p.publications.length, 0),
    userProjects.reduce((sum, p) => sum + (p.funding.totalBudget.amount || 0), 0),
    getHealthDistribution(userProjects),
    getRecentActivity(userProjects.slice(0, 10))
  ]);

  const overdueProjects = userProjects.filter(p => p.isOverdue()).length;
  const avgProgress = userProjects.length > 0 
    ? Math.round(userProjects.reduce((sum, p) => sum + p.calculateProgress(), 0) / userProjects.length)
    : 0;

  const dashboardData = {
    overview: {
      totalProjects,
      activeProjects,
      completedProjects,
      overdueProjects,
      totalPublications,
      totalFunding: {
        amount: totalFunding,
        currency: 'USD'
      },
      avgProgress
    },
    health: healthDistribution,
    recentActivity,
    quickStats: {
      projectsThisMonth: userProjects.filter(p => 
        new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      publicationsThisYear: userProjects.reduce((sum, p) => 
        sum + p.publications.filter(pub => 
          new Date(pub.dates.published || pub.createdAt) > new Date(new Date().getFullYear(), 0, 1)
        ).length, 0
      ),
      avgTeamSize: userProjects.length > 0 
        ? Math.round(userProjects.reduce((sum, p) => sum + p.teamSize, 0) / userProjects.length)
        : 0
    }
  };

  logger.info('Research dashboard accessed', {
    userId,
    projectCount: totalProjects
  });

  res.json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: dashboardData
  });
});

/**
 * Get projects overview analytics
 * @route GET /api/v1/nose/analytics/projects/overview
 */
const getProjectsOverview = handleAsync(async (req, res) => {
  const { timeRange = '6months' } = req.query;
  
  const dateRanges = {
    '1month': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    '3months': new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    '6months': new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    '1year': new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  };

  const startDate = dateRanges[timeRange] || dateRanges['6months'];

  const projects = await ResearchProject.find({
    createdAt: { $gte: startDate }
  });

  // Projects by status
  const statusDistribution = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  // Projects by research type
  const typeDistribution = projects.reduce((acc, project) => {
    const type = project.classification.researchType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Projects by field of study
  const fieldDistribution = projects.reduce((acc, project) => {
    const field = project.classification.fieldOfStudy.primary;
    acc[field] = (acc[field] || 0) + 1;
    return acc;
  }, {});

  // Monthly project creation trend
  const monthlyTrend = getMonthlyTrend(projects, startDate);

  // Average project metrics
  const metrics = {
    avgDuration: Math.round(projects.reduce((sum, p) => sum + (p.durationInDays || 0), 0) / projects.length),
    avgBudget: Math.round(projects.reduce((sum, p) => sum + (p.funding.totalBudget.amount || 0), 0) / projects.length),
    avgTeamSize: Math.round(projects.reduce((sum, p) => sum + p.teamSize, 0) / projects.length),
    avgProgress: Math.round(projects.reduce((sum, p) => sum + p.calculateProgress(), 0) / projects.length)
  };

  res.json({
    success: true,
    message: 'Projects overview retrieved successfully',
    data: {
      totalProjects: projects.length,
      timeRange,
      distributions: {
        status: statusDistribution,
        researchType: typeDistribution,
        fieldOfStudy: fieldDistribution
      },
      trends: {
        monthly: monthlyTrend
      },
      averages: metrics
    }
  });
});

/**
 * Get publication metrics
 * @route GET /api/v1/nose/analytics/publications/metrics
 */
const getPublicationMetrics = handleAsync(async (req, res) => {
  const projects = await ResearchProject.find({
    'publications.0': { $exists: true }
  });

  const allPublications = projects.reduce((acc, project) => {
    return acc.concat(project.publications.map(pub => ({
      ...pub.toObject(),
      projectId: project.projectId,
      projectTitle: project.title
    })));
  }, []);

  // Publications by type
  const typeDistribution = allPublications.reduce((acc, pub) => {
    acc[pub.publicationType] = (acc[pub.publicationType] || 0) + 1;
    return acc;
  }, {});

  // Publications by status
  const statusDistribution = allPublications.reduce((acc, pub) => {
    acc[pub.status] = (acc[pub.status] || 0) + 1;
    return acc;
  }, {});

  // Publication trends over time
  const publicationTrend = getPublicationTrend(allPublications);

  // Citation metrics
  const citationStats = {
    totalCitations: allPublications.reduce((sum, pub) => sum + (pub.citationCount || 0), 0),
    avgCitations: Math.round(allPublications.reduce((sum, pub) => sum + (pub.citationCount || 0), 0) / allPublications.length),
    hIndex: calculateHIndex(allPublications),
    topCited: allPublications
      .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, 10)
      .map(pub => ({
        title: pub.title,
        citations: pub.citationCount || 0,
        projectTitle: pub.projectTitle
      }))
  };

  // Venue analysis
  const venueAnalysis = getVenueAnalysis(allPublications);

  res.json({
    success: true,
    message: 'Publication metrics retrieved successfully',
    data: {
      totalPublications: allPublications.length,
      distributions: {
        type: typeDistribution,
        status: statusDistribution
      },
      trends: publicationTrend,
      citations: citationStats,
      venues: venueAnalysis,
      recent: allPublications
        .filter(pub => pub.dates.published)
        .sort((a, b) => new Date(b.dates.published) - new Date(a.dates.published))
        .slice(0, 10)
        .map(pub => ({
          title: pub.title,
          publishedDate: pub.dates.published,
          venue: pub.venue.name,
          projectTitle: pub.projectTitle
        }))
    }
  });
});

/**
 * Get funding summary
 * @route GET /api/v1/nose/analytics/funding/summary
 */
const getFundingSummary = handleAsync(async (req, res) => {
  const projects = await ResearchProject.find({
    'funding.totalBudget.amount': { $gt: 0 }
  });

  const totalFunding = projects.reduce((sum, p) => sum + (p.funding.totalBudget.amount || 0), 0);
  const totalExpenses = projects.reduce((sum, p) => 
    sum + p.funding.expenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0
  );

  // Source analysis
  const sourceAnalysis = projects.reduce((acc, project) => {
    project.funding.sources.forEach(source => {
      if (!acc[source.organization]) {
        acc[source.organization] = {
          totalAmount: 0,
          projectCount: 0,
          statuses: {}
        };
      }
      acc[source.organization].totalAmount += source.amount;
      acc[source.organization].projectCount += 1;
      acc[source.organization].statuses[source.status] = 
        (acc[source.organization].statuses[source.status] || 0) + 1;
    });
    return acc;
  }, {});

  // Expense categories
  const expenseCategories = projects.reduce((acc, project) => {
    project.funding.expenses.forEach(expense => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    });
    return acc;
  }, {});

  // Budget utilization distribution
  const utilizationDistribution = projects.reduce((acc, project) => {
    const utilization = project.budgetUtilization;
    let bucket;
    if (utilization < 25) bucket = '0-25%';
    else if (utilization < 50) bucket = '25-50%';
    else if (utilization < 75) bucket = '50-75%';
    else if (utilization < 100) bucket = '75-100%';
    else bucket = 'Over 100%';
    
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    message: 'Funding summary retrieved successfully',
    data: {
      overview: {
        totalFunding,
        totalExpenses,
        remainingBudget: totalFunding - totalExpenses,
        utilizationRate: Math.round((totalExpenses / totalFunding) * 100),
        projectsWithFunding: projects.length
      },
      sources: Object.entries(sourceAnalysis)
        .map(([org, data]) => ({ organization: org, ...data }))
        .sort((a, b) => b.totalAmount - a.totalAmount),
      expenses: expenseCategories,
      utilization: utilizationDistribution,
      trends: getFundingTrends(projects)
    }
  });
});

/**
 * Get collaboration network analysis
 * @route GET /api/v1/nose/analytics/collaboration/network
 */
const getCollaborationNetwork = handleAsync(async (req, res) => {
  const projects = await ResearchProject.find({})
    .populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName email')
    .populate('team.coInvestigators.userId', 'profile.firstName profile.lastName email')
    .populate('team.students.userId', 'profile.firstName profile.lastName email');

  // Build collaboration network
  const collaborations = {};
  const institutions = {};
  const researchers = {};

  projects.forEach(project => {
    const pi = project.team.principalInvestigator.userId;
    const piId = pi._id.toString();
    
    if (!researchers[piId]) {
      researchers[piId] = {
        id: piId,
        name: `${pi.profile.firstName} ${pi.profile.lastName}`,
        email: pi.email,
        role: 'PI',
        projectCount: 0,
        collaboratorCount: new Set()
      };
    }
    researchers[piId].projectCount += 1;

    // Track institution collaborations
    if (project.team.principalInvestigator.affiliationInstitution) {
      const inst = project.team.principalInvestigator.affiliationInstitution;
      institutions[inst] = (institutions[inst] || 0) + 1;
    }

    // Process co-investigators
    project.team.coInvestigators.forEach(coInv => {
      if (coInv.userId) {
        const coInvId = coInv.userId._id.toString();
        researchers[piId].collaboratorCount.add(coInvId);
        
        if (!researchers[coInvId]) {
          researchers[coInvId] = {
            id: coInvId,
            name: `${coInv.userId.profile.firstName} ${coInv.userId.profile.lastName}`,
            email: coInv.userId.email,
            role: 'Co-Investigator',
            projectCount: 0,
            collaboratorCount: new Set()
          };
        }
        researchers[coInvId].projectCount += 1;
        researchers[coInvId].collaboratorCount.add(piId);
      }
    });
  });

  // Convert sets to counts
  Object.values(researchers).forEach(researcher => {
    researcher.collaboratorCount = researcher.collaboratorCount.size;
  });

  // Find most collaborative researchers
  const topCollaborators = Object.values(researchers)
    .sort((a, b) => b.collaboratorCount - a.collaboratorCount)
    .slice(0, 10);

  // Institution analysis
  const institutionAnalysis = Object.entries(institutions)
    .map(([name, count]) => ({ institution: name, projectCount: count }))
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, 15);

  res.json({
    success: true,
    message: 'Collaboration network retrieved successfully',
    data: {
      overview: {
        totalResearchers: Object.keys(researchers).length,
        totalInstitutions: Object.keys(institutions).length,
        avgCollaboratorsPerResearcher: Math.round(
          Object.values(researchers).reduce((sum, r) => sum + r.collaboratorCount, 0) / 
          Object.keys(researchers).length
        )
      },
      topCollaborators,
      institutions: institutionAnalysis,
      networkMetrics: {
        density: calculateNetworkDensity(researchers),
        clusters: identifyCollaborationClusters(projects)
      }
    }
  });
});

// Helper Functions

function getHealthDistribution(projects) {
  return projects.reduce((acc, project) => {
    const health = project.health.overallHealth;
    acc[health] = (acc[health] || 0) + 1;
    return acc;
  }, {});
}

function getRecentActivity(projects) {
  return projects
    .filter(p => p.audit.lastModified)
    .sort((a, b) => new Date(b.audit.lastModified) - new Date(a.audit.lastModified))
    .slice(0, 10)
    .map(p => ({
      projectId: p.projectId,
      title: p.title,
      lastActivity: p.audit.lastModified,
      status: p.status
    }));
}

function getMonthlyTrend(projects, startDate) {
  const months = {};
  const current = new Date(startDate);
  const end = new Date();

  while (current <= end) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    months[key] = 0;
    current.setMonth(current.getMonth() + 1);
  }

  projects.forEach(project => {
    const date = new Date(project.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (months[key] !== undefined) {
      months[key] += 1;
    }
  });

  return Object.entries(months).map(([month, count]) => ({ month, count }));
}

function getPublicationTrend(publications) {
  const monthlyPublications = {};
  
  publications.forEach(pub => {
    const date = pub.dates.published || pub.createdAt;
    if (date) {
      const key = `${new Date(date).getFullYear()}-${String(new Date(date).getMonth() + 1).padStart(2, '0')}`;
      monthlyPublications[key] = (monthlyPublications[key] || 0) + 1;
    }
  });

  return Object.entries(monthlyPublications)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function calculateHIndex(publications) {
  const citations = publications
    .map(pub => pub.citationCount || 0)
    .sort((a, b) => b - a);

  let hIndex = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  return hIndex;
}

function getVenueAnalysis(publications) {
  const venues = {};
  
  publications.forEach(pub => {
    if (pub.venue && pub.venue.name) {
      if (!venues[pub.venue.name]) {
        venues[pub.venue.name] = {
          name: pub.venue.name,
          type: pub.venue.type,
          publications: 0,
          totalCitations: 0,
          impactFactor: pub.venue.impactFactor
        };
      }
      venues[pub.venue.name].publications += 1;
      venues[pub.venue.name].totalCitations += pub.citationCount || 0;
    }
  });

  return Object.values(venues)
    .sort((a, b) => b.publications - a.publications)
    .slice(0, 20);
}

function getFundingTrends(projects) {
  const monthlyFunding = {};
  
  projects.forEach(project => {
    project.funding.sources.forEach(source => {
      if (source.startDate) {
        const key = `${new Date(source.startDate).getFullYear()}-${String(new Date(source.startDate).getMonth() + 1).padStart(2, '0')}`;
        monthlyFunding[key] = (monthlyFunding[key] || 0) + source.amount;
      }
    });
  });

  return Object.entries(monthlyFunding)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function calculateNetworkDensity(researchers) {
  const n = Object.keys(researchers).length;
  if (n <= 1) return 0;
  
  const totalPossibleConnections = n * (n - 1) / 2;
  const actualConnections = Object.values(researchers)
    .reduce((sum, r) => sum + r.collaboratorCount, 0) / 2;
  
  return Math.round((actualConnections / totalPossibleConnections) * 100) / 100;
}

function identifyCollaborationClusters(projects) {
  // Simplified cluster identification
  const clusters = [];
  const processed = new Set();

  projects.forEach(project => {
    const projectId = project._id.toString();
    if (!processed.has(projectId)) {
      const cluster = {
        leadInstitution: project.team.principalInvestigator.affiliationInstitution,
        projects: [project.projectId],
        researchers: new Set(),
        totalFunding: project.funding.totalBudget.amount || 0
      };

      cluster.researchers.add(project.team.principalInvestigator.userId.toString());
      project.team.coInvestigators.forEach(co => {
        if (co.userId) cluster.researchers.add(co.userId.toString());
      });

      clusters.push({
        ...cluster,
        researcherCount: cluster.researchers.size
      });
      processed.add(projectId);
    }
  });

  return clusters
    .sort((a, b) => b.totalFunding - a.totalFunding)
    .slice(0, 10);
}

module.exports = {
  getDashboard,
  getProjectsOverview,
  getPublicationMetrics,
  getFundingSummary,
  getCollaborationNetwork
};