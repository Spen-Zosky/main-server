import React, { useState, useEffect } from 'react';
import { serviceManagerApi } from '../services/serviceManagerApi';
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
  MenuItem
} from '@mui/material';
import {
  ArrowBackOutlined as BackIcon,
  RefreshOutlined as RefreshIcon,
  FolderOutlined as FolderIcon,
  ArchiveOutlined as BackupIcon,
  DescriptionOutlined as LogIcon,
  CameraAltOutlined as SnapshotIcon,
  HistoryOutlined as RollbackIcon,
  ViewListOutlined as StageIcon,
  InfoOutlined as InspectIcon,
  DownloadOutlined as DownloadIcon,
  DeleteOutlined as DeleteIcon,
  VisibilityOutlined as PreviewIcon,
  SearchOutlined as SearchIcon,
  FilterListOutlined as FilterIcon,
  CheckBoxOutlined as SelectIcon,
  MoreVertOutlined as MoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

// Directory Classes Configuration based on dummy.txt analysis
const DIRECTORY_CLASSES = {
  backups: {
    name: 'Backups',
    icon: <BackupIcon />,
    path: '/home/ubuntu/main-server/backups/',
    description: 'Session backups and archives',
    color: '#1976d2',
    size: '3.7MB',
    fileCount: 18,
    types: ['tar.gz', 'txt']
  },
  'development-logs': {
    name: 'Development Logs',
    icon: <LogIcon />,
    path: '/home/ubuntu/main-server/development-logs/',
    description: 'Application and development logs',
    color: '#388e3c',
    size: '1.2KB',
    fileCount: 1,
    types: ['log', 'txt']
  },
  'development-snapshots': {
    name: 'Development Snapshots',
    icon: <SnapshotIcon />,
    path: '/home/ubuntu/main-server/development-snapshots/',
    description: 'Code snapshots and checkpoints',
    color: '#f57c00',
    size: '0.1KB',
    fileCount: 1,
    types: ['json', 'config']
  },
  'rollback-history': {
    name: 'Rollback History',
    icon: <RollbackIcon />,
    path: '/home/ubuntu/main-server/rollback-history/',
    description: 'Version rollback operations',
    color: '#d32f2f',
    size: '0.2KB',
    fileCount: 1,
    types: ['txt', 'rollback']
  },
  'stage-snapshots': {
    name: 'Stage Snapshots',
    icon: <StageIcon />,
    path: '/home/ubuntu/main-server/STAGE_SNAPSHOTS/',
    description: 'Stage deployment states',
    color: '#7b1fa2',
    size: '0.1KB',
    fileCount: 1,
    types: ['json', 'stage']
  }
};

// This will be populated from API calls

function ServiceManagerPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [selectedClass, setSelectedClass] = useState('backups');
  const [selectedItem, setSelectedItem] = useState(null);
  const [inspectDialogOpen, setInspectDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [directoryInfo, setDirectoryInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [inspectorContent, setInspectorContent] = useState(null);

  const currentClass = DIRECTORY_CLASSES[selectedClass];

  // Load directory contents when selectedClass changes
  useEffect(() => {
    loadDirectoryContents();
  }, [selectedClass]);

  const loadDirectoryContents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceManagerApi.getDirectoryContents(selectedClass);
      
      if (result && result.success && result.data && result.data.files) {
        setCurrentFiles(result.data.files);
        setDirectoryInfo(result.data);
        
        // Update DIRECTORY_CLASSES with real data
        DIRECTORY_CLASSES[selectedClass].fileCount = result.data.totalFiles || result.data.files.length;
        DIRECTORY_CLASSES[selectedClass].size = result.data.totalSize;
      } else {
        let errorMessage = result?.error || 'Invalid API response structure';
        if (result?.details) {
          if (result.details.timeout) {
            errorMessage += ' (Request timed out)';
          } else if (result.details.network) {
            errorMessage += ' (Network error)';
          } else if (result.details.status) {
            errorMessage += ` (HTTP ${result.details.status})`;
          }
        }
        setError(errorMessage);
        setCurrentFiles([]);
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
      setCurrentFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInspect = async (item) => {
    setSelectedItem(item);
    setInspectorContent(null);
    
    // Check if file is previewable (text files)
    const previewableExtensions = ['.txt', '.md', '.json', '.log', '.csv', '.js', '.jsx', '.ts', '.tsx', '.html', '.css'];
    const fileExtension = item.name.toLowerCase().substring(item.name.lastIndexOf('.'));
    
    if (previewableExtensions.includes(fileExtension)) {
      try {
        const result = await serviceManagerApi.previewFile(selectedClass, item.name);
        if (result.success) {
          setInspectorContent(result.data);
        }
      } catch (err) {
        console.error('Error loading file content for inspector:', err);
      }
    }
    
    setInspectDialogOpen(true);
  };

  const handleRefresh = () => {
    loadDirectoryContents();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDirectoryContents();
      return;
    }

    setLoading(true);
    try {
      const result = await serviceManagerApi.searchFiles(selectedClass, searchQuery);
      if (result.success) {
        setCurrentFiles(result.data.files);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item) => {
    try {
      const result = await serviceManagerApi.downloadFile(selectedClass, item.name);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      return;
    }

    try {
      const result = await serviceManagerApi.deleteFile(selectedClass, item.name);
      if (result.success) {
        // Refresh the directory contents
        loadDirectoryContents();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePreview = async (item) => {
    try {
      const result = await serviceManagerApi.previewFile(selectedClass, item.name);
      if (result.success) {
        setPreviewContent(result.data);
        setPreviewDialogOpen(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkSelect = (fileName) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileName)) {
        return prev.filter(f => f !== fileName);
      } else {
        return [...prev, fileName];
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      return;
    }

    try {
      const result = await serviceManagerApi.bulkDelete(selectedClass, selectedFiles);
      if (result.success) {
        setSelectedFiles([]);
        setBulkMode(false);
        loadDirectoryContents();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const result = await serviceManagerApi.bulkDownload(selectedClass, selectedFiles);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
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
      case 'baseline': return '#1976d2';
      case 'stable': return '#388e3c';
      case 'active': return '#f57c00';
      case 'completed': return '#7b1fa2';
      default: return '#666';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('it-IT');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
      display: 'flex'
    }} className="scrollbar-modern">
      {/* AWS/OCI Style Sidebar */}
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
              Service Manager
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage development resources and archives
          </Typography>
        </Box>

        {/* Directory Classes Navigation */}
        <List sx={{ p: 0 }}>
          {Object.entries(DIRECTORY_CLASSES).map(([key, classData]) => (
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
                      {classData.size} • {classData.fileCount} items
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Sidebar Footer - Storage Info */}
        <Box sx={{ mt: 'auto', p: 2, borderTop: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333' }}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: mode === 'light' ? '#e3f2fd' : '#1a237e20',
              border: mode === 'light' ? '1px solid #bbdefb' : '1px solid #1a237e'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Total Storage: 3.7MB
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={25} 
              sx={{ mt: 1, height: 4, borderRadius: 2 }}
            />
          </Paper>
        </Box>
      </Paper>

      {/* Main Content Panel */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Bar with Commands */}
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
            <Typography color="text.secondary" variant="body2">Service Manager</Typography>
            <Typography color="primary" variant="body2" sx={{ fontWeight: 600 }}>
              {currentClass.name}
            </Typography>
          </Breadcrumbs>

          {/* Action Commands */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <TextField
              size="small"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 200 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterIcon />}
            >
              Filter
            </Button>
            <Button
              variant={bulkMode ? "contained" : "outlined"}
              size="small"
              startIcon={<SelectIcon />}
              onClick={() => {
                setBulkMode(!bulkMode);
                if (bulkMode) {
                  setSelectedFiles([]);
                }
              }}
            >
              {bulkMode ? 'Exit Select' : 'Select Multiple'}
            </Button>
            {bulkMode && selectedFiles.length > 0 && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={handleBulkDelete}
                >
                  Delete ({selectedFiles.length})
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleBulkDownload}
                >
                  Download ({selectedFiles.length})
                </Button>
              </>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              label={`${currentFiles.length} items`}
              size="small"
              variant="outlined"
            />
          </Box>

          {loading && <LinearProgress sx={{ mt: 1 }} />}
        </Paper>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: 2 }}>
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
                    {currentClass.description} • {currentClass.path}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* File Table */}
            {currentFiles.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {bulkMode && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedFiles.length > 0 && selectedFiles.length < currentFiles.length}
                            checked={currentFiles.length > 0 && selectedFiles.length === currentFiles.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles(currentFiles.map(f => f.name));
                              } else {
                                setSelectedFiles([]);
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>Name</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Modified</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentFiles.map((file) => (
                      <TableRow
                        key={file.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        selected={selectedFiles.includes(file.name)}
                      >
                        {bulkMode && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedFiles.includes(file.name)}
                              onChange={() => handleBulkSelect(file.name)}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {file.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{file.sizeFormatted || file.size}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={file.type}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={file.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(file.status)}15`,
                              color: getStatusColor(file.status),
                              border: `1px solid ${getStatusColor(file.status)}30`
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatTimestamp(file.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Inspect">
                              <IconButton
                                size="small"
                                onClick={() => handleInspect(file)}
                              >
                                <InspectIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                onClick={() => handleDownload(file)}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(file)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Preview">
                              <IconButton
                                size="small"
                                onClick={() => handlePreview(file)}
                              >
                                <PreviewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Directory is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This directory is ready for use but contains no files currently.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Inspection Dialog */}
      <Dialog
        open={inspectDialogOpen}
        onClose={() => setInspectDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InspectIcon />
            File Inspector
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom>
                {selectedItem.name}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedItem.description}
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">Size</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedItem.size}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">Type</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedItem.type}
                    </Typography>
                  </Paper>
                </Box>

                {selectedItem.metadata && (
                  <Paper sx={{ p: 2, backgroundColor: 'background.default', mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Metadata</Typography>
                    {Object.entries(selectedItem.metadata).map(([key, value]) => (
                      <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {key}:
                        </Typography>
                        <Typography variant="caption">
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                )}

              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInspectDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={() => selectedItem && handleDownload(selectedItem)}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PreviewIcon />
            File Preview
            {previewContent && (
              <Chip
                label={previewContent.filename}
                size="small"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent className="scrollbar-modern">
          {previewContent && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={`${previewContent.lines} lines`} size="small" />
                <Chip label={formatBytes(previewContent.size)} size="small" />
                <Chip label={previewContent.type} size="small" />
              </Box>
              <Paper
                className="scrollbar-modern"
                sx={{
                  p: 2,
                  backgroundColor: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
                  border: '1px solid',
                  borderColor: mode === 'light' ? '#e0e0e0' : '#333',
                  maxHeight: '60vh',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {previewContent.content}
                </pre>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
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

export default ServiceManagerPage;