import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Insights as InsightsIcon,
  AutoFixHigh as EnhanceIcon,
  Assessment as ReportIcon,
  Hub as FusionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const ValueServicesMonitor = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentEnhancements, setRecentEnhancements] = useState([]);

  useEffect(() => {
    fetchValueServices();
  }, []);

  const fetchValueServices = async () => {
    try {
      setLoading(true);
      // Mock data representing value-added services
      setServices([
        {
          id: 'data-fusion',
          name: 'Intelligent Data Fusion',
          description: 'Cross-platform data correlation and merging with AI-powered matching',
          status: 'active',
          icon: <FusionIcon />,
          metrics: {
            recordsProcessed: 15420,
            recordsEnhanced: 14890,
            successRate: 96.6,
            avgProcessingTime: 1.2,
            correlationsFound: 2340,
            duplicatesRemoved: 340
          },
          capabilities: [
            'Cross-Source Matching',
            'Entity Resolution',
            'Data Deduplication',
            'Relationship Detection',
            'Quality Scoring'
          ],
          recentActivity: [
            { timestamp: '2025-01-30T10:45:00Z', action: 'Merged 45 records from Bright Data and ArXiv' },
            { timestamp: '2025-01-30T10:42:00Z', action: 'Detected 12 entity relationships' },
            { timestamp: '2025-01-30T10:40:00Z', action: 'Removed 8 duplicate entries' }
          ]
        },
        {
          id: 'ai-enhancement',
          name: 'AI Enhancement Layer',
          description: 'AI-powered content analysis, sentiment, entity recognition, and insights',
          status: 'active',
          icon: <EnhanceIcon />,
          metrics: {
            recordsProcessed: 12680,
            insightsGenerated: 340,
            sentimentAnalyzed: 8920,
            entitiesExtracted: 15670,
            topicsClassified: 2340,
            summariesGenerated: 180
          },
          capabilities: [
            'Natural Language Processing',
            'Sentiment Analysis',
            'Entity Recognition',
            'Topic Classification',
            'Content Summarization'
          ],
          recentActivity: [
            { timestamp: '2025-01-30T10:46:00Z', action: 'Extracted 23 entities from academic papers' },
            { timestamp: '2025-01-30T10:44:00Z', action: 'Generated sentiment scores for 150 records' },
            { timestamp: '2025-01-30T10:41:00Z', action: 'Classified 45 topics in research abstracts' }
          ]
        },
        {
          id: 'analytics',
          name: 'Advanced Analytics Engine',
          description: 'Pattern detection, trend analysis, and statistical insights generation',
          status: 'active',
          icon: <AnalyticsIcon />,
          metrics: {
            dashboardsActive: 12,
            reportsGenerated: 28,
            patternsDetected: 89,
            trendsIdentified: 34,
            anomaliesFound: 7,
            predictionsGenerated: 15
          },
          capabilities: [
            'Pattern Recognition',
            'Trend Analysis',
            'Anomaly Detection',
            'Predictive Analytics',
            'Statistical Analysis'
          ],
          recentActivity: [
            { timestamp: '2025-01-30T10:47:00Z', action: 'Detected emerging trend in AI research papers' },
            { timestamp: '2025-01-30T10:43:00Z', action: 'Identified 3 data anomalies requiring attention' },
            { timestamp: '2025-01-30T10:39:00Z', action: 'Generated weekly analytics report' }
          ]
        },
        {
          id: 'reporting',
          name: 'Professional Reporting Suite',
          description: 'Executive dashboards, automated reports, and export capabilities',
          status: 'active',
          icon: <ReportIcon />,
          metrics: {
            reportsGenerated: 156,
            dashboardViews: 890,
            exportsCompleted: 67,
            scheduledReports: 23,
            notificationsSent: 45,
            customReports: 12
          },
          capabilities: [
            'Executive Dashboards',
            'Automated Reporting',
            'Custom Report Builder',
            'Multi-format Export',
            'Scheduled Delivery'
          ],
          recentActivity: [
            { timestamp: '2025-01-30T10:48:00Z', action: 'Delivered weekly executive summary' },
            { timestamp: '2025-01-30T10:45:00Z', action: 'Exported 234 records to CSV format' },
            { timestamp: '2025-01-30T10:41:00Z', action: 'Generated custom analytics dashboard' }
          ]
        }
      ]);

      setRecentEnhancements([
        {
          id: '1',
          timestamp: '2025-01-30T10:48:00Z',
          service: 'AI Enhancement',
          type: 'insight',
          title: 'Research Trend Identified',
          description: 'Detected emerging pattern in quantum computing research papers',
          impact: 'high',
          recordsAffected: 45
        },
        {
          id: '2',
          timestamp: '2025-01-30T10:45:00Z',
          service: 'Data Fusion',
          type: 'correlation',
          title: 'Cross-Source Match Found',
          description: 'Matched author profiles across ArXiv and OpenAlex databases',
          impact: 'medium',
          recordsAffected: 23
        },
        {
          id: '3',
          timestamp: '2025-01-30T10:42:00Z',
          service: 'Analytics',
          type: 'anomaly',
          title: 'Data Quality Alert',
          description: 'Unusual pattern detected in web scraping results',
          impact: 'medium',
          recordsAffected: 8
        },
        {
          id: '4',
          timestamp: '2025-01-30T10:40:00Z',
          service: 'Reporting',
          type: 'report',
          title: 'Weekly Summary Generated',
          description: 'Comprehensive analytics report compiled and delivered',
          impact: 'low',
          recordsAffected: 1250
        }
      ]);

    } catch (error) {
      console.error('Failed to fetch value services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return <WarningIcon color="error" />;
      case 'medium': return <WarningIcon color="warning" />;
      case 'low': return <CheckCircleIcon color="success" />;
      default: return <CheckCircleIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5">Value-Added Services Monitor</Typography>
          <Typography variant="body2" color="textSecondary">
            Our Unique Value Layer - Enhancement Services Beyond Raw Data
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh Status">
            <IconButton onClick={fetchValueServices}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Value Proposition Alert */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          🎯 Value Services Philosophy
        </Typography>
        <Typography variant="body2">
          This is where we add unique value - not in data collection tools, but in intelligent processing, 
          AI enhancement, cross-source correlation, and professional insights generation.
        </Typography>
      </Alert>

      {/* Service Cards */}
      <Grid container spacing={3} mb={4}>
        {services.map((service) => (
          <Grid item xs={12} md={6} key={service.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {service.icon}
                  <Box>
                    <Typography variant="h6">{service.name}</Typography>
                    <Chip 
                      label={service.status} 
                      color="success" 
                      size="small" 
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" mb={2}>
                  {service.description}
                </Typography>

                {/* Capabilities */}
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Capabilities:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {service.capabilities.map((capability, index) => (
                      <Chip 
                        key={index}
                        label={capability} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Metrics */}
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Performance Metrics:
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(service.metrics).slice(0, 4).map(([key, value]) => (
                      <Grid item xs={6} key={key}>
                        <Typography variant="caption" color="textSecondary">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Recent Activity */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Activity:
                  </Typography>
                  <List dense>
                    {service.recentActivity.slice(0, 2).map((activity, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={new Date(activity.timestamp).toLocaleString()}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Enhancements Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Recent Value Enhancements</Typography>
            <Typography variant="body2" color="textSecondary">
              Real-time view of value-added processing results
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Enhancement Type</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Records</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentEnhancements.map((enhancement) => (
                  <TableRow key={enhancement.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(enhancement.timestamp).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={enhancement.service} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {enhancement.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {enhancement.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {enhancement.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getImpactIcon(enhancement.impact)}
                        <Chip 
                          label={enhancement.impact} 
                          size="small" 
                          color={getImpactColor(enhancement.impact)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {enhancement.recordsAffected.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export Results">
                          <IconButton size="small">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Service Health Summary */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Health Overview
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="All Value Services Operational"
                    secondary="4/4 services running with optimal performance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Processing Efficiency: 96.6%"
                    secondary="Above target threshold of 95%"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InsightsIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="AI Enhancement Active"
                    secondary="340 insights generated in last 24 hours"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Value Impact Metrics
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FusionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data Quality Improvement"
                    secondary="96.6% of records enhanced through fusion"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Insights Generation Rate"
                    secondary="2.7 insights per 100 processed records"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ReportIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Professional Reports"
                    secondary="156 reports delivered with 98% satisfaction"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ValueServicesMonitor;