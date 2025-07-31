/**
 * Design System Demo Page
 * Showcases the new atomic design components with design tokens
 */

import React, { useState } from 'react';
import { Button, Text, Input } from '../components/atoms';
import { SearchBox } from '../components/molecules';
import { Header } from '../components/organisms';

const DesignSystemDemo = () => {
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState('');

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👨‍💻',
  };

  const navigation = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Projects', icon: '📂' },
    { label: 'Team', icon: '👥' },
    { label: 'Settings', icon: '⚙️' },
  ];

  const handleLogin = () => {
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSearch = (query) => {
    setSearchResults(`Searching for: "${query}"`);
    setTimeout(() => setSearchResults(''), 3000);
  };

  const sectionStyle = {
    margin: '2rem 0',
    padding: '1.5rem',
    border: '1px solid var(--color-neutral-200)',
    borderRadius: 'var(--border-radius-lg)',
    backgroundColor: 'var(--color-surface-background-light)',
  };

  const gridStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'start',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-neutral-50)' }}>
      {/* Header Organism Examples */}
      <section>
        <Header
          title="Design System Demo"
          subtitle="Atomic Design with Design Tokens"
          navigation={navigation}
          user={user}
          onSearch={handleSearch}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onNavigate={(item) => console.log('Navigate to:', item.label)}
        />
      </section>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Search Results */}
        {searchResults && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-semantic-info)',
            color: 'white',
            borderRadius: 'var(--border-radius-md)',
            marginBottom: '2rem',
          }}>
            {searchResults}
          </div>
        )}

        {/* Typography Showcase */}
        <section style={sectionStyle}>
          <Text variant="h2" color="brand" className="mb-4">Typography System</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Text variant="display" as="h1">Display Heading</Text>
            <Text variant="h1" as="h1">Heading 1</Text>
            <Text variant="h2" as="h2">Heading 2</Text>
            <Text variant="h3" as="h3">Heading 3</Text>
            <Text variant="h4" as="h4">Heading 4</Text>
            <Text variant="bodyLarge">Large body text for emphasis</Text>
            <Text variant="body">Regular body text with perfect readability</Text>
            <Text variant="caption" color="secondary">Caption text for additional information</Text>
            <Text variant="code">const designSystem = 'awesome';</Text>
          </div>
        </section>

        {/* Button Showcase */}
        <section style={sectionStyle}>
          <Text variant="h2" color="brand" className="mb-4">Button Components</Text>
          <div style={gridStyle}>
            <div>
              <Text variant="h4" className="mb-3">Primary Buttons</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
              </div>
            </div>
            
            <div>
              <Text variant="h4" className="mb-3">Secondary Buttons</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm">Small Secondary</Button>
                <Button variant="secondary" size="md">Medium Secondary</Button>
                <Button variant="secondary" size="lg">Large Secondary</Button>
              </div>
            </div>
            
            <div>
              <Text variant="h4" className="mb-3">Semantic Buttons</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="error">Error</Button>
                <Button variant="accent">Accent</Button>
              </div>
            </div>
            
            <div>
              <Text variant="h4" className="mb-3">Button States</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button startIcon="🚀">With Icon</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Showcase */}
        <section style={sectionStyle}>
          <Text variant="h2" color="brand" className="mb-4">Input Components</Text>
          <div style={gridStyle}>
            <div>
              <Text variant="h4" className="mb-3">Basic Inputs</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  startIcon="👤"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  startIcon="📧"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  startIcon="🔒"
                />
              </div>
            </div>
            
            <div>
              <Text variant="h4" className="mb-3">Input States</Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="Success State"
                  placeholder="Valid input"
                  success
                  helperText="Looks good!"
                />
                <Input
                  label="Error State"
                  placeholder="Invalid input"
                  error
                  errorText="This field is required"
                />
                <Input
                  label="Disabled State"
                  placeholder="Cannot edit"
                  disabled
                  value="Read only"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SearchBox Showcase */}
        <section style={sectionStyle}>
          <Text variant="h2" color="brand" className="mb-4">SearchBox Molecules</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SearchBox
              placeholder="Search everything..."
              onSearch={handleSearch}
              size="lg"
              fullWidth
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <SearchBox
                placeholder="Small search"
                size="sm"
                onSearch={handleSearch}
              />
              <SearchBox
                placeholder="Medium search"
                size="md"
                onSearch={handleSearch}
              />
            </div>
          </div>
        </section>

        {/* Module Themes */}
        <section style={sectionStyle}>
          <Text variant="h2" color="brand" className="mb-4">Module Themes</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Header
              title="AI-HRMS Module"
              subtitle="Human Resources Management"
              theme="ai"
              navigation={navigation.slice(0, 2)}
              user={user}
              showSearch={false}
            />
            <Header
              title="NOSE Research Module"
              subtitle="Academic Research Platform"
              theme="nose"
              navigation={navigation.slice(0, 2)}
              user={user}
              showSearch={false}
            />
            <Header
              title="Web-Hunter Module"
              subtitle="Data Mining & Analytics"
              theme="hunter"
              navigation={navigation.slice(0, 2)}
              user={user}
              showSearch={false}
            />
          </div>
        </section>

        {/* Color Palette */}
        <section style={sectionStyle}>
          <Text variant="h2" color="brand" className="mb-4">Color System</Text>
          <div style={gridStyle}>
            <div>
              <Text variant="h4" className="mb-3">Brand Colors</Text>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--color-brand-primary)',
                  borderRadius: 'var(--border-radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>Primary</div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--color-brand-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>Secondary</div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--color-brand-accent)',
                  borderRadius: 'var(--border-radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>Accent</div>
              </div>
            </div>
            
            <div>
              <Text variant="h4" className="mb-3">Semantic Colors</Text>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-semantic-success)',
                  borderRadius: 'var(--border-radius-md)',
                }}></div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-semantic-warning)',
                  borderRadius: 'var(--border-radius-md)',
                }}></div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-semantic-error)',
                  borderRadius: 'var(--border-radius-md)',
                }}></div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-semantic-info)',
                  borderRadius: 'var(--border-radius-md)',
                }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Tokens Info */}
        <section style={sectionStyle}>
          <Text variant="h2" color="brand" className="mb-4">Design System Features</Text>
          <div style={gridStyle}>
            <div>
              <Text variant="h4" color="success" className="mb-2">✅ Completed Features</Text>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li><Text variant="body">Comprehensive design token system</Text></li>
                <li><Text variant="body">Atomic design component structure</Text></li>
                <li><Text variant="body">CSS variables and JavaScript exports</Text></li>
                <li><Text variant="body">Module-specific theming support</Text></li>
                <li><Text variant="body">Responsive design patterns</Text></li>
                <li><Text variant="body">Storybook documentation</Text></li>
              </ul>
            </div>
            
            <div>
              <Text variant="h4" color="info" className="mb-2">🔧 Technical Implementation</Text>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li><Text variant="body">Style Dictionary build system</Text></li>
                <li><Text variant="body">Universal portability (zero hardcoded paths)</Text></li>
                <li><Text variant="body">Enterprise-grade component architecture</Text></li>
                <li><Text variant="body">Accessibility-first design approach</Text></li>
                <li><Text variant="body">TypeScript support and declarations</Text></li>
                <li><Text variant="body">Automated token generation</Text></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DesignSystemDemo;