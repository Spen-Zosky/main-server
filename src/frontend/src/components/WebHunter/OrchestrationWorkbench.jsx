import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
  Stepper,
  Step,
  StepLabel,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Visibility as ViewIcon,
  Hub as HubIcon,
  AccountTree as WorkflowIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const OrchestrationWorkbench = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platforms: [],
    orchestrationRules: {
      sequencing: 'parallel',
      errorHandling: 'retry',
      dataFlowType: 'fusion'
    },
    valueServices: {
      dataFusion: true,
      aiEnhancement: true,
      analytics: true,
      reporting: true
    },
    schedule: {
      type: 'manual',
      frequency: '',
      enabled: false
    }
  });

  const steps = [
    'Basic Configuration',
    'Platform Selection', 
    'Orchestration Rules',
    'Value Services',
    'Schedule & Deploy'
  ];

  const availablePlatforms = [
    { id: 'bright-data', name: 'Bright Data Network', category: 'Scraping', capabilities: ['Proxy Rotation', 'Geo-targeting'] },
    { id: 'firecrawl', name: 'Firecrawl AI Engine', category: 'AI Scraping', capabilities: ['Content Extraction', 'Schema Recognition'] },
    { id: 'arxiv', name: 'ArXiv Research API', category: 'Academic', capabilities: ['Research Papers', 'Metadata'] },
    { id: 'openalex', name: 'OpenAlex Research', category: 'Academic', capabilities: ['Author Networks', 'Citations'] },
    { id: 'aws-ai', name: 'AWS AI Services', category: 'AI Processing', capabilities: ['NLP', 'Entity Recognition'] },
    { id: 'elasticsearch', name: 'Elasticsearch Analytics', category: 'Analytics', capabilities: ['Search', 'Aggregations'] }
  ];

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      // Mock data representing orchestration workflows
      setWorkflows([
        {
          id: '1',
          name: 'Multi-Source Academic Research',
          description: 'Combines ArXiv, OpenAlex, and AWS AI for comprehensive research intelligence',
          status: 'running',
          progress: 65,
          platforms: ['ArXiv Research API', 'OpenAlex Research', 'AWS AI Services'],
          startTime: '2025-01-30T10:30:00Z',
          orchestrationRules: {
            sequencing: 'sequential',
            errorHandling: 'retry',
            dataFlowType: 'fusion'
          },
          valueServices: ['Data Fusion', 'AI Enhancement', 'Analytics'],
          metrics: {
            recordsProcessed: 1250,
            recordsEnhanced: 1180,
            insightsGenerated: 45,
            correlationsFound: 12
          }
        },
        {
          id: '2',
          name: 'E-commerce Intelligence Fusion',
          description: 'Orchestrates web scraping platforms with AI processing for market intelligence',
          status: 'completed',
          progress: 100,
          platforms: ['Bright Data Network', 'Firecrawl AI Engine', 'Elasticsearch Analytics'],
          startTime: '2025-01-30T09:00:00Z',
          endTime: '2025-01-30T09:45:00Z',
          orchestrationRules: {
            sequencing: 'parallel',
            errorHandling: 'continue',
            dataFlowType: 'aggregation'
          },
          valueServices: ['Data Fusion', 'Analytics', 'Reporting'],
          metrics: {
            recordsProcessed: 3400,
            recordsEnhanced: 3400,
            insightsGenerated: 89,
            correlationsFound: 23
          }
        },
        {
          id: '3',
          name: 'Government Data Correlation',
          description: 'Multi-platform workflow for institutional data analysis and correlation',
          status: 'queued',
          progress: 0,
          platforms: ['Official APIs', 'AWS AI Services', 'Elasticsearch Analytics'],
          scheduledTime: '2025-01-30T12:00:00Z',
          orchestrationRules: {
            sequencing: 'sequential',
            errorHandling: 'stop',
            dataFlowType: 'correlation'
          },
          valueServices: ['Data Fusion', 'AI Enhancement', 'Analytics', 'Reporting'],
          metrics: {
            recordsProcessed: 0,
            recordsEnhanced: 0,
            insightsGenerated: 0,
            correlationsFound: 0
          }
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'queued': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <PlayArrowIcon />;
      case 'completed': return <CheckCircleIcon />;
      case 'queued': return <ScheduleIcon />;
      case 'error': return <ErrorIcon />;
      default: return null;
    }
  };

  const handlePlatformToggle = (platformId) => {
    const newSelected = formData.platforms.includes(platformId)
      ? formData.platforms.filter(id => id !== platformId)
      : [...formData.platforms, platformId];
    
    setFormData({
      ...formData,
      platforms: newSelected
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Orchestration Philosophy:</strong> We coordinate multiple best-of-breed platforms 
                  to create intelligent workflows that deliver enhanced value through data fusion and AI processing.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workflow Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Multi-Source Market Intelligence"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the workflow objective and expected outcomes"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select External Platforms to Orchestrate
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
              Choose the best-of-breed platforms that will be coordinated in this workflow
            </Typography>
            
            <List>
              {availablePlatforms.map((platform) => (
                <ListItem key={platform.id} divider>
                  <ListItemIcon>
                    <HubIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={platform.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {platform.category} Platform
                        </Typography>
                        <Box display="flex" gap={0.5} mt={0.5}>
                          {platform.capabilities.map((capability, index) => (
                            <Chip 
                              key={index}
                              label={capability} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      checked={formData.platforms.includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Orchestration Rules
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                Define how platforms will be coordinated and data will flow between them
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Execution Sequencing</InputLabel>
                <Select
                  value={formData.orchestrationRules.sequencing}
                  onChange={(e) => setFormData({
                    ...formData,
                    orchestrationRules: { ...formData.orchestrationRules, sequencing: e.target.value }
                  })}
                  label="Execution Sequencing"
                >
                  <MenuItem value="parallel">Parallel Execution</MenuItem>
                  <MenuItem value="sequential">Sequential Execution</MenuItem>
                  <MenuItem value="conditional">Conditional Flow</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Error Handling</InputLabel>
                <Select
                  value={formData.orchestrationRules.errorHandling}
                  onChange={(e) => setFormData({
                    ...formData,
                    orchestrationRules: { ...formData.orchestrationRules, errorHandling: e.target.value }
                  })}
                  label="Error Handling"
                >
                  <MenuItem value="retry">Retry Failed Platforms</MenuItem>
                  <MenuItem value="continue">Continue on Errors</MenuItem>
                  <MenuItem value="stop">Stop on First Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Data Flow Type</InputLabel>
                <Select
                  value={formData.orchestrationRules.dataFlowType}
                  onChange={(e) => setFormData({
                    ...formData,
                    orchestrationRules: { ...formData.orchestrationRules, dataFlowType: e.target.value }
                  })}
                  label="Data Flow Type"
                >
                  <MenuItem value="fusion">Data Fusion (Merge & Correlate)</MenuItem>
                  <MenuItem value="aggregation">Data Aggregation (Combine)</MenuItem>
                  <MenuItem value="correlation">Cross-Source Correlation</MenuItem>
                  <MenuItem value="independent">Independent Processing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Value-Added Services
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                Select the enhancement layers that will add value to the raw platform data
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.valueServices.dataFusion}
                    onChange={(e) => setFormData({
                      ...formData,
                      valueServices: { ...formData.valueServices, dataFusion: e.target.checked }
                    })}
                  />
                }
                label="Intelligent Data Fusion"
              />
              <Typography variant="caption" color="textSecondary" display="block">
                Cross-platform data correlation and merging with AI
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.valueServices.aiEnhancement}
                    onChange={(e) => setFormData({
                      ...formData,
                      valueServices: { ...formData.valueServices, aiEnhancement: e.target.checked }
                    })}
                  />
                }
                label="AI Enhancement Layer"
              />
              <Typography variant="caption" color="textSecondary" display="block">
                AI-powered insights, sentiment analysis, entity recognition
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.valueServices.analytics}
                    onChange={(e) => setFormData({
                      ...formData,
                      valueServices: { ...formData.valueServices, analytics: e.target.checked }
                    })}
                  />
                }
                label="Advanced Analytics"
              />
              <Typography variant="caption" color="textSecondary" display="block">
                Pattern detection, trend analysis, statistical insights
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.valueServices.reporting}
                    onChange={(e) => setFormData({
                      ...formData,
                      valueServices: { ...formData.valueServices, reporting: e.target.checked }
                    })}
                  />
                }
                label="Professional Reporting"
              />
              <Typography variant="caption" color="textSecondary" display="block">
                Executive dashboards, automated reports, export capabilities
              </Typography>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Schedule & Deployment
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Schedule Type</InputLabel>
                <Select
                  value={formData.schedule.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, type: e.target.value }
                  })}
                  label="Schedule Type"
                >
                  <MenuItem value="manual">Manual Execution</MenuItem>
                  <MenuItem value="recurring">Recurring Schedule</MenuItem>
                  <MenuItem value="trigger">Event Triggered</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.schedule.type === 'recurring' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.schedule.frequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, frequency: e.target.value }
                    })}
                    label="Frequency"
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.schedule.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, enabled: e.target.checked }
                    })}
                  />
                }
                label="Enable automatic scheduling"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5">Orchestration Workbench</Typography>
          <Typography variant="body2" color="textSecondary">
            Intelligent Multi-Platform Workflow Coordination
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            variant="contained"
          >
            Create Workflow
          </Button>
        </Box>
      </Box>

      {/* Orchestration Philosophy */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          🎯 Orchestration Value Proposition
        </Typography>
        <Typography variant="body2">
          Coordinate multiple best-of-breed platforms into intelligent workflows. Our value comes from 
          smart sequencing, data fusion, AI enhancement, and result correlation across platforms.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} key={workflow.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <WorkflowIcon color="primary" />
                      <Typography variant="h6">{workflow.name}</Typography>
                      <Chip 
                        icon={getStatusIcon(workflow.status)}
                        label={workflow.status} 
                        color={getStatusColor(workflow.status)} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      {workflow.description}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {workflow.status === 'running' && (
                      <Tooltip title="Pause">
                        <IconButton size="small">
                          <PauseIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {workflow.status === 'queued' && (
                      <Tooltip title="Start">
                        <IconButton size="small">
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Platform Integration Display */}
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Orchestrated Platforms:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {workflow.platforms.map((platform, index) => (
                      <Chip 
                        key={index}
                        label={platform} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Progress for running workflows */}
                {workflow.status === 'running' && (
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Progress: {workflow.progress}%</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Started: {new Date(workflow.startTime).toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={workflow.progress} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}

                {/* Value Services Display */}
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Value-Added Services:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {workflow.valueServices.map((service, index) => (
                      <Chip 
                        key={index}
                        label={service} 
                        size="small" 
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Metrics */}
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="caption" color="textSecondary">
                      Records Processed
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {workflow.metrics.recordsProcessed.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="caption" color="textSecondary">
                      Enhanced
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {workflow.metrics.recordsEnhanced.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="caption" color="textSecondary">
                      AI Insights
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {workflow.metrics.insightsGenerated}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="caption" color="textSecondary">
                      Correlations
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {workflow.metrics.correlationsFound}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Workflow Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Create New Orchestration Workflow</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mt: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mt: 4, mb: 2 }}>
              {renderStepContent(activeStep)}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained">
              Deploy Workflow
            </Button>
          ) : (
            <Button 
              onClick={() => setActiveStep(activeStep + 1)} 
              variant="contained"
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrchestrationWorkbench;