/**
 * Card Component Stories
 * Storybook documentation for Card atom
 */

import Card from './Card';
import { Button } from '../Button';
import { Text } from '../Text';

export default {
  title: 'Design System/Atoms/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: 'Flexible card component built with design tokens. Supports various styles, interactive states, and content organization.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined', 'ghost'],
      description: 'Card visual style variant',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Internal padding',
    },
    shadow: {
      control: { type: 'select' },
      options: ['none', 'sm', 'base', 'md', 'lg', 'xl'],
      description: 'Shadow depth',
    },
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Border radius',
    },
    border: {
      control: { type: 'boolean' },
      description: 'Show border',
    },
    hoverable: {
      control: { type: 'boolean' },
      description: 'Hover animation effect',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Clickable with pointer cursor',
    },
  },
};

// Default story
export const Default = {
  args: {
    children: (
      <div>
        <Text variant="h3" className="mb-2">Card Title</Text>
        <Text variant="body">
          This is a default card with some content. Cards are flexible containers 
          that can hold various types of content and interactive elements.
        </Text>
      </div>
    ),
  },
};

// Card variants
export const Variants = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
      <Card variant="default">
        <Text variant="h4" className="mb-2">Default Card</Text>
        <Text variant="body">Standard card with subtle background</Text>
      </Card>
      
      <Card variant="elevated">
        <Text variant="h4" className="mb-2">Elevated Card</Text>
        <Text variant="body">Card with enhanced shadow depth</Text>
      </Card>
      
      <Card variant="outlined">
        <Text variant="h4" className="mb-2">Outlined Card</Text>
        <Text variant="body">Card with visible border outline</Text>
      </Card>
      
      <Card variant="ghost">
        <Text variant="h4" className="mb-2">Ghost Card</Text>
        <Text variant="body">Transparent card for subtle grouping</Text>
      </Card>
    </div>
  ),
};

// Padding sizes
export const PaddingSizes = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <Card padding="sm" border>
        <Text variant="h4" className="mb-1">Small Padding</Text>
        <Text variant="caption">Compact spacing</Text>
      </Card>
      
      <Card padding="md" border>
        <Text variant="h4" className="mb-2">Medium Padding</Text>
        <Text variant="caption">Default spacing</Text>
      </Card>
      
      <Card padding="lg" border>
        <Text variant="h4" className="mb-2">Large Padding</Text>
        <Text variant="caption">Spacious layout</Text>
      </Card>
    </div>
  ),
};

// Shadow depths
export const ShadowDepths = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
      <Card shadow="none" border>
        <Text variant="h4" className="mb-2">No Shadow</Text>
        <Text variant="caption">Flat appearance</Text>
      </Card>
      
      <Card shadow="sm">
        <Text variant="h4" className="mb-2">Small Shadow</Text>
        <Text variant="caption">Subtle elevation</Text>
      </Card>
      
      <Card shadow="base">
        <Text variant="h4" className="mb-2">Base Shadow</Text>
        <Text variant="caption">Standard elevation</Text>
      </Card>
      
      <Card shadow="md">
        <Text variant="h4" className="mb-2">Medium Shadow</Text>
        <Text variant="caption">Notable elevation</Text>
      </Card>
      
      <Card shadow="lg">
        <Text variant="h4" className="mb-2">Large Shadow</Text>
        <Text variant="caption">High elevation</Text>
      </Card>
    </div>
  ),
};

// Interactive cards
export const Interactive = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
      <Card hoverable>
        <Text variant="h4" className="mb-2">Hoverable Card</Text>
        <Text variant="body">Hover to see lift animation</Text>
      </Card>
      
      <Card clickable onClick={() => alert('Card clicked!')}>
        <Text variant="h4" className="mb-2">Clickable Card</Text>
        <Text variant="body">Click me to trigger action</Text>
      </Card>
      
      <Card hoverable clickable onClick={() => console.log('Interactive card clicked')}>
        <Text variant="h4" className="mb-2">Interactive Card</Text>
        <Text variant="body">Both hoverable and clickable</Text>
      </Card>
    </div>
  ),
};

// Cards with headers and footers
export const WithHeaderFooter = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      <Card
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3">Project Card</Text>
            <Text variant="caption" color="secondary">Active</Text>
          </div>
        }
        footer={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button size="sm" variant="primary">Edit</Button>
            <Button size="sm" variant="secondary">Delete</Button>
          </div>
        }
      >
        <Text variant="body" className="mb-3">
          This project contains multiple components and features. 
          Last updated 2 hours ago.
        </Text>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--color-brand-primary)',
            color: 'white',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.75rem'
          }}>React</span>
          <span style={{ 
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--color-semantic-success)',
            color: 'white',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.75rem'
          }}>TypeScript</span>
        </div>
      </Card>
      
      <Card
        header={<Text variant="h3">Statistics</Text>}
        footer={<Text variant="caption" color="secondary">Updated just now</Text>}
        variant="elevated"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div>
            <Text variant="h2" color="brand">42</Text>
            <Text variant="caption" color="secondary">Active Users</Text>
          </div>
          <div>
            <Text variant="h2" color="success">98%</Text>
            <Text variant="caption" color="secondary">Uptime</Text>
          </div>
        </div>
      </Card>
    </div>
  ),
};

// Product card example
export const ProductCard = {
  render: () => (
    <Card 
      hoverable 
      clickable 
      style={{ maxWidth: '320px' }}
      onClick={() => console.log('Product clicked')}
    >
      <div style={{ 
        height: '200px', 
        backgroundColor: 'var(--color-neutral-100)',
        borderRadius: 'var(--border-radius-md)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        📱
      </div>
      
      <Text variant="h3" className="mb-2">Smartphone Pro</Text>
      <Text variant="body" className="mb-3" color="secondary">
        Latest flagship smartphone with advanced camera system and 5G connectivity.
      </Text>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="h3" color="brand">$999</Text>
        <Button variant="primary" size="sm">Add to Cart</Button>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a product card with hover effects and interactive elements.',
      },
    },
  },
};

// Dashboard card grid
export const DashboardGrid = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
      <Card variant="elevated" hoverable>
        <Text variant="h2" color="brand" className="mb-1">1,234</Text>
        <Text variant="h4">Total Users</Text>
        <Text variant="caption" color="success">↗ +12% from last month</Text>
      </Card>
      
      <Card variant="elevated" hoverable>
        <Text variant="h2" color="success" className="mb-1">$45.2K</Text>
        <Text variant="h4">Revenue</Text>
        <Text variant="caption" color="success">↗ +8% from last month</Text>
      </Card>
      
      <Card variant="elevated" hoverable>
        <Text variant="h2" color="warning" className="mb-1">23</Text>
        <Text variant="h4">Pending Tasks</Text>
        <Text variant="caption" color="secondary">3 due today</Text>
      </Card>
      
      <Card variant="elevated" hoverable>
        <Text variant="h2" color="info" className="mb-1">99.9%</Text>
        <Text variant="h4">Uptime</Text>
        <Text variant="caption" color="success">All systems operational</Text>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard-style metrics cards with consistent styling and hover effects.',
      },
    },
  },
};