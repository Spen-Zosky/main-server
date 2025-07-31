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

function LandingPageTestV03() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const trigger = useScrollTrigger({ threshold: 100 })
  const mode = 'light' // Simplified theme handling
  
  useEffect(() => {
    setLoaded(true)
  }, [])
  
  const modules = [
    {
      id: 'ai-hrms',
      title: 'AI-HRMS',
      subtitle: 'Human Resources',
      description: 'Advanced HR management system with integrated AI.',
      iconName: 'users',
      stats: '10K+ Users'
    },
    {
      id: 'nose',
      title: 'NOSE',
      subtitle: 'Research Hub',
      description: 'Assistant for scientific, humanistic and industrial research.',
      iconName: 'search',
      stats: '2.5K+ Projects'
    },
    {
      id: 'web-hunter',
      title: 'Web-Hunter',
      subtitle: 'Data Intelligence',
      description: 'Framework for data acquisition and machine learning.',
      iconName: 'data',
      stats: '100M+ Data Points'
    }
  ]

  // Complete list of available interfaces
  const allInterfaces = [
    {
      title: 'Dashboard',
      description: 'Main application dashboard',
      route: '/dashboard',
      color: '#6366f1',
      emoji: '📊',
      category: 'Core'
    },
    {
      title: 'Service Manager',
      description: 'File management and service controls',
      route: '/service-manager',
      color: '#10b981',
      emoji: '⚙️',
      category: 'Management'
    },
    {
      title: 'HR Dashboard V02',
      description: 'Advanced HR analytics with Chart.js',
      route: '/hr-dashboard-v02',
      color: '#1976d2',
      emoji: '👥',
      category: 'AI-HRMS',
      isNew: true
    },
    {
      title: 'Database Manager V03',
      description: 'Complete database management interface',
      route: '/database-manager-v03',
      color: '#8b5cf6',
      emoji: '🗄️',
      category: 'Data',
      isNew: true
    },
    {
      title: 'Style Guide V03',
      description: 'Design system catalog and documentation',
      route: '/style-guide-v03',
      color: '#f59e0b',
      emoji: '🎨',
      category: 'Developer',
      isNew: true
    },
    {
      title: 'Error Testing V03',
      description: 'Error boundary testing environment',
      route: '/error-testing-v03',
      color: '#ef4444',
      emoji: '🧪',
      category: 'Testing',
      isNew: true
    },
    {
      title: 'Storybook',
      description: 'Component library and documentation',
      route: '/storybook',
      color: '#ec4899',
      emoji: '📚',
      category: 'Developer'
    }
  ]

  const stats = [
    { value: '9', label: 'Active Interfaces' },
    { value: '99.9%', label: 'Uptime' },
    { value: '200+', label: 'Components' },
    { value: '15+', label: 'AI Models' }
  ]

  const groupedInterfaces = allInterfaces.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <Box>
      {/* Background */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fafbff 0%, #f1f5f9 50%, #e2e8f0 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
            zIndex: 0
          }
        }}
      >
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={loaded} timeout={800}>
            <Box sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 4, md: 6 }, textAlign: 'center' }}>
              
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 50%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em'
                }}
              >
                🧪 TEST Environment
              </Typography>
              
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  mb: 4,
                  color: '#475569',
                  maxWidth: '800px',
                  mx: 'auto',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em'
                }}
              >
                Main Server Platform
              </Typography>

              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.35rem' },
                  mb: 4,
                  color: '#64748b',
                  maxWidth: '700px',
                  mx: 'auto',
                  fontWeight: 500,
                  lineHeight: 1.4
                }}
              >
                Complete testing environment with{' '}
                <Box component="span" sx={{ color: '#6366f1', fontWeight: 600 }}>
                  9 interfaces
                </Box>
                {' '}including V02 and V03 imports
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    px: 4.8,
                    py: 1.6,
                    fontSize: '0.88rem',
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
                  🚀 Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    px: 4.8,
                    py: 1.6,
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#4f46e5',
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔑 Login
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
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(99, 102, 241, 0.15)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800, 
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
                          color: '#64748b',
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

        {/* All Available Interfaces */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 3, md: 5 } }}>
            <Typography variant="h2" component="h2" sx={{ 
              textAlign: 'center', 
              mb: 4, 
              fontWeight: 700, 
              fontSize: { xs: '2rem', md: '2.75rem' },
              background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              letterSpacing: '-0.01em'
            }}>
              All Available Interfaces
            </Typography>
            
            {Object.entries(groupedInterfaces).map(([category, interfaces]) => (
              <Box key={category} sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  📂 {category} ({interfaces.length})
                </Typography>
                
                <Grid container spacing={3}>
                  {interfaces.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card 
                        onClick={() => navigate(item.route)}
                        sx={{ 
                          height: '100%',
                          cursor: 'pointer',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(20px)',
                          border: `1px solid ${item.color}20`,
                          borderRadius: 4,
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 20px 60px ${item.color}20`,
                            borderColor: `${item.color}40`
                          }
                        }}
                      >
                        {item.isNew && (
                          <Box sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: '#10b981',
                            color: 'white',
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
                        
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ 
                              width: 48, 
                              height: 48, 
                              borderRadius: '50%', 
                              backgroundColor: item.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.5rem',
                              fontWeight: 'bold'
                            }}>
                              {item.emoji}
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h6" component="h3" sx={{ 
                                fontWeight: 700, 
                                color: '#1e293b', 
                                mb: 0.5, 
                                lineHeight: 1.2,
                                fontSize: '1.1rem'
                              }}>
                                {item.title}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: item.color,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: `${item.color}15`,
                                px: 1.5,
                                py: 0.3,
                                borderRadius: 1,
                                display: 'inline-block'
                              }}>
                                {item.route}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" sx={{ 
                            color: '#475569', 
                            lineHeight: 1.5,
                            fontSize: '0.9rem'
                          }}>
                            {item.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </Container>

        {/* Three Main Modules */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 3, md: 5 } }}>
            <Typography variant="h2" component="h2" sx={{ 
              textAlign: 'center', 
              mb: 4, 
              fontWeight: 700, 
              fontSize: { xs: '2rem', md: '2.75rem' },
              background: 'linear-gradient(135deg, #1e293b 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              letterSpacing: '-0.01em'
            }}>
              Three Modules, One Platform
            </Typography>
            
            <Grid container spacing={3}>
              {modules.map((module, index) => (
                <Grid item xs={12} md={4} key={module.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)',
                        borderColor: 'rgba(99, 102, 241, 0.2)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: '50%', 
                          backgroundColor: module.id === 'ai-hrms' ? '#6366f1' : module.id === 'nose' ? '#10b981' : '#f59e0b',
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
                            color: '#1e293b', 
                            mb: 0.5, 
                            lineHeight: 1.3,
                            fontSize: '1.3rem'
                          }}>
                            {module.title}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ 
                            color: '#64748b', 
                            fontSize: '0.85rem',
                            fontWeight: 500
                          }}>
                            {module.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        color: '#475569', 
                        mb: 2, 
                        lineHeight: 1.5,
                        fontSize: '0.95rem'
                      }}>
                        {module.description}
                      </Typography>
                      
                      <Typography variant="caption" sx={{ 
                        color: module.id === 'ai-hrms' ? '#6366f1' : module.id === 'nose' ? '#10b981' : '#f59e0b',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        background: module.id === 'ai-hrms' ? 'rgba(99, 102, 241, 0.1)' : module.id === 'nose' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
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

        {/* Call to Action */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Typography variant="h2" component="h2" sx={{ 
              mb: 3, 
              fontWeight: 800, 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #1e293b 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
              letterSpacing: '-0.02em'
            }}>
              Start Testing Today
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 6, 
              color: '#64748b', 
              maxWidth: '600px', 
              mx: 'auto', 
              lineHeight: 1.2,
              fontSize: '1.1rem'
            }}>
              Explore all interfaces and test the complete functionality of the integrated platform
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                  color: 'white',
                  px: 6.4,
                  py: 2,
                  fontSize: '0.96rem',
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
                📊 Open Dashboard
              </Button>
              
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/service-manager')}
                sx={{ 
                  borderColor: '#10b981',
                  color: '#10b981',
                  px: 4.8,
                  py: 2,
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderRadius: 4,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#059669',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    color: '#059669',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                ⚙️ Service Manager
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
                color: '#10b981',
                fontWeight: 600
              }}>
                <Box sx={{ fontSize: '1.2rem' }}>✓</Box>
                <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                  9 Active Interfaces
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: '#10b981',
                fontWeight: 600
              }}>
                <Box sx={{ fontSize: '1.2rem' }}>✓</Box>
                <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                  V02 + V03 Integration
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: '#10b981',
                fontWeight: 600
              }}>
                <Box sx={{ fontSize: '1.2rem' }}>✓</Box>
                <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                  Full Testing Environment
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPageTestV03