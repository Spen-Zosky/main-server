/**
 * Storybook Alternative - Component Documentation Page
 * Enterprise documentation system built into the application
 */

import React, { useState } from 'react';
import { Button } from '../components/atoms/Button';
import { Text } from '../components/atoms/Text';
import { Input } from '../components/atoms/Input';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { SearchBox } from '../components/molecules/SearchBox';
import { Form } from '../components/molecules/Form';
import { Header } from '../components/organisms/Header';
import { designTokens } from '../design-system/tokens';
import { brandIdentity } from '../design-system/brand/BrandIdentity';

const StorybookAlternative = () => {
  const [selectedComponent, setSelectedComponent] = useState('Button');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [demoValue, setDemoValue] = useState('');

  const components = [
    { name: 'Button', category: 'Atoms' },
    { name: 'Text', category: 'Atoms' },
    { name: 'Input', category: 'Atoms' },
    { name: 'Card', category: 'Atoms' },
    { name: 'Badge', category: 'Atoms' },
    { name: 'SearchBox', category: 'Molecules' },
    { name: 'Form', category: 'Molecules' },
    { name: 'Header', category: 'Organisms' }
  ];

  const themes = ['default', 'ai', 'nose', 'hunter'];

  const ComponentDemo = ({ component }) => {
    const themeStyle = selectedTheme !== 'default' ? {
      '--color-brand-primary': designTokens.colors.modules[selectedTheme]?.primary || designTokens.colors.brand.primary,
      '--color-brand-secondary': designTokens.colors.modules[selectedTheme]?.secondary || designTokens.colors.brand.secondary,
      '--color-brand-accent': designTokens.colors.modules[selectedTheme]?.accent || designTokens.colors.brand.accent,
    } : {};

    switch (component) {
      case 'Button':
        return (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: designTokens.spacing.scale[3],
            ...themeStyle
          }}>
            <Button variant="primary" theme={selectedTheme}>Primary Button</Button>
            <Button variant="secondary" theme={selectedTheme}>Secondary Button</Button>
            <Button variant="accent" theme={selectedTheme}>Accent Button</Button>
            <Button variant="ghost" theme={selectedTheme}>Ghost Button</Button>
            <Button variant="primary" theme={selectedTheme} disabled>Disabled Button</Button>
            <Button variant="primary" theme={selectedTheme} loading>Loading Button</Button>
          </div>
        );
      
      case 'Text':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.scale[2] }}>
            <Text variant="display">Display Text</Text>
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="h3">Heading 3</Text>
            <Text variant="body">Body text for regular content</Text>
            <Text variant="bodyLarge">Large body text</Text>
            <Text variant="caption">Caption text</Text>
            <Text variant="code">const code = 'example';</Text>
          </div>
        );
      
      case 'Input':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.scale[3] }}>
            <Input label="Standard Input" placeholder="Enter text..." value={demoValue} onChange={setDemoValue} />
            <Input label="Required Input" placeholder="Required field" required value="" onChange={() => {}} />
            <Input label="Input with Error" error="This field is required" value="" onChange={() => {}} />
            <Input label="Disabled Input" disabled value="Disabled value" onChange={() => {}} />
          </div>
        );
      
      case 'Card':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.scale[3] }}>
            <Card variant="default" padding="md">Default Card</Card>
            <Card variant="elevated" padding="md">Elevated Card</Card>
            <Card variant="outlined" padding="md">Outlined Card</Card>
            <Card variant="ghost" padding="md">Ghost Card</Card>
          </div>
        );
      
      case 'Badge':
        return (
          <div style={{ display: 'flex', gap: designTokens.spacing.scale[2], flexWrap: 'wrap' }}>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        );
      
      case 'SearchBox':
        return (
          <SearchBox
            placeholder="Search components..."
            value={demoValue}
            onChange={setDemoValue}
            onSubmit={(query) => console.log('Search:', query)}
          />
        );
      
      case 'Form':
        return (
          <Form
            title="Demo Form"
            onSubmit={(data) => console.log('Form data:', data)}
            validation={{
              name: (value) => !value ? 'Name is required' : null
            }}
          >
            <Input name="name" label="Name" placeholder="Enter name" required />
          </Form>
        );
      
      case 'Header':
        return (
          <Header
            title="Demo Header"
            theme={selectedTheme}
            showSearch={true}
            showUserActions={true}
          />
        );
      
      default:
        return <Text>Select a component from the sidebar</Text>;
    }
  };

  const ComponentProps = ({ component }) => {
    const propsList = {
      Button: [
        { name: 'variant', type: 'string', default: 'primary', options: 'primary, secondary, accent, ghost' },
        { name: 'size', type: 'string', default: 'md', options: 'sm, md, lg' },
        { name: 'disabled', type: 'boolean', default: 'false' },
        { name: 'loading', type: 'boolean', default: 'false' },
        { name: 'fullWidth', type: 'boolean', default: 'false' }
      ],
      Text: [
        { name: 'variant', type: 'string', default: 'body', options: 'display, h1, h2, h3, body, bodyLarge, caption, code' },
        { name: 'color', type: 'string', default: 'primary', options: 'primary, secondary, brand, accent' },
        { name: 'align', type: 'string', default: 'left', options: 'left, center, right, justify' }
      ],
      Input: [
        { name: 'label', type: 'string', default: '' },
        { name: 'placeholder', type: 'string', default: '' },
        { name: 'type', type: 'string', default: 'text', options: 'text, email, password, number' },
        { name: 'required', type: 'boolean', default: 'false' },
        { name: 'disabled', type: 'boolean', default: 'false' },
        { name: 'error', type: 'string', default: '' }
      ],
      Card: [
        { name: 'variant', type: 'string', default: 'default', options: 'default, elevated, outlined, ghost' },
        { name: 'padding', type: 'string', default: 'md', options: 'none, sm, md, lg, xl' },
        { name: 'shadow', type: 'string', default: 'base', options: 'none, sm, base, md, lg, xl' }
      ],
      Badge: [
        { name: 'variant', type: 'string', default: 'primary', options: 'primary, secondary, success, error, warning, info' },
        { name: 'size', type: 'string', default: 'md', options: 'sm, md, lg' }
      ]
    };

    const props = propsList[component] || [];

    return (
      <div style={{ marginTop: designTokens.spacing.scale[4] }}>
        <Text variant="h3" style={{ marginBottom: designTokens.spacing.scale[3] }}>Props</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.scale[2] }}>
          {props.map(prop => (
            <Card key={prop.name} variant="outlined" padding="sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text variant="code" style={{ color: designTokens.colors.brand.primary }}>
                    {prop.name}
                  </Text>
                  <Text variant="caption" style={{ marginLeft: designTokens.spacing.scale[2] }}>
                    {prop.type}
                  </Text>
                </div>
                <Badge variant="secondary">{prop.default}</Badge>
              </div>
              {prop.options && (
                <Text variant="caption" style={{ marginTop: designTokens.spacing.scale[1] }}>
                  Options: {prop.options}
                </Text>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: designTokens.typography.fonts.primary,
      minHeight: '100vh',
      backgroundColor: designTokens.colors.surface.background.light
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: designTokens.colors.brand.primary,
        color: 'white',
        padding: designTokens.spacing.scale[4],
        textAlign: 'center'
      }}>
        <Text variant="h1" style={{ color: 'white', margin: '0 0 1rem 0' }}>
          Design System Documentation
        </Text>
        <Text variant="bodyLarge" style={{ color: 'white', margin: '0', opacity: 0.9 }}>
          Interactive component library and documentation
        </Text>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 200px)' }}>
        {/* Sidebar */}
        <div style={{
          width: '300px',
          backgroundColor: designTokens.colors.neutral[50],
          padding: designTokens.spacing.scale[4],
          borderRight: `1px solid ${designTokens.colors.neutral[200]}`
        }}>
          <Text variant="h3" style={{ marginBottom: designTokens.spacing.scale[3] }}>
            Components
          </Text>
          
          {['Atoms', 'Molecules', 'Organisms'].map(category => (
            <div key={category} style={{ marginBottom: designTokens.spacing.scale[4] }}>
              <Text variant="h4" style={{ 
                marginBottom: designTokens.spacing.scale[2],
                color: designTokens.colors.text.secondary.light
              }}>
                {category}
              </Text>
              {components
                .filter(comp => comp.category === category)
                .map(comp => (
                  <div
                    key={comp.name}
                    onClick={() => setSelectedComponent(comp.name)}
                    style={{
                      padding: designTokens.spacing.scale[2],
                      borderRadius: designTokens.borderRadius.md,
                      cursor: 'pointer',
                      backgroundColor: selectedComponent === comp.name 
                        ? designTokens.colors.brand.primary 
                        : 'transparent',
                      color: selectedComponent === comp.name 
                        ? 'white' 
                        : designTokens.colors.text.primary.light,
                      marginBottom: designTokens.spacing.scale[1]
                    }}
                  >
                    <Text variant="body" style={{ 
                      color: selectedComponent === comp.name ? 'white' : 'inherit' 
                    }}>
                      {comp.name}
                    </Text>
                  </div>
              ))}
            </div>
          ))}

          <div style={{ marginTop: designTokens.spacing.scale[6] }}>
            <Text variant="h4" style={{ 
              marginBottom: designTokens.spacing.scale[3],
              color: designTokens.colors.brand.accent,
              fontWeight: 'bold'
            }}>
              🎨 Theme Switcher
            </Text>
            {themes.map(theme => (
              <div
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                style={{
                  padding: designTokens.spacing.scale[2],
                  borderRadius: designTokens.borderRadius.md,
                  cursor: 'pointer',
                  backgroundColor: selectedTheme === theme 
                    ? designTokens.colors.brand.accent 
                    : 'transparent',
                  color: selectedTheme === theme 
                    ? 'white' 
                    : designTokens.colors.text.primary.light,
                  marginBottom: designTokens.spacing.scale[1],
                  textTransform: 'capitalize'
                }}
              >
                <Text variant="body" style={{ 
                  color: selectedTheme === theme ? 'white' : 'inherit' 
                }}>
                  {theme === 'ai' ? '🤖 AI-HRMS' : 
                   theme === 'nose' ? '🔬 NOSE Research' : 
                   theme === 'hunter' ? '🕸️ Web-Hunter' :
                   theme === 'default' ? '⚡ Default' : theme}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          padding: designTokens.spacing.scale[6],
          overflow: 'auto'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <Text variant="h2" style={{ marginBottom: designTokens.spacing.scale[4] }}>
              {selectedComponent}
            </Text>

            {/* Component Demo */}
            <Card variant="elevated" padding="lg" style={{ marginBottom: designTokens.spacing.scale[6] }}>
              <Text variant="h3" style={{ marginBottom: designTokens.spacing.scale[4] }}>
                Demo
              </Text>
              <ComponentDemo component={selectedComponent} />
            </Card>

            {/* Component Props */}
            <Card variant="outlined" padding="lg">
              <ComponentProps component={selectedComponent} />
            </Card>

            {/* Usage Example */}
            <Card variant="ghost" padding="lg" style={{ marginTop: designTokens.spacing.scale[6] }}>
              <Text variant="h3" style={{ marginBottom: designTokens.spacing.scale[3] }}>
                Usage
              </Text>
              <div style={{
                backgroundColor: designTokens.colors.neutral[900],
                color: designTokens.colors.neutral[100],
                padding: designTokens.spacing.scale[4],
                borderRadius: designTokens.borderRadius.md,
                fontFamily: designTokens.typography.fonts.monospace,
                fontSize: designTokens.typography.fontSizes.sm,
                overflow: 'auto'
              }}>
                <pre>{`import { ${selectedComponent} } from '../components/${
                  selectedComponent === 'Button' || selectedComponent === 'Text' || 
                  selectedComponent === 'Input' || selectedComponent === 'Card' || 
                  selectedComponent === 'Badge' ? 'atoms' : 
                  selectedComponent === 'SearchBox' || selectedComponent === 'Form' ? 'molecules' : 
                  'organisms'
                }/${selectedComponent}';

<${selectedComponent}${selectedComponent === 'Button' ? ' variant="primary"' : 
  selectedComponent === 'Text' ? ' variant="body"' : 
  selectedComponent === 'Input' ? ' label="Label"' : ''}>
  ${selectedComponent === 'Button' ? 'Click me' : 
    selectedComponent === 'Text' ? 'Sample text' : 
    selectedComponent === 'Card' ? 'Card content' : 
    selectedComponent === 'Badge' ? 'Badge text' : ''}
</${selectedComponent}>`}</pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorybookAlternative;