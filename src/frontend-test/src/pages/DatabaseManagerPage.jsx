import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Breadcrumbs,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  LinearProgress,
  TextField,
  Alert,
  Snackbar,
  Checkbox,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ArrowBackOutlined as BackIcon,
  RefreshOutlined as RefreshIcon,
  StorageOutlined as DatabaseIcon,
  TableViewOutlined as TableIcon,
  ViewListOutlined as CollectionIcon,
  AccountTreeOutlined as IndexIcon,
  PersonOutlined as UserIcon,
  SecurityOutlined as SecurityIcon,
  BackupOutlined as BackupIcon,
  UploadFileOutlined as ImportIcon,
  DownloadOutlined as ExportIcon,
  PlayArrowOutlined as QueryIcon,
  PlayArrowOutlined,
  BarChartOutlined as AnalyticsIcon,
  MonitorOutlined as MonitorIcon,
  SettingsOutlined as SettingsIcon,
  SpeedOutlined,
  StorageOutlined,
  LinkOutlined,
  TrendingUpOutlined,
  TuneOutlined,
  ErrorOutlineOutlined,
  AddOutlined as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  VisibilityOutlined as ViewIcon,
  SearchOutlined as SearchIcon,
  FilterListOutlined as FilterIcon,
  MoreVertOutlined as MoreIcon,
  KeyOutlined as KeyIcon,
  LinkOutlined as RelationIcon,
  DataObjectOutlined as SchemaIcon,
  TimelineOutlined as PerformanceIcon,
  CloudSyncOutlined as SyncIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

// Database Object Classes Configuration
const DATABASE_CLASSES = {
  tables: {
    name: 'Tables',
    icon: <TableIcon />,
    description: 'Database tables management',
    color: '#1976d2',
    count: 24,
    status: 'active'
  },
  collections: {
    name: 'Collections',
    icon: <CollectionIcon />,
    description: 'MongoDB collections',
    color: '#388e3c',
    count: 8,
    status: 'active'
  },
  indexes: {
    name: 'Indexes',
    icon: <IndexIcon />,
    description: 'Database indexes and keys',
    color: '#f57c00',
    count: 45,
    status: 'optimized'
  },
  relations: {
    name: 'Relations',
    icon: <RelationIcon />,
    description: 'Table relationships and foreign keys',
    color: '#7b1fa2',
    count: 18,
    status: 'active'
  },
  users: {
    name: 'Users & Roles',
    icon: <UserIcon />,
    description: 'Database users and permissions',
    color: '#d32f2f',
    count: 12,
    status: 'secured'
  },
  schemas: {
    name: 'Schemas',
    icon: <SchemaIcon />,
    description: 'Database schemas and structures',
    color: '#00796b',
    count: 6,
    status: 'active'
  },
  backups: {
    name: 'Backups',
    icon: <BackupIcon />,
    description: 'Database backups and recovery',
    color: '#5d4037',
    count: 15,
    status: 'healthy'
  },
  performance: {
    name: 'Performance',
    icon: <PerformanceIcon />,
    description: 'Query performance and optimization',
    color: '#e91e63',
    count: 0,
    status: 'monitoring'
  }
};

function DatabaseManagerPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [selectedClass, setSelectedClass] = useState('tables');
  const [selectedItems, setSelectedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [performanceData, setPerformanceData] = useState({
    connections: 45,
    queriesPerSecond: 250,
    avgResponseTime: '12ms',
    cacheHitRatio: '94.2%'
  });

  const currentClass = DATABASE_CLASSES[selectedClass];

  // Mock data based on selected class
  const getMockData = () => {
    switch (selectedClass) {
      case 'tables':
        return [
          { id: 1, name: 'users', type: 'InnoDB', rows: 15420, size: '2.3MB', engine: 'MySQL', status: 'active', lastModified: '2025-01-24T10:30:00' },
          { id: 2, name: 'employees', type: 'InnoDB', rows: 850, size: '456KB', engine: 'MySQL', status: 'active', lastModified: '2025-01-24T09:15:00' },
          { id: 3, name: 'research_projects', type: 'InnoDB', rows: 234, size: '1.2MB', engine: 'MySQL', status: 'active', lastModified: '2025-01-23T16:45:00' },
          { id: 4, name: 'data_mining_jobs', type: 'InnoDB', rows: 1420, size: '3.8MB', engine: 'MySQL', status: 'active', lastModified: '2025-01-24T11:20:00' }
        ];
      case 'collections':
        return [
          { id: 1, name: 'user_sessions', type: 'Document', documents: 25430, size: '45MB', engine: 'MongoDB', status: 'active', lastModified: '2025-01-24T12:00:00' },
          { id: 2, name: 'analytics_data', type: 'Document', documents: 95200, size: '2.3GB', engine: 'MongoDB', status: 'active', lastModified: '2025-01-24T11:45:00' },
          { id: 3, name: 'file_metadata', type: 'Document', documents: 8420, size: '125MB', engine: 'MongoDB', status: 'active', lastModified: '2025-01-24T10:30:00' }
        ];
      case 'indexes':
        return [
          { id: 1, name: 'idx_users_email', table: 'users', type: 'UNIQUE', columns: ['email'], size: '145KB', status: 'active', efficiency: '98.5%' },
          { id: 2, name: 'idx_employees_dept', table: 'employees', type: 'BTREE', columns: ['department_id'], size: '89KB', status: 'active', efficiency: '95.2%' },
          { id: 3, name: 'idx_projects_status', table: 'research_projects', type: 'BTREE', columns: ['status', 'created_at'], size: '234KB', status: 'active', efficiency: '92.1%' }
        ];
      case 'relations':
        return [
          { id: 1, name: 'fk_employees_users', fromTable: 'employees', toTable: 'users', type: 'ONE_TO_ONE', constraint: 'CASCADE', status: 'active' },
          { id: 2, name: 'fk_projects_employees', fromTable: 'research_projects', toTable: 'employees', type: 'MANY_TO_ONE', constraint: 'RESTRICT', status: 'active' },
          { id: 3, name: 'fk_jobs_projects', fromTable: 'data_mining_jobs', toTable: 'research_projects', type: 'MANY_TO_ONE', constraint: 'CASCADE', status: 'active' }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    const data = getMockData();
    setCurrentData(data);
  }, [selectedClass]);

  // Debug log
  console.log('Current class:', selectedClass, 'Data:', currentData);
  console.log('Dialog state - open:', dialogOpen, 'type:', dialogType);

  const handleAction = (action, item = null) => {
    console.log('handleAction called:', action, 'item:', item);
    try {
      setDialogType(action);
      if (item) {
        setSelectedItems([item]);
      }
      setDialogOpen(true);
    } catch (error) {
      console.error('Error in handleAction:', error);
      setError('Error opening dialog: ' + error.message);
    }
  };

  const handleBulkAction = (action) => {
    setDialogType(action);
    setDialogOpen(true);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#388e3c';
      case 'optimized': return '#1976d2';
      case 'secured': return '#7b1fa2';
      case 'healthy': return '#00796b';
      case 'monitoring': return '#f57c00';
      default: return '#666';
    }
  };

  const renderActionMenu = () => {
    const actions = [
      { id: 'query', label: 'Query Builder', icon: <QueryIcon />, color: '#1976d2' },
      { id: 'import', label: 'Import Data', icon: <ImportIcon />, color: '#388e3c' },
      { id: 'export', label: 'Export Data', icon: <ExportIcon />, color: '#f57c00' },
      { id: 'backup', label: 'Create Backup', icon: <BackupIcon />, color: '#5d4037' },
      { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, color: '#e91e63' },
      { id: 'monitor', label: 'Monitor', icon: <MonitorIcon />, color: '#00796b' },
      { id: 'sync', label: 'Sync', icon: <SyncIcon />, color: '#7b1fa2' },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon />, color: '#666' }
    ];

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outlined"
            size="small"
            startIcon={action.icon}
            onClick={() => handleAction(action.id)}
            sx={{
              borderColor: `${action.color}30`,
              color: action.color,
              '&:hover': {
                borderColor: action.color,
                backgroundColor: `${action.color}10`
              }
            }}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    );
  };

  const renderDataTable = () => {
    const data = currentData;
    
    console.log('renderDataTable - selectedClass:', selectedClass, 'data:', data);
    
    if (!data || data.length === 0) {
      return (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <DatabaseIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {currentClass.name.toLowerCase()} found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Get started by creating your first {currentClass.name.toLowerCase().slice(0, -1)}.
          </Typography>
        </Box>
      );
    }

    const getTableHeaders = () => {
      switch (selectedClass) {
        case 'tables':
          return ['Name', 'Type', 'Rows', 'Size', 'Engine', 'Status', 'Last Modified', 'Actions'];
        case 'collections':
          return ['Name', 'Type', 'Documents', 'Size', 'Engine', 'Status', 'Last Modified', 'Actions'];
        case 'indexes':
          return ['Name', 'Table', 'Type', 'Columns', 'Size', 'Efficiency', 'Status', 'Actions'];
        case 'relations':
          return ['Name', 'From Table', 'To Table', 'Type', 'Constraint', 'Status', 'Actions'];
        default:
          return ['Name', 'Type', 'Status', 'Actions'];
      }
    };

    const renderTableRow = (item) => {
      if (!item) return null;
      
      console.log('renderTableRow - selectedClass:', selectedClass, 'item:', item);
      
      try {
        switch (selectedClass) {
          case 'tables':
          case 'collections':
          return (
            <>
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {item.id}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={item.type} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {item.rows || item.documents}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.size}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={item.engine} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(item.status)}15`,
                    color: getStatusColor(item.status),
                    border: `1px solid ${getStatusColor(item.status)}30`
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(item.lastModified).toLocaleString('it-IT')}
                </Typography>
              </TableCell>
            </>
          );
        case 'indexes':
          return (
            <>
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.table}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={item.type} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {item.columns && Array.isArray(item.columns) ? item.columns.join(', ') : 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.size}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                  {item.efficiency}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(item.status)}15`,
                    color: getStatusColor(item.status),
                    border: `1px solid ${getStatusColor(item.status)}30`
                  }}
                />
              </TableCell>
            </>
          );
        case 'relations':
          return (
            <>
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.fromTable}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.toTable}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={item.type} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Chip label={item.constraint} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(item.status)}15`,
                    color: getStatusColor(item.status),
                    border: `1px solid ${getStatusColor(item.status)}30`
                  }}
                />
              </TableCell>
            </>
          );
        default:
          return null;
      }
    } catch (error) {
      console.error('Error in renderTableRow:', error, 'item:', item);
      return (
        <TableCell colSpan={8}>
          <Typography color="error" variant="body2">
            Error rendering row: {error.message}
          </Typography>
        </TableCell>
      );
    }
  };

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              {getTableHeaders().map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} hover sx={{ cursor: 'pointer' }}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                {renderTableRow(item)}
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View">
                      <IconButton size="small" onClick={() => handleAction('view', item)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleAction('edit', item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleAction('delete', item)} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More">
                      <IconButton size="small">
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderPerformanceMetrics = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {performanceData.connections}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Connections
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {performanceData.queriesPerSecond}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Queries/Second
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {performanceData.avgResponseTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Response Time
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {performanceData.cacheHitRatio}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cache Hit Ratio
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
      display: 'flex'
    }} className="scrollbar-modern">
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          backgroundColor: mode === 'light' ? '#fafafa' : '#1e1e1e',
          borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
          borderRadius: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 2, borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/')}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <BackIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Database Manager
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Comprehensive database administration console
          </Typography>
        </Box>

        {/* Database Classes Navigation */}
        <List sx={{ p: 0 }}>
          {Object.entries(DATABASE_CLASSES).map(([key, classData]) => (
            <ListItem
              key={key}
              button
              selected={selectedClass === key}
              onClick={() => setSelectedClass(key)}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: mode === 'light' 
                    ? `${classData.color}15` 
                    : `${classData.color}25`,
                  borderRight: `3px solid ${classData.color}`,
                  '&:hover': {
                    backgroundColor: mode === 'light' 
                      ? `${classData.color}20` 
                      : `${classData.color}30`,
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedClass === key ? classData.color : 'text.secondary',
                minWidth: 36
              }}>
                {classData.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: selectedClass === key ? 600 : 400 }}>
                    {classData.name}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {classData.count} items • {classData.status}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Sidebar Footer - Connection Info */}
        <Box sx={{ mt: 'auto', p: 2, borderTop: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333' }}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: mode === 'light' ? '#e3f2fd' : '#1a237e20',
              border: mode === 'light' ? '1px solid #bbdefb' : '1px solid #1a237e'
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Connection: MongoDB
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Host: localhost:27017
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Database: main_server_platform
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: '#388e3c',
                animation: 'pulse 2s infinite'
              }} />
              <Typography variant="caption" color="text.secondary">
                Connected
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Paper>

      {/* Main Content Panel */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Bar with Actions */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: mode === 'light' ? '#fff' : '#1e1e1e',
            borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
            borderRadius: 0,
            p: 2
          }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Typography color="text.secondary" variant="body2">Database Manager</Typography>
            <Typography color="primary" variant="body2" sx={{ fontWeight: 600 }}>
              {currentClass.name}
            </Typography>
          </Breadcrumbs>

          {/* Action Menu */}
          <Box sx={{ mb: 2 }}>
            {renderActionMenu()}
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder={`Search ${currentClass.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Button variant="outlined" size="small" startIcon={<FilterIcon />}>
              Filter
            </Button>
            <Button variant="contained" size="small" startIcon={<AddIcon />}>
              Create New
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              label={`${currentData.length} ${currentClass.name.toLowerCase()}`}
              size="small"
              variant="outlined"
            />
          </Box>

          {loading && <LinearProgress sx={{ mt: 1 }} />}
        </Paper>

        {/* Performance Metrics */}
        <Box sx={{ p: 2 }}>
          {renderPerformanceMetrics()}
        </Box>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: 2, pt: 0 }}>
          <Paper
            elevation={1}
            sx={{
              backgroundColor: mode === 'light' ? '#fff' : '#1e1e1e',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {/* Class Info Header */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: mode === 'light' ? `${currentClass.color}08` : `${currentClass.color}15`,
              borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: currentClass.color,
                    color: 'white'
                  }}
                >
                  {currentClass.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentClass.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentClass.description}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={currentClass.status}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(currentClass.status)}15`,
                      color: getStatusColor(currentClass.status),
                      border: `1px solid ${getStatusColor(currentClass.status)}30`,
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Data Table */}
            <Box className="scrollbar-modern">
              {renderDataTable()}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Action Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          console.log('Dialog closing');
          setDialogOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {dialogType === 'analytics' ? <AnalyticsIcon /> : 
             dialogType === 'monitor' ? <MonitorIcon /> : <QueryIcon />}
            {dialogType === 'query' ? 'SQL Query Builder' :
             dialogType === 'import' ? 'Import Data' :
             dialogType === 'export' ? 'Export Data' :
             dialogType === 'backup' ? 'Create Backup' :
             dialogType === 'analytics' ? 'Database Analytics' :
             dialogType === 'monitor' ? 'Real-time Monitor' :
             dialogType === 'view' ? 'View Details' :
             dialogType === 'edit' ? 'Edit Item' :
             dialogType === 'delete' ? 'Delete Confirmation' :
             'Action Dialog'}
          </Box>
        </DialogTitle>
        <DialogContent className="scrollbar-modern">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {dialogType === 'query' ? 'Build and execute SQL queries with visual interface.' :
             dialogType === 'import' ? 'Import data from various formats (CSV, JSON, SQL).' :
             dialogType === 'export' ? 'Export selected data to different formats.' :
             dialogType === 'backup' ? 'Create a backup of selected database objects.' :
             dialogType === 'analytics' ? 'View comprehensive database performance metrics and analytics.' :
             dialogType === 'monitor' ? 'Monitor database performance and system health in real-time with alerts.' :
             dialogType === 'view' ? 'View detailed information about the selected item.' :
             dialogType === 'edit' ? 'Modify the selected database object.' :
             dialogType === 'delete' ? 'Are you sure you want to delete the selected items?' :
             'Dialog content loading...'}
          </Typography>
          
          {dialogType === 'query' && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Query Builder" />
                <Tab label="Raw SQL" />
                <Tab label="History" />
                <Tab label="Results" />
              </Tabs>
              
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Visual Query Builder</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Table/Collection</InputLabel>
                        <Select label="Table/Collection" defaultValue="">
                          <MenuItem value="users">users</MenuItem>
                          <MenuItem value="employees">employees</MenuItem>
                          <MenuItem value="research_projects">research_projects</MenuItem>
                          <MenuItem value="data_mining_jobs">data_mining_jobs</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Operation</InputLabel>
                        <Select label="Operation" defaultValue="SELECT">
                          <MenuItem value="SELECT">SELECT</MenuItem>
                          <MenuItem value="INSERT">INSERT</MenuItem>
                          <MenuItem value="UPDATE">UPDATE</MenuItem>
                          <MenuItem value="DELETE">DELETE</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Limit"
                        type="number"
                        defaultValue={100}
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Columns to Select:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {['id', 'email', 'name', 'created_at', 'status'].map((col) => (
                      <FormControlLabel
                        key={col}
                        control={<Checkbox size="small" />}
                        label={col}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>WHERE Conditions:</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={3}>
                        <TextField size="small" label="Column" defaultValue="email" />
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl fullWidth size="small">
                          <Select defaultValue="=">
                            <MenuItem value="=">=</MenuItem>
                            <MenuItem value="!=">!=</MenuItem>
                            <MenuItem value=">">&gt;</MenuItem>
                            <MenuItem value="<">&lt;</MenuItem>
                            <MenuItem value="LIKE">LIKE</MenuItem>
                            <MenuItem value="IN">IN</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField size="small" label="Value" placeholder="admin@example.com" />
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl fullWidth size="small">
                          <Select defaultValue="AND">
                            <MenuItem value="AND">AND</MenuItem>
                            <MenuItem value="OR">OR</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Button size="small" startIcon={<AddIcon />}>
                      Add Condition
                    </Button>
                  </Box>
                  
                  <Paper sx={{ p: 2, backgroundColor: 'background.default', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Generated Query:</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      SELECT id, email, name, created_at, status FROM users WHERE email = 'admin@example.com' LIMIT 100;
                    </Typography>
                  </Paper>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    label="SQL Query"
                    placeholder="-- Enter your SQL query here
SELECT * FROM users 
WHERE created_at >= '2024-01-01'
ORDER BY created_at DESC
LIMIT 100;"
                    sx={{ mb: 2, fontFamily: 'monospace' }}
                    InputProps={{
                      sx: { fontFamily: 'monospace', fontSize: '0.9rem' }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button variant="outlined" size="small">Format Query</Button>
                    <Button variant="outlined" size="small">Validate</Button>
                    <Button variant="outlined" size="small">Explain Plan</Button>
                  </Box>
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Query History</Typography>
                  <List>
                    {[
                      { query: "SELECT * FROM users WHERE status = 'active'", time: '10:30 AM', rows: 1542 },
                      { query: "SELECT COUNT(*) FROM employees GROUP BY department", time: '10:15 AM', rows: 8 },
                      { query: "UPDATE research_projects SET status = 'completed' WHERE id = 23", time: '09:45 AM', rows: 1 }
                    ].map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                              {item.query}
                            </Typography>
                          }
                          secondary={`${item.time} • ${item.rows} rows affected`}
                        />
                        <Box>
                          <IconButton size="small">
                            <PlayArrowOutlined />
                          </IconButton>
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Query Results</Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Execute a query to see results here. Last execution: 1,542 rows in 0.023s
                  </Alert>
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>id</TableCell>
                          <TableCell>email</TableCell>
                          <TableCell>name</TableCell>
                          <TableCell>status</TableCell>
                          <TableCell>created_at</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { id: 1, email: 'admin@example.com', name: 'Admin User', status: 'active', created_at: '2024-01-15' },
                          { id: 2, email: 'john@example.com', name: 'John Doe', status: 'active', created_at: '2024-01-16' },
                          { id: 3, email: 'jane@example.com', name: 'Jane Smith', status: 'inactive', created_at: '2024-01-17' }
                        ].map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Chip 
                                label={row.status} 
                                size="small" 
                                color={row.status === 'active' ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell>{row.created_at}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" startIcon={<ExportIcon />}>
                      Export Results
                    </Button>
                    <Button variant="outlined" size="small">
                      Copy to Clipboard
                    </Button>
                  </Box>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                <Button variant="contained" startIcon={<PlayArrowOutlined />}>
                  Execute Query
                </Button>
                <Button variant="outlined" startIcon={<BackupIcon />}>
                  Save Query
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export Plan
                </Button>
              </Box>
            </Box>
          )}
          
          {dialogType === 'import' && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="File Upload" />
                <Tab label="Database Connection" />
                <Tab label="API Import" />
                <Tab label="Schedule" />
              </Tabs>
              
              {tabValue === 0 && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Target Table/Collection</InputLabel>
                        <Select label="Target Table/Collection">
                          <MenuItem value="users">users</MenuItem>
                          <MenuItem value="employees">employees</MenuItem>
                          <MenuItem value="research_projects">research_projects</MenuItem>
                          <MenuItem value="new_table">+ Create New Table</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Import Mode</InputLabel>
                        <Select label="Import Mode" defaultValue="insert">
                          <MenuItem value="insert">Insert New Records</MenuItem>
                          <MenuItem value="upsert">Insert/Update (Upsert)</MenuItem>
                          <MenuItem value="replace">Replace Existing</MenuItem>
                          <MenuItem value="append">Append Only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Paper
                    sx={{
                      p: 4,
                      border: '2px dashed #ccc',
                      textAlign: 'center',
                      mb: 3,
                      backgroundColor: 'background.default',
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                  >
                    <UploadFileOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Drop files here or click to browse
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supported formats: CSV, JSON, SQL, XML, Excel (.xlsx)
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Max file size: 100MB
                    </Typography>
                  </Paper>
                  
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Upload Options:</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Skip first row (headers)"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Validate data before import"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Create backup before import"
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Field Mapping:</Typography>
                  <TableContainer sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Source Field</TableCell>
                          <TableCell>Target Column</TableCell>
                          <TableCell>Data Type</TableCell>
                          <TableCell>Transform</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { source: 'email_address', target: 'email', type: 'VARCHAR', transform: 'lowercase' },
                          { source: 'full_name', target: 'name', type: 'VARCHAR', transform: 'trim' },
                          { source: 'signup_date', target: 'created_at', type: 'TIMESTAMP', transform: 'date_format' }
                        ].map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.source}</TableCell>
                            <TableCell>
                              <TextField size="small" defaultValue={row.target} />
                            </TableCell>
                            <TableCell>
                              <FormControl size="small" sx={{ minWidth: 100 }}>
                                <Select defaultValue={row.type}>
                                  <MenuItem value="VARCHAR">VARCHAR</MenuItem>
                                  <MenuItem value="INTEGER">INTEGER</MenuItem>
                                  <MenuItem value="TIMESTAMP">TIMESTAMP</MenuItem>
                                  <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select defaultValue={row.transform}>
                                  <MenuItem value="none">None</MenuItem>
                                  <MenuItem value="lowercase">Lowercase</MenuItem>
                                  <MenuItem value="trim">Trim</MenuItem>
                                  <MenuItem value="date_format">Date Format</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Database Connection Import</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Database Type</InputLabel>
                        <Select label="Database Type">
                          <MenuItem value="mysql">MySQL</MenuItem>
                          <MenuItem value="postgresql">PostgreSQL</MenuItem>
                          <MenuItem value="mongodb">MongoDB</MenuItem>
                          <MenuItem value="oracle">Oracle</MenuItem>
                          <MenuItem value="mssql">SQL Server</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth size="small" label="Host" placeholder="localhost" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth size="small" label="Port" placeholder="3306" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth size="small" label="Database" placeholder="source_db" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth size="small" label="Username" placeholder="user" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth size="small" label="Password" type="password" placeholder="password" />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button variant="outlined" size="small">Test Connection</Button>
                    <Button variant="outlined" size="small">List Tables</Button>
                  </Box>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Import Query"
                    placeholder="SELECT * FROM source_table WHERE created_at >= '2024-01-01'"
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>API Import</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="API Endpoint"
                        placeholder="https://api.example.com/users"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Method</InputLabel>
                        <Select label="Method" defaultValue="GET">
                          <MenuItem value="GET">GET</MenuItem>
                          <MenuItem value="POST">POST</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Authentication</InputLabel>
                        <Select label="Authentication">
                          <MenuItem value="none">None</MenuItem>
                          <MenuItem value="bearer">Bearer Token</MenuItem>
                          <MenuItem value="basic">Basic Auth</MenuItem>
                          <MenuItem value="api_key">API Key</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Headers (JSON)"
                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Request Body (JSON)"
                    placeholder='{"filter": {"status": "active"}}'
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
              
              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Schedule Import</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Frequency</InputLabel>
                        <Select label="Frequency">
                          <MenuItem value="once">One Time</MenuItem>
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                          <MenuItem value="custom">Custom Cron</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Schedule Time"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                  
                  <FormControlLabel
                    control={<Switch />}
                    label="Send notification on completion"
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    size="small"
                    label="Notification Email"
                    placeholder="admin@example.com"
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
            </Box>
          )}
          
          {dialogType === 'export' && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Quick Export" />
                <Tab label="Custom Query" />
                <Tab label="Scheduled Export" />
                <Tab label="Format Options" />
              </Tabs>
              
              {tabValue === 0 && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Source Table</InputLabel>
                        <Select label="Source Table">
                          <MenuItem value="users">users</MenuItem>
                          <MenuItem value="employees">employees</MenuItem>
                          <MenuItem value="research_projects">research_projects</MenuItem>
                          <MenuItem value="data_mining_jobs">data_mining_jobs</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Export Format</InputLabel>
                        <Select label="Export Format" defaultValue="csv">
                          <MenuItem value="csv">CSV</MenuItem>
                          <MenuItem value="json">JSON</MenuItem>
                          <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                          <MenuItem value="sql">SQL Dump</MenuItem>
                          <MenuItem value="xml">XML</MenuItem>
                          <MenuItem value="parquet">Parquet</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Export Options:</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Include headers"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Compress file"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Split large files"
                      />
                    </Grid>
                  </Grid>
                  
                  <TextField
                    fullWidth
                    size="small"
                    label="Record Limit (optional)"
                    type="number"
                    placeholder="Leave empty for all records"
                    sx={{ mb: 2 }}
                  />
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Estimated export size: ~2.3MB (15,420 records)
                  </Alert>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Custom Export Query"
                    placeholder="SELECT email, name, created_at FROM users WHERE status = 'active' ORDER BY created_at DESC"
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button variant="outlined" size="small">Validate Query</Button>
                    <Button variant="outlined" size="small">Preview Results</Button>
                    <Button variant="outlined" size="small">Estimate Size</Button>
                  </Box>
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Frequency</InputLabel>
                        <Select label="Frequency">
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                          <MenuItem value="custom">Custom Cron</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Export Time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                  
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Delivery Method</InputLabel>
                    <Select label="Delivery Method">
                      <MenuItem value="download">Download Link</MenuItem>
                      <MenuItem value="email">Email Attachment</MenuItem>
                      <MenuItem value="ftp">FTP Upload</MenuItem>
                      <MenuItem value="s3">Amazon S3</MenuItem>
                      <MenuItem value="drive">Google Drive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
              
              {tabValue === 3 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>CSV Options:</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth size="small" label="Delimiter" defaultValue="," />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth size="small" label="Quote Character" defaultValue='"' />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth size="small" label="Escape Character" defaultValue="\\" />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>JSON Options:</Typography>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Pretty print (formatted)"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Include metadata"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Excel Options:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    label="Sheet Name"
                    defaultValue="Export Data"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Auto-fit columns"
                    sx={{ display: 'block' }}
                  />
                </Box>
              )}
            </Box>
          )}
          
          {dialogType === 'backup' && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Create Backup" />
                <Tab label="Schedule Backup" />
                <Tab label="Restore" />
                <Tab label="Backup History" />
              </Tabs>
              
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Create Database Backup</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Backup Type</InputLabel>
                        <Select label="Backup Type" defaultValue="full">
                          <MenuItem value="full">Full Database</MenuItem>
                          <MenuItem value="incremental">Incremental</MenuItem>
                          <MenuItem value="differential">Differential</MenuItem>
                          <MenuItem value="schema_only">Schema Only</MenuItem>
                          <MenuItem value="data_only">Data Only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Compression</InputLabel>
                        <Select label="Compression" defaultValue="gzip">
                          <MenuItem value="none">None</MenuItem>
                          <MenuItem value="gzip">GZIP</MenuItem>
                          <MenuItem value="bzip2">BZIP2</MenuItem>
                          <MenuItem value="lz4">LZ4 (Fast)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Tables/Collections:</Typography>
                  <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto', mb: 2 }} className="scrollbar-modern">
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Select All"
                      sx={{ mb: 1, display: 'block', fontWeight: 600 }}
                    />
                    <Divider sx={{ mb: 1 }} />
                    {['users', 'employees', 'research_projects', 'data_mining_jobs', 'user_sessions', 'analytics_data'].map((table) => (
                      <FormControlLabel
                        key={table}
                        control={<Checkbox defaultChecked />}
                        label={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="body2">{table}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {table === 'users' ? '15.4K records, 2.3MB' :
                               table === 'employees' ? '850 records, 456KB' :
                               table === 'research_projects' ? '234 records, 1.2MB' :
                               table === 'user_sessions' ? '25.4K records, 45MB' :
                               '1.4K records, 3.8MB'}
                            </Typography>
                          </Box>
                        }
                        sx={{ display: 'block', mb: 0.5 }}
                      />
                    ))}
                  </Paper>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Backup Name"
                        defaultValue={`backup_${new Date().toISOString().split('T')[0]}`}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Storage Location</InputLabel>
                        <Select label="Storage Location" defaultValue="local">
                          <MenuItem value="local">Local Storage</MenuItem>
                          <MenuItem value="s3">Amazon S3</MenuItem>
                          <MenuItem value="gcs">Google Cloud Storage</MenuItem>
                          <MenuItem value="azure">Azure Blob Storage</MenuItem>
                          <MenuItem value="ftp">FTP Server</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Advanced Options:</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Include indexes"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Include triggers"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Include stored procedures"
                      />
                    </Grid>
                  </Grid>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Estimated backup size: ~52MB compressed (~180MB uncompressed)
                      <br />Estimated time: 2-3 minutes
                    </Typography>
                  </Alert>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Schedule Automatic Backups</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Frequency</InputLabel>
                        <Select label="Frequency" defaultValue="daily">
                          <MenuItem value="hourly">Hourly</MenuItem>
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                          <MenuItem value="custom">Custom Cron</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Backup Time"
                        type="time"
                        defaultValue="03:00"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Retention Policy:</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Keep Daily Backups"
                        type="number"
                        defaultValue={7}
                        InputProps={{ endAdornment: 'days' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Keep Weekly Backups"
                        type="number"
                        defaultValue={4}
                        InputProps={{ endAdornment: 'weeks' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Keep Monthly Backups"
                        type="number"
                        defaultValue={12}
                        InputProps={{ endAdornment: 'months' }}
                      />
                    </Grid>
                  </Grid>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Send notification on completion"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Send notification on failure"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <TextField
                    fullWidth
                    size="small"
                    label="Notification Email"
                    defaultValue="admin@example.com"
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Restore Database</Typography>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      ⚠️ Restore operations will overwrite existing data. Create a backup before proceeding.
                    </Typography>
                  </Alert>
                  
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Select Backup</InputLabel>
                    <Select label="Select Backup">
                      <MenuItem value="backup_2025_01_24_full">backup_2025_01_24_full.sql.gz (52MB) - Today 03:00</MenuItem>
                      <MenuItem value="backup_2025_01_23_full">backup_2025_01_23_full.sql.gz (51MB) - Yesterday 03:00</MenuItem>
                      <MenuItem value="backup_2025_01_22_full">backup_2025_01_22_full.sql.gz (50MB) - 2 days ago</MenuItem>
                      <MenuItem value="backup_2025_01_21_full">backup_2025_01_21_full.sql.gz (49MB) - 3 days ago</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Restore Options:</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Restore Type</InputLabel>
                        <Select label="Restore Type" defaultValue="full">
                          <MenuItem value="full">Full Restore</MenuItem>
                          <MenuItem value="schema_only">Schema Only</MenuItem>
                          <MenuItem value="data_only">Data Only</MenuItem>
                          <MenuItem value="selective">Selective Tables</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Target Database</InputLabel>
                        <Select label="Target Database" defaultValue="current">
                          <MenuItem value="current">Current Database</MenuItem>
                          <MenuItem value="new">New Database</MenuItem>
                          <MenuItem value="test">Test Database</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Create pre-restore backup"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Drop existing tables before restore"
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Ignore foreign key constraints"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Paper sx={{ p: 2, backgroundColor: 'background.default', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Backup Information:</Typography>
                    <Typography variant="body2">
                      • Created: 2025-01-24 03:00:15 UTC<br />
                      • Size: 52MB compressed (180MB uncompressed)<br />
                      • Tables: 6 tables, 43,234 total records<br />
                      • Integrity: ✅ Verified
                    </Typography>
                  </Paper>
                </Box>
              )}
              
              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Backup History</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      placeholder="Search backups..."
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      }}
                    />
                    <Button variant="outlined" size="small">Filter</Button>
                    <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>
                      Refresh
                    </Button>
                  </Box>
                  
                  <List>
                    {[
                      { 
                        name: 'backup_2025_01_24_full.sql.gz', 
                        date: '2025-01-24 03:00:15', 
                        size: '52MB', 
                        type: 'Full', 
                        status: 'Completed',
                        duration: '2m 34s'
                      },
                      { 
                        name: 'backup_2025_01_23_full.sql.gz', 
                        date: '2025-01-23 03:00:12', 
                        size: '51MB', 
                        type: 'Full', 
                        status: 'Completed',
                        duration: '2m 28s'
                      },
                      { 
                        name: 'backup_2025_01_22_incr.sql.gz', 
                        date: '2025-01-22 15:30:05', 
                        size: '5MB', 
                        type: 'Incremental', 
                        status: 'Completed',
                        duration: '0m 45s'
                      },
                      { 
                        name: 'backup_2025_01_22_full.sql.gz', 
                        date: '2025-01-22 03:00:08', 
                        size: '50MB', 
                        type: 'Full', 
                        status: 'Failed',
                        duration: '1m 12s'
                      }
                    ].map((backup, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <BackupIcon sx={{ 
                            color: backup.status === 'Completed' ? '#388e3c' : 
                                   backup.status === 'Failed' ? '#d32f2f' : '#f57c00'
                          }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {backup.name}
                              </Typography>
                              <Chip 
                                label={backup.status} 
                                size="small" 
                                color={
                                  backup.status === 'Completed' ? 'success' : 
                                  backup.status === 'Failed' ? 'error' : 'warning'
                                }
                              />
                              <Chip label={backup.type} size="small" variant="outlined" />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {backup.date} • {backup.size} • Duration: {backup.duration}
                            </Typography>
                          }
                        />
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Download">
                            <IconButton size="small">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Restore">
                            <IconButton size="small" disabled={backup.status !== 'Completed'}>
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Verify">
                            <IconButton size="small">
                              <SecurityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" sx={{ color: 'error.main' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
          
          {dialogType === 'analytics' && (
            <Box sx={{ mt: 2, maxHeight: '70vh' }}>
              <Box sx={{ display: 'flex', height: '70vh' }}>
                {/* Left Panel - Navigation */}
                <Box sx={{ 
                  width: 240, 
                  bgcolor: mode === 'light' ? '#f8fafc' : '#0f172a',
                  borderRight: '1px solid',
                  borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                  p: 2
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    color: mode === 'light' ? '#64748b' : '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 2
                  }}>
                    Analytics Categories
                  </Typography>
                  
                  {[
                    { id: 'performance', label: 'Query Performance', icon: <SpeedOutlined />, active: true },
                    { id: 'storage', label: 'Storage Metrics', icon: <StorageOutlined /> },
                    { id: 'connections', label: 'Connections', icon: <LinkOutlined /> },
                    { id: 'growth', label: 'Growth Trends', icon: <TrendingUpOutlined /> },
                    { id: 'optimization', label: 'Optimization', icon: <TuneOutlined /> }
                  ].map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        mb: 0.5,
                        bgcolor: item.active ? (mode === 'light' ? '#6366f1' : '#4f46e5') : 'transparent',
                        color: item.active ? 'white' : (mode === 'light' ? '#475569' : '#cbd5e1'),
                        '&:hover': {
                          bgcolor: item.active ? undefined : (mode === 'light' ? '#e2e8f0' : '#374151')
                        }
                      }}
                    >
                      <Box sx={{ '& svg': { fontSize: '1.1rem' } }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Main Content */}
                <Box sx={{ flex: 1, p: 3, overflow: 'auto' }} className="scrollbar-modern">
                  {/* Header Stats */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                      { 
                        title: 'Query Response Time', 
                        value: '2.3ms', 
                        change: '-12%', 
                        positive: true,
                        icon: <SpeedOutlined sx={{ color: '#10b981' }} />
                      },
                      { 
                        title: 'Active Connections', 
                        value: '147', 
                        change: '+8%', 
                        positive: true,
                        icon: <LinkOutlined sx={{ color: '#3b82f6' }} />
                      },
                      { 
                        title: 'Storage Usage', 
                        value: '67.2GB', 
                        change: '+23%', 
                        positive: false,
                        icon: <StorageOutlined sx={{ color: '#f59e0b' }} />
                      },
                      { 
                        title: 'Error Rate', 
                        value: '0.03%', 
                        change: '-45%', 
                        positive: true,
                        icon: <ErrorOutlineOutlined sx={{ color: '#ef4444' }} />
                      }
                    ].map((stat, index) => (
                      <Grid item xs={12} sm={6} lg={3} key={index}>
                        <Paper sx={{
                          p: 2.5,
                          bgcolor: mode === 'light' ? '#ffffff' : '#1e293b',
                          border: '1px solid',
                          borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                          borderRadius: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8',
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}>
                              {stat.title}
                            </Typography>
                            {stat.icon}
                          </Box>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 700,
                            color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                            mb: 0.5
                          }}>
                            {stat.value}  
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={stat.change}
                              size="small"
                              sx={{
                                bgcolor: stat.positive 
                                  ? (mode === 'light' ? '#dcfce7' : '#064e3b')
                                  : (mode === 'light' ? '#fef2f2' : '#7f1d1d'),
                                color: stat.positive
                                  ? (mode === 'light' ? '#166534' : '#4ade80')
                                  : (mode === 'light' ? '#dc2626' : '#f87171'),
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                height: 20
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Charts Row */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Query Performance Chart */}
                    <Grid item xs={12} lg={8}>
                      <Paper sx={{
                        p: 3,
                        bgcolor: mode === 'light' ? '#ffffff' : '#1e293b',
                        border: '1px solid',
                        borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                        borderRadius: 2,
                        height: 350
                      }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                          mb: 2
                        }}>
                          Query Performance Trends
                        </Typography>
                        <Box sx={{ 
                          height: 280,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: mode === 'light' ? '#f8fafc' : '#0f172a',
                          borderRadius: 1,
                          border: '1px dashed',
                          borderColor: mode === 'light' ? '#cbd5e1' : '#475569'
                        }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <TrendingUpOutlined sx={{ 
                              fontSize: 48, 
                              color: mode === 'light' ? '#94a3b8' : '#64748b',
                              mb: 1 
                            }} />
                            <Typography variant="body2" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8' 
                            }}>
                              Interactive chart showing query response times over last 24h
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Top Queries */}
                    <Grid item xs={12} lg={4}>
                      <Paper sx={{
                        p: 3,
                        bgcolor: mode === 'light' ? '#ffffff' : '#1e293b',
                        border: '1px solid',
                        borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                        borderRadius: 2,
                        height: 350
                      }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                          mb: 2
                        }}>
                          Slowest Queries
                        </Typography>
                        <Box className="scrollbar-modern" sx={{ maxHeight: 280, overflow: 'auto' }}>
                          {[
                            { query: 'SELECT * FROM users WHERE created_at > ...', time: '145ms', count: '2.3K' },
                            { query: 'UPDATE orders SET status = ? WHERE id IN ...', time: '89ms', count: '891' },
                            { query: 'SELECT u.*, p.* FROM users u JOIN profiles p ...', time: '67ms', count: '1.2K' },
                            { query: 'DELETE FROM logs WHERE timestamp < ...', time: '45ms', count: '456' },
                            { query: 'INSERT INTO analytics (user_id, event, data) ...', time: '23ms', count: '8.9K' }
                          ].map((item, index) => (
                            <Box key={index} sx={{ 
                              p: 2,
                              mb: 1,
                              bgcolor: mode === 'light' ? '#f8fafc' : '#0f172a',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: mode === 'light' ? '#e2e8f0' : '#334155'
                            }}>
                              <Typography variant="body2" sx={{ 
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                color: mode === 'light' ? '#374151' : '#d1d5db',
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {item.query}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Chip 
                                  label={item.time}
                                  size="small"
                                  sx={{
                                    bgcolor: index < 2 
                                      ? (mode === 'light' ? '#fef2f2' : '#7f1d1d')
                                      : (mode === 'light' ? '#fef3c7' : '#78350f'),
                                    color: index < 2
                                      ? (mode === 'light' ? '#dc2626' : '#f87171')
                                      : (mode === 'light' ? '#d97706' : '#fbbf24'),
                                    fontSize: '0.7rem',
                                    height: 18
                                  }}
                                />
                                <Typography variant="caption" sx={{ 
                                  color: mode === 'light' ? '#64748b' : '#94a3b8',
                                  fontSize: '0.7rem'
                                }}>
                                  {item.count} calls
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Database Objects Overview */}
                  <Paper sx={{
                    p: 3,
                    bgcolor: mode === 'light' ? '#ffffff' : '#1e293b',
                    border: '1px solid',
                    borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                      mb: 3
                    }}>
                      Database Objects Health Overview
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {[
                        { 
                          object: 'users', 
                          type: 'Table', 
                          rows: '2.4M', 
                          size: '1.2GB', 
                          growth: '+2.3%',
                          health: 'excellent',
                          queries: 12450 
                        },
                        { 
                          object: 'orders', 
                          type: 'Table', 
                          rows: '890K', 
                          size: '456MB', 
                          growth: '+5.1%',
                          health: 'good',
                          queries: 8934 
                        },
                        { 
                          object: 'products', 
                          type: 'Table', 
                          rows: '125K', 
                          size: '89MB', 
                          growth: '+1.2%',
                          health: 'excellent',
                          queries: 5623 
                        },
                        { 
                          object: 'analytics_logs', 
                          type: 'Table', 
                          rows: '15.2M', 
                          size: '8.7GB', 
                          growth: '+45%',
                          health: 'warning',
                          queries: 2341 
                        }
                      ].map((item, index) => (
                        <Grid item xs={12} sm={6} lg={3} key={index}>
                          <Box sx={{
                            p: 2.5,
                            bgcolor: mode === 'light' ? '#f8fafc' : '#0f172a',
                            border: '1px solid',
                            borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                            borderRadius: 2,
                            height: '100%'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                                fontFamily: 'monospace'
                              }}>
                                {item.object}
                              </Typography>
                              <Chip 
                                label={item.health}
                                size="small"
                                sx={{
                                  bgcolor: item.health === 'excellent' 
                                    ? (mode === 'light' ? '#dcfce7' : '#064e3b')
                                    : item.health === 'good'
                                    ? (mode === 'light' ? '#dbeafe' : '#1e3a8a')
                                    : (mode === 'light' ? '#fef3c7' : '#78350f'),
                                  color: item.health === 'excellent'
                                    ? (mode === 'light' ? '#166534' : '#4ade80')
                                    : item.health === 'good'
                                    ? (mode === 'light' ? '#2563eb' : '#60a5fa')
                                    : (mode === 'light' ? '#d97706' : '#fbbf24'),
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" sx={{ 
                                color: mode === 'light' ? '#64748b' : '#94a3b8',
                                display: 'block',
                                mb: 0.5
                              }}>
                                {item.type} • {item.rows} rows
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ 
                                color: mode === 'light' ? '#374151' : '#d1d5db',
                                fontSize: '0.8rem'
                              }}>
                                Size: {item.size}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: item.growth.includes('+') 
                                  ? (mode === 'light' ? '#059669' : '#34d399')
                                  : (mode === 'light' ? '#dc2626' : '#f87171'),
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}>
                                {item.growth}
                              </Typography>
                            </Box>

                            <Typography variant="caption" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8'
                            }}>
                              {item.queries.toLocaleString()} queries/day
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}
          
          {dialogType === 'monitor' && (
            <Box sx={{ mt: 2, maxHeight: '70vh' }}>
              <Box sx={{ display: 'flex', height: '70vh' }}>
                {/* Left Panel - Monitoring Categories */}
                <Box sx={{ 
                  width: 240, 
                  bgcolor: mode === 'light' ? '#f8fafc' : '#0f172a',
                  borderRight: '1px solid',
                  borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                  p: 2
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    color: mode === 'light' ? '#64748b' : '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 2
                  }}>
                    Monitoring Panels
                  </Typography>
                  
                  {[
                    { id: 'realtime', label: 'Real-time Metrics', icon: <SpeedOutlined />, active: true },
                    { id: 'alerts', label: 'Active Alerts', icon: <ErrorOutlineOutlined />, count: 3 },
                    { id: 'connections', label: 'Connection Pool', icon: <LinkOutlined /> },
                    { id: 'queries', label: 'Query Monitor', icon: <QueryIcon /> },
                    { id: 'system', label: 'System Resources', icon: <StorageOutlined /> }
                  ].map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        mb: 0.5,
                        bgcolor: item.active ? (mode === 'light' ? '#6366f1' : '#4f46e5') : 'transparent',
                        color: item.active ? 'white' : (mode === 'light' ? '#475569' : '#cbd5e1'),
                        '&:hover': {
                          bgcolor: item.active ? undefined : (mode === 'light' ? '#e2e8f0' : '#374151')
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ '& svg': { fontSize: '1.1rem' } }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                      </Box>
                      {item.count && (
                        <Chip 
                          label={item.count}
                          size="small"
                          sx={{
                            bgcolor: '#ef4444',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 18,
                            minWidth: 18
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Main Content */}
                <Box sx={{ flex: 1, p: 3, overflow: 'auto' }} className="scrollbar-modern">
                  {/* Real-time Status Banner */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    p: 2, 
                    mb: 3,
                    bgcolor: mode === 'light' ? '#dcfce7' : '#064e3b',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: mode === 'light' ? '#22c55e' : '#16a34a'
                  }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: '#22c55e',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.5 }
                      }
                    }} />
                    <Typography variant="h6" sx={{ 
                      color: mode === 'light' ? '#166534' : '#4ade80',
                      fontWeight: 600 
                    }}>
                      System Status: HEALTHY → Real-time monitoring active
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: mode === 'light' ? '#15803d' : '#86efac',
                      ml: 'auto' 
                    }}>
                      Last updated: {new Date().toLocaleTimeString()}
                    </Typography>
                  </Box>

                  {/* Critical Metrics Row */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      { 
                        title: 'CPU Usage', 
                        value: '23%', 
                        status: 'normal',
                        icon: <TuneOutlined />,
                        trend: 'stable'
                      },
                      { 
                        title: 'Memory', 
                        value: '67%', 
                        status: 'warning',
                        icon: <StorageOutlined />,
                        trend: 'increasing'
                      },
                      { 
                        title: 'Active Queries', 
                        value: '12', 
                        status: 'normal',
                        icon: <QueryIcon />,
                        trend: 'decreasing'
                      },
                      { 
                        title: 'Response Time', 
                        value: '1.8ms', 
                        status: 'excellent',
                        icon: <SpeedOutlined />,
                        trend: 'stable'
                      }
                    ].map((metric, index) => (
                      <Grid item xs={12} sm={6} lg={3} key={index}>
                        <Paper sx={{
                          p: 2,
                          bgcolor: mode === 'light' ? '#ffffff' : '#1e293b',
                          border: '2px solid',
                          borderColor: metric.status === 'excellent' 
                            ? '#22c55e'
                            : metric.status === 'normal'
                            ? '#3b82f6'
                            : metric.status === 'warning'
                            ? '#f59e0b'
                            : '#ef4444',
                          borderRadius: 2,
                          position: 'relative'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'uppercase'
                            }}>
                              {metric.title}
                            </Typography>
                            <Box sx={{ color: metric.status === 'excellent' 
                              ? '#22c55e'
                              : metric.status === 'normal'
                              ? '#3b82f6'
                              : metric.status === 'warning'
                              ? '#f59e0b'
                              : '#ef4444'
                            }}>
                              {metric.icon}
                            </Box>
                          </Box>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 700,
                            color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                            mb: 1
                          }}>
                            {metric.value}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Chip 
                              label={metric.status.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: metric.status === 'excellent' 
                                  ? (mode === 'light' ? '#dcfce7' : '#064e3b')
                                  : metric.status === 'normal'
                                  ? (mode === 'light' ? '#dbeafe' : '#1e3a8a')
                                  : metric.status === 'warning'
                                  ? (mode === 'light' ? '#fef3c7' : '#78350f')
                                  : (mode === 'light' ? '#fef2f2' : '#7f1d1d'),
                                color: metric.status === 'excellent'
                                  ? (mode === 'light' ? '#166534' : '#4ade80')
                                  : metric.status === 'normal'
                                  ? (mode === 'light' ? '#2563eb' : '#60a5fa')
                                  : metric.status === 'warning'
                                  ? (mode === 'light' ? '#d97706' : '#fbbf24')
                                  : (mode === 'light' ? '#dc2626' : '#f87171'),
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                height: 18
                              }}
                            />
                            <Typography variant="caption" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8',
                              fontSize: '0.7rem'
                            }}>
                              {metric.trend}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Active Alerts Section */}
                  <Paper sx={{
                    p: 3,
                    mb: 3,
                    bgcolor: mode === 'light' ? '#ffffff' : '#1e293b',
                    border: '1px solid',
                    borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                    borderRadius: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: mode === 'light' ? '#1e293b' : '#f1f5f9'
                      }}>
                        Active Alerts (3)
                      </Typography>
                      <Button variant="outlined" size="small" startIcon={<SettingsIcon />}>
                        Configure
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        {
                          level: 'warning',
                          title: 'High Memory Usage',
                          description: 'Memory usage is at 67% and trending upward',
                          time: '2 minutes ago',
                          action: 'Scale resources'
                        },
                        {
                          level: 'info',
                          title: 'Backup Completed',
                          description: 'Scheduled backup finished successfully (52MB)',
                          time: '15 minutes ago',
                          action: 'View details'
                        },
                        {
                          level: 'error',
                          title: 'Connection Failed',
                          description: 'Failed to connect to replica node db-replica-2',
                          time: '1 hour ago',
                          action: 'Investigate'
                        }
                      ].map((alert, index) => (
                        <Box key={index} sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alert.level === 'error' 
                            ? '#ef4444'
                            : alert.level === 'warning'
                            ? '#f59e0b'
                            : '#3b82f6',
                          bgcolor: alert.level === 'error' 
                            ? (mode === 'light' ? '#fef2f2' : '#7f1d1d')
                            : alert.level === 'warning'
                            ? (mode === 'light' ? '#fef3c7' : '#78350f')
                            : (mode === 'light' ? '#dbeafe' : '#1e3a8a')
                        }}>
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: alert.level === 'error' 
                              ? '#ef4444'
                              : alert.level === 'warning'
                              ? '#f59e0b'
                              : '#3b82f6',
                            flexShrink: 0
                          }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ 
                              fontWeight: 600,
                              color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                              mb: 0.5
                            }}>
                              {alert.title}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: mode === 'light' ? '#475569' : '#cbd5e1',
                              fontSize: '0.85rem',
                              mb: 0.5
                            }}>
                              {alert.description}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8'
                            }}>
                              {alert.time}
                            </Typography>
                          </Box>
                          <Button 
                            variant="outlined" 
                            size="small"
                            sx={{
                              borderColor: alert.level === 'error' 
                                ? '#ef4444'
                                : alert.level === 'warning'
                                ? '#f59e0b'
                                : '#3b82f6',
                              color: alert.level === 'error' 
                                ? '#ef4444'
                                : alert.level === 'warning'
                                ? '#f59e0b'
                                : '#3b82f6'
                            }}
                          >
                            {alert.action}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Paper>

                  {/* Live Query Monitor */}
                  <Paper sx={{
                    p: 3,
                    bgcolor: mode === 'light' ? '#ffffff' : '#1e293b',
                    border: '1px solid',
                    borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                      mb: 2
                    }}>
                      Live Query Monitor
                    </Typography>
                    
                    <Box className="scrollbar-modern" sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {[
                        { query: 'SELECT * FROM users WHERE last_login > NOW() - INTERVAL 1 DAY', status: 'running', duration: '1.2s', user: 'admin' },
                        { query: 'UPDATE orders SET status = "completed" WHERE id IN (1001, 1002, 1003)', status: 'completed', duration: '0.8s', user: 'system' },
                        { query: 'INSERT INTO analytics_events (user_id, event_type, timestamp) VALUES...', status: 'running', duration: '0.3s', user: 'app_user' },
                        { query: 'DELETE FROM temp_logs WHERE created_at < NOW() - INTERVAL 7 DAY', status: 'queued', duration: '-', user: 'cleanup_job' },
                        { query: 'SELECT COUNT(*) FROM products WHERE category = "electronics" AND in_stock > 0', status: 'completed', duration: '0.1s', user: 'frontend' }
                      ].map((query, index) => (
                        <Box key={index} sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          mb: 1,
                          borderRadius: 1,
                          bgcolor: mode === 'light' ? '#f8fafc' : '#0f172a',
                          border: '1px solid',
                          borderColor: mode === 'light' ? '#e2e8f0' : '#334155'
                        }}>
                          <Chip 
                            label={query.status}
                            size="small"
                            sx={{
                              bgcolor: query.status === 'running' 
                                ? (mode === 'light' ? '#fef3c7' : '#78350f')
                                : query.status === 'completed'
                                ? (mode === 'light' ? '#dcfce7' : '#064e3b')
                                : (mode === 'light' ? '#f3f4f6' : '#374151'),
                              color: query.status === 'running'
                                ? (mode === 'light' ? '#d97706' : '#fbbf24')
                                : query.status === 'completed'
                                ? (mode === 'light' ? '#166534' : '#4ade80')
                                : (mode === 'light' ? '#374151' : '#d1d5db'),
                              fontSize: '0.7rem',
                              width: 80,
                              justifyContent: 'center'
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ 
                              fontFamily: 'monospace',
                              fontSize: '0.8rem',
                              color: mode === 'light' ? '#374151' : '#d1d5db',
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {query.query}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8'
                            }}>
                              User: {query.user} • Duration: {query.duration}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">
            {dialogType === 'delete' ? 'Delete' : 'Execute'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DatabaseManagerPage;