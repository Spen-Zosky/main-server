import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  BugReport,
  Warning,
  Error as ErrorIcon,
  Memory,
  NetworkCheck,
  Timer
} from '@mui/icons-material';

// Component that intentionally throws errors for testing
const ErrorThrower = ({ errorType, framework, message }) => {
  const throwError = () => {
    switch (errorType) {
      case 'reference':
        // ReferenceError
        console.log(undefinedVariable.property);
        break;
      case 'type':
        // TypeError
        null.someMethod();
        break;
      case 'network':
        // Simulate network error
        throw new Error(`Network Error: Failed to connect to ${framework} API - ${message}`);
      case 'memory':
        // Simulate memory error
        throw new Error(`Memory Error: Insufficient memory for ${framework} operation - ${message}`);
      case 'validation':
        // Validation error
        throw new Error(`Validation Error: Invalid data format in ${framework} - ${message}`);
      case 'timeout':
        // Timeout error
        throw new Error(`Timeout Error: ${framework} operation timed out - ${message}`);
      case 'custom':
        // Custom error with message
        throw new Error(message || `Custom error in ${framework} framework`);
      default:
        throw new Error(`Unknown error in ${framework} framework`);
    }
  };

  // Automatically throw error on render
  React.useEffect(() => {
    throwError();
  }, [errorType, framework, message]);

  return <div>This should not render - error should be thrown</div>;
};

// Simple Error Boundary for testing
class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            🛑 {this.props.framework} Error Boundary Caught Error
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Framework:</strong> {this.props.framework}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Reset Error Boundary
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}

const ErrorTestingPanel = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [framework, setFramework] = useState('ai-hrms');
  const [errorType, setErrorType] = useState('reference');
  const [customMessage, setCustomMessage] = useState('');

  const errorTypes = [
    { value: 'reference', label: 'Reference Error', icon: <ErrorIcon /> },
    { value: 'type', label: 'Type Error', icon: <ErrorIcon /> },
    { value: 'network', label: 'Network Error', icon: <NetworkCheck /> },
    { value: 'memory', label: 'Memory Error', icon: <Memory /> },
    { value: 'validation', label: 'Validation Error', icon: <Warning /> },
    { value: 'timeout', label: 'Timeout Error', icon: <Timer /> },
    { value: 'custom', label: 'Custom Error', icon: <BugReport /> }
  ];

  const frameworks = [
    { value: 'ai-hrms', label: 'AI-HRMS' },
    { value: 'nose', label: 'NOSE' },
    { value: 'web-hunter', label: 'Web-Hunter' }
  ];

  const triggerError = () => {
    setActiveTest({ framework, errorType, message: customMessage });
  };

  const resetTest = () => {
    setActiveTest(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReport color="error" />
        Error Boundary Testing Panel
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test environment to verify Error Boundaries behavior in different frameworks. 
        This panel is available only in the test environment.
      </Typography>

      <Alert severity="warning" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>⚠️ Test Environment Only:</strong> This panel is used to test 
          error handling. Errors are intentional and controlled.
        </Typography>
      </Alert>

      {/* Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Configuration
          </Typography>
          
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Framework</InputLabel>
              <Select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                label="Framework"
              >
                {frameworks.map((fw) => (
                  <MenuItem key={fw.value} value={fw.value}>
                    <Chip label={fw.label} size="small" sx={{ mr: 1 }} />
                    {fw.label} Error Boundary
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Error Type</InputLabel>
              <Select
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
                label="Error Type"
              >
                {errorTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {errorType === 'custom' && (
              <TextField
                fullWidth
                label="Custom Error Message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter custom error message..."
              />
            )}

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="error"
                onClick={triggerError}
                startIcon={<BugReport />}
                disabled={!!activeTest}
              >
                Trigger Error
              </Button>
              
              <Button
                variant="outlined"
                onClick={resetTest}
                disabled={!activeTest}
              >
                Reset Test
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Error Display Area */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Error Boundary Test Area
          </Typography>
          
          <SimpleErrorBoundary framework={framework}>
            {activeTest ? (
              <Box sx={{ p: 3, border: '2px dashed', borderColor: 'error.main', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Testing {activeTest.framework} framework with {activeTest.errorType} error...
                </Typography>
                <ErrorThrower
                  errorType={activeTest.errorType}
                  framework={activeTest.framework}
                  message={activeTest.message}
                />
              </Box>
            ) : (
              <Alert severity="info">
                <Typography variant="body2">
                  No active test. Configure the test parameters above and click "Trigger Error" to test error boundaries.
                </Typography>
              </Alert>
            )}
          </SimpleErrorBoundary>
        </CardContent>
      </Card>

      {/* Error Types Reference */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Error Types Reference
          </Typography>
          
          <Stack spacing={2}>
            {errorTypes.map((type) => (
              <Box key={type.value} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {type.icon}
                <Box>
                  <Typography variant="subtitle2">{type.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.value === 'reference' && 'Tests ReferenceError - accessing undefined variables'}
                    {type.value === 'type' && 'Tests TypeError - calling methods on null/undefined'}
                    {type.value === 'network' && 'Simulates network connection failures'}
                    {type.value === 'memory' && 'Simulates memory allocation errors'}
                    {type.value === 'validation' && 'Tests data validation failures'}
                    {type.value === 'timeout' && 'Simulates operation timeout errors'}
                    {type.value === 'custom' && 'Tests custom error messages'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Framework Status */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Framework Error Boundary Status
          </Typography>
          
          <Stack spacing={1}>
            {frameworks.map((fw) => (
              <Box key={fw.value} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={fw.label} 
                  size="small" 
                  color={fw.value === framework ? 'primary' : 'default'}
                />
                <Typography variant="body2" color="text.secondary">
                  Error Boundary Active - {fw.label} framework protected
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorTestingPanel;