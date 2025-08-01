import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Fab,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Hub as IntegrationIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  Hub as HubIcon,
  Analytics as AnalyticsIcon,
  CloudSync as CloudSyncIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import IntegrationManager from './IntegrationManager';
import OrchestrationWorkbench from './OrchestrationWorkbench';
import ValueServicesMonitor from './ValueServicesMonitor';

const WebHunterDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    integrations: {
      active: 8,
      total: 12,
      health: 'excellent'
    },
    orchestrations: {
      running: 3,
      completed: 15,
      queued: 2
    },
    valueServices: {
      dataFusion: 'active',
      aiEnhancement: 'active', 
      analytics: 'active',
      reporting: 'active'
    },
    recentResults: [],
    systemHealth: 'healthy'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data reflecting integration-first approach
      setDashboardData({
        integrations: {
          brightData: { status: 'active', requests: 1250, success: 98.5 },
          firecrawl: { status: 'active', requests: 850, success: 99.2 },
          arxiv: { status: 'active', requests: 320, success: 100 },
          openAlex: { status: 'active', requests: 180, success: 97.8 },
          awsAI: { status: 'active', requests: 2100, success: 99.8 },
          elasticSearch: { status: 'active', requests: 890, success: 99.1 },
          total: 8,
          active: 8,
          health: 'excellent'
        },
        orchestrations: {
          running: 3,
          completed: 15,
          queued: 2,
          recentWorkflows: [
            { id: '1', name: 'Multi-Source Academic Research', status: 'running', platforms: ['ArXiv', 'OpenAlex', 'AWS AI'] },
            { id: '2', name: 'E-commerce Intelligence Fusion', status: 'completed', platforms: ['Bright Data', 'Firecrawl', 'ElasticSearch'] },
            { id: '3', name: 'Government Data Correlation', status: 'queued', platforms: ['Official APIs', 'AWS AI', 'Analytics'] }
          ]
        },
        valueServices: {
          dataFusion: { status: 'active', processed: 15420, enhanced: 14890 },
          aiEnhancement: { status: 'active', insights: 340, correlations: 89 },
          analytics: { status: 'active', dashboards: 12, reports: 28 },
          reporting: { status: 'active', exports: 156, notifications: 45 }
        },
        systemHealth: 'healthy'
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'queued': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon />;
      case 'running': return <PlayArrowIcon />;
      case 'completed': return <CheckCircleIcon />;
      case 'queued': return <ScheduleIcon />;
      case 'error': return <ErrorIcon />;
      default: return null;
    }
  };

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Strategic Integration Metrics */}
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎯 System Integration Platform Status
          </Typography>
          <Typography variant="body2">
            <strong>Mission:</strong> Orchestrating best-of-breed platforms for superior data intelligence solutions. 
            We integrate, enhance, and deliver value-added results.
          </Typography>
        </Alert>
      </Grid>

      {/* Key Integration Metrics */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Active Integrations
                </Typography>
                <Typography variant="h4">
                  {dashboardData.integrations.active}/{dashboardData.integrations.total}
                </Typography>
                <Typography variant="caption" color="success.main">
                  {Math.round((dashboardData.integrations.active / dashboardData.integrations.total) * 100)}% Connected
                </Typography>
              </Box>
              <IntegrationIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Active Orchestrations
                </Typography>
                <Typography variant="h4">
                  {dashboardData.orchestrations.running}
                </Typography>
                <Typography variant="caption" color="primary.main">
                  Multi-Platform Workflows
                </Typography>
              </Box>
              <HubIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Value Services
                </Typography>
                <Typography variant="h4">
                  4/4
                </Typography>
                <Typography variant="caption" color="success.main">
                  All Enhancement Layers Active
                </Typography>
              </Box>
              <AnalyticsIcon color="info" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  System Health
                </Typography>
                <Typography variant="h4">
                  Excellent
                </Typography>
                <Typography variant="caption" color="success.main">
                  All Systems Operational
                </Typography>
              </Box>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* External Platform Integration Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">External Platform Integrations</Typography>
              <Tooltip title="All integrations via API - No custom development">
                <CloudSyncIcon color="primary" />
              </Tooltip>
            </Box>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Bright Data Enterprise"
                  secondary="Proxy Network & Web Scraping - 1,250 requests (98.5% success)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Firecrawl AI Scraping"
                  secondary="AI-Powered Content Extraction - 850 requests (99.2% success)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="ArXiv Academic API"
                  secondary="Research Papers - 320 requests (100% success)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="AWS AI Services"
                  secondary="ML Processing & Analytics - 2,100 requests (99.8% success)"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Value-Added Services Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Value-Added Services</Typography>
              <Tooltip title="Our unique contribution layer">
                <TrendingUpIcon color="primary" />
              </Tooltip>
            </Box>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Intelligent Data Fusion"
                  secondary={`${dashboardData.valueServices.dataFusion.processed.toLocaleString()} records processed, ${dashboardData.valueServices.dataFusion.enhanced.toLocaleString()} enhanced`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="AI Enhancement Layer"
                  secondary={`${dashboardData.valueServices.aiEnhancement.insights} insights generated, ${dashboardData.valueServices.aiEnhancement.correlations} correlations found`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Advanced Analytics"
                  secondary={`${dashboardData.valueServices.analytics.dashboards} active dashboards, ${dashboardData.valueServices.analytics.reports} reports generated`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Professional Reporting"
                  secondary={`${dashboardData.valueServices.reporting.exports} exports, ${dashboardData.valueServices.reporting.notifications} notifications sent`}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Orchestration Workflows */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Orchestration Workflows</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Multi-platform coordination delivering enhanced results
            </Typography>
            
            {dashboardData.orchestrations.recentWorkflows.map((workflow) => (
              <Box key={workflow.id} mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(workflow.status)}
                    <Typography variant="body1">{workflow.name}</Typography>
                  </Box>
                  <Chip 
                    label={workflow.status} 
                    color={getStatusColor(workflow.status)} 
                    size="small" 
                  />
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {workflow.platforms.map((platform, index) => (
                    <Chip 
                      key={index}
                      label={platform} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" component="h1">
            Web-Hunter Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Data Intelligence Orchestrator - Integrating Best-of-Breed Platforms
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => setActiveTab('integrations')}
            color={activeTab === 'integrations' ? 'primary' : 'inherit'}
          >
            Platform Integrations
          </Button>
          <Button
            variant="outlined"
            onClick={() => setActiveTab('orchestration')}
            color={activeTab === 'orchestration' ? 'primary' : 'inherit'}
          >
            Orchestration Workbench  
          </Button>
          <Button
            variant="outlined"
            onClick={() => setActiveTab('services')}
            color={activeTab === 'services' ? 'primary' : 'inherit'}
          >
            Value Services
          </Button>
          <Button
            variant="outlined"
            onClick={() => setActiveTab('overview')}
            color={activeTab === 'overview' ? 'primary' : 'inherit'}
          >
            Overview
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'integrations' && <IntegrationManager />}
      {activeTab === 'orchestration' && <OrchestrationWorkbench />}
      {activeTab === 'services' && <ValueServicesMonitor />}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create new orchestration"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setActiveTab('orchestration')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default WebHunterDashboard;