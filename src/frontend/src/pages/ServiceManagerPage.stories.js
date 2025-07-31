import ServiceManagerPage from './ServiceManagerPage'
import { ThemeProvider } from '../context/ThemeContext'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'

// Wrapper component with GitHub-style theming
const StoryWrapper = ({ children, darkMode = true }) => {
  const themeMode = darkMode ? 'dark' : 'light'
  const muiTheme = createTheme({
    palette: {
      mode: themeMode,
      ...(themeMode === 'dark' && {
        background: {
          default: '#0d1117',
          paper: '#161b22',
        },
        text: {
          primary: '#f0f6fc',
          secondary: '#8b949e',
        },
      }),
    },
  })

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

export default {
  title: 'Pages/Service Manager',
  component: ServiceManagerPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete Service Manager page with multiple view modes: Classic GitHub-style interface, Advanced File Inspector with chronological navigation, and Analytics dashboard. Manages all service files (backups, chat logs, development logs, design systems) with granular inspection capabilities.',
      },
    },
    backgrounds: {
      default: 'github-dark',
      values: [
        { name: 'github-dark', value: '#0d1117' },
        { name: 'github-light', value: '#fafbfc' },
      ],
    },
  },
  decorators: [
    (Story, { args }) => (
      <StoryWrapper darkMode={args.darkMode}>
        <Story />
      </StoryWrapper>
    ),
  ],
}

// Main Service Manager Page Stories
export const Default = {
  name: 'GitHub Dark - Classic View',
  args: {
    darkMode: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Service Manager page in GitHub dark theme showing the classic file management interface with tabs for different file types.',
      },
    },
  },
}

export const LightTheme = {
  name: 'GitHub Light - Classic View',
  args: {
    darkMode: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Service Manager page in GitHub light theme with clean, professional appearance for day-time development.',
      },
    },
    backgrounds: {
      default: 'github-light',
    },
  },
}

export const FileInspectorView = {
  name: 'Advanced File Inspector',
  render: () => (
    <StoryWrapper>
      <div style={{ height: '100vh' }}>
        <ServiceManagerPage />
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px',
          padding: '12px',
          color: '#f0f6fc',
          fontSize: '12px',
          zIndex: 1000
        }}>
          💡 Click "File Inspector" tab to access advanced chronological navigation
        </div>
      </div>
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Advanced File Inspector mode with chronological sidebar navigation, granular file inspection, and metadata analysis for all service file types.',
      },
    },
  },
}

export const ServiceManagerComparison = {
  name: 'View Modes Comparison',
  render: () => (
    <StoryWrapper>
      <div style={{ padding: '20px', backgroundColor: '#0d1117', color: '#f0f6fc', minHeight: '100vh' }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>
          🚀 Claude Service Manager - Enhanced with Storybook
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: '#161b22', 
            border: '1px solid #30363d', 
            borderRadius: '8px', 
            padding: '20px' 
          }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              📋 Classic View
            </h2>
            <p style={{ color: '#8b949e', marginBottom: '16px' }}>
              Traditional GitHub-style file management with tabbed interface
            </p>
            <ul style={{ color: '#8b949e', fontSize: '14px' }}>
              <li>Tab-based file type organization</li>
              <li>List view with file metadata</li>
              <li>Basic actions (view, download, delete)</li>
              <li>GitHub-inspired dark/light themes</li>
              <li>Mobile-responsive design</li>
            </ul>
          </div>
          
          <div style={{ 
            backgroundColor: '#161b22', 
            border: '1px solid #30363d', 
            borderRadius: '8px', 
            padding: '20px' 
          }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              🔍 File Inspector
            </h2>
            <p style={{ color: '#8b949e', marginBottom: '16px' }}>
              Advanced chronological navigation with granular inspection
            </p>
            <ul style={{ color: '#8b949e', fontSize: '14px' }}>
              <li>Chronological timeline sidebar</li>
              <li>Section-based content inspection</li>
              <li>Metadata analysis and search</li>
              <li>File type-specific actions</li>
              <li>Sequential navigation support</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#161b22', 
          border: '1px solid #30363d', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            📊 File Type Classifications
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ 
              backgroundColor: '#21262d', 
              borderLeft: '3px solid #238636',
              borderRadius: '4px',
              padding: '12px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#238636' }}>📦 Backup Files</div>
              <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
                Project archives with metadata, contents inspection, and restoration capabilities
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#21262d', 
              borderLeft: '3px solid #1f6feb',
              borderRadius: '4px',
              padding: '12px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#1f6feb' }}>💬 Chat Logs</div>
              <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
                Conversation history with timeline view, topic analysis, and search functionality
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#21262d', 
              borderLeft: '3px solid #f85149',
              borderRadius: '4px',
              padding: '12px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#f85149' }}>🔧 Development Logs</div>
              <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
                Session logs with error analysis, level filtering, and build statistics
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#21262d', 
              borderLeft: '3px solid #8b5cf6',
              borderRadius: '4px',
              padding: '12px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>🎨 Design Systems</div>
              <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
                Component configurations with version control and diff comparison
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#238636', 
          color: 'white',
          borderRadius: '8px', 
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            ✅ Zone-Based Development Compliance
          </div>
          <div style={{ fontSize: '14px' }}>
            Service Manager zone isolated • Server-side rendering maintained • Fixed ports respected • Remote access guaranteed
          </div>
        </div>
      </div>
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive overview comparing different view modes and file type classifications in the enhanced Service Manager.',
      },
    },
  },
}

// Specialized workflow stories
export const BackupRestoreWorkflow = {
  name: 'Backup & Restore Workflow',
  render: () => (
    <StoryWrapper>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          backgroundColor: '#161b22',
          borderBottom: '1px solid #30363d',
          padding: '16px',
          color: '#f0f6fc'
        }}>
          <h2 style={{ margin: '0 0 8px 0' }}>📦 Backup & Restore Workflow</h2>
          <p style={{ margin: '0', color: '#8b949e' }}>
            Navigate to File Inspector → Select backup file → Inspect metadata → Execute restore
          </p>
        </div>
        <ServiceManagerPage />
      </div>
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Workflow demonstration for backup inspection and restoration using the File Inspector interface.',
      },
    },
  },
}

export const ConversationAnalysis = {
  name: 'Chat Log Analysis Workflow',
  render: () => (
    <StoryWrapper>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          backgroundColor: '#161b22',
          borderBottom: '1px solid #30363d',
          padding: '16px',
          color: '#f0f6fc'
        }}>
          <h2 style={{ margin: '0 0 8px 0' }}>💬 Conversation Analysis Workflow</h2>
          <p style={{ margin: '0', color: '#8b949e' }}>
            Navigate to File Inspector → Select chat log → Analyze timeline → Search topics → Export insights
          </p>
        </div>
        <ServiceManagerPage />
      </div>
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Workflow demonstration for chat log analysis with timeline navigation and topic search capabilities.',
      },
    },
  },
}