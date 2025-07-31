import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Avatar,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBackOutlined as BackIcon,
  RefreshOutlined as RefreshIcon,
  OpenInNewOutlined as OpenIcon,
  FullscreenOutlined as FullscreenIcon,
  MenuBookOutlined as LibraryIcon,
  CodeOutlined as CodeIcon,
  PaletteOutlined as DesignIcon,
  ViewModuleOutlined as ComponentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

function StorybookPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeView, setActiveView] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  // Storybook views/sections
  const storybookViews = [
    { label: 'Component Library', path: '/', icon: <ComponentIcon /> },
    { label: 'Documentation', path: '/?path=/docs/configure-your-project--docs', icon: <DesignIcon /> },
    { label: 'Example Button', path: '/?path=/example/button--primary', icon: <CodeIcon /> },
    { label: 'Example Header', path: '/?path=/example/header--logged-in', icon: <LibraryIcon /> }
  ];

  // Reset loading when activeView changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    setIframeKey(prev => prev + 1);
  }, [activeView]);

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const currentStorybookUrl = `/storybook-proxy${storybookViews[activeView].path}`;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: mode === 'light' ? '#fafbfc' : '#0d1117',
      color: mode === 'light' ? '#24292f' : '#f0f6fc'
    }}>
      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: mode === 'light' ? '#f6f8fa' : '#161b22',
          borderBottom: mode === 'light' 
            ? '1px solid #d0d7de' 
            : '1px solid #30363d',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={() => navigate('/')}
                size="small"
                sx={{ 
                  color: mode === 'light' ? '#656d76' : '#8b949e',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? '#f3f4f6' : '#21262d'
                  }
                }}
              >
                <BackIcon fontSize="small" />
              </IconButton>
              
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: mode === 'light' ? '#8b5cf6' : '#a855f7',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                📚
              </Avatar>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
                  Component Library
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Storybook v9.0.17 • Interactive component development environment
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }}
                onClick={() => window.location.reload()}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }}
                onClick={() => window.open('http://79.72.47.188:6006', '_blank')}
              >
                <OpenIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'text.secondary' }}
                onClick={() => {
                  const iframe = document.querySelector('iframe');
                  if (iframe) {
                    iframe.requestFullscreen();
                  }
                }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Storybook Navigation Tabs */}
          <Box sx={{ borderTop: mode === 'light' ? '1px solid #d0d7de' : '1px solid #30363d' }}>
            <Tabs
              value={activeView}
              onChange={(e, newValue) => {
                setActiveView(newValue);
                setLoading(true);
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: mode === 'light' ? '#656d76' : '#8b949e',
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48,
                  '&.Mui-selected': {
                    color: mode === 'light' ? '#8b5cf6' : '#a855f7'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: mode === 'light' ? '#8b5cf6' : '#a855f7'
                }
              }}
            >
              {storybookViews.map((view, index) => (
                <Tab
                  key={index}
                  icon={view.icon}
                  label={view.label}
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              ))}
            </Tabs>
          </Box>
        </Container>
      </Paper>

      {/* Storybook Integration Area */}
      <Box sx={{ 
        position: 'relative',
        height: 'calc(100vh - 120px)', // Subtract header height
        backgroundColor: mode === 'light' ? '#ffffff' : '#0d1117'
      }}>
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(13, 17, 23, 0.9)',
            zIndex: 10
          }}>
            <CircularProgress 
              sx={{ 
                color: mode === 'light' ? '#8b5cf6' : '#a855f7',
                mb: 2 
              }} 
            />
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Loading Storybook Component Library...
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              {storybookViews[activeView].label}
            </Typography>
          </Box>
        )}

        {error && (
          <Container maxWidth="md" sx={{ pt: 8 }}>
            <Alert 
              severity="warning" 
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                    window.location.reload();
                  }}
                >
                  Retry
                </Button>
              }
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Storybook Connection Issue
              </Typography>
              <Typography variant="body2">
                Unable to load the component library. The Storybook server might be starting up.
              </Typography>
            </Alert>
            
            <Box sx={{ mt: 4, p: 3, backgroundColor: mode === 'light' ? '#f6f8fa' : '#161b22', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LibraryIcon /> Component Library Features
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  📦 Interactive component development and testing
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  🎨 Live component props manipulation
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  📖 Auto-generated documentation
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  📱 Responsive viewport testing
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  🎯 GitHub-style theming (Light/Dark)
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<OpenIcon />}
                onClick={() => window.open('http://79.72.47.188:6006', '_blank')}
                sx={{ mt: 2 }}
              >
                Open in New Tab
              </Button>
            </Box>
          </Container>
        )}

        {/* Storybook Iframe */}
        <iframe
          key={iframeKey} // Force reload on activeView change
          src={currentStorybookUrl}
          title="Storybook Component Library"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: (loading || error) ? 'none' : 'block'
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        />
      </Box>
    </Box>
  );
}

export default StorybookPage;