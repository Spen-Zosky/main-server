/**
 * Badge Component Stories
 * Storybook documentation for Badge atom
 */

import Badge from './Badge';
import { Text } from '../Text';
import { Button } from '../Button';

export default {
  title: 'Design System/Atoms/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: 'Badge component for status indicators, labels, and notifications. Built with design tokens for consistent styling.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
      description: 'Badge color variant',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Badge size',
    },
    rounded: {
      control: { type: 'boolean' },
      description: 'Fully rounded corners',
    },
    outline: {
      control: { type: 'boolean' },
      description: 'Outline style variant',
    },
    dot: {
      control: { type: 'boolean' },
      description: 'Dot indicator style',
    },
    children: {
      control: { type: 'text' },
      description: 'Badge content',
    },
  },
};

// Default story
export const Default = {
  args: {
    children: 'Badge',
  },
};

// All variants
export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

// Size variants
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Badge size="xs" variant="primary">XS</Badge>
      <Badge size="sm" variant="primary">Small</Badge>
      <Badge size="md" variant="primary">Medium</Badge>
      <Badge size="lg" variant="primary">Large</Badge>
    </div>
  ),
};

// Outline variants
export const Outline = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="default" outline>Default</Badge>
      <Badge variant="primary" outline>Primary</Badge>
      <Badge variant="success" outline>Success</Badge>
      <Badge variant="warning" outline>Warning</Badge>
      <Badge variant="error" outline>Error</Badge>
      <Badge variant="info" outline>Info</Badge>
    </div>
  ),
};

// Dot indicators
export const Dots = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge dot variant="success" />
        <Text>Online</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge dot variant="warning" />
        <Text>Away</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge dot variant="error" />
        <Text>Offline</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge dot variant="info" />
        <Text>Busy</Text>
      </div>
    </div>
  ),
};

// Status badges
export const StatusBadges = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Text>Server Status:</Text>
        <Badge variant="success" size="sm">Online</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Text>Build Status:</Text>
        <Badge variant="warning" size="sm">Pending</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Text>Security Scan:</Text>
        <Badge variant="error" size="sm">Failed</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Text>Version:</Text>
        <Badge variant="info" size="sm">v2.1.0</Badge>
      </div>
    </div>
  ),
};

// Notification badges
export const NotificationBadges = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Button variant="ghost">Messages</Button>
        <Badge 
          variant="error" 
          size="xs"
          style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-8px' 
          }}
        >
          3
        </Badge>
      </div>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Button variant="ghost">Notifications</Button>
        <Badge 
          variant="primary" 
          size="xs"
          style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-8px' 
          }}
        >
          12
        </Badge>
      </div>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Button variant="ghost">Cart</Button>
        <Badge 
          dot
          variant="error"
          style={{ 
            position: 'absolute', 
            top: '4px', 
            right: '4px' 
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges positioned as notification indicators on buttons and other elements.',
      },
    },
  },
};

// Tag-style badges
export const Tags = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Text variant="h4" className="mb-2">Technologies</Text>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" rounded={false}>React</Badge>
          <Badge variant="secondary" rounded={false}>TypeScript</Badge>
          <Badge variant="accent" rounded={false}>Node.js</Badge>
          <Badge variant="success" rounded={false}>MongoDB</Badge>
          <Badge variant="info" rounded={false}>Docker</Badge>
        </div>
      </div>
      
      <div>
        <Text variant="h4" className="mb-2">Skills</Text>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" outline size="sm">Frontend</Badge>
          <Badge variant="secondary" outline size="sm">Backend</Badge>
          <Badge variant="accent" outline size="sm">DevOps</Badge>
          <Badge variant="success" outline size="sm">UI/UX</Badge>
          <Badge variant="info" outline size="sm">Testing</Badge>
        </div>
      </div>
    </div>
  ),
};

// Priority indicators
export const PriorityIndicators = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto', 
        gap: '1rem',
        alignItems: 'center',
        padding: '0.75rem',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 'var(--border-radius-md)'
      }}>
        <div>
          <Text variant="h4">Critical Bug Fix</Text>
          <Text variant="caption" color="secondary">Payment processing issue</Text>
        </div>
        <Badge variant="error" size="sm">High</Badge>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto', 
        gap: '1rem',
        alignItems: 'center',
        padding: '0.75rem',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 'var(--border-radius-md)'
      }}>
        <div>
          <Text variant="h4">Feature Enhancement</Text>
          <Text variant="caption" color="secondary">Add dark mode support</Text>
        </div>
        <Badge variant="warning" size="sm">Medium</Badge>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto', 
        gap: '1rem',
        alignItems: 'center',
        padding: '0.75rem',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 'var(--border-radius-md)'
      }}>
        <div>
          <Text variant="h4">Documentation Update</Text>
          <Text variant="caption" color="secondary">Update API documentation</Text>
        </div>
        <Badge variant="success" size="sm">Low</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used as priority or status indicators in task lists and cards.',
      },
    },
  },
};