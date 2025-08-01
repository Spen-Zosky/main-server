import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { WebHunterDashboard, IntegrationManager, OrchestrationWorkbench, ValueServicesMonitor } from '../components/WebHunter';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function WebHunterPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🕷️ Web-Hunter Framework - Enterprise Data Intelligence Platform
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            System Integrator Approach | 24 Providers | 636 Data Sources
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="Web-Hunter interfaces"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="📊 Dashboard" />
            <Tab label="🔌 Provider Integration" />
            <Tab label="⚙️ Orchestration Workbench" />
            <Tab label="📈 Value Services Monitor" />
          </Tabs>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <TabPanel value={activeTab} index={0}>
          <WebHunterDashboard />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <IntegrationManager />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <OrchestrationWorkbench />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <ValueServicesMonitor />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default WebHunterPage;