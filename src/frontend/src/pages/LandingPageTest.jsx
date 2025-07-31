import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack,
  Fade,
  useScrollTrigger
} from '@mui/material'
// import { Icon, ThemedIcon } from '../components/ui/IconLibrary' // Rimuoso per evitare conflitti build
import { useThemeMode } from '../context/ThemeContext'

function LandingPageTest() {
  const [loaded, setLoaded] = useState(false)
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
    }
  ]

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '200+', label: 'Integrations' },
    { value: '15+', label: 'AI Models' }
  ]

  return (
    <Box>
      {/* Single Background for entire page */}
      <Box
        sx={{
          minHeight: '100vh',
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #fafbff 0%, #f1f5f9 50%, #e2e8f0 100%)' 
            : 'linear-gradient(135deg, #0c1129 0%, #1e293b 50%, #334155 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: mode === 'light'
              ? 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)'
              : 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            zIndex: 0
          }
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
              

              <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Box 
                      sx={{ 
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: mode === 'light' 
                          ? 'rgba(255, 255, 255, 0.7)' 
                          : 'rgba(30, 41, 59, 0.3)',
                        backdropFilter: 'blur(10px)',
                        border: mode === 'light' 
                          ? '1px solid rgba(99, 102, 241, 0.1)' 
                          : '1px solid rgba(165, 180, 252, 0.1)',
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
                          <Box sx={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: '50%', 
                            backgroundColor: module.id === 'ai-hrms' 
                              ? (mode === 'light' ? '#6366f1' : '#a5b4fc')
                              : module.id === 'nose' 
                              ? (mode === 'light' ? '#10b981' : '#6ee7b7')
                              : (mode === 'light' ? '#f59e0b' : '#fbbf24'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}>
                            {module.id === 'ai-hrms' ? '🤖' : module.id === 'nose' ? '🔍' : '🕷️'}
                          </Box>
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
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 4,
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
                        transform: 'translateY(-6px)',
                        boxShadow: mode === 'light'
                          ? '0 16px 40px rgba(99, 102, 241, 0.15)'
                          : '0 16px 40px rgba(0, 0, 0, 0.3)',
                        borderColor: mode === 'light' 
                          ? 'rgba(99, 102, 241, 0.2)' 
                          : 'rgba(165, 180, 252, 0.2)'
                      }
                    }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        backgroundColor: mode === 'light' ? '#6366f1' : '#a5b4fc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}>
                        {feature.iconName === 'security' ? '🔒' : 
                         feature.iconName === 'performance' ? '⚡' :
                         feature.iconName === 'ai' ? '🤖' : '☁️'}
                      </Box>
                      <Box sx={{ ml: 3 }}>
                        <Typography variant="h6" component="h3" sx={{ 
                          fontWeight: 700, 
                          color: mode === 'light' ? '#1e293b' : '#f1f5f9', 
                          mb: 1, 
                          lineHeight: 1.1,
                          fontSize: '1.2rem'
                        }}>
                          {feature.title}
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
    </Box>
  )
}

export default LandingPageTest