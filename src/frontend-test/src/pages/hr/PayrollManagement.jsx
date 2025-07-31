import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert,
  LinearProgress,
  Fab,
  Tooltip,
  Tab,
  Tabs,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MoneyIcon,
  AccountBalance as BankIcon,
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const PayrollManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [payrolls, setPayrolls] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('view');

  // Filter states
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    period: '',
    periodType: '',
    status: '',
    department: '',
    dateFrom: null,
    dateTo: null
  });

  const [formData, setFormData] = useState({
    employee: '',
    payPeriod: {
      type: 'monthly',
      startDate: null,
      endDate: null,
      payDate: null,
      year: new Date().getFullYear(),
      period: 1
    },
    baseSalary: {
      amount: 0,
      currency: 'EUR',
      frequency: 'monthly'
    },
    workingHours: {
      regularHours: 0,
      overtimeHours: 0,
      doubleTimeHours: 0,
      sickLeaveHours: 0,
      vacationHours: 0,
      holidayHours: 0
    },
    earnings: {
      regular: 0,
      overtime: 0,
      doubleTime: 0,
      commission: 0,
      bonus: 0,
      allowances: [],
      reimbursements: []
    },
    status: 'draft'
  });

  const departments = [
    'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 
    'Operations', 'Legal', 'IT', 'Customer Support', 'Product Management'
  ];

  const payPeriodTypes = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-Weekly' },
    { value: 'semi-monthly', label: 'Semi-Monthly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const payrollStatuses = [
    { value: 'draft', label: 'Draft', color: 'default' },
    { value: 'pending_approval', label: 'Pending Approval', color: 'warning' },
    { value: 'approved', label: 'Approved', color: 'info' },
    { value: 'processed', label: 'Processed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' }
  ];

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchPayrollData();
    fetchPayrollStats();
  }, [filters, page, rowsPerPage]);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      // Mock payroll data - replace with hrmsAPI.getPayrolls()
      const mockPayrolls = [
        {
          id: 1,
          employee: {
            id: 1,
            firstName: 'Mario',
            lastName: 'Rossi',
            employeeId: 'EMP001',
            department: 'Engineering',
            position: 'Senior Developer'
          },
          payPeriod: {
            type: 'monthly',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            payDate: '2024-02-01',
            year: 2024,
            period: 1
          },
          totals: {
            grossPay: 5500,
            netPay: 4200,
            totalTaxes: 1100,
            totalPreTaxDeductions: 200
          },
          status: 'processed',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          employee: {
            id: 2,
            firstName: 'Giulia',
            lastName: 'Bianchi',
            employeeId: 'EMP002',
            department: 'Marketing',
            position: 'Marketing Manager'
          },
          payPeriod: {
            type: 'monthly',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            payDate: '2024-02-01',
            year: 2024,
            period: 1
          },
          totals: {
            grossPay: 4800,
            netPay: 3700,
            totalTaxes: 960,
            totalPreTaxDeductions: 140
          },
          status: 'approved',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ];

      setPayrolls(mockPayrolls);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payroll data');
      console.error('Error fetching payrolls:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrollStats = async () => {
    try {
      // Mock stats data - replace with hrmsAPI.getPayrollStats()
      const mockStats = {
        overview: {
          totalPayrolls: 24,
          totalGrossPay: 125000,
          totalNetPay: 95000,
          totalTaxes: 25000,
          totalDeductions: 5000,
          avgGrossPay: 5208,
          avgNetPay: 3958
        },
        monthlyBreakdown: [
          { _id: 1, totalGrossPay: 62500, totalNetPay: 47500, payrollCount: 12 },
          { _id: 2, totalGrossPay: 62500, totalNetPay: 47500, payrollCount: 12 }
        ],
        departmentBreakdown: [
          { department: 'Engineering', totalGrossPay: 45000, employeeCount: 8, avgGrossPay: 5625 },
          { department: 'Marketing', totalGrossPay: 35000, employeeCount: 6, avgGrossPay: 5833 },
          { department: 'Sales', totalGrossPay: 30000, employeeCount: 5, avgGrossPay: 6000 }
        ]
      };

      setStats(mockStats);
    } catch (err) {
      console.error('Error fetching payroll stats:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleMenuClick = (event, payroll) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayroll(payroll);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayroll(null);
  };

  const handleOpenDialog = (mode, payroll = null) => {
    setDialogMode(mode);
    if (payroll) {
      setSelectedPayroll(payroll);
      setFormData({
        ...payroll,
        employee: payroll.employee.id
      });
    } else {
      setFormData({
        employee: '',
        payPeriod: {
          type: 'monthly',
          startDate: null,
          endDate: null,
          payDate: null,
          year: new Date().getFullYear(),
          period: 1
        },
        baseSalary: {
          amount: 0,
          currency: 'EUR',
          frequency: 'monthly'
        },
        workingHours: {
          regularHours: 0,
          overtimeHours: 0,
          doubleTimeHours: 0,
          sickLeaveHours: 0,
          vacationHours: 0,
          holidayHours: 0
        },
        earnings: {
          regular: 0,
          overtime: 0,
          doubleTime: 0,
          commission: 0,
          bonus: 0,
          allowances: [],
          reimbursements: []
        },
        status: 'draft'
      });
    }
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPayroll(null);
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSavePayroll = async () => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        // await hrmsAPI.createPayroll(formData);
        console.log('Creating payroll:', formData);
      } else if (dialogMode === 'edit') {
        // await hrmsAPI.updatePayroll(selectedPayroll.id, formData);
        console.log('Updating payroll:', formData);
      }
      
      await fetchPayrollData();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save payroll');
      console.error('Error saving payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayroll = async () => {
    try {
      setLoading(true);
      // await hrmsAPI.deletePayroll(selectedPayroll.id);
      console.log('Deleting payroll:', selectedPayroll.id);
      await fetchPayrollData();
      handleMenuClose();
    } catch (err) {
      setError('Failed to delete payroll');
      console.error('Error deleting payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayroll = async () => {
    try {
      setLoading(true);
      // await hrmsAPI.approvePayroll(selectedPayroll.id);
      console.log('Approving payroll:', selectedPayroll.id);
      await fetchPayrollData();
      handleMenuClose();
    } catch (err) {
      setError('Failed to approve payroll');
      console.error('Error approving payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async () => {
    try {
      setLoading(true);
      // await hrmsAPI.processPayroll(selectedPayroll.id);
      console.log('Processing payroll:', selectedPayroll.id);
      await fetchPayrollData();
      handleMenuClose();
    } catch (err) {
      setError('Failed to process payroll');
      console.error('Error processing payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayStub = async () => {
    try {
      // await hrmsAPI.generatePayStub(selectedPayroll.id);
      console.log('Generating pay stub for:', selectedPayroll.id);
      handleMenuClose();
    } catch (err) {
      setError('Failed to generate pay stub');
      console.error('Error generating pay stub:', err);
    }
  };

  const getStatusColor = (status) => {
    const statusConfig = payrollStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'default';
  };

  const filteredPayrolls = payrolls.filter(payroll =>
    payroll.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatsCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body2">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const PayrollDialog = () => (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        {dialogMode === 'view' ? 'Payroll Details' : 
         dialogMode === 'edit' ? 'Edit Payroll' : 'Create New Payroll'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={dialogMode === 'view'}>
              <InputLabel>Employee</InputLabel>
              <Select
                value={formData.employee || ''}
                onChange={handleFormChange('employee')}
                label="Employee"
              >
                <MenuItem value="1">Mario Rossi (EMP001)</MenuItem>
                <MenuItem value="2">Giulia Bianchi (EMP002)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={dialogMode === 'view'}>
              <InputLabel>Pay Period Type</InputLabel>
              <Select
                value={formData.payPeriod?.type || ''}
                onChange={handleFormChange('payPeriod.type')}
                label="Pay Period Type"
              >
                {payPeriodTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Year"
              type="number"
              value={formData.payPeriod?.year || ''}
              onChange={handleFormChange('payPeriod.year')}
              disabled={dialogMode === 'view'}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Period"
              type="number"
              value={formData.payPeriod?.period || ''}
              onChange={handleFormChange('payPeriod.period')}
              disabled={dialogMode === 'view'}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Base Salary"
              type="number"
              value={formData.baseSalary?.amount || ''}
              onChange={handleFormChange('baseSalary.amount')}
              disabled={dialogMode === 'view'}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Regular Hours"
              type="number"
              value={formData.workingHours?.regularHours || ''}
              onChange={handleFormChange('workingHours.regularHours')}
              disabled={dialogMode === 'view'}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Overtime Hours"
              type="number"
              value={formData.workingHours?.overtimeHours || ''}
              onChange={handleFormChange('workingHours.overtimeHours')}
              disabled={dialogMode === 'view'}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Regular Earnings"
              type="number"
              value={formData.earnings?.regular || ''}
              onChange={handleFormChange('earnings.regular')}
              disabled={dialogMode === 'view'}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bonus"
              type="number"
              value={formData.earnings?.bonus || ''}
              onChange={handleFormChange('earnings.bonus')}
              disabled={dialogMode === 'view'}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth disabled={dialogMode === 'view'}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || ''}
                onChange={handleFormChange('status')}
                label="Status"
              >
                {payrollStatuses.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>
          {dialogMode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {dialogMode !== 'view' && (
          <Button 
            onClick={handleSavePayroll} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Payroll Management
          </Typography>
          <Tooltip title="Add New Payroll">
            <Fab 
              color="primary" 
              aria-label="add"
              onClick={() => handleOpenDialog('add')}
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Payroll Records" />
            <Tab label="Statistics" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        {/* Statistics Tab */}
        {tabValue === 1 && stats && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Payrolls"
                value={stats.overview.totalPayrolls}
                icon={<ReceiptIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Gross Pay"
                value={`€${stats.overview.totalGrossPay.toLocaleString()}`}
                icon={<MoneyIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Net Pay"
                value={`€${stats.overview.totalNetPay.toLocaleString()}`}
                icon={<BankIcon />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Average Gross Pay"
                value={`€${stats.overview.avgGrossPay.toLocaleString()}`}
                icon={<TrendingUpIcon />}
                color="warning"
              />
            </Grid>
          </Grid>
        )}

        {/* Payroll Records Tab */}
        {tabValue === 0 && (
          <>
            {/* Search and Filter Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <TextField
                placeholder="Search payrolls..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              <Button
                startIcon={<FilterIcon />}
                onClick={handleFilterClick}
                variant="outlined"
              >
                Filters
              </Button>
            </Box>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* Payroll Table */}
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Pay Period</TableCell>
                      <TableCell>Gross Pay</TableCell>
                      <TableCell>Net Pay</TableCell>
                      <TableCell>Taxes</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Pay Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayrolls
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((payroll) => (
                        <TableRow key={payroll.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {payroll.employee.firstName} {payroll.employee.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payroll.employee.employeeId} • {payroll.employee.department}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {payroll.payPeriod.year} - Period {payroll.payPeriod.period}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payroll.payPeriod.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              €{payroll.totals.grossPay.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              €{payroll.totals.netPay.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              €{payroll.totals.totalTaxes.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={payroll.status.replace('_', ' ').toUpperCase()}
                              color={getStatusColor(payroll.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(payroll.payPeriod.payDate).toLocaleDateString('it-IT')}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              onClick={(e) => handleMenuClick(e, payroll)}
                              size="small"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredPayrolls.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </>
        )}

        {/* Reports Tab */}
        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payroll Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate comprehensive payroll reports for compliance and analysis.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ mr: 2 }}>
                  Export Payroll Data
                </Button>
                <Button variant="outlined" startIcon={<AssessmentIcon />} sx={{ mr: 2 }}>
                  Tax Reports
                </Button>
                <Button variant="outlined" startIcon={<SecurityIcon />}>
                  Compliance Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleOpenDialog('view', selectedPayroll)}>
            <VisibilityIcon sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleOpenDialog('edit', selectedPayroll)}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleGeneratePayStub}>
            <ReceiptIcon sx={{ mr: 1 }} />
            Generate Pay Stub
          </MenuItem>
          <Divider />
          {selectedPayroll?.status === 'pending_approval' && (
            <MenuItem onClick={handleApprovePayroll} sx={{ color: 'success.main' }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              Approve
            </MenuItem>
          )}
          {selectedPayroll?.status === 'approved' && (
            <MenuItem onClick={handleProcessPayroll} sx={{ color: 'info.main' }}>
              <PendingIcon sx={{ mr: 1 }} />
              Process
            </MenuItem>
          )}
          <MenuItem onClick={handleDeletePayroll} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Payroll Dialog */}
        <PayrollDialog />
      </Box>
    </LocalizationProvider>
  );
};

export default PayrollManagement;