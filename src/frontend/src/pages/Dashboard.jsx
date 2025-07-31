import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Paper
} from '@mui/material'
import {
  WorkOutlined as HRIcon,
  SearchOutlined as ResearchIcon,
  DataObjectOutlined as DataIcon,
  DashboardOutlined as DashboardIcon,
  TrendingUpOutlined as TrendingIcon,
  NotificationsOutlined as NotificationIcon
} from '@mui/icons-material'

function Dashboard() {
  const navigate = useNavigate()
  
  const handleModuleClick = (moduleId) => {
    if (moduleId === 'ai-hrms') {
      navigate('/hr')
    }
    // Add other module navigations later
  }
  
  const modules = [
    {
      id: 'ai-hrms',
      title: 'AI-HRMS',
      description: 'Gestione Risorse Umane',
      icon: HRIcon,
      color: '#1976d2',
      stats: { active: 45, pending: 12 },
      status: 'Operativo'
    },
    {
      id: 'nose',
      title: 'NOSE',
      description: 'Research Hound',
      icon: ResearchIcon,
      color: '#388e3c',
      stats: { active: 23, pending: 7 },
      status: 'Operativo'
    },
    {
      id: 'web-hunter',
      title: 'Web-Hunter',
      description: 'Data Mining & ML',
      icon: DataIcon,
      color: '#f57c00',
      stats: { active: 31, pending: 5 },
      status: 'Operativo'
    }
  ]

  const quickStats = [
    { label: 'Utenti Attivi', value: '1,234', change: '+12%' },
    { label: 'Progetti Attivi', value: '89', change: '+8%' },
    { label: 'Task Completati', value: '2,567', change: '+15%' },
    { label: 'Uptime Sistema', value: '99.9%', change: '0%' }
  ]

  return (
    <Box sx={{ py: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Benvenuto nella Main Server Platform
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickStats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<TrendingIcon />}
                    label={stat.change}
                    size="small"
                    color={stat.change.startsWith('+') ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Modules Grid */}
        <Grid container spacing={4}>
          {modules.map((module) => {
            const IconComponent = module.icon
            return (
              <Grid item xs={12} md={4} key={module.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: module.color,
                          width: 56,
                          height: 56,
                          mr: 2
                        }}
                      >
                        <IconComponent sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                          {module.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {module.description}
                        </Typography>
                      </Box>
                      <Chip 
                        label={module.status}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: module.color, fontWeight: 600 }}>
                          {module.stats.active}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Attivi
                        </Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {module.stats.pending}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          In Sospeso
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Button 
                      variant="contained"
                      fullWidth
                      onClick={() => handleModuleClick(module.id)}
                      sx={{ 
                        backgroundColor: module.color,
                        '&:hover': {
                          backgroundColor: module.color,
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      Accedi a {module.title}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* Recent Activity */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            Attività Recenti
          </Typography>
          
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="h6">Nessuna nuova attività</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Le attività recenti appariranno qui una volta che i moduli saranno operativi.
            </Typography>
          </Paper>
        </Box>

        {/* System Status */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DashboardIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">Sistema Operativo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tutti i servizi sono online e funzionanti
                  </Typography>
                </Box>
              </Box>
              <Chip label="Tutto OK" color="success" />
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default Dashboard