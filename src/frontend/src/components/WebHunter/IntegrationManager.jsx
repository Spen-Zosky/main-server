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
  ListItemSecondaryAction,
  Divider,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Api as ApiIcon,
  Cloud as CloudIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const IntegrationManager = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    category: 'scraping',
    apiEndpoint: '',
    description: '',
    enabled: true,
    config: {
      apiKey: '',
      rateLimit: 100,
      timeout: 30000,
      retries: 3
    }
  });

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      // Mock data representing external platform integrations
      setIntegrations([
        {
          id: '1',
          name: 'Bright Data Network',
          provider: 'Bright Data',
          category: 'scraping',
          apiEndpoint: 'https://api.brightdata.com/v1',
          description: 'Enterprise proxy network with 100M+ residential IPs',
          enabled: true,
          status: 'active',
          lastSync: '2025-01-30T10:45:00Z',
          metrics: {
            requests: 1250,
            successRate: 98.5,
            avgResponseTime: 1200
          },
          config: {
            rateLimit: 1000,
            timeout: 30000,
            retries: 3
          },
          valueAdded: ['IP Rotation', 'Geo-targeting', 'Anti-detection']
        },
        {
          id: '2',
          name: 'Firecrawl AI Engine',
          provider: 'Firecrawl',
          category: 'ai-scraping',
          apiEndpoint: 'https://api.firecrawl.dev/v1',
          description: 'AI-powered web scraping with structured data extraction',
          enabled: true,
          status: 'active',
          lastSync: '2025-01-30T10:42:00Z',
          metrics: {
            requests: 850,
            successRate: 99.2,
            avgResponseTime: 2100
          },
          config: {
            rateLimit: 500,
            timeout: 45000,
            retries: 2
          },
          valueAdded: ['AI Content Extraction', 'Markdown Output', 'Schema Recognition']
        },
        {
          id: '3',
          name: 'ArXiv Research API',
          provider: 'Cornell University',
          category: 'academic',
          apiEndpoint: 'https://export.arxiv.org/api',
          description: 'Academic papers and research publications',
          enabled: true,
          status: 'active',
          lastSync: '2025-01-30T10:40:00Z',
          metrics: {
            requests: 320,
            successRate: 100,
            avgResponseTime: 800
          },
          config: {
            rateLimit: 300,
            timeout: 15000,
            retries: 2
          },
          valueAdded: ['Research Metadata', 'Citation Networks', 'PDF Access']
        },
        {
          id: '4',
          name: 'AWS AI Services',
          provider: 'Amazon Web Services',
          category: 'ai-processing',
          apiEndpoint: 'https://api.aws.com/ai',
          description: 'Machine learning and AI processing services',
          enabled: true,
          status: 'active',
          lastSync: '2025-01-30T10:46:00Z',
          metrics: {
            requests: 2100,
            successRate: 99.8,
            avgResponseTime: 650
          },
          config: {
            rateLimit: 5000,
            timeout: 60000,
            retries: 3
          },
          valueAdded: ['NLP Processing', 'Sentiment Analysis', 'Entity Recognition']
        },
        {
          id: '5',
          name: 'OpenAlex Research',
          provider: 'OpenAlex',
          category: 'academic',
          apiEndpoint: 'https://api.openalex.org',
          description: 'Open access to scholarly works and authors',
          enabled: true,
          status: 'active',
          lastSync: '2025-01-30T10:38:00Z',
          metrics: {
            requests: 180,
            successRate: 97.8,
            avgResponseTime: 950
          },
          config: {
            rateLimit: 200,
            timeout: 20000,
            retries: 2
          },
          valueAdded: ['Author Networks', 'Institution Mapping', 'Citation Graphs']
        },
        {
          id: '6',
          name: 'Elasticsearch Analytics',
          provider: 'Elastic',
          category: 'analytics',
          apiEndpoint: 'https://api.elastic.co',
          description: 'Advanced search and analytics engine',
          enabled: false,
          status: 'inactive',
          lastSync: '2025-01-29T15:20:00Z',
          metrics: {
            requests: 890,
            successRate: 99.1,
            avgResponseTime: 320
          },
          config: {
            rateLimit: 2000,
            timeout: 25000,
            retries: 3
          },
          valueAdded: ['Full-text Search', 'Aggregations', 'Real-time Analytics']
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (integration = null) => {
    if (integration) {
      setEditingIntegration(integration);
      setFormData({
        name: integration.name,
        provider: integration.provider,
        category: integration.category,
        apiEndpoint: integration.apiEndpoint,
        description: integration.description,
        enabled: integration.enabled,
        config: integration.config
      });
    } else {
      setEditingIntegration(null);
      setFormData({
        name: '',
        provider: '',
        category: 'scraping',
        apiEndpoint: '',
        description: '',
        enabled: true,
        config: {
          apiKey: '',
          rateLimit: 100,
          timeout: 30000,
          retries: 3
        }
      });
    }
    setDialogOpen(true);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'scraping': return <CloudIcon />;
      case 'ai-scraping': return <AnalyticsIcon />;
      case 'academic': return <SecurityIcon />;
      case 'ai-processing': return <AnalyticsIcon />;
      case 'analytics': return <TrendingUpIcon />;
      default: return <ApiIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'scraping': return 'primary';
      case 'ai-scraping': return 'secondary';
      case 'academic': return 'info';
      case 'ai-processing': return 'warning';
      case 'analytics': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5">External Platform Integrations</Typography>
          <Typography variant="body2" color="textSecondary">
            System Integrator Approach - Best-of-Breed Platform Orchestration
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchIntegrations}
            variant="outlined"
          >
            Refresh Status
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            variant="contained"
          >
            Add Integration
          </Button>
        </Box>
      </Box>

      {/* Integration Philosophy Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          🎯 Integration-First Philosophy
        </Typography>
        <Typography variant="body2">
          We don't build scraping tools - we integrate the best existing platforms via APIs. 
          Our value comes from intelligent orchestration, data fusion, and enhanced analytics.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} md={6} lg={4} key={integration.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getCategoryIcon(integration.category)}
                    <Typography variant="h6" noWrap>
                      {integration.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={integration.status} 
                      color={getStatusColor(integration.status)} 
                      size="small" 
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" mb={1}>
                  <strong>Provider:</strong> {integration.provider}
                </Typography>

                <Chip 
                  label={integration.category.replace('-', ' ').toUpperCase()} 
                  color={getCategoryColor(integration.category)} 
                  size="small" 
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" color="textSecondary" mb={2}>
                  {integration.description}
                </Typography>

                {/* Performance Metrics */}
                <Box mb={2}>
                  <Typography variant="caption" color="textSecondary" gutterBottom display="block">
                    Performance Metrics:
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="textSecondary">
                        Requests
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {integration.metrics.requests.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="textSecondary">
                        Success Rate
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {integration.metrics.successRate}%
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="textSecondary">
                        Avg Response
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {integration.metrics.avgResponseTime}ms
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Value-Added Features */}
                <Box mb={2}>
                  <Typography variant="caption" color="textSecondary" gutterBottom display="block">
                    Value-Added Features:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {integration.valueAdded.map((feature, index) => (
                      <Chip 
                        key={index}
                        label={feature} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>

                <Typography variant="caption" color="textSecondary" mb={2} display="block">
                  Last Sync: {new Date(integration.lastSync).toLocaleString()}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={integration.enabled}
                        size="small"
                      />
                    }
                    label="Enabled"
                  />
                  <Box>
                    <Tooltip title="Configure">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(integration)}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Integration Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingIntegration ? 'Configure Integration' : 'Add New Platform Integration'}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Integration Policy:</strong> We only integrate with established, best-of-breed platforms. 
              No custom scraping development - API integration only.
            </Typography>
          </Alert>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Integration Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bright Data Enterprise"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Platform Provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Bright Data Inc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="scraping">Web Scraping</MenuItem>
                  <MenuItem value="ai-scraping">AI-Powered Scraping</MenuItem>
                  <MenuItem value="academic">Academic/Research</MenuItem>
                  <MenuItem value="ai-processing">AI/ML Processing</MenuItem>
                  <MenuItem value="analytics">Analytics & Search</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API Endpoint"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                placeholder="https://api.provider.com/v1"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the platform capabilities and integration purpose"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  />
                }
                label="Enable this integration"
              />
            </Grid>

            {/* Configuration Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Integration Configuration
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Rate Limit (requests/hour)"
                value={formData.config.rateLimit}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, rateLimit: parseInt(e.target.value) }
                })}
                inputProps={{ min: 1, max: 10000 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Timeout (milliseconds)"
                value={formData.config.timeout}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, timeout: parseInt(e.target.value) }
                })}
                inputProps={{ min: 1000, max: 120000 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Retry Attempts"
                value={formData.config.retries}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, retries: parseInt(e.target.value) }
                })}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">
            {editingIntegration ? 'Update Integration' : 'Add Integration'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IntegrationManager;