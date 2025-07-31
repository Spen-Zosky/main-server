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
  Fade
} from '@mui/material'
import {
  RocketLaunch as RocketIcon,
  Psychology as AIIcon,
  Search as SearchIcon,
  Web as WebIcon,
  Security as SecurityIcon,
  Speed as PerformanceIcon,
  Cloud as CloudIcon,
  Settings as SettingsIcon,
  Code as CodeIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useThemeMode } from '../context/ThemeContext'

function LandingPageMinimal() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
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
      icon: <AIIcon sx={{ fontSize: '2.5rem' }} />,
      stats: '10K+ Users',
      color: '#1976d2'
    },
    {
      id: 'nose',
      title: 'NOSE',
      subtitle: 'Research Hub',
      description: 'Assistente per ricerca scientifica, umanistica e industriale.',
      icon: <SearchIcon sx={{ fontSize: '2.5rem' }} />,
      stats: '2.5K+ Projects',
      color: '#388e3c'
    },
    {
      id: 'web-hunter',
      title: 'Web-Hunter',
      subtitle: 'Data Intelligence',
      description: 'Framework per acquisizione dati e machine learning.',
      icon: <WebIcon sx={{ fontSize: '2.5rem' }} />,
      stats: '100M+ Data Points',
      color: '#f57c00'
    }
  ]

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: '2rem' }} />,
      title: 'Sicurezza Enterprise',
      description: 'Protezione avanzata e compliance',
      color: '#1976d2'
    },
    {
      icon: <PerformanceIcon sx={{ fontSize: '2rem' }} />,
      title: 'Performance Ottimizzate',
      description: 'Velocità e scalabilità garantite',
      color: '#388e3c'
    },
    {
      icon: <AIIcon sx={{ fontSize: '2rem' }} />,
      title: 'AI-Powered',
      description: 'Intelligenza artificiale integrata',
      color: '#9c27b0'
    },
    {
      icon: <CloudIcon sx={{ fontSize: '2rem' }} />,
      title: 'Cloud Ready',
      description: 'Deployment flessibile multi-cloud',
      color: '#f57c00'
    },
    {
      icon: <SettingsIcon sx={{ fontSize: '2rem' }} />,
      title: 'Service Manager',
      description: 'File management con Storybook e navigazione cronologica',
      color: '#e91e63',
      isNew: true
    },
    {
      icon: <CodeIcon sx={{ fontSize: '2rem' }} />,
      title: 'Component Library',
      description: 'Storybook integrato per sviluppo componenti',
      color: '#00bcd4',
      isNew: true
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
      {/* Hero Section con gradiente enterprise */}
      <Box
        sx={{
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f4c75 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in={loaded} timeout={1000}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              {/* Logo e titolo principale */}
              <Box sx={{ mb: 4 }}>
                <RocketIcon 
                  sx={{ 
                    fontSize: '4rem', 
                    color: 'white',
                    mb: 2,
                    filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.3))'
                  }} 
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '4.5rem', lg: '5.5rem' },
                    fontWeight: 700,
                    color: 'white',
                    mb: 2,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Main Server Platform
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' },
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 400,
                    mb: 4,
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  Sistema Enterprise Completo - AI-HRMS | NOSE | Web-Hunter
                </Typography>
              </Box>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(255, 107, 107, 0.6)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🚀 Inizia Subito
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(255,255,255,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔐 Accedi
                </Button>
              </Stack>

              {/* Stats */}
              <Grid container spacing={4} justifyContent="center">
                {stats.map((stat, index) => (
                  <Grid item key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: 'white',
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
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
      </Box>

      {/* Modules Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
            color: mode === 'light' ? '#1e293b' : '#f1f5f9'
          }}
        >
          Moduli Enterprise
        </Typography>
        
        <Grid container spacing={4}>
          {modules.map((module, index) => (
            <Grid item xs={12} md={4} key={module.id}>
              <Fade in={loaded} timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    background: mode === 'light' 
                      ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                      : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: `2px solid ${module.color}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: `0 20px 40px ${module.color}30`,
                      borderColor: module.color
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ color: module.color, mb: 2 }}>
                      {module.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: module.color
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: mode === 'light' ? '#64748b' : '#94a3b8',
                        fontWeight: 500
                      }}
                    >
                      {module.subtitle}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: mode === 'light' ? '#475569' : '#cbd5e1',
                        lineHeight: 1.6
                      }}
                    >
                      {module.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: module.color,
                        background: `${module.color}15`,
                        py: 1,
                        px: 2,
                        borderRadius: 2,
                        display: 'inline-block'
                      }}
                    >
                      {module.stats}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        py: 8 
      }}>
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: mode === 'light' ? '#1e293b' : '#f1f5f9'
            }}
          >
            Caratteristiche Enterprise
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in={loaded} timeout={1500 + index * 100}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: mode === 'light' ? 'white' : '#1e293b',
                      border: `1px solid ${feature.color}30`,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 15px 30px ${feature.color}20`,
                        borderColor: `${feature.color}60`
                      }
                    }}
                  >
                    {feature.isNew && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: 16,
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        NEW
                      </Box>
                    )}
                    <Box sx={{ color: feature.color, mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: mode === 'light' ? '#1e293b' : '#f1f5f9'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: mode === 'light' ? '#64748b' : '#94a3b8',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Final */}
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: mode === 'light' ? '#1e293b' : '#f1f5f9'
          }}
        >
          Pronto per iniziare?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: mode === 'light' ? '#64748b' : '#94a3b8',
            fontWeight: 400
          }}
        >
          Accedi alla piattaforma enterprise più avanzata del settore
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 35px rgba(99, 102, 241, 0.6)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Inizia la prova gratuita
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/service-manager')}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderColor: mode === 'light' ? '#6366f1' : '#8b5cf6',
              color: mode === 'light' ? '#6366f1' : '#8b5cf6',
              '&:hover': {
                borderColor: mode === 'light' ? '#4f46e5' : '#7c3aed',
                background: mode === 'light' ? '#6366f110' : '#8b5cf610',
                transform: 'translateY(-3px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Service Manager
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default LandingPageMinimal