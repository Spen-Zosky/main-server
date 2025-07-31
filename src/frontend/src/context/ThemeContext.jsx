import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const CustomThemeProvider = ({ children }) => {
  // Recupera la preferenza dal localStorage o usa 'light' come default
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'light';
  });

  // Salva la preferenza nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Temi standardizzati - Basati su theme.ts e design system
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',  
        light: '#ff5983',
        dark: '#9a0036',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
      },
      success: {
        main: '#388e3c',
        light: '#66bb6a', 
        dark: '#2e7d32',
      },
      warning: {
        main: '#f57c00',
        light: '#ffb74d',
        dark: '#ef6c00',
      },
      error: {
        main: '#d32f2f',
        light: '#f87171',
        dark: '#c62828',
      },
      ai: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      nose: {
        main: '#388e3c',
        light: '#66bb6a',
        dark: '#2e7d32',
      },
      hunter: {
        main: '#f57c00',
        light: '#ffb74d',
        dark: '#ef6c00',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1.1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 6,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#42a5f5',
        light: '#90caf9',
        dark: '#1976d2',
      },
      secondary: {
        main: '#ff5983',
        light: '#ff8a95',
        dark: '#dc004e',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
      },
      success: {
        main: '#66bb6a',
        light: '#81c784',
        dark: '#388e3c',
      },
      warning: {
        main: '#ffb74d',
        light: '#ffcc80',
        dark: '#f57c00',
      },
      error: {
        main: '#f87171',
        light: '#ffb3ba',
        dark: '#d32f2f',
      },
      ai: {
        main: '#42a5f5',
        light: '#90caf9',
        dark: '#1976d2',
      },
      nose: {
        main: '#66bb6a',
        light: '#81c784',
        dark: '#388e3c',
      },
      hunter: {
        main: '#ffb74d',
        light: '#ffcc80',
        dark: '#f57c00',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1.1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(255,255,255,0.08)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 6,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
    },
  });

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const contextValue = {
    mode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default CustomThemeProvider;