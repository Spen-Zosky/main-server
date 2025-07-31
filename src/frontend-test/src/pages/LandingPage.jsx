import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Stack,
  Fade,
  useScrollTrigger
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
// Rimuoviamo temporaneamente le icone fino a fix completo
// import { Icon } from '../components/ui/IconLibrarySimple'
import { useThemeMode } from '../context/ThemeContext'
import LoginModal from '../components/auth/LoginModal'
import RegisterModal from '../components/auth/RegisterModal'

function LandingPage() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const trigger = useScrollTrigger({ threshold: 100 })
  const { mode } = useThemeMode()
  
  useEffect(() => {
    setLoaded(true)
  }, [])
  
  const modules = [
    {
      id: 'ai-hrms',
      title: 'AI-HRMS',
      subtitle: 'Human Resources',
      description: 'Sistema intelligente per la gestione delle risorse umane con AI integrata.',
      iconName: 'users',
      stats: '10K+ Users'
    },
    {
      id: 'nose',
      title: 'NOSE',
      subtitle: 'Research Hub',
      description: 'Assistente per ricerca scientifica, umanistica e industriale.',
      iconName: 'search',
      stats: '2.5K+ Projects'
    },
    {
      id: 'web-hunter',
      title: 'Web-Hunter',
      subtitle: 'Data Intelligence',
      description: 'Framework per acquisizione dati e machine learning.',
      iconName: 'data',
      stats: '100M+ Data Points'
    }
  ]

  const features = [
    {
      iconName: 'security',
      title: 'Sicurezza Enterprise',
      description: 'Protezione avanzata e compliance'
    },
    {
      iconName: 'performance',
      title: 'Performance Ottimizzate',
      description: 'Velocità e scalabilità garantite'
    },
    {
      iconName: 'ai',
      title: 'AI-Powered',
      description: 'Intelligenza artificiale integrata'
    },
    {
      iconName: 'cloud',
      title: 'Cloud Ready',
      description: 'Deployment flessibile multi-cloud'
    },
    {
      iconName: 'settings',
      title: 'Service Manager',
      description: 'File management con Storybook e navigazione cronologica',
      isNew: true
    },
    {
      iconName: 'code',
      title: 'Component Library',
      description: 'Storybook integrato per sviluppo componenti',
      isNew: true
    },
    {
      iconName: 'database',
      title: 'Database Manager',
      description: 'Gestione completa database con performance monitoring',
      isNew: true
    },
    {
      iconName: 'palette',
      title: 'Style Guide',
      description: 'Catalogo design system e documentazione componenti',
      isNew: true
    },
    {
      iconName: 'analytics',
      title: 'HR Analytics',
      description: 'Dashboard avanzato risorse umane con Chart.js',
      isNew: true
    }
  ]

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '9+', label: 'Interfaces' },
    { value: '15+', label: 'AI Models' }
  ]

  return (
    <Box>
      {/* Single Background for entire page */}
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={loaded} timeout={800}>
            <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 }, textAlign: 'center' }}>
              
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '3rem', md: '5rem' },
                  fontWeight: 800,
                  mb: 3,
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #1e293b 0%, #6366f1 50%, #8b5cf6 100%)'
                    : 'linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 50%, #c4b5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                Main Server Platform
              </Typography>
              
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.35rem' },
                  mb: 6,
                  color: mode === 'light' ? '#475569' : '#cbd5e1',
                  maxWidth: '700px',
                  mx: 'auto',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  letterSpacing: '-0.01em'
                }}
              >
                Piattaforma AI unificata per{' '}
                <Box component="span" sx={{ 
                  color: mode === 'light' ? '#6366f1' : '#a5b4fc',
                  fontWeight: 600
                }}>
                  HR Management
                </Box>
                ,{' '}
                <Box component="span" sx={{ 
                  color: mode === 'light' ? '#8b5cf6' : '#c4b5fd',
                  fontWeight: 600
                }}>
                  Ricerca Scientifica
                </Box>
                {' '}e{' '}
                <Box component="span" sx={{ 
                  color: mode === 'light' ? '#ec4899' : '#f0abfc',
                  fontWeight: 600
                }}>
                  Data Intelligence
                </Box>
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 8 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => setRegisterModalOpen(true)}
                  sx={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Inizia Gratis
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => setLoginModalOpen(true)}
                  sx={{ 
                    borderColor: mode === 'light' ? '#6366f1' : '#a5b4fc',
                    color: mode === 'light' ? '#6366f1' : '#a5b4fc',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: mode === 'light' ? '#4f46e5' : '#c4b5fd',
                      backgroundColor: mode === 'light' 
                        ? 'rgba(99, 102, 241, 0.05)' 
                        : 'rgba(165, 180, 252, 0.05)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Esplora Demo
                </Button>
              </Stack>

              <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Box 
                      sx={{ 
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: mode === 'light'
                            ? '0 12px 32px rgba(99, 102, 241, 0.15)'
                            : '0 12px 32px rgba(0, 0, 0, 0.3)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800, 
                          background: mode === 'light'
                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                            : 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          mb: 1,
                          fontSize: { xs: '2rem', sm: '2.5rem' }
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: mode === 'light' ? '#64748b' : '#94a3b8',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Container>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 6, md: 10 } }}>
              <Typography variant="h2" component="h2" sx={{ 
                textAlign: 'center', 
                mb: 6, 
                fontWeight: 700, 
                fontSize: { xs: '2rem', md: '2.75rem' },
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)'
                  : 'linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
                letterSpacing: '-0.01em'
              }}>
                Tre Moduli, Una Piattaforma
              </Typography>
              
              <Grid container spacing={3}>
                {modules.map((module, index) => (
                  <Grid item xs={12} md={4} key={module.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        backgroundColor: mode === 'light' 
                          ? 'rgba(255, 255, 255, 0.8)' 
                          : 'rgba(30, 41, 59, 0.4)',
                        backdropFilter: 'blur(20px)',
                        border: mode === 'light' 
                          ? '1px solid rgba(99, 102, 241, 0.1)' 
                          : '1px solid rgba(165, 180, 252, 0.1)',
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: mode === 'light'
                            ? '0 20px 60px rgba(99, 102, 241, 0.15)'
                            : '0 20px 60px rgba(0, 0, 0, 0.4)',
                          borderColor: mode === 'light' 
                            ? 'rgba(99, 102, 241, 0.2)' 
                            : 'rgba(165, 180, 252, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {/* <ThemedIcon 
                            name={module.iconName} 
                            theme={module.id === 'ai-hrms' ? 'ai' : module.id === 'nose' ? 'nose' : 'hunter'} 
                            size="lg" 
                            className="mr-3"
                          /> */}
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="h5" component="h3" sx={{ 
                              fontWeight: 700, 
                              color: mode === 'light' ? '#1e293b' : '#f1f5f9', 
                              mb: 0.5, 
                              lineHeight: 1.1,
                              fontSize: '1.3rem'
                            }}>
                              {module.title}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ 
                              color: mode === 'light' ? '#64748b' : '#94a3b8', 
                              fontSize: '0.85rem',
                              fontWeight: 500
                            }}>
                              {module.subtitle}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ 
                          color: mode === 'light' ? '#475569' : '#cbd5e1', 
                          mb: 2, 
                          lineHeight: 1.5,
                          fontSize: '0.95rem'
                        }}>
                          {module.description}
                        </Typography>
                        
                        <Typography variant="caption" sx={{ 
                          color: module.id === 'ai-hrms' 
                            ? (mode === 'light' ? '#6366f1' : '#a5b4fc')
                            : module.id === 'nose' 
                            ? (mode === 'light' ? '#10b981' : '#6ee7b7')
                            : (mode === 'light' ? '#f59e0b' : '#fbbf24'),
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          background: module.id === 'ai-hrms' 
                            ? (mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(165, 180, 252, 0.1)')
                            : module.id === 'nose' 
                            ? (mode === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(110, 231, 183, 0.1)')
                            : (mode === 'light' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(251, 191, 36, 0.1)'),
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          display: 'inline-block'
                        }}>
                          {module.stats}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
        </Container>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 6, md: 10 } }}>
              <Typography variant="h2" component="h2" sx={{ 
                textAlign: 'center', 
                mb: 6, 
                fontWeight: 700, 
                fontSize: { xs: '2rem', md: '2.75rem' },
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #1e293b 0%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, #f1f5f9 0%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
                letterSpacing: '-0.01em'
              }}>
                Tecnologie Enterprise
              </Typography>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box 
                      onClick={
                        feature.title === 'Service Manager' ? () => navigate('/service-manager') :
                        feature.title === 'Component Library' ? () => navigate('/storybook') :
                        feature.title === 'Database Manager' ? () => navigate('/database-manager-v03') :
                        feature.title === 'Style Guide' ? () => navigate('/style-guide-v03') :
                        feature.title === 'HR Analytics' ? () => navigate('/hr-dashboard-v02') :
                        undefined
                      }
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 4,
                        backgroundColor: feature.isNew 
                          ? (mode === 'light' 
                            ? 'rgba(16, 185, 129, 0.1)' 
                            : 'rgba(110, 231, 183, 0.1)')
                          : (mode === 'light' 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'rgba(30, 41, 59, 0.4)'),
                        backdropFilter: 'blur(20px)',
                        border: feature.isNew 
                          ? (mode === 'light' 
                            ? '1px solid rgba(16, 185, 129, 0.3)' 
                            : '1px solid rgba(110, 231, 183, 0.3)')
                          : (mode === 'light' 
                            ? '1px solid rgba(99, 102, 241, 0.1)' 
                            : '1px solid rgba(165, 180, 252, 0.1)'),
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        cursor: (feature.title === 'Service Manager' || feature.title === 'Component Library' || feature.title === 'Database Manager' || feature.title === 'Style Guide' || feature.title === 'HR Analytics') ? 'pointer' : 'default',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: feature.isNew
                            ? (mode === 'light'
                              ? '0 16px 40px rgba(16, 185, 129, 0.2)'
                              : '0 16px 40px rgba(110, 231, 183, 0.2)')
                            : (mode === 'light'
                              ? '0 16px 40px rgba(99, 102, 241, 0.15)'
                              : '0 16px 40px rgba(0, 0, 0, 0.3)'),
                          borderColor: feature.isNew 
                            ? (mode === 'light' 
                              ? 'rgba(16, 185, 129, 0.4)' 
                              : 'rgba(110, 231, 183, 0.4)')
                            : (mode === 'light' 
                              ? 'rgba(99, 102, 241, 0.2)' 
                              : 'rgba(165, 180, 252, 0.2)')
                        }
                      }}
                    >
                      {feature.isNew && (
                        <Box sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: mode === 'light' ? '#10b981' : '#6ee7b7',
                          color: mode === 'light' ? 'white' : '#065f46',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}>
                          NEW
                        </Box>
                      )}
                      {/* <ThemedIcon 
                        name={feature.iconName} 
                        theme={feature.isNew ? "nose" : "primary"} 
                        size="md" 
                      /> */}
                      <Box sx={{ ml: 3 }}>
                        <Typography variant="h6" component="h3" sx={{ 
                          fontWeight: 700, 
                          color: feature.isNew 
                            ? (mode === 'light' ? '#10b981' : '#6ee7b7')
                            : (mode === 'light' ? '#1e293b' : '#f1f5f9'), 
                          mb: 1, 
                          lineHeight: 1.1,
                          fontSize: '1.2rem'
                        }}>
                          {feature.title}
                          {feature.title === 'Service Manager' && ' ⚡'}
                          {feature.title === 'Component Library' && ' 📚'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: mode === 'light' ? '#64748b' : '#cbd5e1', 
                          lineHeight: 1.4,
                          fontSize: '0.95rem'
                        }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
        </Container>

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
              <Typography variant="h2" component="h2" sx={{ 
                mb: 3, 
                fontWeight: 800, 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #1e293b 0%, #ec4899 100%)'
                  : 'linear-gradient(135deg, #f1f5f9 0%, #f0abfc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}>
                Inizia Oggi
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 6, 
                color: mode === 'light' ? '#64748b' : '#cbd5e1', 
                maxWidth: '600px', 
                mx: 'auto', 
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}>
                Trasforma i tuoi processi business con la piattaforma AI-powered più avanzata del mercato
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                    color: 'white',
                    px: 8,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderRadius: 4,
                    textTransform: 'none',
                    boxShadow: '0 12px 40px rgba(236, 72, 153, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #db2777 0%, #7c3aed 50%, #4f46e5 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 16px 50px rgba(236, 72, 153, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🚀 Inizia Gratis Ora
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/service-manager')}
                  sx={{ 
                    borderColor: mode === 'light' ? '#10b981' : '#6ee7b7',
                    color: mode === 'light' ? '#10b981' : '#6ee7b7',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: mode === 'light' ? '#059669' : '#a7f3d0',
                      backgroundColor: mode === 'light' 
                        ? 'rgba(16, 185, 129, 0.05)' 
                        : 'rgba(110, 231, 183, 0.05)',
                      color: mode === 'light' ? '#059669' : '#a7f3d0',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  ⚡ Service Manager
                </Button>
              </Stack>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={4} 
                justifyContent="center" 
                sx={{ mt: 6, flexWrap: 'wrap' }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: mode === 'light' ? '#10b981' : '#6ee7b7',
                  fontWeight: 600
                }}>
                  <Box sx={{ fontSize: '1.2rem' }}>✓</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                    Setup 5 min
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: mode === 'light' ? '#10b981' : '#6ee7b7',
                  fontWeight: 600
                }}>
                  <Box sx={{ fontSize: '1.2rem' }}>✓</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                    Supporto 24/7
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: mode === 'light' ? '#10b981' : '#6ee7b7',
                  fontWeight: 600
                }}>
                  <Box sx={{ fontSize: '1.2rem' }}>✓</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                    30 giorni free
                  </Typography>
                </Box>
              </Stack>
            </Box>
        </Container>
      </Box>

      {/* Auth Modals */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false)
          setRegisterModalOpen(true)
        }}
        onLoginSuccess={() => {
          navigate('/dashboard')
        }}
      />

      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false)
          setLoginModalOpen(true)
        }}
        onRegisterSuccess={() => {
          // Mostra messaggio di successo e passa al login
          setRegisterModalOpen(false)
          setLoginModalOpen(true)
        }}
      />
    </Box>
  )
}

export default LandingPage