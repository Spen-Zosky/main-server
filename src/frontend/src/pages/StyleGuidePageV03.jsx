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
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [demoTabValue, setDemoTabValue] = useState(0);
  const { mode, toggleTheme } = useThemeMode();

  const sampleData = [
    { id: 1, name: 'Sample File 1.txt', size: '2.3 KB', type: 'text', status: 'active' },
    { id: 2, name: 'Demo Script.js', size: '15.7 KB', type: 'javascript', status: 'recent' },
    { id: 3, name: 'Archive.tar.gz', size: '45.2 MB', type: 'archive', status: 'archived' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex'
    }} className="scrollbar-modern">
      
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          borderRadius: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Style Guide
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete catalog of styles used in web interfaces
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {[
            { name: 'Colors & Themes', icon: <LightIcon />, section: 'colors' },
            { name: 'Typography', icon: <InfoIcon />, section: 'typography' },
            { name: 'Buttons', icon: <SettingsIcon />, section: 'buttons' },
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

        <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'divider' }}>
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
            Complete documentation of all styles, components and patterns used in the platform's web interfaces.
          </Typography>
        </Box>

        {/* Colors Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🎨 Colors & Themes
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Primary</Typography>
              <Typography variant="caption">Theme Primary Color</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Secondary</Typography>
              <Typography variant="caption">Theme Secondary Color</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'success.main', color: 'success.contrastText', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Success</Typography>
              <Typography variant="caption">Success Green</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Error</Typography>
              <Typography variant="caption">Error Red</Typography>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Module-Specific Colors
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'ai.main', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>AI-HRMS</Typography>
              <Typography variant="caption">Human Resources Module</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'nose.main', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>NOSE Research</Typography>
              <Typography variant="caption">Research Platform Module</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'hunter.main', color: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Web-Hunter</Typography>
              <Typography variant="caption">Data Mining Module</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Typography Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📝 Typography
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="h1">Heading 1 - Main Titles</Typography>
            <Typography variant="h2">Heading 2 - Section Titles</Typography>
            <Typography variant="h3">Heading 3 - Subsection Titles</Typography>
            <Typography variant="h4">Heading 4 - Component Titles</Typography>
            <Typography variant="h5">Heading 5 - Card Titles</Typography>
            <Typography variant="h6">Heading 6 - Small Titles</Typography>
            <Typography variant="body1">Body 1 - Primary body text for main content and descriptions</Typography>
            <Typography variant="body2">Body 2 - Secondary body text for supporting information</Typography>
            <Typography variant="caption">Caption - Small text for labels and metadata</Typography>
            <Typography variant="overline">OVERLINE - UPPERCASE TEXT FOR CATEGORIES</Typography>
          </Box>
        </Paper>

        {/* Buttons Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🔘 Buttons
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Button variant="contained">Primary Button</Button>
            <Button variant="outlined">Outlined Button</Button>
            <Button variant="text">Text Button</Button>
            <Button variant="contained" color="secondary">Secondary</Button>
            <Button variant="contained" color="success">Success</Button>
            <Button variant="contained" color="warning">Warning</Button>
            <Button variant="contained" color="error">Error</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Button variant="contained" size="small">Small</Button>
            <Button variant="contained" size="medium">Medium</Button>
            <Button variant="contained" size="large">Large</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <IconButton><HomeIcon /></IconButton>
            <IconButton color="primary"><SettingsIcon /></IconButton>
            <IconButton color="secondary"><InfoIcon /></IconButton>
            <IconButton disabled><DeleteIcon /></IconButton>
          </Box>
        </Paper>

        {/* Form Elements Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📝 Form Elements
          </Typography>
          <Box sx={{ display: 'grid', gap: 3, maxWidth: 400 }}>
            <TextField label="Standard Input" variant="outlined" />
            <TextField label="Filled Input" variant="filled" />
            <TextField label="Standard Input" variant="standard" />
            <TextField label="With Helper Text" variant="outlined" helperText="This is helper text" />
            <TextField label="Error State" variant="outlined" error helperText="This field has an error" />
            <TextField label="Disabled Input" variant="outlined" disabled />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel control={<Switch />} label="Switch" />
              <FormControlLabel control={<Switch defaultChecked />} label="Checked Switch" />
            </Box>
          </Box>
        </Paper>

        {/* Cards Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🗂️ Cards & Papers
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Basic Card</Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a basic card with content and actions.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Action 1</Button>
                <Button size="small">Action 2</Button>
              </CardActions>
            </Card>
            
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Elevated Card</Typography>
                <Typography variant="body2" color="text.secondary">
                  This card has more elevation for emphasis.
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Colored Card</Typography>
                <Typography variant="body2">
                  This card uses the primary color scheme.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>

        {/* Chips & Badges Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            🏷️ Chips & Badges
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Chip label="Default Chip" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Warning" color="warning" />
            <Chip label="Error" color="error" />
            <Chip label="Clickable" color="primary" onClick={() => {}} />
            <Chip label="Deletable" color="secondary" onDelete={() => {}} />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Badge badgeContent={4} color="primary">
              <HomeIcon />
            </Badge>
            <Badge badgeContent="99+" color="error">
              <SettingsIcon />
            </Badge>
            <Badge variant="dot" color="success">
              <InfoIcon />
            </Badge>
          </Box>
        </Paper>

        {/* Table Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📊 Tables
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small" 
                        color={row.status === 'active' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small"><VisibilityIcon /></IconButton>
                      <IconButton size="small"><DownloadIcon /></IconButton>
                      <IconButton size="small"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Progress & Alerts Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            ⚡ Progress & Alerts
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Progress Bars</Typography>
            <LinearProgress sx={{ mb: 2 }} />
            <LinearProgress variant="determinate" value={50} sx={{ mb: 2 }} />
            <LinearProgress variant="determinate" value={75} color="secondary" />
          </Box>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Alert severity="info">This is an info alert</Alert>
            <Alert severity="success">This is a success alert</Alert>
            <Alert severity="warning">This is a warning alert</Alert>
            <Alert severity="error">This is an error alert</Alert>
          </Box>
        </Paper>

        {/* Dialog Demo Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            💬 Dialogs & Modals
          </Typography>
          <Button variant="contained" onClick={() => setDemoDialogOpen(true)}>
            Open Demo Dialog
          </Button>
          
          <Dialog open={demoDialogOpen} onClose={() => setDemoDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Demo Dialog</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                This is a demonstration dialog showing the standard layout and styling.
              </Typography>
              <Tabs value={demoTabValue} onChange={(e, v) => setDemoTabValue(v)}>
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {demoTabValue === 0 && <Typography>Content for Tab 1</Typography>}
                {demoTabValue === 1 && <Typography>Content for Tab 2</Typography>}
                {demoTabValue === 2 && <Typography>Content for Tab 3</Typography>}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDemoDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => setDemoDialogOpen(false)}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </Paper>

        {/* Scrollbar Styles */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📜 Custom Scrollbars
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Custom scrollbar styles are applied using the .scrollbar-modern class:
          </Typography>
          <Box 
            sx={{ 
              height: 200, 
              overflow: 'auto', 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2
            }}
            className="scrollbar-modern"
          >
            {Array.from({ length: 20 }, (_, i) => (
              <Typography key={i} sx={{ mb: 1 }}>
                Scrollable content line {i + 1} - This demonstrates the custom scrollbar styling
              </Typography>
            ))}
          </Box>
        </Paper>

      </Box>
    </Box>
  );
}

export default StyleGuidePage;