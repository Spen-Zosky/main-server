/**
 * Input Component Stories
 * Storybook documentation for Input atom
 */

import { useState } from 'react';
import Input from './Input';

export default {
  title: 'Design System/Atoms/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'Form input component built with design tokens. Supports various states, sizes, validation, and accessibility features.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Error state',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Success state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Required field',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Full width input',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    label: {
      control: { type: 'text' },
      description: 'Input label',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Helper text',
    },
    errorText: {
      control: { type: 'text' },
      description: 'Error message',
    },
  },
};

// Default story
export const Default = {
  args: {
    placeholder: 'Enter text...',
  },
};

// With label and helper text
export const WithLabel = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    helperText: 'This will be displayed on your profile',
    required: true,
  },
};

// Size variants
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input size="sm" label="Small Input" placeholder="Small size input" />
      <Input size="md" label="Medium Input" placeholder="Medium size input (default)" />
      <Input size="lg" label="Large Input" placeholder="Large size input" />
    </div>
  ),
};

// Input states
export const States = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input label="Default State" placeholder="Normal input" />
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
        placeholder="Disabled input" 
        disabled 
        value="Cannot edit this"
      />
    </div>
  ),
};

// With icons
export const WithIcons = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input 
        label="Email Address"
        type="email"
        placeholder="Enter your email" 
        startIcon="📧"
      />
      <Input 
        label="Password"
        type="password"
        placeholder="Enter password" 
        startIcon="🔒"
        endIcon="👁️"
      />
      <Input 
        label="Search"
        type="search"
        placeholder="Search anything..." 
        startIcon="🔍"
        endIcon="⌘K"
      />
    </div>
  ),
};

// Input types
export const InputTypes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input type="text" label="Text Input" placeholder="Any text" />
      <Input type="email" label="Email Input" placeholder="user@example.com" />
      <Input type="password" label="Password Input" placeholder="••••••••" />
      <Input type="number" label="Number Input" placeholder="123" />
      <Input type="tel" label="Phone Input" placeholder="+1 (555) 123-4567" />
      <Input type="url" label="URL Input" placeholder="https://example.com" />
      <Input type="search" label="Search Input" placeholder="Search..." />
    </div>
  ),
};

// Controlled input example
const ControlledExample = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setError(newValue.length < 3);
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Username"
        value={value}
        onChange={handleChange}
        error={error}
        errorText={error ? 'Username must be at least 3 characters' : ''}
        helperText={!error ? 'Choose a unique username' : ''}
        placeholder="Enter username"
        required
      />
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        Current value: "{value}" (Length: {value.length})
      </p>
    </div>
  );
};

export const Controlled = {
  render: ControlledExample,
  parameters: {
    docs: {
      description: {
        story: 'Controlled input with real-time validation and state management.',
      },
    },
  },
};

// Full width
export const FullWidth = {
  render: () => (
    <div style={{ width: '100%' }}>
      <Input
        label="Full Width Input"
        placeholder="This input takes the full width of its container"
        fullWidth
        helperText="This is useful for forms and layouts"
      />
    </div>
  ),
};

// Form example
export const FormExample = {
  render: () => (
    <form style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        label="First Name"
        placeholder="Enter your first name"
        required
        startIcon="👤"
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        required
        startIcon="📧"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Choose a strong password"
        required
        startIcon="🔒"
        helperText="Must be at least 8 characters"
      />
      <Input
        label="Website (Optional)"
        type="url"
        placeholder="https://your-website.com"
        startIcon="🌐"
      />
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete form example showing various input types and states.',
      },
    },
  },
};