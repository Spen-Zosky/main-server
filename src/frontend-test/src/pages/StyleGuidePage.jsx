import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  Avatar
} from '@mui/material';
import {
  HomeOutlined as HomeIcon,
  SettingsOutlined as SettingsIcon,
  InfoOutlined as InfoIcon,
  VisibilityOutlined as VisibilityIcon,
  DownloadOutlined as DownloadIcon,
  DeleteOutlined as DeleteIcon,
  RefreshOutlined as RefreshIcon,
  SearchOutlined as SearchIcon,
  FolderOutlined as FolderIcon,
  LightModeOutlined as LightIcon,
  DarkModeOutlined as DarkIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

function StyleGuidePage() {
  const { mode, toggleTheme } = useThemeMode();
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [demoTabValue, setDemoTabValue] = useState(0);

  const sampleData = [
    { id: 1, name: 'Sample File 1.txt', size: '2.3 KB', type: 'text', status: 'active' },
    { id: 2, name: 'Demo Script.js', size: '15.7 KB', type: 'javascript', status: 'recent' },
    { id: 3, name: 'Archive.tar.gz', size: '45.2 MB', type: 'archive', status: 'archived' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
      display: 'flex'
    }} className="scrollbar-modern">
      
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          backgroundColor: mode === 'light' ? '#fafafa' : '#1e1e1e',
          borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
          borderRadius: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ p: 2, borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Style Guide
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Catalogo completo degli stili utilizzati nelle interfacce web
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {[
            { name: 'Colori & Temi', icon: <LightIcon />, section: 'colors' },
            { name: 'Tipografia', icon: <InfoIcon />, section: 'typography' },
            { name: 'Bottoni', icon: <SettingsIcon />, section: 'buttons' },
            { name: 'Form Elements', icon: <SearchIcon />, section: 'forms' },
            { name: 'Cards & Papers', icon: <FolderIcon />, section: 'cards' },
            { name: 'Lists & Tables', icon: <VisibilityIcon />, section: 'lists' },
            { name: 'Dialogs & Modals', icon: <InfoIcon />, section: 'dialogs' },
            { name: 'Scrollbars', icon: <RefreshIcon />, section: 'scrollbars' }
          ].map((item, index) => (
            <ListItem key={index} button>
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 2, borderTop: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333' }}>
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
            label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          />
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }} className="scrollbar-modern">
        
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
            Main Server Platform
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3, color: 'primary.main' }}>
            Style Guide & Design System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Documentazione completa di tutti gli stili, componenti e pattern utilizzati nelle interfacce web della piattaforma.
          </Typography>
        </Box>

        {/* Colors Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🎨 Colori & Temi
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
            <Box sx={{ p: 2, backgroundColor: '#1976d2', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Primary Blue</Typography>
              <Typography variant="caption">#1976d2</Typography>
            </Box>
            <Box sx={{ p: 2, backgroundColor: '#388e3c', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Success Green</Typography>
              <Typography variant="caption">#388e3c</Typography>
            </Box>
            <Box sx={{ p: 2, backgroundColor: '#f57c00', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Warning Orange</Typography>
              <Typography variant="caption">#f57c00</Typography>
            </Box>
            <Box sx={{ p: 2, backgroundColor: '#d32f2f', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Error Red</Typography>
              <Typography variant="caption">#d32f2f</Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Background: {mode === 'light' ? '#f5f5f5 (Light)' : '#121212 (Dark)'} • 
            Paper: {mode === 'light' ? '#ffffff (Light)' : '#1e1e1e (Dark)'}
          </Typography>
        </Paper>

        {/* Typography Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📝 Tipografia
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h1" sx={{ lineHeight: 1.2 }}>Heading 1 (h1) - Line Height 1.2</Typography>
            <Typography variant="h2" sx={{ lineHeight: 1.2 }}>Heading 2 (h2) - Line Height 1.2</Typography>
            <Typography variant="h3" sx={{ lineHeight: 1.3 }}>Heading 3 (h3) - Line Height 1.3</Typography>
            <Typography variant="h4" sx={{ lineHeight: 1.3 }}>Heading 4 (h4) - Line Height 1.3</Typography>
            <Typography variant="h5" sx={{ lineHeight: 1.3 }}>Heading 5 (h5) - Line Height 1.3</Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.3 }}>Heading 6 (h6) - Line Height 1.3</Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>Body 1 - Line Height 1.6 per testi di paragrafo principali</Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>Body 2 - Line Height 1.5 per testi secondari</Typography>
            <Typography variant="caption" sx={{ lineHeight: 1.4 }}>Caption - Line Height 1.4 per didascalie</Typography>
          </Box>
        </Paper>

        {/* Buttons Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🔘 Bottoni & Azioni
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Primary Button
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />}>
              Secondary Button
            </Button>
            <Button variant="text" startIcon={<InfoIcon />}>
              Text Button
            </Button>
            <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
              Danger Button
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <IconButton size="small"><HomeIcon fontSize="small" /></IconButton>
            <IconButton><SettingsIcon /></IconButton>
            <IconButton size="large"><SearchIcon fontSize="large" /></IconButton>
            <Tooltip title="Icon with Tooltip">
              <IconButton><InfoIcon /></IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Form Elements Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📋 Form Elements
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              label="Standard Text Field" 
              placeholder="Placeholder text"
              variant="outlined"
              size="small"
            />
            <TextField 
              label="Search Field" 
              placeholder="Search files..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel control={<Switch />} label="Switch Control" />
              <Chip label="Active" size="small" />
              <Chip label="Inactive" size="small" variant="outlined" />
              <Badge badgeContent={4} color="primary">
                <Avatar sx={{ width: 32, height: 32 }}>MS</Avatar>
              </Badge>
            </Box>
          </Box>
        </Paper>

        {/* Tables Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📊 Tables & Lists
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id} hover sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>
                      <Chip label={row.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: row.status === 'active' ? '#388e3c15' : '#f57c0015',
                          color: row.status === 'active' ? '#388e3c' : '#f57c00'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Preview">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Cards Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🗃️ Cards & Components
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Standard Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Card con contenuto standard e azioni. Utilizzata per raggruppare informazioni correlate.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Action 1</Button>
                <Button size="small">Action 2</Button>
              </CardActions>
            </Card>
            
            <Paper sx={{ p: 2, backgroundColor: mode === 'light' ? '#e3f2fd' : '#1a237e20', border: mode === 'light' ? '1px solid #bbdefb' : '1px solid #1a237e' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Info Paper
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Paper colorato per informazioni speciali o highlight.
              </Typography>
            </Paper>
          </Box>
        </Paper>

        {/* Progress & Alerts Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📊 Progress & Alerts
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 4 }} />
            <Alert severity="success">Success alert - Operazione completata con successo</Alert>
            <Alert severity="warning">Warning alert - Attenzione: verifica i dati inseriti</Alert>
            <Alert severity="error">Error alert - Errore durante l'operazione</Alert>
            <Alert severity="info">Info alert - Informazione generale per l'utente</Alert>
          </Box>
        </Paper>

        {/* Scrollbars Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📜 Scrollbars Moderne
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Scrollbar moderne con auto-hide implementate su tutti i componenti con la classe `scrollbar-modern`.
          </Typography>
          <Box 
            className="scrollbar-modern"
            sx={{ 
              p: 2, 
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
              border: '1px solid',
              borderColor: mode === 'light' ? '#e0e0e0' : '#333',
              borderRadius: 1,
              height: '150px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              // Force scrollbar styles
              '&::-webkit-scrollbar': {
                width: '6px',
                height: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'transparent',
                borderRadius: '10px',
                transition: 'background-color 0.3s ease'
              },
              '&:hover::-webkit-scrollbar-thumb': {
                backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} style={{ padding: '4px 0', borderBottom: i < 29 ? '1px solid rgba(128,128,128,0.1)' : 'none' }}>
                Riga {i + 1} - Contenuto di esempio per mostrare la scrollbar moderna che appare solo al hover e scompare automaticamente. Hover sull'area per vedere la scrollbar.
              </div>
            ))}
          </Box>
          <Box sx={{ mt: 2, p: 2, backgroundColor: mode === 'light' ? '#f9f9f9' : '#2a2a2a', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Specifiche Tecniche:
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
              • width: 6px, height: 6px
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
              • scrollbar-width: thin
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
              • background: transparent → visible al hover
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
              • transition: background-color 0.3s ease
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
              • Light: rgba(0,0,0,0.1), Dark: rgba(255,255,255,0.1)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block' }}>
              • border-radius: 10px, background: transparent
            </Typography>
          </Box>
          <Box sx={{ mt: 2, p: 2, backgroundColor: mode === 'light' ? '#f0f0f0' : '#1a1a1a', borderRadius: 1, border: '1px solid', borderColor: mode === 'light' ? '#e0e0e0' : '#333' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              CSS Completo:
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', whiteSpace: 'pre-line', color: mode === 'light' ? '#666' : '#ccc' }}>
{`.scrollbar-modern {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}
.scrollbar-modern::-webkit-scrollbar {
  width: 6px; height: 6px;
}
.scrollbar-modern::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-modern::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}
.scrollbar-modern:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}`}
            </Typography>
          </Box>
        </Paper>

        {/* Demo Dialog Button */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🔄 Modal & Dialog Demo
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setDemoDialogOpen(true)}
            startIcon={<InfoIcon />}
          >
            Apri Dialog Demo
          </Button>
        </Paper>

      </Box>

      {/* Demo Dialog */}
      <Dialog
        open={demoDialogOpen}
        onClose={() => setDemoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon />
            Demo Dialog
          </Box>
        </DialogTitle>
        <DialogContent className="scrollbar-modern">
          <Box sx={{ mt: 1 }}>
            <Tabs value={demoTabValue} onChange={(e, v) => setDemoTabValue(v)} sx={{ mb: 3 }}>
              <Tab label="Tab 1" />
              <Tab label="Tab 2" />
              <Tab label="Tab 3" />
            </Tabs>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Questo è un esempio di dialog con contenuto scrollabile e tabs. 
              Utilizza la classe `scrollbar-modern` per scrollbar coerenti.
            </Typography>
            <Box sx={{ height: '300px', overflow: 'auto' }} className="scrollbar-modern">
              {Array.from({ length: 15 }, (_, i) => (
                <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                  Contenuto scrollabile riga {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDemoDialogOpen(false)}>Chiudi</Button>
          <Button variant="contained">Conferma</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default StyleGuidePage;