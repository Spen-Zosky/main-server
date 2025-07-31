import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material'
import {
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  LoginOutlined as LoginIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Chiamata API diretta (JWT stateless, no CSRF needed)
      const response = await authAPI.login({
        login: formData.login,
        password: formData.password
      })
      
      const data = response

      if (data.success) {
        // Il token JWT sarà gestito tramite httpOnly cookie dal backend
        navigate('/dashboard')
      } else {
        setError(data.error || 'Credenziali non valide')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Errore di connessione al server. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 700, lineHeight: 1.3 }}>
              Accedi
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Benvenuto nella Main Server Platform
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="login"
              type="text"
              label="Email o Username"
              value={formData.login}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{ mb: 3, py: 1.2 }}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Oppure
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Non hai un account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/register')}
                  sx={{ fontWeight: 600 }}
                >
                  Registrati qui
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Demo credentials info */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: 'info.light',
              borderRadius: 2
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Credenziali Demo:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              Email: admin@example.com<br />
              Password: Admin123
            </Typography>
          </Paper>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage