/**
 * Storybook Pro - Professional Component Documentation System
 * Enterprise-grade alternative to Storybook with all the essential features
 */

import React, { useState, useCallback } from 'react';
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

const StorybookPro = () => {
  const [selectedComponent, setSelectedComponent] = useState('Button');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedView, setSelectedView] = useState('canvas'); // canvas, docs, code
  const [componentProps, setComponentProps] = useState({
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    children: 'Sample Button'
  });

  const components = [
    { name: 'Button', category: 'Atoms', icon: '🔘' },
    { name: 'Text', category: 'Atoms', icon: '📝' },
    { name: 'Input', category: 'Atoms', icon: '📝' },
    { name: 'Card', category: 'Atoms', icon: '🃏' },
    { name: 'Badge', category: 'Atoms', icon: '🏷️' },
    { name: 'SearchBox', category: 'Molecules', icon: '🔍' },
    { name: 'Form', category: 'Molecules', icon: '📋' },
    { name: 'Header', category: 'Organisms', icon: '🏗️' }
  ];

  const themes = [
    { key: 'default', name: 'Default', icon: '⚡', color: designTokens.colors.brand.primary },
    { key: 'ai', name: 'AI-HRMS', icon: '🤖', color: '#1976d2' },
    { key: 'nose', name: 'NOSE Research', icon: '🔬', color: '#388e3c' },
    { key: 'hunter', name: 'Web-Hunter', icon: '🕸️', color: '#f57c00' }
  ];

  // Component props configurations
  const componentPropsConfig = {
    Button: {
      variant: { type: 'select', options: ['primary', 'secondary', 'accent', 'ghost'], default: 'primary' },
      size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      disabled: { type: 'boolean', default: false },
      loading: { type: 'boolean', default: false },
      fullWidth: { type: 'boolean', default: false },
      children: { type: 'text', default: 'Sample Button' }
    },
    Text: {
      variant: { type: 'select', options: ['display', 'h1', 'h2', 'h3', 'body', 'bodyLarge', 'caption', 'code'], default: 'body' },
      color: { type: 'select', options: ['primary', 'secondary', 'brand', 'accent'], default: 'primary' },
      children: { type: 'text', default: 'Sample Text' }
    },
    Input: {
      label: { type: 'text', default: 'Label' },
      placeholder: { type: 'text', default: 'Enter text...' },
      type: { type: 'select', options: ['text', 'email', 'password', 'number'], default: 'text' },
      required: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      error: { type: 'text', default: '' }
    }
  };

  // Generate component with current props
  const renderComponentDemo = useCallback(() => {
    const Component = {
      Button,
      Text,
      Input,
      Card,
      Badge,
      SearchBox,
      Form,
      Header
    }[selectedComponent];

    if (!Component) return <div>Component not found</div>;

    const themeStyle = selectedTheme !== 'default' ? {
      '--color-brand-primary': themes.find(t => t.key === selectedTheme)?.color || designTokens.colors.brand.primary,
    } : {};

    const props = { ...componentProps, theme: selectedTheme };

    return (
      <div style={themeStyle}>
        <Component {...props} />
      </div>
    );
  }, [selectedComponent, selectedTheme, componentProps]);

  // Generate code snippet
  const generateCodeSnippet = () => {
    const propsString = Object.entries(componentProps)
      .filter(([key, value]) => {
        const config = componentPropsConfig[selectedComponent]?.[key];
        return config && value !== config.default;
      })
      .map(([key, value]) => {
        if (typeof value === 'string') return `${key}="${value}"`;
        if (typeof value === 'boolean') return value ? key : '';
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(' ');

    const themeProps = selectedTheme !== 'default' ? ` theme="${selectedTheme}"` : '';
    
    return `<${selectedComponent}${propsString ? ' ' + propsString : ''}${themeProps}>
  ${componentProps.children || 'Content'}
</${selectedComponent}>`;
  };

  // Props control panel
  const renderPropsControls = () => {
    const config = componentPropsConfig[selectedComponent];
    if (!config) return null;

    return (
      <div style={{ padding: designTokens.spacing.scale[4] }}>
        <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
          Controls
        </Text>
        
        {Object.entries(config).map(([propName, propConfig]) => (
          <div key={propName} style={{ marginBottom: designTokens.spacing.scale[3] }}>
            <Text variant="caption" style={{ 
              display: 'block', 
              marginBottom: designTokens.spacing.scale[1],
              fontWeight: 'bold'
            }}>
              {propName}
            </Text>
            
            {propConfig.type === 'select' && (
              <select
                value={componentProps[propName] || propConfig.default}
                onChange={(e) => setComponentProps(prev => ({ ...prev, [propName]: e.target.value }))}
                style={{
                  width: '100%',
                  padding: designTokens.spacing.scale[2],
                  borderRadius: designTokens.borderRadius.md,
                  border: `1px solid ${designTokens.colors.neutral[300]}`,
                  fontSize: designTokens.typography.fontSizes.sm
                }}
              >
                {propConfig.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {propConfig.type === 'boolean' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.scale[2] }}>
                <input
                  type="checkbox"
                  checked={componentProps[propName] || false}
                  onChange={(e) => setComponentProps(prev => ({ ...prev, [propName]: e.target.checked }))}
                />
                <Text variant="body">{propName}</Text>
              </label>
            )}
            
            {propConfig.type === 'text' && (
              <input
                type="text"
                value={componentProps[propName] || propConfig.default}
                onChange={(e) => setComponentProps(prev => ({ ...prev, [propName]: e.target.value }))}
                style={{
                  width: '100%',
                  padding: designTokens.spacing.scale[2],
                  borderRadius: designTokens.borderRadius.md,
                  border: `1px solid ${designTokens.colors.neutral[300]}`,
                  fontSize: designTokens.typography.fontSizes.sm
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div style={{
      fontFamily: designTokens.typography.fonts.primary,
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e1e1e',
        color: 'white',
        padding: designTokens.spacing.scale[4],
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <div>
          <Text variant="h2" style={{ color: 'white', margin: 0 }}>
            📚 Storybook Pro
          </Text>
          <Text variant="caption" style={{ color: '#ccc', margin: 0 }}>
            Professional Component Documentation System
          </Text>
        </div>
        
        {/* Theme Switcher */}
        <div style={{ display: 'flex', gap: designTokens.spacing.scale[2] }}>
          {themes.map(theme => (
            <button
              key={theme.key}
              onClick={() => setSelectedTheme(theme.key)}
              style={{
                padding: `${designTokens.spacing.scale[2]}px ${designTokens.spacing.scale[3]}px`,
                borderRadius: designTokens.borderRadius.md,
                border: 'none',
                backgroundColor: selectedTheme === theme.key ? theme.color : '#333',
                color: 'white',
                cursor: 'pointer',
                fontSize: designTokens.typography.fontSizes.sm,
                fontWeight: selectedTheme === theme.key ? 'bold' : 'normal'
              }}
            >
              {theme.icon} {theme.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          backgroundColor: 'white',
          borderRight: '1px solid #e1e5e9',
          overflowY: 'auto'
        }}>
          {/* Component Navigation */}
          <div style={{ padding: designTokens.spacing.scale[4] }}>
            <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
              Components
            </Text>
            
            {['Atoms', 'Molecules', 'Organisms'].map(category => (
              <div key={category} style={{ marginBottom: designTokens.spacing.scale[4] }}>
                <Text variant="caption" style={{ 
                  display: 'block',
                  marginBottom: designTokens.spacing.scale[2],
                  color: designTokens.colors.text.secondary.light,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}>
                  {category}
                </Text>
                
                {components
                  .filter(comp => comp.category === category)
                  .map(comp => (
                    <button
                      key={comp.name}
                      onClick={() => {
                        setSelectedComponent(comp.name);
                        // Reset props when switching components
                        const config = componentPropsConfig[comp.name];
                        if (config) {
                          const defaultProps = {};
                          Object.entries(config).forEach(([key, propConfig]) => {
                            defaultProps[key] = propConfig.default;
                          });
                          setComponentProps(defaultProps);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: designTokens.spacing.scale[2],
                        borderRadius: designTokens.borderRadius.md,
                        border: 'none',
                        backgroundColor: selectedComponent === comp.name 
                          ? designTokens.colors.brand.primary 
                          : 'transparent',
                        color: selectedComponent === comp.name 
                          ? 'white' 
                          : designTokens.colors.text.primary.light,
                        cursor: 'pointer',
                        marginBottom: designTokens.spacing.scale[1],
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: designTokens.spacing.scale[2],
                        fontSize: designTokens.typography.fontSizes.sm
                      }}
                    >
                      <span>{comp.icon}</span>
                      <span>{comp.name}</span>
                    </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* View Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: 'white',
            borderBottom: '1px solid #e1e5e9',
            padding: `0 ${designTokens.spacing.scale[4]}px`
          }}>
            {[
              { key: 'canvas', name: 'Canvas', icon: '🎨' },
              { key: 'docs', name: 'Docs', icon: '📖' },
              { key: 'code', name: 'Code', icon: '💻' }
            ].map(view => (
              <button
                key={view.key}
                onClick={() => setSelectedView(view.key)}
                style={{
                  padding: `${designTokens.spacing.scale[3]}px ${designTokens.spacing.scale[4]}px`,
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: selectedView === view.key ? `2px solid ${designTokens.colors.brand.primary}` : '2px solid transparent',
                  color: selectedView === view.key ? designTokens.colors.brand.primary : designTokens.colors.text.secondary.light,
                  cursor: 'pointer',
                  fontSize: designTokens.typography.fontSizes.sm,
                  fontWeight: selectedView === view.key ? 'bold' : 'normal'
                }}
              >
                {view.icon} {view.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flex: 1 }}>
            {/* Main View */}
            <div style={{ flex: 1, padding: designTokens.spacing.scale[6] }}>
              {selectedView === 'canvas' && (
                <div>
                  <div style={{ marginBottom: designTokens.spacing.scale[4] }}>
                    <Text variant="h3">
                      {selectedComponent} - {themes.find(t => t.key === selectedTheme)?.name} Theme
                    </Text>
                  </div>
                  
                  <Card variant="elevated" padding="xl" style={{ 
                    backgroundColor: 'white',
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {renderComponentDemo()}
                  </Card>
                </div>
              )}
              
              {selectedView === 'code' && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: designTokens.spacing.scale[4]
                  }}>
                    <Text variant="h3">Code Example</Text>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => copyToClipboard(generateCodeSnippet())}
                    >
                      📋 Copy Code
                    </Button>
                  </div>
                  
                  <Card variant="outlined" padding="lg">
                    <pre style={{
                      backgroundColor: '#1e1e1e',
                      color: '#f8f8f2',
                      padding: designTokens.spacing.scale[4],
                      borderRadius: designTokens.borderRadius.md,
                      overflow: 'auto',
                      fontSize: designTokens.typography.fontSizes.sm,
                      fontFamily: designTokens.typography.fonts.monospace,
                      margin: 0
                    }}>
                      {generateCodeSnippet()}
                    </pre>
                  </Card>
                </div>
              )}
              
              {selectedView === 'docs' && (
                <div>
                  <Text variant="h3" style={{ marginBottom: designTokens.spacing.scale[4] }}>
                    {selectedComponent} Documentation
                  </Text>
                  
                  <Card variant="outlined" padding="lg" style={{ marginBottom: designTokens.spacing.scale[4] }}>
                    <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[2] }}>
                      Description
                    </Text>
                    <Text variant="body">
                      The {selectedComponent} component is a reusable UI element from our design system. 
                      It supports multiple themes and variants to fit different use cases.
                    </Text>
                  </Card>
                  
                  <Card variant="outlined" padding="lg">
                    <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
                      Props
                    </Text>
                    {Object.entries(componentPropsConfig[selectedComponent] || {}).map(([propName, propConfig]) => (
                      <div key={propName} style={{ 
                        marginBottom: designTokens.spacing.scale[3],
                        paddingBottom: designTokens.spacing.scale[2],
                        borderBottom: `1px solid ${designTokens.colors.neutral[200]}`
                      }}>
                        <div style={{ display: 'flex', gap: designTokens.spacing.scale[2], marginBottom: designTokens.spacing.scale[1] }}>
                          <Badge variant="secondary">{propName}</Badge>
                          <Badge variant="info">{propConfig.type}</Badge>
                          <Badge variant="success">default: {String(propConfig.default)}</Badge>
                        </div>
                        {propConfig.options && (
                          <Text variant="caption">
                            Options: {propConfig.options.join(', ')}
                          </Text>
                        )}
                      </div>
                    ))}
                  </Card>
                </div>
              )}
            </div>

            {/* Controls Panel */}
            {selectedView === 'canvas' && (
              <div style={{
                width: '300px',
                backgroundColor: 'white',
                borderLeft: '1px solid #e1e5e9',
                overflowY: 'auto'
              }}>
                {renderPropsControls()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorybookPro;