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
  Avatar,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Calendar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Alert,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  DateRange as DateRangeIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  Approve as ApproveIcon,
  Reject as RejectIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Line, Bar } from 'react-chartjs-2';

const AttendanceManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Mario Rossi',
      department: 'Engineering',
      date: '2025-01-23',
      checkIn: '09:00',
      checkOut: '18:00',
      workHours: 8,
      status: 'Present',
      overtime: 0,
      breaks: ['12:00-13:00']
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Giulia Bianchi',
      department: 'Marketing',
      date: '2025-01-23',
      checkIn: '09:15',
      checkOut: '17:45',
      workHours: 7.5,
      status: 'Late',
      overtime: 0,
      breaks: ['12:30-13:30']
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Luca Verde',
      department: 'Sales',
      date: '2025-01-23',
      checkIn: null,
      checkOut: null,
      workHours: 0,
      status: 'Absent',
      overtime: 0,
      breaks: []
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Mario Rossi',
      leaveType: 'Annual Leave',
      startDate: '2025-01-30',
      endDate: '2025-02-03',
      days: 5,
      reason: 'Family vacation',
      status: 'Pending',
      requestDate: '2025-01-20',
      approver: 'Luca Bianchi'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Giulia Bianchi',
      leaveType: 'Sick Leave',
      startDate: '2025-01-25',
      endDate: '2025-01-25',
      days: 1,
      reason: 'Medical appointment',
      status: 'Approved',
      requestDate: '2025-01-24',
      approver: 'Anna Verde'
    },
    {
      id: 3,
      employeeId: 'EMP004',
      employeeName: 'Paolo Neri',
      leaveType: 'Personal Leave',
      startDate: '2025-02-10',
      endDate: '2025-02-11',
      days: 2,
      reason: 'Personal matters',
      status: 'Rejected',
      requestDate: '2025-01-22',
      approver: 'Luca Bianchi',
      rejectionReason: 'Insufficient notice period'
    }
  ]);

  const [attendanceStats, setAttendanceStats] = useState({
    totalEmployees: 247,
    presentToday: 235,
    absentToday: 8,
    lateToday: 4,
    averageWorkHours: 7.8,
    overtimeHours: 23,
    pendingLeaves: 12,
    approvedLeaves: 45
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); // 'leave-request', 'manual-entry'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const departments = ['Engineering', 'Marketing', 'Sales', 'Support', 'HR', 'Finance'];
  const attendanceStatuses = ['Present', 'Absent', 'Late', 'Half Day', 'Work from Home'];
  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Emergency Leave'];
  const leaveStatuses = ['Pending', 'Approved', 'Rejected'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      case 'Half Day': return 'info';
      case 'Work from Home': return 'secondary';
      default: return 'default';
    }
  };

  const getLeaveStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  // Chart data for attendance trends
  const attendanceTrendData = {
    labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'],
    datasets: [
      {
        label: 'Presenti',
        data: [240, 238, 235, 242, 235],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Assenti',
        data: [7, 9, 12, 5, 12],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  };

  const overtimeData = {
    labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag'],
    datasets: [
      {
        label: 'Ore Straordinario',
        data: [45, 52, 38, 61, 23],
        backgroundColor: 'rgba(54, 162, 235, 0.8)'
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (mode) => {
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogMode('');
  };

  const handleApproveLeave = (leaveId) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'Approved' } : leave
    ));
  };

  const handleRejectLeave = (leaveId) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'Rejected' } : leave
    ));
  };

  // Quick Stats Cards
  const StatsCard = ({ icon, title, value, subtitle, color = 'primary', trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Attendance Table Component
  const AttendanceTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dipendente</TableCell>
            <TableCell>Dipartimento</TableCell>
            <TableCell>Entrata</TableCell>
            <TableCell>Uscita</TableCell>
            <TableCell>Ore Lavoro</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Straordinari</TableCell>
            <TableCell align="right">Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
            <TableRow key={record.id} hover>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                    {record.employeeName.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {record.employeeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {record.employeeId}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell>
                <Typography variant="body2">
                  {record.checkIn || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {record.checkOut || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {record.workHours}h
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={record.status} 
                  color={getStatusColor(record.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {record.overtime}h
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Leave Requests Table Component
  const LeaveRequestsTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dipendente</TableCell>
            <TableCell>Tipo Permesso</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Giorni</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell align="right">Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                    {request.employeeName.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {request.employeeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.employeeId}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{request.leaveType}</TableCell>
              <TableCell>
                <Typography variant="body2">
                  {new Date(request.startDate).toLocaleDateString('it-IT')} - {new Date(request.endDate).toLocaleDateString('it-IT')}
                </Typography>
              </TableCell>
              <TableCell>{request.days}</TableCell>
              <TableCell>
                <Chip 
                  label={request.status} 
                  color={getLeaveStatusColor(request.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap>
                  {request.reason}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {request.status === 'Pending' && (
                  <Box>
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => handleApproveLeave(request.id)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleRejectLeave(request.id)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestione Presenze
          </Typography>
          <Box display="flex" gap={2}>
            <Button startIcon={<DownloadIcon />} variant="outlined">
              Esporta Report
            </Button>
            <Button 
              startIcon={<AddIcon />} 
              variant="contained"
              onClick={() => handleOpenDialog('manual-entry')}
            >
              Inserimento Manuale
            </Button>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<CheckCircleIcon />}
              title="Presenti Oggi"
              value={attendanceStats.presentToday}
              subtitle={`su ${attendanceStats.totalEmployees} totali`}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<CancelIcon />}
              title="Assenti Oggi"
              value={attendanceStats.absentToday}
              subtitle="3.2% del totale"
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<WarningIcon />}
              title="Ritardatari"
              value={attendanceStats.lateToday}
              subtitle="1.6% del totale"
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<AccessTimeIcon />}
              title="Ore Straordinari"
              value={attendanceStats.overtimeHours}
              subtitle="questa settimana"
              color="info"
            />
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Presenze Giornaliere" />
            <Tab label="Richieste Permessi" />
            <Tab label="Analytics" />
            <Tab label="Calendario" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {/* Filters */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <DatePicker
                        label="Data"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        placeholder="Cerca dipendente..."
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
                          {attendanceStatuses.map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Table */}
            <Grid item xs={12}>
              <Card>
                <AttendanceTable />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={attendanceData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedTab === 1 && (
          <Grid container spacing={3}>
            {/* Leave Requests Stats */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Riepilogo Permessi
                  </Typography>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">In Attesa</Typography>
                      <Chip label={attendanceStats.pendingLeaves} color="warning" size="small" />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(attendanceStats.pendingLeaves / (attendanceStats.pendingLeaves + attendanceStats.approvedLeaves)) * 100} 
                      color="warning"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Approvati</Typography>
                      <Chip label={attendanceStats.approvedLeaves} color="success" size="small" />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(attendanceStats.approvedLeaves / (attendanceStats.pendingLeaves + attendanceStats.approvedLeaves)) * 100} 
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Leave Requests Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Richieste Permessi
                    </Typography>
                    <Button 
                      startIcon={<AddIcon />} 
                      variant="contained"
                      onClick={() => handleOpenDialog('leave-request')}
                    >
                      Nuova Richiesta
                    </Button>
                  </Box>
                  <LeaveRequestsTable />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedTab === 2 && (
          <Grid container spacing={3}>
            {/* Attendance Trends */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Trend Presenze (Settimana Corrente)
                  </Typography>
                  <Box height={300}>
                    <Line 
                      data={attendanceTrendData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Overtime Trends */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Straordinari per Mese
                  </Typography>
                  <Box height={300}>
                    <Bar 
                      data={overtimeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Additional Analytics */}
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body1" fontWeight="medium">
                  Analytics AI in Development
                </Typography>
                <Typography variant="body2">
                  Funzionalità avanzate di analisi con AI per previsioni di assenze, pattern di presenza e ottimizzazione dei turni in fase di sviluppo.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        )}

        {selectedTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Calendario Presenze
                  </Typography>
                  <Alert severity="info">
                    Vista calendario in sviluppo - Integrazione con componente calendario per visualizzazione mensile delle presenze e permessi.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Dialogs would go here */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'leave-request' ? 'Nuova Richiesta Permesso' : 'Inserimento Manuale Presenza'}
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mt: 2 }}>
              Form per {dialogMode === 'leave-request' ? 'richiesta permessi' : 'inserimento manuale presenze'} in sviluppo.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annulla</Button>
            <Button variant="contained">Salva</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceManagement;