import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Payment as PaymentIcon,
  PersonAdd as PersonAddIcon,
  NotificationsActive as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const HRDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalEmployees: 247,
      activeEmployees: 239,
      onLeave: 8,
      newHires: 12,
      pendingApprovals: 15,
      performanceReviews: 23
    },
    trends: {
      employeeGrowth: [220, 225, 235, 241, 247],
      turnoverRate: 4.2,
      satisfactionScore: 8.4,
      attendanceRate: 96.5
    },
    departments: [
      { name: 'Engineering', count: 89, growth: '+5.2%' },
      { name: 'Sales', count: 45, growth: '+2.1%' },
      { name: 'Marketing', count: 23, growth: '+8.7%' },
      { name: 'Support', count: 34, growth: '-1.2%' },
      { name: 'HR', count: 12, growth: '+0%' },
      { name: 'Finance', count: 18, growth: '+3.1%' }
    ],
    recentActivities: [
      { id: 1, type: 'hire', employee: 'Mario Rossi', department: 'Engineering', time: '2 ore fa' },
      { id: 2, type: 'leave', employee: 'Giulia Bianchi', department: 'Marketing', time: '4 ore fa' },
      { id: 3, type: 'review', employee: 'Luca Verde', department: 'Sales', time: '1 giorno fa' },
      { id: 4, type: 'approval', employee: 'Anna Neri', department: 'Support', time: '2 giorni fa' }
    ],
    pendingTasks: [
      { id: 1, task: 'Review onboarding documents', priority: 'high', dueDate: 'Oggi' },
      { id: 2, task: 'Approve vacation requests', priority: 'medium', dueDate: 'Domani' },
      { id: 3, task: 'Schedule performance reviews', priority: 'low', dueDate: 'Questa settimana' },
      { id: 4, task: 'Update salary bands', priority: 'high', dueDate: 'Prossima settimana' }
    ]
  });

  // Chart data configurations
  const employeeGrowthData = {
    labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag'],
    datasets: [
      {
        label: 'Dipendenti Totali',
        data: dashboardData.trends.employeeGrowth,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const departmentData = {
    labels: dashboardData.departments.map(dept => dept.name),
    datasets: [
      {
        label: 'Dipendenti per Dipartimento',
        data: dashboardData.departments.map(dept => dept.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ]
      }
    ]
  };

  const performanceData = {
    labels: ['Eccellente', 'Buono', 'Discreto', 'Da Migliorare'],
    datasets: [
      {
        data: [45, 120, 67, 15],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FF9800',
          '#F44336'
        ]
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'hire': return <PersonAddIcon color="success" />;
      case 'leave': return <AccessTimeIcon color="warning" />;
      case 'review': return <AssessmentIcon color="info" />;
      case 'approval': return <CheckCircleIcon color="primary" />;
      default: return <DashboardIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Quick Action Cards
  const QuickActionCard = ({ icon, title, value, trend, color = 'primary' }) => (
    <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { elevation: 4 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend.startsWith('+') ? 
                  <TrendingUpIcon fontSize="small" color="success" /> : 
                  <TrendingDownIcon fontSize="small" color="error" />
                }
                <Typography variant="caption" color={trend.startsWith('+') ? 'success.main' : 'error.main'}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            AI-HRMS Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Benvenuto nel sistema di gestione risorse umane
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Badge badgeContent={dashboardData.overview.pendingApprovals} color="error">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Badge>
          <Button variant="contained" startIcon={<PersonAddIcon />}>
            Nuovo Dipendente
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionCard
            icon={<PeopleIcon />}
            title="Dipendenti Totali"
            value={dashboardData.overview.totalEmployees}
            trend="+3.2%"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionCard
            icon={<CheckCircleIcon />}
            title="Dipendenti Attivi"
            value={dashboardData.overview.activeEmployees}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionCard
            icon={<AccessTimeIcon />}
            title="In Permesso"
            value={dashboardData.overview.onLeave}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionCard
            icon={<PersonAddIcon />}
            title="Nuove Assunzioni"
            value={dashboardData.overview.newHires}
            trend="+12%"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionCard
            icon={<WarningIcon />}
            title="Approvazioni"
            value={dashboardData.overview.pendingApprovals}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <QuickActionCard
            icon={<AssessmentIcon />}
            title="Valutazioni"
            value={dashboardData.overview.performanceReviews}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Panoramica" />
          <Tab label="Analytics" />
          <Tab label="Attività Recenti" />
          <Tab label="Task in Sospeso" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {/* Employee Growth Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Crescita Dipendenti (Ultimi 5 Mesi)
                </Typography>
                <Box height={300}>
                  <Line 
                    data={employeeGrowthData} 
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

          {/* Key Metrics */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Metriche Chiave
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Turnover Rate
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {dashboardData.trends.turnoverRate}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.trends.turnoverRate * 10} 
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Soddisfazione
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {dashboardData.trends.satisfactionScore}/10
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.trends.satisfactionScore * 10} 
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Presenza
                  </Typography>
                  <Typography variant="h5" color="info.main">
                    {dashboardData.trends.attendanceRate}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.trends.attendanceRate} 
                    color="info"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dipendenti per Dipartimento
                </Typography>
                <Box height={300}>
                  <Bar 
                    data={departmentData}
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

          {/* Performance Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribuzione Performance
                </Typography>
                <Box height={300}>
                  <Doughnut 
                    data={performanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analytics Avanzate - AI Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Funzionalità di analytics avanzate con AI in sviluppo...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attività Recenti
                </Typography>
                <List>
                  {dashboardData.recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${activity.employee} - ${activity.department}`}
                          secondary={activity.time}
                        />
                        <Chip 
                          label={activity.type} 
                          size="small" 
                          variant="outlined"
                        />
                      </ListItem>
                      {index < dashboardData.recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task in Sospeso
                </Typography>
                <List>
                  {dashboardData.pendingTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      <ListItem>
                        <ListItemText
                          primary={task.task}
                          secondary={`Scadenza: ${task.dueDate}`}
                        />
                        <Chip 
                          label={task.priority} 
                          size="small" 
                          color={getPriorityColor(task.priority)}
                        />
                      </ListItem>
                      {index < dashboardData.pendingTasks.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default HRDashboard;