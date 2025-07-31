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
import { AIHRMSErrorBoundary, NOSEErrorBoundary, WebHunterErrorBoundary } from './FrameworkErrorBoundary';

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
    { value: 'ai-hrms', label: 'AI-HRMS', component: AIHRMSErrorBoundary },
    { value: 'nose', label: 'NOSE', component: NOSEErrorBoundary },
    { value: 'web-hunter', label: 'Web-Hunter', component: WebHunterErrorBoundary }
  ];

  const triggerError = () => {
    setActiveTest({ framework, errorType, message: customMessage });
  };

  const resetTest = () => {
    setActiveTest(null);
  };

  const selectedFramework = frameworks.find(f => f.value === framework);
  const ErrorBoundaryComponent = selectedFramework?.component || AIHRMSErrorBoundary;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReport color="error" />
        Error Boundary Testing Panel
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test environment per verificare il comportamento degli Error Boundaries 
        nei diversi framework. Questo panel è disponibile solo nell'ambiente di test.
      </Typography>

      <Alert severity="warning" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>⚠️ Test Environment Only:</strong> Questo panel serve per testare 
          la gestione degli errori. Gli errori sono intenzionali e controllati.
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

            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<BugReport />}
                onClick={triggerError}
                disabled={activeTest !== null}
              >
                Trigger Error
              </Button>
              
              {activeTest && (
                <Button
                  variant="outlined"
                  onClick={resetTest}
                >
                  Reset Test
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 4 }} />

      {/* Error Boundary Test Area */}
      <Typography variant="h6" gutterBottom>
        Error Boundary Test Area - {selectedFramework?.label}
      </Typography>
      
      <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 2, minHeight: 300 }}>
        <ErrorBoundaryComponent componentName="Error Testing Component">
          {activeTest ? (
            <ErrorThrower
              errorType={activeTest.errorType}
              framework={activeTest.framework}
              message={activeTest.message}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                ✅ No Errors - System Operating Normally
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure the test above and click "Trigger Error" to test the Error Boundary.
              </Typography>
              <Chip 
                label={`${selectedFramework?.label} Framework Ready`} 
                color="success" 
                sx={{ mt: 2 }} 
              />
            </Box>
          )}
        </ErrorBoundaryComponent>
      </Box>

      {/* Documentation */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Error Boundary Features Tested
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              ✅ <strong>Framework-Specific UI:</strong> Ogni framework ha un'interfaccia di errore personalizzata
            </Typography>
            <Typography variant="body2">
              ✅ <strong>Error ID Generation:</strong> Ogni errore genera un ID univoco per il tracking
            </Typography>
            <Typography variant="body2">
              ✅ <strong>Error Logging:</strong> Gli errori sono automaticamente loggati con dettagli tecnici
            </Typography>
            <Typography variant="body2">
              ✅ <strong>User-Friendly Messages:</strong> Messaggi comprensibili per gli utenti finali
            </Typography>
            <Typography variant="body2">
              ✅ <strong>Recovery Actions:</strong> Pulsanti per retry e navigazione
            </Typography>
            <Typography variant="body2">
              ✅ <strong>Technical Details:</strong> Stack trace e component stack per debugging
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorTestingPanel;