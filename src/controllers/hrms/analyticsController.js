/**
 * AI-HRMS Analytics Controller
 * Handles HR analytics, metrics, and dashboard data
 */

const { Employee } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const logger = require('../../utils/logger');

/**
 * Get HR dashboard analytics
 * @route GET /api/v1/hrms/analytics/dashboard
 */
const getDashboard = handleAsync(async (req, res) => {
  const userId = req.user.id;
  const { timeRange = '6months' } = req.query;

  const dateRanges = {
    '1month': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    '3months': new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    '6months': new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    '1year': new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  };

  const startDate = dateRanges[timeRange] || dateRanges['6months'];

  // Get all employees
  const allEmployees = await Employee.find({});
  const activeEmployees = allEmployees.filter(emp => emp.status === 'active');
  const recentHires = allEmployees.filter(emp => new Date(emp.employment.startDate) >= startDate);

  // Calculate dashboard metrics
  const [
    totalEmployees,
    activeCount,
    inactiveCount,
    pendingCount,
    avgSalary,
    departmentDistribution,
    recentActivity
  ] = await Promise.all([
    allEmployees.length,
    activeEmployees.length,
    allEmployees.filter(emp => emp.status === 'inactive').length,
    allEmployees.filter(emp => emp.status === 'pending').length,
    calculateAverageSalary(activeEmployees),
    getDepartmentDistribution(activeEmployees),
    getRecentActivity(allEmployees.slice(0, 10))
  ]);

  const terminatedCount = allEmployees.filter(emp => emp.status === 'terminated').length;
  const turnoverRate = totalEmployees > 0 ? Math.round((terminatedCount / totalEmployees) * 100) : 0;

  const dashboardData = {
    overview: {
      totalEmployees,
      activeEmployees: activeCount,
      inactiveEmployees: inactiveCount,
      pendingEmployees: pendingCount,
      terminatedEmployees: terminatedCount,
      turnoverRate,
      avgSalary: {
        amount: avgSalary,
        currency: 'USD'
      }
    },
    departments: departmentDistribution,
    recentActivity,
    trends: {
      newHires: recentHires.length,
      timeRange
    },
    quickStats: {
      employeesThisMonth: allEmployees.filter(emp => 
        new Date(emp.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      avgTenure: calculateAverageTenure(activeEmployees),
      topDepartment: getTopDepartment(departmentDistribution)
    }
  };

  logger.hrms('HR dashboard accessed', {
    userId,
    timeRange,
    employeeCount: totalEmployees
  });

  res.json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: dashboardData
  });
});

/**
 * Get headcount report
 * @route GET /api/v1/hrms/analytics/headcount
 */
