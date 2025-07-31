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
      case 'users':
        return [
          { id: 1, username: 'admin', role: 'super_admin', permissions: ['ALL'], lastLogin: '2025-01-24T11:30:00', status: 'active' },
          { id: 2, username: 'hr_manager', role: 'hr_admin', permissions: ['HR_READ', 'HR_WRITE'], lastLogin: '2025-01-24T10:15:00', status: 'active' },
          { id: 3, username: 'researcher', role: 'research_user', permissions: ['RESEARCH_READ', 'RESEARCH_WRITE'], lastLogin: '2025-01-23T15:45:00', status: 'active' }
        ];
      case 'schemas':
        return [
          { id: 1, name: 'hr_system', tables: 8, size: '15MB', version: '2.1.0', status: 'active', lastUpdated: '2025-01-20T14:30:00' },
          { id: 2, name: 'research_platform', tables: 12, size: '45MB', version: '1.8.2', status: 'active', lastUpdated: '2025-01-22T09:15:00' },
          { id: 3, name: 'analytics_engine', tables: 6, size: '120MB', version: '3.0.1', status: 'active', lastUpdated: '2025-01-24T11:00:00' }
        ];
      case 'backups':
        return [
          { id: 1, name: 'daily_backup_2025_01_24', type: 'Full', size: '2.8GB', status: 'completed', created: '2025-01-24T02:00:00', retention: '30 days' },
          { id: 2, name: 'weekly_backup_2025_01_21', type: 'Incremental', size: '450MB', status: 'completed', created: '2025-01-21T02:00:00', retention: '90 days' },
          { id: 3, name: 'monthly_backup_2025_01_01', type: 'Full', size: '2.5GB', status: 'completed', created: '2025-01-01T02:00:00', retention: '1 year' }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    setCurrentData(getMockData());
  }, [selectedClass]);

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setSelectedItems([]);
    setSearchQuery('');
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map(item => item.id));
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentData(getMockData());
    setLoading(false);
  };

  const handleAction = (action) => {
    setDialogType(action);
    setDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'optimized': return 'primary';
      case 'secured': return 'secondary';
      case 'healthy': return 'success';
      case 'monitoring': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const renderClassCard = (classKey, classData) => (
    <Card 
      key={classKey}
      sx={{ 
        cursor: 'pointer',
        border: selectedClass === classKey ? 2 : 1,
        borderColor: selectedClass === classKey ? classData.color : 'divider',
        '&:hover': { 
          borderColor: classData.color,
          boxShadow: 2
        }
      }}
      onClick={() => handleClassSelect(classKey)}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Box 
              sx={{ 
                color: classData.color, 
                mr: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {classData.icon}
            </Box>
            <Box>
              <Typography variant="h6" component="div">
                {classData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {classData.description}
              </Typography>
            </Box>
          </Box>
          <Box textAlign="right">
            <Typography variant="h4" sx={{ color: classData.color }}>
              {classData.count}
            </Typography>
            <Chip 
              label={classData.status} 
              size="small" 
              color={getStatusColor(classData.status)}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderDataTable = () => {
    const filteredData = currentData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedItems.length > 0 && selectedItems.length < filteredData.length}
                  checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {selectedClass === 'tables' && (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Rows</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Engine</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Modified</TableCell>
                </>
              )}
              {selectedClass === 'collections' && (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Documents</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Engine</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Modified</TableCell>
                </>
              )}
              {selectedClass === 'indexes' && (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Table</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Columns</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Efficiency</TableCell>
                  <TableCell>Status</TableCell>
                </>
              )}
              {selectedClass === 'relations' && (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>From Table</TableCell>
                  <TableCell>To Table</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Constraint</TableCell>
                  <TableCell>Status</TableCell>
                </>
              )}
              {selectedClass === 'users' && (
                <>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Status</TableCell>
                </>
              )}
              {selectedClass === 'schemas' && (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Tables</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Updated</TableCell>
                </>
              )}
              {selectedClass === 'backups' && (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Retention</TableCell>
                </>
              )}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                  />
                </TableCell>
                {selectedClass === 'tables' && (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.rows.toLocaleString()}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.engine}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                    <TableCell>{new Date(item.lastModified).toLocaleString()}</TableCell>
                  </>
                )}
                {selectedClass === 'collections' && (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.documents.toLocaleString()}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.engine}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                    <TableCell>{new Date(item.lastModified).toLocaleString()}</TableCell>
                  </>
                )}
                {selectedClass === 'indexes' && (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.table}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.columns.join(', ')}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.efficiency}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                  </>
                )}
                {selectedClass === 'relations' && (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.fromTable}</TableCell>
                    <TableCell>{item.toTable}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.constraint}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                  </>
                )}
                {selectedClass === 'users' && (
                  <>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.permissions.join(', ')}</TableCell>
                    <TableCell>{new Date(item.lastLogin).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                  </>
                )}
                {selectedClass === 'schemas' && (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.tables}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.version}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleString()}</TableCell>
                  </>
                )}
                {selectedClass === 'backups' && (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                    </TableCell>
                    <TableCell>{new Date(item.created).toLocaleString()}</TableCell>
                    <TableCell>{item.retention}</TableCell>
                  </>
                )}
                <TableCell>
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => handleAction('view')}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleAction('edit')}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleAction('delete')}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Database Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage database objects, users, and performance
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAction('create')}
          >
            Create New
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Database Classes Grid */}
      <Typography variant="h6" gutterBottom>
        Database Objects
      </Typography>
      <Grid container spacing={3} mb={4}>
        {Object.entries(DATABASE_CLASSES).map(([key, data]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
            {renderClassCard(key, data)}
          </Grid>
        ))}
      </Grid>

      {/* Performance Dashboard */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Metrics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">{performanceData.connections}</Typography>
              <Typography variant="body2" color="text.secondary">Active Connections</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="secondary">{performanceData.queriesPerSecond}</Typography>
              <Typography variant="body2" color="text.secondary">Queries/Second</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">{performanceData.avgResponseTime}</Typography>
              <Typography variant="body2" color="text.secondary">Avg Response Time</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main">{performanceData.cacheHitRatio}</Typography>
              <Typography variant="body2" color="text.secondary">Cache Hit Ratio</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Current Class Data */}
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {currentClass.name} ({currentData.length})
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            {selectedItems.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleAction('bulkDelete')}
              >
                Delete Selected ({selectedItems.length})
              </Button>
            )}
          </Box>
        </Box>
        {renderDataTable()}
      </Paper>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'create' && `Create New ${currentClass.name}`}
          {dialogType === 'edit' && `Edit ${currentClass.name}`}
          {dialogType === 'delete' && `Delete ${currentClass.name}`}
          {dialogType === 'bulkDelete' && `Delete ${selectedItems.length} Items`}
          {dialogType === 'view' && `View ${currentClass.name}`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {dialogType === 'create' && `Create new ${currentClass.name.toLowerCase()} functionality would be implemented here.`}
            {dialogType === 'edit' && `Edit ${currentClass.name.toLowerCase()} functionality would be implemented here.`}
            {dialogType === 'delete' && `Are you sure you want to delete this ${currentClass.name.toLowerCase()}?`}
            {dialogType === 'bulkDelete' && `Are you sure you want to delete ${selectedItems.length} selected items?`}
            {dialogType === 'view' && `View ${currentClass.name.toLowerCase()} details would be shown here.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          {(dialogType === 'delete' || dialogType === 'bulkDelete') && (
            <Button color="error" variant="contained">
              Delete
            </Button>
          )}
          {dialogType === 'create' && (
            <Button variant="contained">
              Create
            </Button>
          )}
          {dialogType === 'edit' && (
            <Button variant="contained">
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DatabaseManagerPage;