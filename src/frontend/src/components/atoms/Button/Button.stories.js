/**
 * Button Component Stories
 * Storybook documentation for Button atom
 */

import Button from './Button';

export default {
  title: 'Design System/Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Base button component built with design tokens. Supports multiple variants, sizes, states, and accessibility features.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'ghost'],
      description: 'Button visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading state',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Make button full width',
    },
    children: {
      control: { type: 'text' },
      description: 'Button content',
    },
  },
};

// Default story
export const Default = {
  args: {
    children: 'Button',
  },
};

// Variant examples
export const Primary = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Accent = {
  args: {
    children: 'Accent Button',
    variant: 'accent',
  },
};

export const Success = {
  args: {
    children: 'Success Button',
    variant: 'success',
  },
};

export const Warning = {
  args: {
    children: 'Warning Button',
    variant: 'warning',
  },
};

export const Error = {
  args: {
    children: 'Error Button',
    variant: 'error',
  },
};

export const Ghost = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

// Size examples
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// State examples
export const States = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button>Normal</Button>
      <Button loading>Loading</Button>  
      <Button disabled>Disabled</Button>
    </div>
  ),
};

// With icons
export const WithIcons = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button startIcon="🚀">Start Icon</Button>
      <Button endIcon="➡️">End Icon</Button>
      <Button startIcon="💾" endIcon="✓">Both Icons</Button>
    </div>
  ),
};

// Full width
export const FullWidth = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};

// All variants showcase
export const AllVariants = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="error">Error</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants using design system tokens.',
      },
    },
  },
};