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
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Stack,
  Divider
} from '@mui/material'
import { 
  MenuOutlined as MenuIcon,
  CloseOutlined as CloseIcon,
  WorkOutlined as HRIcon,
  SearchOutlined as ResearchIcon,
  DataObjectOutlined as DataIcon,
  DashboardOutlined as DashboardIcon,
  PersonOutlined as ProfileIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
      {/* Logo Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #388e3c 50%, #f57c00 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '1.2rem'
        }}
      >
        M
      </Box>
      
      {/* Logo Text */}
      <Box>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 800,
            color: 'white',
            lineHeight: 1,
            fontSize: '1.25rem'
          }}
        >
          Main Server
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: 1
          }}
        >
          Platform
        </Typography>
      </Box>
    </Box>
  )

  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: DashboardIcon,
      path: '/dashboard',
      color: '#667eea'
    },
    {
      label: 'AI-HRMS',
      icon: HRIcon,
      path: '/ai-hrms',
      color: '#1976d2'
    },
    {
      label: 'NOSE Research',
      icon: ResearchIcon,
      path: '/nose',
      color: '#388e3c'
    },
    {
      label: 'Web-Hunter',
      icon: DataIcon,
      path: '/web-hunter',
      color: '#f57c00'
    }
  ]

  const userItems = [
    {
      label: 'Profile',
      icon: ProfileIcon,
      path: '/profile'
    },
    {
      label: 'Settings',
      icon: SettingsIcon,
      path: '/settings'
    },
    {
      label: 'Logout',
      icon: LogoutIcon,
      action: 'logout'
    }
  ]

  const Sidebar = ({ variant = 'persistent' }) => (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        backgroundColor: 'transparent', // Transparent background
        backdropFilter: 'none',
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Logo />
          {isMobile && (
            <IconButton onClick={handleSidebarToggle} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, px: 2 }}>
        <List>
          {sidebarItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.8)',
                  backgroundColor: location.pathname === item.path ? `${item.color}20` : 'transparent',
                  border: location.pathname === item.path ? `1px solid ${item.color}40` : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: `${item.color}10`,
                    color: 'white'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: 40 
                }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* User Items */}
        <List>
          {userItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  if (item.action === 'logout') {
                    // Handle logout
                    navigate('/login')
                  } else {
                    navigate(item.path)
                  }
                }}
                sx={{
                  borderRadius: 2,
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: 40 
                }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )

  // Transparent Header
  const Header = () => (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        zIndex: 1100,
        borderBottom: 'none',
        color: 'white'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, minHeight: '70px' }}>
          {isMobile && (
            <IconButton 
              onClick={handleSidebarToggle}
              sx={{ 
                color: 'white',
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* User Menu */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button 
              color="inherit" 
              onClick={() => navigate('/profile')}
              sx={{ 
                color: 'white',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Profile
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )

  // Transparent Footer
  const Footer = () => (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: isMobile ? 0 : 280, // Adjust for sidebar width
        right: 0,
        zIndex: 1000,
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        borderTop: 'none',
        py: 1,
        px: 2
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          © 2025 Main Server Platform | Dashboard Interface
        </Typography>
      </Container>
    </Box>
  )
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={handleSidebarToggle}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: 'transparent',
              backdropFilter: 'blur(20px)',
              border: 'none'
            }
          }}
        >
          <Sidebar variant="temporary" />
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && sidebarOpen && (
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 1050
          }}
        >
          <Sidebar variant="persistent" />
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: !isMobile && sidebarOpen ? '280px' : 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Header />
        
        {/* Scrollable Display Window */}
        <Box 
          component="main" 
          sx={{ 
            paddingTop: '86px', // Header height + margin
            paddingBottom: '50px', // Footer height + margin
            minHeight: '100vh',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            height: '100%',
            overflow: 'auto'
          }}>
            <Outlet />
          </Box>
        </Box>

        <Footer />
      </Box>
    </Box>
  )
}

export default DashboardLayout