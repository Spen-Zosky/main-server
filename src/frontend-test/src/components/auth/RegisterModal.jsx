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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Fade,
  Grid
} from '@mui/material'
import {
  PersonOutlined as PersonIcon,
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  AppRegistrationOutlined as RegisterIcon,
  BusinessOutlined as CompanyIcon,
  CloseOutlined as CloseIcon
} from '@mui/icons-material'
import { useThemeMode } from '../../context/ThemeContext'
import { authAPI } from '../../services/api'

function RegisterModal({ open, onClose, onSwitchToLogin, onRegisterSuccess }) {
  const { mode, theme } = useThemeMode()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'data_analyst', label: 'Data Analyst' },
    { value: 'user', label: 'Standard User' }
  ]

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Nome e cognome sono obbligatori')
      return false
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email non valida')
      return false
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono')
      return false
    }
    
    if (!formData.agreeTerms) {
      setError('Devi accettare i termini e condizioni')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const response = await authAPI.register(formData)
      
      if (response.success) {
        onRegisterSuccess && onRegisterSuccess()
        onClose()
      } else {
        setError(response.error || 'Errore nella registrazione')
      }
    } catch (err) {
      console.error('Registration error:', err)
      if (err.status === 409) {
        setError('Email già registrata. Usa un\'altra email o effettua il login.')
      } else {
        setError(err.message || 'Errore di connessione al server. Riprova.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      role: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })
    setError('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
            Registrati
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: mode === 'light' ? '#475569' : '#cbd5e1', fontSize: '0.9rem' }}
          >
            Crea il tuo account per accedere alla piattaforma
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="firstName"
                label="Nome"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Cognome"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="company"
                label="Azienda (opzionale)"
                value={formData.company}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CompanyIcon sx={{ color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Ruolo</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Ruolo"
                  required
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Conferma Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                required
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                Accetto i{' '}
                <Link href="#" sx={{ fontWeight: 600, color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }}>
                  termini e condizioni
                </Link>
                {' '}e la{' '}
                <Link href="#" sx={{ fontWeight: 600, color: mode === 'dark' ? '#a5b4fc' : '#6366f1' }}>
                  privacy policy
                </Link>
              </Typography>
            }
            sx={{ mt: 1.5, mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={<RegisterIcon />}
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
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: mode === 'light' ? '#475569' : '#cbd5e1', fontSize: '0.8rem' }}>
              Oppure
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: mode === 'light' ? '#475569' : '#cbd5e1', fontSize: '0.85rem' }}>
              Hai già un account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => {
                  handleClose()
                  onSwitchToLogin && onSwitchToLogin()
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
                Accedi qui
              </Link>
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default RegisterModal