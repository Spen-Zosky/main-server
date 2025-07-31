import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  Card, 
  CardContent,
  Chip,
  Stack,
  Divider 
} from '@mui/material';
import { 
  ErrorOutline, 
  Refresh, 
  BugReport, 
  Home,
  ContentCopy 
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { 
      hasError: true,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to our centralized error tracking
    this.setState({
      error,
      errorInfo
    });

    // Send to error tracking service (when implemented)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Enterprise error logging
    const errorReport = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      framework: this.props.framework || 'unknown',
      component: this.props.componentName || 'unknown',
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.props.userId || 'anonymous'
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary Caught Error [${this.state.errorId}]`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }

    // In production, send to error tracking service
    // Example: window.errorTracker?.captureException(errorReport);
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  copyErrorReport = () => {
    const errorReport = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      error: this.state.error?.toString(),
      framework: this.props.framework,
      component: this.props.componentName
    };

    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        // Could show a toast notification here
        console.log('Error report copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy error report:', err);
      });
  };

  render() {
    if (this.state.hasError) {
      const { framework, componentName, fallbackComponent } = this.props;
      
      // If custom fallback component is provided, use it
      if (fallbackComponent) {
        return React.createElement(fallbackComponent, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          onRetry: this.handleRetry,
          errorId: this.state.errorId
        });
      }

      // Default error UI
      return (
        <Box 
          sx={{ 
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'background.default'
          }}
        >
          <Card 
            sx={{ 
              maxWidth: 600, 
              width: '100%',
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'error.light'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ErrorOutline 
                  sx={{ 
                    fontSize: 40, 
                    color: 'error.main', 
                    mr: 2 
                  }} 
                />
                <Box>
                  <Typography variant="h5" color="error.main" fontWeight="bold">
                    Something went wrong
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {framework && (
                      <Chip 
                        label={framework} 
                        size="small" 
                        color="primary" 
                        sx={{ mr: 1, mt: 1 }} 
                      />
                    )}
                    {componentName && (
                      <Chip 
                        label={componentName} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mt: 1 }} 
                      />
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Error ID */}
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={this.copyErrorReport}
                    startIcon={<ContentCopy />}
                  >
                    Copy
                  </Button>
                }
              >
                <Typography variant="body2" fontFamily="monospace">
                  Error ID: {this.state.errorId}
                </Typography>
              </Alert>

              {/* Error Message */}
              {this.state.error && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Error:</strong> {this.state.error.message}
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleRetry}
                  color="primary"
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>
                <Button
                  variant="text"
                  startIcon={<BugReport />}
                  onClick={this.toggleDetails}
                  size="small"
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} Details
                </Button>
              </Stack>

              {/* Technical Details */}
              {this.state.showDetails && (
                <Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Technical Details
                  </Typography>
                  
                  {this.state.error && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="error">
                        Error Stack:
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: 'grey.100',
                          p: 2,
                          borderRadius: 1,
                          overflow: 'auto',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          maxHeight: 200,
                          border: '1px solid',
                          borderColor: 'grey.300'
                        }}
                      >
                        {this.state.error.stack}
                      </Box>
                    </Box>
                  )}

                  {this.state.errorInfo && (
                    <Box>
                      <Typography variant="subtitle2" color="error">
                        Component Stack:
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: 'grey.100',
                          p: 2,
                          borderRadius: 1,
                          overflow: 'auto',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          maxHeight: 200,
                          border: '1px solid',
                          borderColor: 'grey.300'
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Help Text */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  💡 <strong>What happened?</strong> An unexpected error occurred in the application. 
                  The error has been logged automatically. You can try refreshing the page or 
                  contact support with the Error ID above.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;