import React from 'react'
import { Box, Container, Typography, Button, Paper } from '@mui/material'
import { HomeOutlined as HomeIcon, ArrowBackOutlined as BackIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            color: 'text.primary'
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: '8rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            404
          </Typography>
          
          <Typography variant="h3" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
            Pagina Non Trovata
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            La pagina che stai cercando non esiste o è stata spostata.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ px: 4 }}
            >
              Torna alla Home
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<BackIcon />}
              onClick={() => navigate(-1)}
              sx={{ px: 4 }}
            >
              Torna Indietro
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default NotFoundPage