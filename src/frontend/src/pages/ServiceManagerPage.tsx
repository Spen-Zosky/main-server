import React, { useState, useEffect } from 'react';
// import { serviceManagerApi } from '../services/serviceManagerApi'; // TODO: Remove when implemented
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
  // Divider, // TODO: Remove when used
  Breadcrumbs,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  // Folder as FolderIcon, // TODO: Remove when used
  InsertDriveFile as FileIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Backup as BackupIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

// Directory Classes Configuration
const DIRECTORY_CLASSES = {
  backups: {
    name: 'Backups',
    icon: BackupIcon,
    path: './backups/',
    description: 'Session backups and archives',
    color: '#1976d2',
    size: '3.7MB',
    fileCount: 18,
    types: ['tar.gz', 'txt']
  },
  'development-logs': {
    name: 'Development Logs',
    icon: FileIcon,
    path: './development-logs/',
    description: 'Application and development logs',
    color: '#388e3c',
    size: '1.2KB',
    fileCount: 5,
    types: ['log', 'txt']
  },
  'development-snapshots': {
    name: 'Development Snapshots',
    icon: StorageIcon,
    path: './development-snapshots/',
    description: 'Code snapshots and checkpoints',
    color: '#f57c00',
    size: '0.1KB',
    fileCount: 2,
    types: ['json', 'config']
  },
  'rollback-history': {
    name: 'Rollback History',
    icon: RefreshIcon,
    path: './rollback-history/',
    description: 'Version rollback operations',
    color: '#d32f2f',
    size: '0.2KB',
    fileCount: 3,
    types: ['txt', 'rollback']
  },
  'stage-snapshots': {
    name: 'Stage Snapshots',
    icon: SettingsIcon,
    path: './STAGE_SNAPSHOTS/',
    description: 'Stage deployment states',
    color: '#7b1fa2',
    size: '0.1KB',
    fileCount: 1,
    types: ['json']
  }
};

function ServiceManagerPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [selectedClass, setSelectedClass] = useState('backups');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentClass = DIRECTORY_CLASSES[selectedClass];

  const loadDirectoryContents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for demo
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch {
      setError('Failed to load directory contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectoryContents();
  }, [selectedClass]);

  // const formatTimestamp = (timestamp) => {
  //   return new Date(timestamp).toLocaleString('it-IT');
  // }; // TODO: Remove when used

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 300,
          minHeight: '100vh',
          borderRadius: 0,
          borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333'
        }}
      >
        <Box sx={{ p: 2, borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/')}
              sx={{ color: 'text.secondary' }}
            >
              <BackIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Service Manager
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage system directories and files
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {Object.entries(DIRECTORY_CLASSES).map(([key, classData]) => (
            <ListItem
              key={key}
              button
              selected={selectedClass === key}
              onClick={() => setSelectedClass(key)}
              sx={{
                py: 1.5,
                borderLeft: selectedClass === key ? `3px solid ${classData.color}` : '3px solid transparent',
                backgroundColor: selectedClass === key ? `${classData.color}15` : 'transparent'
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedClass === key ? classData.color : 'text.secondary',
                minWidth: 36
              }}>
                <classData.icon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: selectedClass === key ? 600 : 400 }}>
                    {classData.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {classData.fileCount} files • {classData.size}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 0,
            borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
            backgroundColor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: currentClass.color,
                color: 'white'
              }}
            >
              <currentClass.icon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {currentClass.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentClass.description}
              </Typography>
            </Box>
          </Box>

          <Breadcrumbs sx={{ fontSize: '0.875rem' }}>
            <Button
              startIcon={<HomeIcon />}
              sx={{ textTransform: 'none', minHeight: 'auto', p: 0.5 }}
              size="small"
            >
              Home
            </Button>
            <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
              {currentClass.name}
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* Content Area */}
        <Box sx={{ flex: 1, p: 3 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Directory Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Path: {currentClass.path}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Size: {currentClass.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Files: {currentClass.fileCount}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {currentClass.types.map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ServiceManagerPage;