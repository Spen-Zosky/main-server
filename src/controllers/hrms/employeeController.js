/**
 * AI-HRMS Employee Controller
 * Handles all employee CRUD operations and management
 */

const { Employee } = require('../../models');
const { ApiError, handleAsync } = require('../../utils/errorHandler');
const { buildFilter, paginate } = require('../../utils/queryHelper');
const logger = require('../../utils/logger');

/**
 * Get all employees with filtering and pagination
 * @route GET /api/v1/hrms/employees
 */
const getAllEmployees = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    department,
    status,
    position,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = buildFilter({
    status,
    'employment.department': department,
    'employment.position.title': position ? { $regex: position, $options: 'i' } : null,
    search: search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ]
    } : null
  });

  // Pagination options
  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    populate: [
      {
        path: 'userId',
        select: 'profile.firstName profile.lastName email'
      },
      {
        path: 'employment.department',
        select: 'name description'
      }
    ]
  };

  const result = await paginate(Employee, filter, options);

  logger.hrms('Employees retrieved', {
    userId: req.user.id,
    count: result.docs.length,
    totalDocs: result.totalDocs,
    filter
  });

  res.json({
    success: true,
    message: 'Employees retrieved successfully',
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
 * Get employee by ID
 * @route GET /api/v1/hrms/employees/:employeeId
 */
const getEmployeeById = handleAsync(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findOne({ employeeId })
    .populate('userId', 'profile.firstName profile.lastName email')
    .populate('employment.department', 'name description')
    .populate('employment.manager', 'firstName lastName employeeId');

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  logger.hrms('Employee retrieved', {
    employeeId,
    userId: req.user.id,
    action: 'view_employee'
  });

  res.json({
    success: true,
    message: 'Employee retrieved successfully',
    data: employee
  });
});

/**
 * Create new employee
 * @route POST /api/v1/hrms/employees
 */
const createEmployee = handleAsync(async (req, res) => {
  const employeeData = {
    ...req.body,
    employeeId: await Employee.generateEmployeeId(),
    'audit.createdBy': req.user.id
  };

  const employee = new Employee(employeeData);
  await employee.save();

  await employee.populate('userId', 'profile.firstName profile.lastName email');

  logger.hrms('Employee created', {
    employeeId: employee.employeeId,
    userId: req.user.id,
    name: `${employee.firstName} ${employee.lastName}`
  });

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: employee
  });
});

/**
 * Update employee
 * @route PUT /api/v1/hrms/employees/:employeeId
 */
const updateEmployee = handleAsync(async (req, res) => {
  const { employeeId } = req.params;
  const updates = {
    ...req.body,
    'audit.updatedBy': req.user.id
  };

  const employee = await Employee.findOneAndUpdate(
    { employeeId },
    updates,
    { new: true, runValidators: true }
  ).populate('userId', 'profile.firstName profile.lastName email');

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  logger.hrms('Employee updated', {
    employeeId,
    userId: req.user.id,
    updatedFields: Object.keys(req.body)
  });

  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: employee
  });
});

/**
 * Delete employee
 * @route DELETE /api/v1/hrms/employees/:employeeId
 */
const deleteEmployee = handleAsync(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findOneAndDelete({ employeeId });

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  logger.hrms('Employee deleted', {
    employeeId,
    userId: req.user.id,
    name: `${employee.firstName} ${employee.lastName}`
  });

  res.json({
    success: true,
    message: 'Employee deleted successfully'
  });
});

/**
 * Update employee status
 * @route PATCH /api/v1/hrms/employees/:employeeId/status
 */
const updateEmployeeStatus = handleAsync(async (req, res) => {
  const { employeeId } = req.params;
  const { status } = req.body;

  const employee = await Employee.findOneAndUpdate(
    { employeeId },
    { 
      status,
      'audit.updatedBy': req.user.id,
      ...(status === 'terminated' && { 'employment.endDate': new Date() })
    },
    { new: true }
  );

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  logger.hrms('Employee status updated', {
    employeeId,
    userId: req.user.id,
    newStatus: status
  });

  res.json({
    success: true,
    message: 'Employee status updated successfully',
    data: { employeeId, status }
  });
});

/**
 * Search employees
 * @route GET /api/v1/hrms/search/employees
 */
const searchEmployees = handleAsync(async (req, res) => {
  const { q, filters = {} } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const searchFilter = {
    $text: { $search: q },
    ...buildFilter(filters)
  };

  const employees = await Employee.find(searchFilter)
    .select('employeeId firstName lastName email employment.position.title employment.department status')
    .populate('employment.department', 'name')
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);

  res.json({
    success: true,
    message: 'Search completed successfully',
    data: employees,
    count: employees.length
  });
});

/**
 * Export employees
 * @route GET /api/v1/hrms/export/employees
 */
const exportEmployees = handleAsync(async (req, res) => {
  const { format = 'json', filters = {} } = req.query;

  const filter = buildFilter(filters);
  const employees = await Employee.find(filter)
    .populate('employment.department', 'name')
    .sort({ createdAt: -1 });

  if (format === 'csv') {
    // Convert to CSV format
    const csvData = employees.map(emp => ({
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      status: emp.status,
      department: emp.employment.department?.name || '',
      position: emp.employment.position.title,
      level: emp.employment.position.level,
      startDate: emp.employment.startDate,
      salary: emp.compensation.salary.amount
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="employees_${new Date().toISOString().split('T')[0]}.csv"`);
    
    // Simple CSV conversion
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    res.send(csv);
  } else {
    res.json({
      success: true,
      message: 'Employees exported successfully',
      data: employees,
      exportDate: new Date().toISOString(),
      count: employees.length
    });
  }

  logger.hrms('Employees exported', {
    userId: req.user.id,
    format,
    count: employees.length,
    filters
  });
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  searchEmployees,
  exportEmployees
};