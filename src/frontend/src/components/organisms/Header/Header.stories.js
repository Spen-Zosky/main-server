/**
 * Header Component Stories
 * Storybook documentation for Header organism
 */

import Header from './Header';

const mockNavigation = [
  { label: 'Dashboard', icon: '📊' },
  { label: 'Projects', icon: '📂' },
  { label: 'Team', icon: '👥' },
  { label: 'Settings', icon: '⚙️' },
];

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '👨‍💻',
};

export default {
  title: 'Design System/Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Header organism combines multiple atoms and molecules to create a complete navigation header with search, user actions, and responsive mobile menu.',
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['default', 'ai', 'nose', 'hunter', 'dark'],
      description: 'Header theme based on module branding',
    },
    showSearch: {
      control: { type: 'boolean' },
      description: 'Show search functionality',
    },
    showUserActions: {
      control: { type: 'boolean' },
      description: 'Show user login/logout actions',
    },
    title: {
      control: { type: 'text' },
      description: 'Main title text',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtitle text',
    },
  },
};

// Default story
export const Default = {
  args: {
    title: 'Main Server Platform',
    subtitle: 'Enterprise Solution',
    navigation: mockNavigation,
    onSearch: (query) => console.log('Search:', query),
    onLogin: () => console.log('Login clicked'),
    onNavigate: (item) => console.log('Navigate to:', item.label),
  },
};

// With logged in user
export const WithUser = {
  args: {
    title: 'Main Server Platform',
    navigation: mockNavigation,
    user: mockUser,
    onSearch: (query) => console.log('Search:', query),
    onLogout: () => console.log('Logout clicked'),
    onNavigate: (item) => console.log('Navigate to:', item.label),
  },
};

// Module themes
export const ModuleThemes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header
        title="AI-HRMS Module"
        subtitle="Human Resources Management"
        theme="ai"
        navigation={mockNavigation}
        user={mockUser}
        onSearch={(query) => console.log('AI Search:', query)}
        onLogout={() => console.log('AI Logout')}
      />
      <div style={{ height: '20px' }} />
      <Header
        title="NOSE Research Module"
        subtitle="Academic Research Platform"
        theme="nose"
        navigation={mockNavigation}
        user={mockUser}
        onSearch={(query) => console.log('NOSE Search:', query)}
        onLogout={() => console.log('NOSE Logout')}
      />
      <div style={{ height: '20px' }} />
      <Header
        title="Web-Hunter Module"
        subtitle="Data Mining & Analytics"
        theme="hunter"
        navigation={mockNavigation}
        user={mockUser}
        onSearch={(query) => console.log('Hunter Search:', query)}
        onLogout={() => console.log('Hunter Logout')}
      />
      <div style={{ height: '20px' }} />
      <Header
        title="Main Server Platform"
        subtitle="Dark Theme"
        theme="dark"
        navigation={mockNavigation}
        user={mockUser}
        onSearch={(query) => console.log('Dark Search:', query)}
        onLogout={() => console.log('Dark Logout')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header with different module themes - AI (blue), NOSE (green), Hunter (orange), and Dark theme.',
      },
    },
  },
};

// Minimal header
export const Minimal = {
  args: {
    title: 'Simple App',
    showSearch: false,
    showUserActions: false,
    navigation: [],
  },
};

// Without search
export const WithoutSearch = {
  args: {
    title: 'Internal Dashboard',
    subtitle: 'Admin Panel',
    navigation: mockNavigation,
    user: mockUser,
    showSearch: false,
    onLogout: () => console.log('Logout clicked'),
    onNavigate: (item) => console.log('Navigate to:', item.label),
  },
};

// Mobile responsive example
export const MobileView = {
  args: {
    title: 'Mobile App',
    subtitle: 'Responsive Design',
    navigation: mockNavigation,
    user: mockUser,
    onSearch: (query) => console.log('Mobile Search:', query),
    onLogout: () => console.log('Mobile Logout'),
    onNavigate: (item) => console.log('Mobile Navigate to:', item.label),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Header in mobile view with collapsible navigation menu.',
      },
    },
  },
};

// Custom navigation
export const CustomNavigation = {
  args: {
    title: 'Custom Platform',
    navigation: [
      { label: 'Home', icon: '🏠' },
      { label: 'Analytics', icon: '📈' },
      { label: 'Reports', icon: '📊' },
      { label: 'Users', icon: '👤' },
      { label: 'Settings', icon: '⚙️' },
      { label: 'Help', icon: '❓' },
    ],
    user: mockUser,
    onSearch: (query) => console.log('Custom Search:', query),
    onLogout: () => console.log('Custom Logout'),
    onNavigate: (item) => console.log('Custom Navigate to:', item.label),
  },
};

// Long title example
export const LongTitle = {
  args: {
    title: 'Very Long Platform Name That Might Wrap',
    subtitle: 'With an even longer subtitle that describes the platform in detail',
    navigation: mockNavigation,
    user: mockUser,
    onSearch: (query) => console.log('Long Search:', query),
    onLogout: () => console.log('Long Logout'),
    onNavigate: (item) => console.log('Long Navigate to:', item.label),
  },
};

// Interactive example
const InteractiveExample = () => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [searchResults, setSearchResults] = React.useState('');

  const handleLogin = () => {
    setCurrentUser(mockUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSearch = (query) => {
    setSearchResults(`Searching for: "${query}"`);
    setTimeout(() => setSearchResults(''), 3000);
  };

  return (
    <div>
      <Header
        title="Interactive Header"
        subtitle="Try the login/logout and search"
        navigation={mockNavigation}
        user={currentUser}
        onSearch={handleSearch}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={(item) => console.log('Navigate to:', item.label)}
      />
      
      {searchResults && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f0f8ff', 
          margin: '1rem',
          borderRadius: '6px',
          color: '#1976d2'
        }}>
          {searchResults}
        </div>
      )}
      
      <div style={{ padding: '1rem', color: '#666' }}>
        <p>Current user: {currentUser ? currentUser.name : 'Not logged in'}</p>
        <p>Try the search functionality and login/logout buttons!</p>
      </div>
    </div>
  );
};

export const Interactive = {
  render: InteractiveExample,
  parameters: {
    docs: {
      description: {
        story: 'Interactive header with working login/logout state and search feedback.',
      },
    },
  },
};