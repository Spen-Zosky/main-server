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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  PersonOutlined as PersonIcon,
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  AppRegistrationOutlined as RegisterIcon,
  BusinessOutlined as CompanyIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

function RegisterPage() {
  const navigate = useNavigate()
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
    { value: 'admin', label: 'Amministratore' },
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'researcher', label: 'Ricercatore' },
    { value: 'data_analyst', label: 'Data Analyst' },
    { value: 'user', label: 'Utente Standard' }
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
      setError('Le password non coincidono')
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
      // Chiamata API diretta senza CSRF (JWT stateless)
      const response = await authAPI.register(formData)
      
      const data = response.data
      
      if (data.success) {
        navigate('/login', { 
          state: { 
            message: 'Registrazione completata! Puoi ora effettuare il login.' 
          }
        })
      } else {
        setError(data.error || 'Errore durante la registrazione')
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
      <Container maxWidth="md">
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
              Registrati
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Crea il tuo account per accedere alla piattaforma
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <TextField
                fullWidth
                name="firstName"
                label="Nome"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                name="lastName"
                label="Cognome"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
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
                name="company"
                label="Azienda (opzionale)"
                value={formData.company}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CompanyIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box sx={{ mt: 3, mb: 3 }}>
              <FormControl fullWidth>
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
            </Box>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
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

              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Conferma Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

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
                <Typography variant="body2">
                  Accetto i{' '}
                  <Link href="#" sx={{ fontWeight: 600 }}>
                    termini e condizioni
                  </Link>
                  {' '}e la{' '}
                  <Link href="#" sx={{ fontWeight: 600 }}>
                    privacy policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 2, mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<RegisterIcon />}
              sx={{ mb: 3, py: 1.2 }}
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Oppure
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Hai già un account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/login')}
                  sx={{ fontWeight: 600 }}
                >
                  Accedi qui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage