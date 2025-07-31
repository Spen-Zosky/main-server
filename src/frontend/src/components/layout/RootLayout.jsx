import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Stack
} from '@mui/material'
import { 
  MenuOutlined as MenuIcon,
  CloseOutlined as CloseIcon,
  LoginOutlined as LoginIcon,
  PersonAddOutlined as RegisterIcon,
  LightModeOutlined as LightModeIcon,
  DarkModeOutlined as DarkModeIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useThemeMode } from '../../context/ThemeContext'

function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) // Standard mobile breakpoint
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { mode, toggleTheme } = useThemeMode()
  
  const isHomePage = location.pathname === '/'
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}
      >
        M
      </Box>
      
      <Box>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: mode === 'light' ? '#1e293b' : '#f1f5f9',
            lineHeight: 1,
            fontSize: '1.2rem'
          }}
        >
          Main Server
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: mode === 'light' ? '#64748b' : '#94a3b8',
            fontWeight: 500,
            fontSize: '0.7rem',
            lineHeight: 1
          }}
        >
          Platform
        </Typography>
      </Box>
    </Box>
  )

  const DesktopMenu = () => (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <IconButton 
        onClick={toggleTheme}
        sx={{ 
          color: mode === 'light' ? '#64748b' : '#94a3b8',
          p: 1,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(100, 116, 139, 0.1)' 
              : 'rgba(148, 163, 184, 0.1)',
            color: mode === 'light' ? '#1e293b' : '#f1f5f9'
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.3rem'
          },
          transition: 'all 0.2s ease'
        }}
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
      
      <Button 
        onClick={() => navigate('/login')}
        sx={{ 
          color: mode === 'light' ? '#64748b' : '#94a3b8',
          fontWeight: 500,
          px: 3,
          py: 1,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.95rem',
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(100, 116, 139, 0.1)' 
              : 'rgba(148, 163, 184, 0.1)',
            color: mode === 'light' ? '#1e293b' : '#f1f5f9'
          }
        }}
      >
        Accedi
      </Button>
      <Button 
        variant="contained"
        onClick={() => navigate('/register')}
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.95rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
            transform: 'translateY(-1px)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        Registrati
      </Button>
    </Stack>
  )

  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleMobileMenuToggle} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          <ListItem sx={{ pb: 1 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              onClick={() => {
                toggleTheme()
              }}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                justifyContent: 'flex-start',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              {mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => {
                navigate('/service-manager')
                handleMobileMenuToggle()
              }}
              sx={{
                color: 'white',
                borderColor: 'white',
                py: 1.5,
                justifyContent: 'flex-start'
              }}
            >
              Service Manager
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={() => {
                navigate('/login')
                handleMobileMenuToggle()
              }}
              sx={{
                color: 'white',
                borderColor: 'white',
                py: 1.5,
                justifyContent: 'flex-start'
              }}
            >
              Accedi
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              startIcon={<RegisterIcon />}
              onClick={() => {
                navigate('/register')
                handleMobileMenuToggle()
              }}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Registrati
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )

  const Footer = () => (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: mode === 'light' 
          ? '1px solid rgba(0, 0, 0, 0.08)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        py: 2,
        px: 2
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ 
            color: mode === 'light' ? '#64748b' : '#94a3b8',
            fontWeight: 500,
            fontSize: '0.85rem'
          }}>
© 2025 enzospenuso.com - Main Server Platform. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ 
            color: mode === 'light' ? '#94a3b8' : '#64748b',
            fontWeight: 500,
            fontSize: '0.8rem'
          }}>
            Version 1.0.0 | Enterprise Solution
          </Typography>
        </Box>
      </Container>
    </Box>
  )
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Fixed Header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: mode === 'light' 
            ? '1px solid rgba(0, 0, 0, 0.08)' 
            : '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 1100,
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, minHeight: '70px' }}>
            {/* HAMBURGER SEMPRE A SINISTRA - Mobile E Desktop */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={handleMobileMenuToggle}
                sx={{ 
                  color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${mode === 'light' ? 'rgba(30, 41, 59, 0.1)' : 'rgba(241, 245, 249, 0.1)'}`,
                  '&:hover': {
                    backgroundColor: mode === 'light' 
                      ? 'rgba(30, 41, 59, 0.05)' 
                      : 'rgba(241, 245, 249, 0.05)',
                    borderColor: mode === 'light' ? 'rgba(30, 41, 59, 0.2)' : 'rgba(241, 245, 249, 0.2)'
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.4rem'
                  }
                }}
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Logo />
            </Box>
            
            {/* Desktop menu sempre a destra */}
            {!isMobile && <DesktopMenu />}
          </Toolbar>
        </Container>
      </AppBar>
      
      <MobileMenu />
      
      {/* Scrollable Display Window */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          paddingTop: '86px', // Header height + margin
          paddingBottom: '70px', // Footer height + margin
          overflow: 'hidden' // Prevent main container from scrolling
        }}
      >
        <Box sx={{ 
          height: '100%',
          overflow: 'auto' // Enable scrolling in display window
        }}>
          <Outlet />
        </Box>
      </Box>

      {/* Fixed Footer */}
      <Footer />
    </Box>
  )
}

export default RootLayout