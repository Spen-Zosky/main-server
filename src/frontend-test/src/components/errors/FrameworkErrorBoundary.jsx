import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Alert,
  Chip
} from '@mui/material';
import { 
  BusinessCenter, 
  Science, 
  DataUsage,
  Refresh,
  Home 
} from '@mui/icons-material';

// Framework-specific error fallback components
const AIHRMSErrorFallback = ({ error, errorId, onRetry }) => (
  <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
    <CardContent sx={{ textAlign: 'center', p: 4 }}>
      <BusinessCenter sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="error.main">
        AI-HRMS Module Error
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The Human Resources module encountered an unexpected error. 
        Your HR data is safe and this issue has been reported automatically.
      </Typography>
      <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
        <Typography variant="body2">
          <strong>Error ID:</strong> {errorId}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Employee data and payroll information remain secure and unchanged.
        </Typography>
      </Alert>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetry}>
          Reload HR Module
        </Button>
        <Button variant="outlined" startIcon={<Home />} href="/">
          Return to Dashboard
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const NOSEErrorFallback = ({ error, errorId, onRetry }) => (
  <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
    <CardContent sx={{ textAlign: 'center', p: 4 }}>
      <Science sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="error.main">
        NOSE Research Module Error
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The research assistant module encountered an issue. 
        Your research projects and data remain intact and accessible.
      </Typography>
      <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
        <Typography variant="body2">
          <strong>Error ID:</strong> {errorId}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Research projects, publications, and collaborations are preserved.
        </Typography>
      </Alert>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetry}>
          Reload Research Module
        </Button>
        <Button variant="outlined" startIcon={<Home />} href="/">
          Return to Dashboard
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const WebHunterErrorFallback = ({ error, errorId, onRetry }) => (
  <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
    <CardContent sx={{ textAlign: 'center', p: 4 }}>
      <DataUsage sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="error.main">
        Web-Hunter Module Error
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The data mining module encountered an unexpected error. 
        Your mining jobs and analytics data are safe and preserved.
      </Typography>
      <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
        <Typography variant="body2">
          <strong>Error ID:</strong> {errorId}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Mining jobs, datasets, and ML models remain available.
        </Typography>
      </Alert>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetry}>
          Reload Mining Module
        </Button>
        <Button variant="outlined" startIcon={<Home />} href="/">
          Return to Dashboard
        </Button>
      </Box>
    </CardContent>
  </Card>
);

// Framework-specific Error Boundary components
export const AIHRMSErrorBoundary = ({ children, componentName = 'AI-HRMS Component' }) => (
  <ErrorBoundary
    framework="AI-HRMS"
    componentName={componentName}
    fallbackComponent={AIHRMSErrorFallback}
  >
    {children}
  </ErrorBoundary>
);

export const NOSEErrorBoundary = ({ children, componentName = 'NOSE Component' }) => (
  <ErrorBoundary
    framework="NOSE"
    componentName={componentName}
    fallbackComponent={NOSEErrorFallback}
  >
    {children}
  </ErrorBoundary>
);

export const WebHunterErrorBoundary = ({ children, componentName = 'Web-Hunter Component' }) => (
  <ErrorBoundary
    framework="Web-Hunter"
    componentName={componentName}
    fallbackComponent={WebHunterErrorFallback}
  >
    {children}
  </ErrorBoundary>
);

// Generic Framework Error Boundary with dynamic framework detection
const FrameworkErrorBoundary = ({ 
  children, 
  framework, 
  componentName = 'Framework Component' 
}) => {
  // Select appropriate fallback component based on framework
  const getFallbackComponent = () => {
    switch (framework?.toLowerCase()) {
      case 'ai-hrms':
        return AIHRMSErrorFallback;
      case 'nose':
        return NOSEErrorFallback;
      case 'web-hunter':
        return WebHunterErrorFallback;
      default:
        return null; // Use default ErrorBoundary fallback
    }
  };

  return (
    <ErrorBoundary
      framework={framework}
      componentName={componentName}
      fallbackComponent={getFallbackComponent()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default FrameworkErrorBoundary;