/**
 * Brand Builder - Create and Save Brand Standards
 * Tool to customize components and save them as brand standards
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../components/atoms/Button';
import { Text } from '../components/atoms/Text';
import { Input } from '../components/atoms/Input';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { designTokens } from '../design-system/tokens';

const BrandBuilder = () => {
  const [selectedComponent, setSelectedComponent] = useState('Button');
  const [currentBrand, setCurrentBrand] = useState({
    name: 'My Custom Brand',
    colors: {
      primary: '#0066CC',
      secondary: '#6C757D', 
      accent: '#FF6600',
      success: '#28A745',
      error: '#DC3545',
      warning: '#FFC107'
    },
    typography: {
      primaryFont: 'Inter, system-ui, sans-serif',
      secondaryFont: 'Playfair Display, Georgia, serif',
      fontSize: {
        sm: '14px',
        md: '16px',
        lg: '18px'
      }
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px'
    }
  });

  const [savedBrands, setSavedBrands] = useState(() => {
    const saved = localStorage.getItem('savedBrands');
    return saved ? JSON.parse(saved) : {};
  });

  const [previewComponent, setPreviewComponent] = useState({
    variant: 'primary',
    size: 'md',
    children: 'Sample Button'
  });

  const components = [
    { name: 'Button', icon: '🔘' },
    { name: 'Text', icon: '📝' },
    { name: 'Input', icon: '📝' },
    { name: 'Card', icon: '🃏' },
    { name: 'Badge', icon: '🏷️' }
  ];

  // Apply current brand to preview
  const getBrandStyle = () => ({
    '--color-brand-primary': currentBrand.colors.primary,
    '--color-brand-secondary': currentBrand.colors.secondary,
    '--color-brand-accent': currentBrand.colors.accent,
    '--color-success': currentBrand.colors.success,
    '--color-error': currentBrand.colors.error,
    '--color-warning': currentBrand.colors.warning,
    '--font-primary': currentBrand.typography.primaryFont,
    '--font-secondary': currentBrand.typography.secondaryFont,
    '--border-radius-sm': currentBrand.borderRadius.sm,
    '--border-radius-md': currentBrand.borderRadius.md,
    '--border-radius-lg': currentBrand.borderRadius.lg,
    '--spacing-sm': currentBrand.spacing.sm,
    '--spacing-md': currentBrand.spacing.md,
    '--spacing-lg': currentBrand.spacing.lg,
    '--spacing-xl': currentBrand.spacing.xl
  });

  // Save brand to localStorage
  const saveBrand = () => {
    const brandId = Date.now().toString();
    const newSavedBrands = {
      ...savedBrands,
      [brandId]: {
        ...currentBrand,
        id: brandId,
        createdAt: new Date().toISOString()
      }
    };
    setSavedBrands(newSavedBrands);
    localStorage.setItem('savedBrands', JSON.stringify(newSavedBrands));
    alert(`Brand "${currentBrand.name}" saved successfully!`);
  };

  // Load brand
  const loadBrand = (brandId) => {
    const brand = savedBrands[brandId];
    if (brand) {
      setCurrentBrand(brand);
    }
  };

  // Delete brand
  const deleteBrand = (brandId) => {
    const newSavedBrands = { ...savedBrands };
    delete newSavedBrands[brandId];
    setSavedBrands(newSavedBrands);
    localStorage.setItem('savedBrands', JSON.stringify(newSavedBrands));
  };

  // Export brand as design tokens
  const exportBrand = () => {
    const tokens = {
      color: {
        brand: {
          primary: { value: currentBrand.colors.primary },
          secondary: { value: currentBrand.colors.secondary },
          accent: { value: currentBrand.colors.accent }
        },
        semantic: {
          success: { value: currentBrand.colors.success },
          error: { value: currentBrand.colors.error },
          warning: { value: currentBrand.colors.warning }
        }
      },
      typography: {
        fonts: {
          primary: { value: currentBrand.typography.primaryFont },
          secondary: { value: currentBrand.typography.secondaryFont }
        },
        fontSizes: currentBrand.typography.fontSize
      },
      spacing: {
        scale: currentBrand.spacing
      },
      borderRadius: currentBrand.borderRadius
    };

    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBrand.name.replace(/\s+/g, '-').toLowerCase()}-tokens.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render component preview
  const renderPreview = () => {
    const Component = { Button, Text, Input, Card, Badge }[selectedComponent];
    if (!Component) return null;

    const style = getBrandStyle();
    
    return (
      <div style={style}>
        <Component {...previewComponent} style={{
          fontFamily: 'var(--font-primary)',
          borderRadius: 'var(--border-radius-md)'
        }} />
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: designTokens.typography.fonts.primary,
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e1e1e',
        color: 'white',
        padding: designTokens.spacing.scale[4],
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Text variant="h2" style={{ color: 'white', margin: 0 }}>
            🎨 Brand Builder
          </Text>
          <Text variant="caption" style={{ color: '#ccc', margin: 0 }}>
            Create and save your brand standards
          </Text>
        </div>
        
        <div style={{ display: 'flex', gap: designTokens.spacing.scale[2] }}>
          <Button variant="secondary" onClick={exportBrand}>
            📤 Export Tokens
          </Button>
          <Button variant="primary" onClick={saveBrand}>
            💾 Save Brand
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Saved Brands Sidebar */}
        <div style={{
          width: '250px',
          backgroundColor: 'white',
          borderRight: '1px solid #e1e5e9',
          padding: designTokens.spacing.scale[4],
          overflowY: 'auto'
        }}>
          <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
            Saved Brands
          </Text>
          
          {Object.values(savedBrands).map(brand => (
            <Card key={brand.id} variant="outlined" padding="sm" style={{ marginBottom: designTokens.spacing.scale[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text variant="body" style={{ fontWeight: 'bold' }}>{brand.name}</Text>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: brand.colors.primary, 
                      borderRadius: '2px' 
                    }} />
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: brand.colors.secondary, 
                      borderRadius: '2px' 
                    }} />
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: brand.colors.accent, 
                      borderRadius: '2px' 
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => loadBrand(brand.id)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: designTokens.colors.brand.primary,
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteBrand(brand.id)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex' }}>
          {/* Controls Panel */}
          <div style={{
            width: '350px',
            backgroundColor: 'white',
            padding: designTokens.spacing.scale[4],
            overflowY: 'auto',
            borderRight: '1px solid #e1e5e9'
          }}>
            {/* Brand Name */}
            <div style={{ marginBottom: designTokens.spacing.scale[4] }}>
              <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[2] }}>
                Brand Settings
              </Text>
              <Input
                label="Brand Name"
                value={currentBrand.name}
                onChange={(value) => setCurrentBrand(prev => ({ ...prev, name: value }))}
              />
            </div>

            {/* Colors */}
            <div style={{ marginBottom: designTokens.spacing.scale[4] }}>
              <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
                Colors
              </Text>
              {Object.entries(currentBrand.colors).map(([colorName, colorValue]) => (
                <div key={colorName} style={{ marginBottom: designTokens.spacing.scale[2] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.scale[2] }}>
                    <input
                      type="color"
                      value={colorValue}
                      onChange={(e) => setCurrentBrand(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [colorName]: e.target.value }
                      }))}
                      style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px' }}
                    />
                    <div>
                      <Text variant="body" style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {colorName}
                      </Text>
                      <Text variant="caption" style={{ color: '#666' }}>
                        {colorValue}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Typography */}
            <div style={{ marginBottom: designTokens.spacing.scale[4] }}>
              <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
                Typography
              </Text>
              <div style={{ marginBottom: designTokens.spacing.scale[2] }}>
                <Text variant="caption" style={{ display: 'block', marginBottom: '4px' }}>Primary Font</Text>
                <select
                  value={currentBrand.typography.primaryFont}
                  onChange={(e) => setCurrentBrand(prev => ({
                    ...prev,
                    typography: { ...prev.typography, primaryFont: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="Inter, system-ui, sans-serif">Inter</option>
                  <option value="Roboto, Arial, sans-serif">Roboto</option>
                  <option value="Open Sans, Arial, sans-serif">Open Sans</option>
                  <option value="Lato, Helvetica, sans-serif">Lato</option>
                  <option value="Poppins, Arial, sans-serif">Poppins</option>
                </select>
              </div>
              <div>
                <Text variant="caption" style={{ display: 'block', marginBottom: '4px' }}>Secondary Font</Text>
                <select
                  value={currentBrand.typography.secondaryFont}
                  onChange={(e) => setCurrentBrand(prev => ({
                    ...prev,
                    typography: { ...prev.typography, secondaryFont: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="Playfair Display, Georgia, serif">Playfair Display</option>
                  <option value="Merriweather, Georgia, serif">Merriweather</option>
                  <option value="Lora, Georgia, serif">Lora</option>
                  <option value="Source Serif Pro, Georgia, serif">Source Serif Pro</option>
                </select>
              </div>
            </div>

            {/* Border Radius */}
            <div style={{ marginBottom: designTokens.spacing.scale[4] }}>
              <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
                Border Radius
              </Text>
              {Object.entries(currentBrand.borderRadius).map(([size, value]) => (
                <div key={size} style={{ marginBottom: designTokens.spacing.scale[2] }}>
                  <Text variant="caption" style={{ display: 'block', marginBottom: '4px', textTransform: 'capitalize' }}>
                    {size}
                  </Text>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={parseInt(value)}
                    onChange={(e) => setCurrentBrand(prev => ({
                      ...prev,
                      borderRadius: { ...prev.borderRadius, [size]: `${e.target.value}px` }
                    }))}
                    style={{ width: '100%' }}
                  />
                  <Text variant="caption" style={{ color: '#666' }}>{value}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div style={{ flex: 1, padding: designTokens.spacing.scale[6] }}>
            <div style={{ marginBottom: designTokens.spacing.scale[4] }}>
              <Text variant="h3" style={{ marginBottom: designTokens.spacing.scale[2] }}>
                Preview: {currentBrand.name}
              </Text>
              
              {/* Component Selector */}
              <div style={{ display: 'flex', gap: designTokens.spacing.scale[2], marginBottom: designTokens.spacing.scale[4] }}>
                {components.map(comp => (
                  <button
                    key={comp.name}
                    onClick={() => setSelectedComponent(comp.name)}
                    style={{
                      padding: `${designTokens.spacing.scale[2]}px ${designTokens.spacing.scale[3]}px`,
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: selectedComponent === comp.name ? currentBrand.colors.primary : '#f8f9fa',
                      color: selectedComponent === comp.name ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {comp.icon} {comp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Component Preview */}
            <Card variant="elevated" padding="xl" style={{ 
              backgroundColor: 'white',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: designTokens.spacing.scale[4]
            }}>
              {renderPreview()}
            </Card>

            {/* Brand Palette Preview */}
            <Card variant="outlined" padding="lg">
              <Text variant="h4" style={{ marginBottom: designTokens.spacing.scale[3] }}>
                Brand Palette
              </Text>
              <div style={{ display: 'flex', gap: designTokens.spacing.scale[3], flexWrap: 'wrap' }}>
                {Object.entries(currentBrand.colors).map(([name, color]) => (
                  <div key={name} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: color,
                      borderRadius: currentBrand.borderRadius.md,
                      marginBottom: designTokens.spacing.scale[1],
                      border: '1px solid #e1e5e9'
                    }} />
                    <Text variant="caption" style={{ 
                      display: 'block', 
                      textTransform: 'capitalize',
                      fontWeight: 'bold'
                    }}>
                      {name}
                    </Text>
                    <Text variant="caption" style={{ color: '#666', fontSize: '10px' }}>
                      {color}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBuilder;