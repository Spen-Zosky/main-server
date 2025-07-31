import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Fade,
  Paper
} from '@mui/material'
import {
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  LoginOutlined as LoginIcon,
  CloseOutlined as CloseIcon
} from '@mui/icons-material'
import { useThemeMode } from '../../context/ThemeContext'
import { authAPI } from '../../services/api'

function LoginModal({ open, onClose, onSwitchToRegister, onLoginSuccess }) {
  const { mode, theme } = useThemeMode()
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
      const response = await authAPI.login({
        login: formData.login,
        password: formData.password
      })
      
      if (response.success) {
        onLoginSuccess && onLoginSuccess()
        onClose()
      } else {
        setError(response.error || 'Credenziali non valide')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Errore di connessione al server. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ login: '', password: '' })
    setError('')
    setShowPassword(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${mode === 'dark' ? 'rgba(165, 180, 252, 0.1)' : 'rgba(99, 102, 241, 0.1)'}`,
          boxShadow: mode === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <DialogContent sx={{ p: 3, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: mode === 'dark' ? '#cbd5e1' : '#475569',
            '&:hover': {
              bgcolor: mode === 'dark' ? 'rgba(165, 180, 252, 0.1)' : 'rgba(99, 102, 241, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3, mt: 1 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              mb: 1, 
              fontWeight: 700,
              background: mode === 'light'
                ? 'linear-gradient(135deg, #1e293b 0%, #6366f1 50%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 50%, #c4b5fd 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Accedi
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: mode === 'light' ? '#475569' : '#cbd5e1', fontSize: '0.9rem' }}
          >
            Benvenuto nella Main Server Platform
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: '0.85rem' }}>
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
            sx={{ mb: 2 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }} />
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
            sx={{ mb: 2 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
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
            disabled={loading}
            startIcon={<LoginIcon />}
            sx={{ 
              mb: 2, 
              py: 1.2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
              },
              '&:disabled': {
                background: mode === 'dark' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.5)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: mode === 'light' ? '#475569' : '#cbd5e1', fontSize: '0.8rem' }}>
              Oppure
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: mode === 'light' ? '#475569' : '#cbd5e1', fontSize: '0.85rem' }}>
              Non hai un account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => {
                  handleClose()
                  onSwitchToRegister && onSwitchToRegister()
                }}
                sx={{ 
                  fontWeight: 600,
                  color: mode === 'dark' ? '#a5b4fc' : '#6366f1',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: mode === 'dark' ? '#c4b5fd' : '#4f46e5'
                  }
                }}
              >
                Registrati qui
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Demo credentials - più compatte */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: mode === 'dark' 
              ? 'rgba(165, 180, 252, 0.1)' 
              : 'rgba(99, 102, 241, 0.1)',
            borderRadius: 2,
            border: `1px solid ${mode === 'dark' ? 'rgba(165, 180, 252, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
            Credenziali Demo:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            Email: admin@example.com<br />
            Password: Admin123
          </Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal