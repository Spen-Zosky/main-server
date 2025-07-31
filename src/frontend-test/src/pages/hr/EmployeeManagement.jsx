import React, { useState, useEffect } from 'react';
import { hrmsAPI, handleApiError } from '../../services/api';
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
  Avatar,
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Tooltip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit', 'add'
  const [formData, setFormData] = useState({});

  // Employee form initial state
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    level: '',
    hireDate: new Date(),
    salary: '',
    manager: '',
    location: '',
    skills: [],
    contractType: 'Full-time',
    status: 'Active'
  };

  const departments = [
    'Human Resources',
    'Research & Development', 
    'Data Analytics',
    'IT & Technology',
    'Finance',
    'Marketing',
    'Operations',
    'Administration',
    'Customer Service',
    'Quality Assurance'
  ];
  const levels = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'];
  const contractTypes = ['Full-time', 'Part-time', 'Contract', 'Intern', 'Consultant'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated', 'Suspended'];

  // Load employees from backend API
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees when search/filter criteria change
  useEffect(() => {
    filterEmployees();
  }, [searchTerm, filterDepartment, filterStatus, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await hrmsAPI.getEmployees();
      
      // Transform backend data to frontend format
      const transformedEmployees = response.data.map(emp => ({
        id: emp._id,
        employeeId: emp.employeeId,
        firstName: emp.user?.firstName || 'N/A',
        lastName: emp.user?.lastName || 'N/A', 
        email: emp.user?.email || 'N/A',
        phone: emp.user?.phoneNumber || 'N/A',
        department: emp.department || 'N/A',
        position: emp.jobTitle || 'N/A',
        level: emp.level ? emp.level.charAt(0).toUpperCase() + emp.level.slice(1) : 'N/A',
        hireDate: emp.startDate || new Date().toISOString(),
        salary: emp.salary?.amount || 0,
        status: emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1).replace('-', ' ') : 'Active',
        manager: emp.manager?.user ? `${emp.manager.user.firstName} ${emp.manager.user.lastName}` : 'N/A',
        location: emp.workLocation?.office?.address?.city || emp.workLocation?.remoteAddress?.city || 'N/A',
        avatar: null,
        skills: emp.skills?.map(skill => skill.name) || [],
        performance: emp.performanceReviews?.length > 0 
          ? emp.performanceReviews[emp.performanceReviews.length - 1].rating 
          : 0,
        contractType: emp.employmentType ? emp.employmentType.charAt(0).toUpperCase() + emp.employmentType.slice(1).replace('-', ' ') : 'Full-time'
      }));
      
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }

    if (filterStatus) {
      filtered = filtered.filter(emp => emp.status === filterStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleOpenDialog = (mode, employee = null) => {
    setDialogMode(mode);
    if (mode === 'add') {
      setFormData(initialFormData);
    } else if (employee) {
      setFormData({ ...employee });
    }
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleFormChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSaveEmployee = async () => {
    try {
      setLoading(true);
      setError(null);

      if (dialogMode === 'add') {
        // Transform frontend form data to backend format
        const employeeData = {
          // Create user data first
          user: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone
          },
          department: formData.department,
          jobTitle: formData.position,
          level: formData.level?.toLowerCase(),
          startDate: formData.hireDate,
          employmentType: formData.contractType?.toLowerCase().replace(' ', '-') || 'full-time',
          status: formData.status?.toLowerCase().replace(' ', '-') || 'active',
          salary: {
            amount: parseFloat(formData.salary) || 0,
            currency: 'USD',
            frequency: 'yearly'
          },
          workLocation: {
            type: 'office',
            office: {
              address: {
                city: formData.location || 'N/A'
              }
            }
          },
          skills: formData.skills?.map(skill => ({
            name: skill,
            level: 'intermediate'
          })) || []
        };

        const response = await hrmsAPI.createEmployee(employeeData);
        
        // Refresh the employee list
        await fetchEmployees();
        
      } else if (dialogMode === 'edit') {
        // Transform frontend form data to backend format for update
        const updateData = {
          user: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone
          },
          department: formData.department,
          jobTitle: formData.position,
          level: formData.level?.toLowerCase(),
          startDate: formData.hireDate,
          employmentType: formData.contractType?.toLowerCase().replace(' ', '-') || 'full-time',
          status: formData.status?.toLowerCase().replace(' ', '-') || 'active',
          salary: {
            amount: parseFloat(formData.salary) || 0,
            currency: 'USD',
            frequency: 'yearly'
          },
          workLocation: {
            type: 'office',
            office: {
              address: {
                city: formData.location || 'N/A'
              }
            }
          },
          skills: formData.skills?.map(skill => ({
            name: skill,
            level: 'intermediate'
          })) || []
        };

        const response = await hrmsAPI.updateEmployee(formData.id, updateData);
        
        // Refresh the employee list
        await fetchEmployees();
      }
      
      handleCloseDialog();
      
    } catch (error) {
      console.error('Error saving employee:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await hrmsAPI.deleteEmployee(selectedEmployee.id, 'Deleted from HR management interface');
      
      // Refresh the employee list
      await fetchEmployees();
      
      handleMenuClose();
      
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Terminated': return 'error';
      case 'Suspended': return 'error';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 4.5) return 'success';
    if (score >= 4.0) return 'info';
    if (score >= 3.5) return 'warning';
    return 'error';
  };

  // Employee Detail Dialog
  const EmployeeDialog = () => (
    <Dialog 
      open={openDialog} 
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {dialogMode === 'add' ? 'Nuovo Dipendente' : 
         dialogMode === 'edit' ? 'Modifica Dipendente' : 'Dettagli Dipendente'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informazioni Personali
            </Typography>
            <Divider />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.firstName || ''}
              onChange={handleFormChange('firstName')}
              disabled={dialogMode === 'view'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cognome"
              value={formData.lastName || ''}
              onChange={handleFormChange('lastName')}
              disabled={dialogMode === 'view'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleFormChange('email')}
              disabled={dialogMode === 'view'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefono"
              value={formData.phone || ''}
              onChange={handleFormChange('phone')}
              disabled={dialogMode === 'view'}
            />
          </Grid>

          {/* Work Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Informazioni Lavorative
            </Typography>
            <Divider />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={dialogMode === 'view'}>
              <InputLabel>Dipartimento</InputLabel>
              <Select
                value={formData.department || ''}
                onChange={handleFormChange('department')}
                label="Dipartimento"
              >
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Posizione"
              value={formData.position || ''}
              onChange={handleFormChange('position')}
              disabled={dialogMode === 'view'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={dialogMode === 'view'}>
              <InputLabel>Livello</InputLabel>
              <Select
                value={formData.level || ''}
                onChange={handleFormChange('level')}
                label="Livello"
              >
                {levels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={dialogMode === 'view'}>
              <InputLabel>Tipo Contratto</InputLabel>
              <Select
                value={formData.contractType || ''}
                onChange={handleFormChange('contractType')}
                label="Tipo Contratto"
              >
                {contractTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salario"
              type="number"
              value={formData.salary || ''}
              onChange={handleFormChange('salary')}
              disabled={dialogMode === 'view'}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Manager"
              value={formData.manager || ''}
              onChange={handleFormChange('manager')}
              disabled={dialogMode === 'view'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sede"
              value={formData.location || ''}
              onChange={handleFormChange('location')}
              disabled={dialogMode === 'view'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={dialogMode === 'view'}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || ''}
                onChange={handleFormChange('status')}
                label="Status"
              >
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Performance Info - View only */}
          {dialogMode === 'view' && formData.performance && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Performance
              </Typography>
              <Divider />
              <Box display="flex" alignItems="center" mt={2}>
                <StarIcon color="primary" />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {formData.performance}/5.0
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(formData.performance / 5) * 100}
                  color={getPerformanceColor(formData.performance)}
                  sx={{ ml: 2, flexGrow: 1, height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={loading}>
          {dialogMode === 'view' ? 'Chiudi' : 'Annulla'}
        </Button>
        {dialogMode !== 'view' && (
          <Button 
            onClick={handleSaveEmployee} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Salvataggio...' : (dialogMode === 'add' ? 'Aggiungi' : 'Salva')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestione Dipendenti
          </Typography>
          <Box display="flex" gap={2}>
            <Button startIcon={<DownloadIcon />} variant="outlined">
              Esporta
            </Button>
            <Button startIcon={<UploadIcon />} variant="outlined">
              Importa
            </Button>
            <Button 
              startIcon={<AddIcon />} 
              variant="contained"
              onClick={() => handleOpenDialog('add')}
              disabled={loading}
            >
              Nuovo Dipendente
            </Button>
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <LinearProgress sx={{ mb: 3 }} />
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Cerca dipendenti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Dipartimento</InputLabel>
                  <Select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    label="Dipartimento"
                  >
                    <MenuItem value="">Tutti</MenuItem>
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">Tutti</MenuItem>
                    {statuses.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  {filteredEmployees.length} dipendenti trovati
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Dipendente</TableCell>
                  <TableCell>Dipartimento</TableCell>
                  <TableCell>Posizione</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Data Assunzione</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <LinearProgress sx={{ width: '200px', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          Caricamento dipendenti...
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nessun dipendente trovato
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((employee) => (
                      <TableRow key={employee.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2 }}>
                            {employee.firstName[0]}{employee.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {employee.firstName} {employee.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {employee.employeeId} • {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {employee.department}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.location}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {employee.position}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.level}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.status} 
                          color={getStatusColor(employee.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <StarIcon fontSize="small" color="primary" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {employee.performance}/5.0
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(employee.hireDate).toLocaleDateString('it-IT')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={(e) => handleMenuClick(e, employee)}
                          size="small"
                          disabled={loading}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem 
            onClick={() => handleOpenDialog('view', selectedEmployee)}
            disabled={loading}
          >
            <PersonIcon sx={{ mr: 1 }} />
            Visualizza Dettagli
          </MenuItem>
          <MenuItem 
            onClick={() => handleOpenDialog('edit', selectedEmployee)}
            disabled={loading}
          >
            <EditIcon sx={{ mr: 1 }} />
            Modifica
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleDeleteEmployee} 
            sx={{ color: 'error.main' }}
            disabled={loading}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            {loading ? 'Eliminazione...' : 'Elimina'}
          </MenuItem>
        </Menu>

        {/* Employee Detail/Edit Dialog */}
        <EmployeeDialog />
      </Box>
    </LocalizationProvider>
  );
};

export default EmployeeManagement;