const getHeadcountReport = handleAsync(async (req, res) => {
  const { timeRange = '1year', groupBy = 'month' } = req.query;

  const employees = await Employee.find({})
    .populate('employment.department', 'name');

  // Group by department
  const byDepartment = employees.reduce((acc, emp) => {
    const dept = emp.employment.department?.name || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Group by position level
  const byLevel = employees.reduce((acc, emp) => {
    const level = emp.employment.position.level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  // Group by status
  const byStatus = employees.reduce((acc, emp) => {
    acc[emp.status] = (acc[emp.status] || 0) + 1;
    return acc;
  }, {});

  // Historical headcount (monthly trend)
  const monthlyHeadcount = getMonthlyHeadcountTrend(employees, timeRange);

  const headcountData = {
    current: {
      total: employees.length,
      active: employees.filter(emp => emp.status === 'active').length,
      byDepartment,
      byLevel,
      byStatus
    },
    trends: {
      monthly: monthlyHeadcount,
      growth: calculateGrowthRate(monthlyHeadcount)
    },
    demographics: {
      avgAge: calculateAverageAge(employees),
      genderDistribution: getGenderDistribution(employees),
      tenureDistribution: getTenureDistribution(employees)
    }
  };

  res.json({
    success: true,
    message: 'Headcount report retrieved successfully',
    data: headcountData
  });
});

/**
 * Get turnover analytics
 * @route GET /api/v1/hrms/analytics/turnover
 */
const getTurnoverAnalytics = handleAsync(async (req, res) => {
  const { timeRange = '1year' } = req.query;

  const dateRanges = {
    '6months': new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    '1year': new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    '2years': new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
  };

  const startDate = dateRanges[timeRange] || dateRanges['1year'];

  const employees = await Employee.find({
    createdAt: { $gte: startDate }
  }).populate('employment.department', 'name');

  const terminated = employees.filter(emp => emp.status === 'terminated');
  const totalEmployees = employees.length;

  // Calculate turnover rate
  const turnoverRate = totalEmployees > 0 ? (terminated.length / totalEmployees) * 100 : 0;

  // Turnover by department
  const departmentTurnover = terminated.reduce((acc, emp) => {
    const dept = emp.employment.department?.name || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Voluntary vs Involuntary turnover
  const voluntary = terminated.filter(emp => emp.employment.terminationReason === 'voluntary').length;
  const involuntary = terminated.length - voluntary;

  // Average tenure of terminated employees
  const avgTenureTerminated = calculateAverageTenure(terminated);

  // Top reasons for leaving
  const terminationReasons = terminated.reduce((acc, emp) => {
    const reason = emp.employment.terminationReason || 'unknown';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  const turnoverData = {
    overview: {
      turnoverRate: Math.round(turnoverRate * 100) / 100,
      totalTerminations: terminated.length,
      voluntaryTurnover: voluntary,
      involuntaryTurnover: involuntary,
      avgTenureTerminated
    },
    byDepartment: departmentTurnover,
    reasons: terminationReasons,
    trends: {
      monthly: getMonthlyTurnoverTrend(terminated, startDate),
      benchmark: {
        industry: 15, // Industry average placeholder
        target: 10 // Company target
      }
    },
    insights: generateTurnoverInsights(turnoverRate, departmentTurnover)
  };

  res.json({
    success: true,
    message: 'Turnover analytics retrieved successfully',
    data: turnoverData
  });
});

/**
 * Get department analytics
 * @route GET /api/v1/hrms/analytics/departments
 */
const getDepartmentAnalytics = handleAsync(async (req, res) => {
  const employees = await Employee.find({ status: 'active' })
    .populate('employment.department', 'name description');

  const departmentData = employees.reduce((acc, emp) => {
    const dept = emp.employment.department;
    const deptName = dept?.name || 'Unassigned';

    if (!acc[deptName]) {
      acc[deptName] = {
        name: deptName,
        description: dept?.description || '',
        employeeCount: 0,
        avgSalary: 0,
        salaries: [],
        levels: {},
        avgTenure: 0,
        tenures: []
      };
    }

    acc[deptName].employeeCount += 1;
    acc[deptName].salaries.push(emp.compensation.salary.amount || 0);
    acc[deptName].levels[emp.employment.position.level] = 
      (acc[deptName].levels[emp.employment.position.level] || 0) + 1;
    
    const tenure = calculateEmployeeTenure(emp);
    acc[deptName].tenures.push(tenure);

    return acc;
  }, {});

  // Calculate averages
  Object.values(departmentData).forEach(dept => {
    dept.avgSalary = dept.salaries.length > 0 
      ? Math.round(dept.salaries.reduce((sum, sal) => sum + sal, 0) / dept.salaries.length)
      : 0;
    dept.avgTenure = dept.tenures.length > 0
      ? Math.round(dept.tenures.reduce((sum, ten) => sum + ten, 0) / dept.tenures.length)
      : 0;
    
    // Clean up temporary arrays
    delete dept.salaries;
    delete dept.tenures;
  });

  const analytics = {
    departments: Object.values(departmentData).sort((a, b) => b.employeeCount - a.employeeCount),
    summary: {
      totalDepartments: Object.keys(departmentData).length,
      largestDepartment: Object.values(departmentData).reduce((max, dept) => 
        dept.employeeCount > max.employeeCount ? dept : max, { employeeCount: 0 }),
      avgDepartmentSize: Math.round(
        Object.values(departmentData).reduce((sum, dept) => sum + dept.employeeCount, 0) / 
        Object.keys(departmentData).length
      )
    }
  };

  res.json({
    success: true,
    message: 'Department analytics retrieved successfully',
    data: analytics
  });
});

/**
 * Get performance metrics
 * @route GET /api/v1/hrms/analytics/performance
 */
const getPerformanceMetrics = handleAsync(async (req, res) => {
  const employees = await Employee.find({ status: 'active' });

  const performanceData = {
    overview: {
      totalEmployees: employees.length,
      avgPerformanceScore: calculateAveragePerformance(employees),
      highPerformers: employees.filter(emp => 
        emp.performance.currentRating && emp.performance.currentRating >= 4).length,
      lowPerformers: employees.filter(emp => 
        emp.performance.currentRating && emp.performance.currentRating < 2.5).length
    },
    distributions: {
      byRating: getPerformanceDistribution(employees),
      byDepartment: getPerformanceByDepartment(employees),
      byLevel: getPerformanceByLevel(employees)
    },
    trends: {
      quarterly: getQuarterlyPerformanceTrend(employees),
      improvement: getPerformanceImprovement(employees)
    },
    recommendations: generatePerformanceRecommendations(employees)
  };

  res.json({
    success: true,
    message: 'Performance metrics retrieved successfully',
    data: performanceData
  });
});

// Helper Functions

function calculateAverageSalary(employees) {
  if (employees.length === 0) return 0;
  const total = employees.reduce((sum, emp) => sum + (emp.compensation.salary.amount || 0), 0);
  return Math.round(total / employees.length);
}

function getDepartmentDistribution(employees) {
  return employees.reduce((acc, emp) => {
    const dept = emp.employment.department?.name || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
}

function getRecentActivity(employees) {
  return employees
    .filter(emp => emp.audit.lastModified)
    .sort((a, b) => new Date(b.audit.lastModified) - new Date(a.audit.lastModified))
    .slice(0, 5)
    .map(emp => ({
      employeeId: emp.employeeId,
      name: `${emp.firstName} ${emp.lastName}`,
      action: 'updated',
      timestamp: emp.audit.lastModified
    }));
}

function calculateAverageTenure(employees) {
  if (employees.length === 0) return 0;
  const totalTenure = employees.reduce((sum, emp) => sum + calculateEmployeeTenure(emp), 0);
  return Math.round(totalTenure / employees.length);
}

function calculateEmployeeTenure(employee) {
  const startDate = new Date(employee.employment.startDate);
  const endDate = employee.employment.endDate ? new Date(employee.employment.endDate) : new Date();
  return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 30)); // months
}

function getTopDepartment(departmentDistribution) {
  return Object.entries(departmentDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
}

function getMonthlyHeadcountTrend(employees, timeRange) {
  const months = {};
  const monthsBack = timeRange === '1year' ? 12 : timeRange === '2years' ? 24 : 6;
  
  // Initialize months
  for (let i = monthsBack; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months[key] = 0;
  }

  // Count employees by start month
  employees.forEach(emp => {
    const startDate = new Date(emp.employment.startDate);
    const key = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
    if (months[key] !== undefined) {
      months[key] += 1;
    }
  });

  return Object.entries(months).map(([month, count]) => ({ month, count }));
}

function calculateGrowthRate(monthlyData) {
  if (monthlyData.length < 2) return 0;
  const latest = monthlyData[monthlyData.length - 1].count;
  const previous = monthlyData[monthlyData.length - 2].count;
  return previous > 0 ? Math.round(((latest - previous) / previous) * 100) : 0;
}

function calculateAverageAge(employees) {
  const ages = employees
    .filter(emp => emp.personalInfo.dateOfBirth)
    .map(emp => {
      const birth = new Date(emp.personalInfo.dateOfBirth);
      const now = new Date();
      return Math.floor((now - birth) / (365.25 * 24 * 60 * 60 * 1000));
    });
  
  return ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;
}

function getGenderDistribution(employees) {
  return employees.reduce((acc, emp) => {
    const gender = emp.personalInfo.gender || 'not_specified';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
}

function getTenureDistribution(employees) {
  const buckets = { '0-1': 0, '1-3': 0, '3-5': 0, '5+': 0 };
  
  employees.forEach(emp => {
    const tenure = calculateEmployeeTenure(emp) / 12; // years
    if (tenure < 1) buckets['0-1']++;
    else if (tenure < 3) buckets['1-3']++;
    else if (tenure < 5) buckets['3-5']++;
    else buckets['5+']++;
  });

  return buckets;
}

function getMonthlyTurnoverTrend(terminated, startDate) {
  const months = {};
  const current = new Date(startDate);
  const end = new Date();

  while (current <= end) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    months[key] = 0;
    current.setMonth(current.getMonth() + 1);
  }

  terminated.forEach(emp => {
    if (emp.employment.endDate) {
      const endDate = new Date(emp.employment.endDate);
      const key = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
      if (months[key] !== undefined) {
        months[key] += 1;
      }
    }
  });

  return Object.entries(months).map(([month, count]) => ({ month, count }));
}

function generateTurnoverInsights(turnoverRate, departmentTurnover) {
  const insights = [];
  
  if (turnoverRate > 20) {
    insights.push('High turnover rate detected - consider retention strategies');
  }
  
  const highTurnoverDepts = Object.entries(departmentTurnover)
    .filter(([dept, count]) => count > 5)
    .map(([dept]) => dept);
    
  if (highTurnoverDepts.length > 0) {
    insights.push(`High turnover in: ${highTurnoverDepts.join(', ')}`);
  }

  return insights;
}

function calculateAveragePerformance(employees) {
  const ratings = employees
    .filter(emp => emp.performance.currentRating)
    .map(emp => emp.performance.currentRating);
  
  return ratings.length > 0 
    ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 100) / 100
    : 0;
}

function getPerformanceDistribution(employees) {
  const buckets = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  
  employees.forEach(emp => {
    if (emp.performance.currentRating) {
      const rating = Math.floor(emp.performance.currentRating);
      buckets[rating] = (buckets[rating] || 0) + 1;
    }
  });

  return buckets;
}

function getPerformanceByDepartment(employees) {
  return employees.reduce((acc, emp) => {
    if (emp.performance.currentRating) {
      const dept = emp.employment.department?.name || 'Unassigned';
      if (!acc[dept]) {
        acc[dept] = { total: 0, sum: 0 };
      }
      acc[dept].total += 1;
      acc[dept].sum += emp.performance.currentRating;
    }
    return acc;
  }, {});
}

function getPerformanceByLevel(employees) {
  return employees.reduce((acc, emp) => {
    if (emp.performance.currentRating) {
      const level = emp.employment.position.level;
      if (!acc[level]) {
        acc[level] = { total: 0, sum: 0 };
      }
      acc[level].total += 1;
      acc[level].sum += emp.performance.currentRating;
    }
    return acc;
  }, {});
}

function getQuarterlyPerformanceTrend(employees) {
  // Simplified quarterly trend - would need historical data in real implementation
  return employees
    .filter(emp => emp.performance.reviews && emp.performance.reviews.length > 0)
    .map(emp => {
      const recentReview = emp.performance.reviews[emp.performance.reviews.length - 1];
      return {
        quarter: recentReview.reviewPeriod,
        avgRating: recentReview.overallRating || 0
      };
    });
}

function getPerformanceImprovement(employees) {
  return employees
    .filter(emp => emp.performance.reviews && emp.performance.reviews.length >= 2)
    .map(emp => {
      const reviews = emp.performance.reviews;
      const latest = reviews[reviews.length - 1];
      const previous = reviews[reviews.length - 2];
      return {
        employeeId: emp.employeeId,
        improvement: latest.overallRating - previous.overallRating
      };
    })
    .filter(emp => emp.improvement !== 0);
}

function generatePerformanceRecommendations(employees) {
  const recommendations = [];
  
  const lowPerformers = employees.filter(emp => 
    emp.performance.currentRating && emp.performance.currentRating < 2.5).length;
    
  if (lowPerformers > 0) {
    recommendations.push(`${lowPerformers} employees need performance improvement plans`);
  }
  
  const highPerformers = employees.filter(emp => 
    emp.performance.currentRating && emp.performance.currentRating >= 4.5).length;
    
  if (highPerformers > 0) {
    recommendations.push(`${highPerformers} high performers eligible for advancement`);
  }

  return recommendations;
}

module.exports = {
  getDashboard,
  getHeadcountReport,
  getTurnoverAnalytics,
  getDepartmentAnalytics,
  getPerformanceMetrics
};