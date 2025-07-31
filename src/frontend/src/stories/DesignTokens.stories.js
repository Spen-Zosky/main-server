/**
 * Design Tokens Documentation
 * Complete reference for all design tokens
 */

import { designTokens } from '../design-system/tokens';

export default {
  title: 'Design System/Design Tokens',
  parameters: {
    docs: {
      page: () => (
        <div style={{ fontFamily: designTokens.typography.fonts.primary }}>
          <h1>Design Tokens Reference</h1>
          <p>
            Complete reference for all design tokens in the Main Server Platform design system. 
            These tokens are generated using Style Dictionary and available in multiple formats.
          </p>

          {/* Colors */}
          <section style={{ marginBottom: '3rem' }}>
            <h2>Colors</h2>
            
            <h3>Brand Colors</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {Object.entries(designTokens.colors.brand).map(([key, value]) => (
                <div key={key} style={{
                  backgroundColor: value,
                  color: 'white',
                  padding: '1rem',
                  borderRadius: designTokens.borderRadius.md,
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{key}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{value}</div>
                </div>
              ))}
            </div>

            <h3>Module Colors</h3>
            {Object.entries(designTokens.colors.modules).map(([moduleName, moduleColors]) => (
              <div key={moduleName} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ textTransform: 'capitalize', margin: '1rem 0 0.5rem 0' }}>{moduleName}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.entries(moduleColors).map(([colorKey, colorValue]) => (
                    <div key={colorKey} style={{
                      backgroundColor: colorKey === 'gradient' ? 'transparent' : colorValue,
                      background: colorKey === 'gradient' ? colorValue : undefined,
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: designTokens.borderRadius.sm,
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      {colorKey}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <h3>Semantic Colors</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {Object.entries(designTokens.colors.semantic).map(([key, value]) => (
                <div key={key} style={{
                  backgroundColor: value,
                  color: 'white',
                  padding: '1rem',
                  borderRadius: designTokens.borderRadius.md,
                  textAlign: 'center',
                  minWidth: '120px'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{key}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{value}</div>
                </div>
              ))}
            </div>

            <h3>Neutral Colors</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.entries(designTokens.colors.neutral).map(([key, value]) => (
                <div key={key} style={{
                  backgroundColor: value,
                  color: parseInt(key) > 500 ? 'white' : 'black',
                  padding: '0.75rem',
                  borderRadius: designTokens.borderRadius.sm,
                  textAlign: 'center',
                  minWidth: '60px',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{key}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section style={{ marginBottom: '3rem' }}>
            <h2>Typography</h2>
            
            <h3>Font Families</h3>
            <div style={{ marginBottom: '2rem' }}>
              {Object.entries(designTokens.typography.fonts).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{key}</div>
                  <div style={{ fontFamily: value, fontSize: '1.5rem' }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666', fontFamily: 'monospace' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <h3>Font Sizes</h3>
            <div style={{ marginBottom: '2rem' }}>
              {Object.entries(designTokens.typography.fontSizes).map(([key, value]) => (
                <div key={key} style={{ 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    fontSize: value,
                    fontWeight: '500',
                    minWidth: '60px'
                  }}>
                    {key}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: value }}>
                    Sample text at {key} size
                  </div>
                </div>
              ))}
            </div>

            <h3>Text Styles</h3>
            <div>
              {Object.entries(designTokens.typography.textStyles).map(([key, styles]) => (
                <div key={key} style={{ 
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: designTokens.borderRadius.md
                }}>
                  <div style={{
                    fontSize: styles.fontSize,
                    fontWeight: styles.fontWeight,
                    lineHeight: styles.lineHeight,
                    fontFamily: styles.fontFamily,
                    letterSpacing: styles.letterSpacing,
                    marginBottom: '0.5rem'
                  }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Text Style
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    Font: {styles.fontSize} / Weight: {styles.fontWeight} / Line Height: {styles.lineHeight}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Spacing */}
          <section style={{ marginBottom: '3rem' }}>
            <h2>Spacing Scale</h2>
            <p>Consistent spacing based on a modular scale:</p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {Object.entries(designTokens.spacing.scale).map(([key, value]) => (
                <div key={key} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.5rem 0'
                }}>
                  <div style={{ 
                    minWidth: '40px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace'
                  }}>
                    {key}
                  </div>
                  <div style={{
                    width: value,
                    height: '20px',
                    backgroundColor: designTokens.colors.brand.primary,
                    borderRadius: '2px'
                  }} />
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shadows */}
          <section style={{ marginBottom: '3rem' }}>
            <h2>Shadows</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(designTokens.shadows).map(([key, value]) => (
                <div key={key} style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  boxShadow: value,
                  borderRadius: designTokens.borderRadius.md,
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{key}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>
                    {value === 'none' ? 'none' : 'box-shadow applied'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Border Radius */}
          <section style={{ marginBottom: '3rem' }}>
            <h2>Border Radius</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {Object.entries(designTokens.borderRadius).map(([key, value]) => (
                <div key={key} style={{
                  padding: '1.5rem',
                  backgroundColor: designTokens.colors.neutral[100],
                  borderRadius: value,
                  textAlign: 'center',
                  border: '2px solid ' + designTokens.colors.brand.primary
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{key}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Usage Examples */}
          <section style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: designTokens.borderRadius.lg,
            marginBottom: '3rem'
          }}>
            <h2>Usage Examples</h2>
            
            <h3>CSS Variables</h3>
            <pre style={{
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: designTokens.borderRadius.md,
              fontSize: '0.875rem',
              overflow: 'auto'
            }}>
{`.my-component {
  color: var(--color-brand-primary);
  padding: var(--spacing-scale-4);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadows-base);
  font-size: var(--typography-font-sizes-base);
}`}</pre>

            <h3>JavaScript Objects</h3>
            <pre style={{
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: designTokens.borderRadius.md,
              fontSize: '0.875rem',
              overflow: 'auto'
            }}>
{`import { designTokens } from '../design-system/tokens';

const styles = {
  color: designTokens.colors.brand.primary,
  padding: designTokens.spacing.scale[4],
  borderRadius: designTokens.borderRadius.md,
  boxShadow: designTokens.shadows.base,
  fontSize: designTokens.typography.fontSizes.base,
};`}</pre>
          </section>
        </div>
      ),
    },
  },
};

// Placeholder story for navigation
export const TokenReference = {
  render: () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      backgroundColor: designTokens.colors.neutral[50],
      borderRadius: designTokens.borderRadius.lg
    }}>
      <h2 style={{ color: designTokens.colors.brand.primary, margin: '0 0 1rem 0' }}>
        Design Tokens Reference
      </h2>
      <p style={{ color: designTokens.colors.text.secondary.light, margin: '0' }}>
        Switch to the Documentation tab to view the complete token reference
      </p>
    </div>
  ),
};