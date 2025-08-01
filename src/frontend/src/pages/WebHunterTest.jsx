import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

function WebHunterTest() {
  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        🕷️ Web-Hunter Framework Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        Se vedi questo messaggio, il routing funziona correttamente!
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            ✅ Status: Frontend Attivo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            React + Material-UI + Vite Development Server
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            📊 Web-Hunter Dashboard
          </Typography>
          <Typography variant="body2">
            Sistema di monitoraggio provider e orchestrazione workflow
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            🔌 Integration Manager
          </Typography>
          <Typography variant="body2">
            Gestione provider esterni: Bright Data, Firecrawl, ArXiv, AWS AI
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            ⚙️ Orchestration Workbench  
          </Typography>
          <Typography variant="body2">
            Creazione e gestione workflow multi-provider
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">
            📈 Value Services Monitor
          </Typography>
          <Typography variant="body2">
            Monitoraggio Data Fusion, AI Enhancement, Analytics
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default WebHunterTest;