/**
 * Button Component Stories
 * Comprehensive documentation and testing for the Button atom
 */

import { Button } from './Button';
import { designTokens } from '../../design-system/tokens';

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary button component with multiple variants, sizes, and states. Supports theming and accessibility features.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
  tags: ['autodocs'],
};

// Default story
export const Default = {
  args: {
    children: 'Default Button',
    variant: 'primary',
    size: 'md',
  },
};

// Variants showcase
export const Variants = () => (
  <div style={{ display: 'flex', gap: designTokens.spacing.scale[3], flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="accent">Accent</Button>
    <Button variant="ghost">Ghost</Button>
  </div>
);

// Sizes showcase
export const Sizes = () => (
  <div style={{ display: 'flex', gap: designTokens.spacing.scale[3], alignItems: 'center', flexWrap: 'wrap' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

// States showcase
export const States = () => (
  <div style={{ display: 'flex', gap: designTokens.spacing.scale[3], flexWrap: 'wrap' }}>
    <Button>Normal</Button>
    <Button disabled>Disabled</Button>
    <Button loading>Loading</Button>
  </div>
);

// Full width example
export const FullWidth = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};

// Interactive example
export const Interactive = {
  args: {
    children: 'Click me!',
    onClick: () => alert('Button clicked!'),
  },
};

// Theme variations (these will show different colors based on selected theme)
export const ThemeVariations = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.scale[4] }}>
    <div>
      <h3 style={{ marginBottom: designTokens.spacing.scale[2] }}>Primary Buttons</h3>
      <div style={{ display: 'flex', gap: designTokens.spacing.scale[2] }}>
        <Button variant="primary">AI-HRMS Style</Button>
        <Button variant="primary" size="lg">Large Primary</Button>
      </div>
    </div>
    
    <div>
      <h3 style={{ marginBottom: designTokens.spacing.scale[2] }}>Secondary & Accent</h3>
      <div style={{ display: 'flex', gap: designTokens.spacing.scale[2] }}>
        <Button variant="secondary">NOSE Research Style</Button>
        <Button variant="accent">Web-Hunter Style</Button>
      </div>
    </div>
  </div>
);