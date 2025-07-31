/**
 * Design System Introduction
 * Overview and getting started guide
 */

import { Text } from '../components/atoms/Text';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';

export default {
  title: 'Design System/Introduction',
  parameters: {
    docs: {
      page: () => (
        <div style={{ fontFamily: 'var(--typography-fonts-primary)', color: 'var(--color-text-primary-light)' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 'var(--spacing-scale-8)',
            padding: 'var(--spacing-scale-6)',
            background: 'var(--color-modules-ai-gradient)',
            color: 'white',
            borderRadius: 'var(--border-radius-lg)'
          }}>
            <h1 style={{ 
              fontSize: 'var(--typography-text-styles-display-font-size)',
              fontWeight: 'var(--typography-text-styles-display-font-weight)',
              lineHeight: 'var(--typography-text-styles-display-line-height)',
              margin: '0 0 var(--spacing-scale-4) 0'
            }}>
              Main Server Platform Design System
            </h1>
            <p style={{ 
              fontSize: 'var(--typography-text-styles-body-large-font-size)',
              margin: '0',
              opacity: 0.9
            }}>
              Enterprise-grade atomic design system with comprehensive design tokens
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-scale-6)',
            marginBottom: 'var(--spacing-scale-8)'
          }}>
            <div style={{
              padding: 'var(--spacing-scale-6)',
              backgroundColor: 'var(--color-surface-paper-light)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadows-base)'
            }}>
              <h2 style={{ color: 'var(--color-brand-primary)', marginTop: '0' }}>🎨 Design Tokens</h2>
              <p>Centralized design decisions with Style Dictionary:</p>
              <ul>
                <li>Colors, Typography, Spacing</li>
                <li>Shadows, Border Radius</li>
                <li>Multi-format Output (CSS, JS, SCSS)</li>
                <li>Module-specific Theming</li>
              </ul>
            </div>

            <div style={{
              padding: 'var(--spacing-scale-6)',
              backgroundColor: 'var(--color-surface-paper-light)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadows-base)'
            }}>
              <h2 style={{ color: 'var(--color-semantic-success)', marginTop: '0' }}>⚛️ Atomic Design</h2>
              <p>Systematic component architecture:</p>
              <ul>
                <li><strong>Atoms:</strong> Button, Text, Input, Card, Badge</li>
                <li><strong>Molecules:</strong> SearchBox, Form</li>
                <li><strong>Organisms:</strong> Header, Dashboard</li>
              </ul>
            </div>

            <div style={{
              padding: 'var(--spacing-scale-6)',
              backgroundColor: 'var(--color-surface-paper-light)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadows-base)'
            }}>
              <h2 style={{ color: 'var(--color-brand-accent)', marginTop: '0' }}>🏢 Enterprise Features</h2>
              <p>Production-ready capabilities:</p>
              <ul>
                <li>WCAG 2.1 Accessibility</li>
                <li>Universal Portability</li>
                <li>TypeScript Support</li>
                <li>Comprehensive Testing</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-scale-8)' }}>
            <h2>Module Themes</h2>
            <p>Each business module has its own visual identity:</p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 'var(--spacing-scale-4)' 
            }}>
              <div style={{
                padding: 'var(--spacing-scale-4)',
                background: 'var(--color-modules-ai-gradient)',
                color: 'white',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-scale-2)' }}>🤖</div>
                <h3 style={{ margin: '0 0 var(--spacing-scale-1) 0' }}>AI-HRMS</h3>
                <p style={{ margin: '0', opacity: 0.9, fontSize: '0.875rem' }}>Human Resources Management</p>
              </div>

              <div style={{
                padding: 'var(--spacing-scale-4)',
                background: 'var(--color-modules-nose-gradient)',
                color: 'white',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-scale-2)' }}>🔬</div>
                <h3 style={{ margin: '0 0 var(--spacing-scale-1) 0' }}>NOSE Research</h3>
                <p style={{ margin: '0', opacity: 0.9, fontSize: '0.875rem' }}>Academic Research Platform</p>
              </div>

              <div style={{
                padding: 'var(--spacing-scale-4)',
                background: 'var(--color-modules-hunter-gradient)',
                color: 'white',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-scale-2)' }}>🕸️</div>
                <h3 style={{ margin: '0 0 var(--spacing-scale-1) 0' }}>Web-Hunter</h3>
                <p style={{ margin: '0', opacity: 0.9, fontSize: '0.875rem' }}>Data Mining & Analytics</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--color-neutral-50)',
            padding: 'var(--spacing-scale-6)',
            borderRadius: 'var(--border-radius-lg)',
            marginBottom: 'var(--spacing-scale-8)'
          }}>
            <h2>Quick Start</h2>
            <div style={{ 
              backgroundColor: 'var(--color-neutral-900)',
              color: 'var(--color-neutral-100)',
              padding: 'var(--spacing-scale-4)',
              borderRadius: 'var(--border-radius-md)',
              fontFamily: 'var(--typography-fonts-monospace)',
              fontSize: 'var(--typography-font-sizes-sm)',
              marginBottom: 'var(--spacing-scale-4)'
            }}>
              <div># Import components</div>
              <div>import {`{ Button, Text, Input }`} from '../components/atoms';</div>
              <div>import {`{ SearchBox, Form }`} from '../components/molecules';</div>
              <div>import {`{ Header }`} from '../components/organisms';</div>
              <br />
              <div># Import design tokens</div>
              <div>import {`{ designTokens }`} from '../design-system/tokens';</div>
            </div>
            
            <h3>Using Design Tokens</h3>
            <div style={{ 
              backgroundColor: 'var(--color-neutral-900)',
              color: 'var(--color-neutral-100)',
              padding: 'var(--spacing-scale-4)',
              borderRadius: 'var(--border-radius-md)',
              fontFamily: 'var(--typography-fonts-monospace)',
              fontSize: 'var(--typography-font-sizes-sm)',
            }}>
              <div>// CSS Variables</div>
              <div>color: var(--color-brand-primary);</div>
              <div>padding: var(--spacing-scale-4);</div>
              <br />
              <div>// JavaScript Objects</div>
              <div>color: designTokens.colors.brand.primary;</div>
              <div>padding: designTokens.spacing.scale[4];</div>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-scale-6)',
            backgroundColor: 'var(--color-semantic-info)',
            color: 'white',
            borderRadius: 'var(--border-radius-lg)'
          }}>
            <h2 style={{ marginTop: '0' }}>Ready for Development</h2>
            <p style={{ marginBottom: '0', fontSize: 'var(--typography-font-sizes-lg)' }}>
              Explore the components in the sidebar to see the design system in action!
            </p>
          </div>
        </div>
      ),
    },
  },
};

// Just a placeholder story for the navigation
export const Welcome = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: 'var(--spacing-scale-6)'
    }}>
      <Text variant="display" color="brand">
        Welcome to Our Design System
      </Text>
      <Text variant="bodyLarge" color="secondary">
        Check out the documentation tab above for the complete guide!
      </Text>
      <div style={{ display: 'flex', gap: 'var(--spacing-scale-3)' }}>
        <Badge variant="success">✅ Design Tokens</Badge>
        <Badge variant="info">⚛️ Atomic Design</Badge>
        <Badge variant="primary">🎨 Storybook</Badge>
        <Badge variant="accent">🏢 Enterprise</Badge>
      </div>
    </div>
  ),
};