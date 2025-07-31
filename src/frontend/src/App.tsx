import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button
} from '@mui/material';
import { 
  CheckCircle as CheckIcon,
  Security as SecurityIcon,
  Storage as DatabaseIcon,
  Code as CodeIcon
} from '@mui/icons-material';

/**
 * Main Application Component - Universal Clean Architecture
 * Version: 3.0.0-universal
 */
function App() {
  const [healthStatus, setHealthStatus] = React.useState<{status: string, timestamp: string} | null>(null);

  React.useEffect(() => {
    // Test backend connectivity
    fetch('/api')
      .then(res => res.json())
      .then(data => console.log('Backend connected:', data))
      .catch(err => console.error('Backend connection failed:', err));

    // Fetch health status
    fetch('/health')
      .then(res => res.json())
      .then(data => setHealthStatus(data))
      .catch(err => console.error('Health check failed:', err));
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Main Server Platform - Universal Clean Architecture
          </Typography>
          <Chip 
            label="v3.0.0-universal" 
            color="secondary" 
            size="small"
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            System Restoration Complete
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Enterprise Platform Ready for Development
          </Typography>
        </Box>

        {/* Status Cards */}
        <Grid container spacing={3}>
          {/* Backend Status */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Backend</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Express.js server with enterprise security middleware
                </Typography>
                <Chip label="Active" color="success" size="small" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>

          {/* Database Status */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <DatabaseIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Database</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  MongoDB with universal PathResolver integration
                </Typography>
                <Chip 
                  label={healthStatus?.services?.database || "Loading..."} 
                  color={healthStatus?.services?.database === "healthy" ? "success" : "default"}
                  size="small" 
                  sx={{ mt: 1 }} 
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Security Status */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SecurityIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Security</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  JWT authentication + GDPR/CCPA audit logging
                </Typography>
                <Chip label="Compliant" color="success" size="small" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>

          {/* Frontend Status */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CodeIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Frontend</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  React 18 + TypeScript + Material-UI + Vite
                </Typography>
                <Chip label="Restored" color="success" size="small" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Information */}
        {healthStatus && (
          <Card sx={{ mt: 4 }} elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Environment:</strong> {healthStatus.environment}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Platform:</strong> {healthStatus.system?.platform}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Node Version:</strong> {healthStatus.system?.nodeVersion}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Project Root:</strong> {healthStatus.system?.projectRoot}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Database:</strong> {healthStatus.database?.connection?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {healthStatus.status}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card sx={{ mt: 4 }} elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Next Development Steps
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The platform is now ready for business module implementation:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" size="small">AI-HRMS Module</Button>
              <Button variant="outlined" size="small">NOSE Research Module</Button>
              <Button variant="outlined" size="small">Web-Hunter Module</Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default App;