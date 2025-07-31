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
import LoginModal from '../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'

function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) // Standard mobile breakpoint
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { mode, toggleTheme } = useThemeMode()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  
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
          p: 0.8,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(100, 116, 139, 0.1)' 
              : 'rgba(148, 163, 184, 0.1)',
            color: mode === 'light' ? '#1e293b' : '#f1f5f9'
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.04rem'
          },
          transition: 'all 0.2s ease'
        }}
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
      
      <Button 
        onClick={() => setLoginModalOpen(true)}
        sx={{ 
          color: mode === 'light' ? '#64748b' : '#94a3b8',
          fontWeight: 500,
          px: 2.4,
          py: 0.8,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.76rem',
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
        onClick={() => setRegisterModalOpen(true)}
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          fontWeight: 600,
          px: 2.4,
          py: 0.8,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.76rem',
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
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          position: 'absolute',
          top: '86px', // Header height
          left: '16px',
          width: 'auto',
          minWidth: '180px',
          height: 'auto',
          maxHeight: 'calc(100vh - 110px)',
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #6b7280',
          borderRadius: '12px',
          boxShadow: mode === 'light'
            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
          color: mode === 'light' ? '#1e293b' : '#f1f5f9',
          overflow: 'visible'
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'transparent'
        }
      }}
    >
      <Box sx={{ p: 1 }}>
        <List sx={{ py: 0, m: 0 }}>
          <ListItem sx={{ py: 0, px: 0 }}>
            <Button
              fullWidth
              variant="text"
              onClick={() => {
                navigate('/')
                handleMobileMenuToggle()
              }}
              sx={{
                color: mode === 'light' ? '#6366f1' : '#a5b4fc',
                py: 0.4,
                px: 0.8,
                fontSize: '0.72rem',
                fontWeight: 600,
                justifyContent: 'flex-start',
                textTransform: 'none',
                lineHeight: 1,
                minHeight: '25.6px',
                backgroundColor: mode === 'light' 
                  ? 'rgba(99, 102, 241, 0.08)' 
                  : 'rgba(165, 180, 252, 0.08)',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(99, 102, 241, 0.12)' 
                    : 'rgba(165, 180, 252, 0.12)'
                }
              }}
            >
              Home
            </Button>
          </ListItem>
          <ListItem sx={{ py: 0, px: 0 }}>
            <Button
              fullWidth
              variant="text"
              onClick={() => {
                navigate('/service-manager')
                handleMobileMenuToggle()
              }}
              sx={{
                color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                py: 0.4,
                px: 0.8,
                fontSize: '0.72rem',
                fontWeight: 500,
                justifyContent: 'flex-start',
                textTransform: 'none',
                lineHeight: 1,
                minHeight: '25.6px',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(30, 41, 59, 0.08)' 
                    : 'rgba(241, 245, 249, 0.08)'
                }
              }}
            >
              Service Manager
            </Button>
          </ListItem>
          <ListItem sx={{ py: 0, px: 0 }}>
            <Button
              fullWidth
              variant="text"
              onClick={() => {
                navigate('/database-manager')
                handleMobileMenuToggle()
              }}
              sx={{
                color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                py: 0.4,
                px: 0.8,
                fontSize: '0.72rem',
                fontWeight: 500,
                justifyContent: 'flex-start',
                textTransform: 'none',
                lineHeight: 1,
                minHeight: '25.6px',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(30, 41, 59, 0.08)' 
                    : 'rgba(241, 245, 249, 0.08)'
                }
              }}
            >
              Database Manager
            </Button>
          </ListItem>
          <ListItem sx={{ py: 0, px: 0 }}>
            <Button
              fullWidth
              variant="text"
              onClick={() => {
                navigate('/style-guide')
                handleMobileMenuToggle()
              }}
              sx={{
                color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                py: 0.4,
                px: 0.8,
                fontSize: '0.72rem',
                fontWeight: 500,
                justifyContent: 'flex-start',
                textTransform: 'none',
                lineHeight: 1,
                minHeight: '25.6px',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(30, 41, 59, 0.08)' 
                    : 'rgba(241, 245, 249, 0.08)'
                }
              }}
            >
              Style Guide
            </Button>
          </ListItem>
          <ListItem sx={{ py: 0, px: 0 }}>
            <Button
              fullWidth
              variant="text"
              onClick={() => {
                setLoginModalOpen(true)
                handleMobileMenuToggle()
              }}
              sx={{
                color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                py: 0.4,
                px: 0.8,
                fontSize: '0.72rem',
                fontWeight: 500,
                justifyContent: 'flex-start',
                textTransform: 'none',
                lineHeight: 1,
                minHeight: '25.6px',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(30, 41, 59, 0.08)' 
                    : 'rgba(241, 245, 249, 0.08)'
                }
              }}
            >
              Accedi
            </Button>
          </ListItem>
          <ListItem sx={{ py: 0, px: 0 }}>
            <Button
              fullWidth
              variant="text"
              onClick={() => {
                setRegisterModalOpen(true)
                handleMobileMenuToggle()
              }}
              sx={{
                color: mode === 'light' ? '#6366f1' : '#a5b4fc',
                py: 0.4,
                px: 0.8,
                fontSize: '0.9rem',
                fontWeight: 600,
                justifyContent: 'flex-start',
                textTransform: 'none',
                lineHeight: 1,
                minHeight: '32px',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(99, 102, 241, 0.08)' 
                    : 'rgba(165, 180, 252, 0.08)'
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
        py: 1.5,
        px: 0
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        px: 1,
        width: '100%'
      }}>
        <Typography variant="body2" sx={{ 
          color: mode === 'light' ? '#64748b' : '#94a3b8',
          fontWeight: 500,
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          lineHeight: 1
        }}>
© 2025 enzospenuso.com - Main Server Platform. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ 
          color: mode === 'light' ? '#94a3b8' : '#64748b',
          fontWeight: 500,
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
          lineHeight: 1
        }}>
          Version 1.0.0 | Enterprise Solution
        </Typography>
      </Box>
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1, 
          px: 1,
          minHeight: '60px',
          width: '100%'
        }}>
          {/* HAMBURGER SEMPRE A SINISTRA - Mobile E Desktop */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <IconButton 
              onClick={handleMobileMenuToggle}
              sx={{ 
                color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                p: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                border: `1px solid ${mode === 'light' ? 'rgba(30, 41, 59, 0.1)' : 'rgba(241, 245, 249, 0.1)'}`,
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(30, 41, 59, 0.05)' 
                    : 'rgba(241, 245, 249, 0.05)',
                  borderColor: mode === 'light' ? 'rgba(30, 41, 59, 0.2)' : 'rgba(241, 245, 249, 0.2)'
                },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1.2rem', sm: '1.4rem' }
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
        </Box>
      </AppBar>
      
      <MobileMenu />
      
      {/* Scrollable Display Window */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          paddingTop: '62px', // Header height reduced
          paddingBottom: '60px', // Footer height reduced
          overflow: 'hidden' // Prevent main container from scrolling
        }}
      >
        <Box sx={{ 
          height: '100%',
          overflow: 'auto' // Enable scrolling in display window
        }} className="scrollbar-modern">
          <Outlet />
        </Box>
      </Box>

      {/* Fixed Footer */}
      <Footer />

      {/* Modali Login e Registrazione */}
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false)
          setRegisterModalOpen(true)
        }}
      />
      <RegisterModal 
        open={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false)
          setLoginModalOpen(true)
        }}
      />
    </Box>
  )
}

export default RootLayout