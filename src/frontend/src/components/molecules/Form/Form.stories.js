/**
 * Form Component Stories
 * Storybook documentation for Form molecule
 */

import { useState } from 'react';
import Form from './Form';
import { Input } from '../../atoms/Input';
import { Text } from '../../atoms/Text';

export default {
  title: 'Design System/Molecules/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component: 'Form molecule provides complete form functionality with validation, submission handling, and consistent styling.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'spacious'],
      description: 'Form style variant',
    },
    layout: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Form field layout',
    },
    spacing: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Spacing between form elements',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Show form action buttons',
    },
    showCancel: {
      control: { type: 'boolean' },
      description: 'Show cancel button',
    },
    showReset: {
      control: { type: 'boolean' },
      description: 'Show reset button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    card: {
      control: { type: 'boolean' },
      description: 'Wrap form in card',
    },
  },
};

// Default story
export const Default = {
  args: {
    title: 'Contact Form',
    subtitle: 'Get in touch with us',
    onSubmit: (formData) => {
      console.log('Form submitted:', Object.fromEntries(formData));
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    children: (
      <>
        <Input
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          required
          startIcon="👤"
        />
        <Input
          name="email"
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          required
          startIcon="📧"
        />
        <Input
          name="message"
          label="Message"
          placeholder="Your message here..."
          required
        />
      </>
    ),
  },
};

// With validation
const ValidationExample = () => {
  const [submitStatus, setSubmitStatus] = useState('');

  const validation = {
    name: {
      required: true,
      requiredMessage: 'Please enter your name',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      requiredMessage: 'Email is required',
      patternMessage: 'Please enter a valid email address',
    },
    password: {
      required: true,
      custom: (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase, and number';
        }
        return true;
      },
    },
    confirmPassword: {
      required: true,
      custom: (value, formData) => {
        const password = new FormData(document.querySelector('form')).get('password');
        if (value !== password) return 'Passwords do not match';
        return true;
      },
    },
  };

  const handleSubmit = async (formData) => {
    setSubmitStatus('submitting');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus('success');
    console.log('Registration data:', Object.fromEntries(formData));
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <Form
        title="Create Account"
        subtitle="Join our platform today"
        onSubmit={handleSubmit}
        validation={validation}
        loading={submitStatus === 'submitting'}
        card
      >
        <Input
          name="name"
          label="Full Name"
          placeholder="John Doe"
          required
          startIcon="👤"
        />
        <Input
          name="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
          startIcon="📧"
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Choose a strong password"
          required
          startIcon="🔒"
        />
        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
          startIcon="🔒"
        />
      </Form>
      
      {submitStatus === 'success' && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--color-semantic-success)',
          color: 'white',
          borderRadius: 'var(--border-radius-md)',
        }}>
          Account created successfully!
        </div>
      )}
    </div>
  );
};

export const WithValidation = {
  render: ValidationExample,
  parameters: {
    docs: {
      description: {
        story: 'Form with comprehensive validation including required fields, patterns, and custom validation rules.',
      },
    },
  },
};

// Layout variants
export const LayoutVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Text variant="h3" className="mb-3">Vertical Layout (Default)</Text>
        <Form
          title="Vertical Form"
          layout="vertical"
          onSubmit={(formData) => console.log('Vertical:', Object.fromEntries(formData))}
          card
        >
          <Input name="firstName" label="First Name" placeholder="John" />
          <Input name="lastName" label="Last Name" placeholder="Doe" />
          <Input name="email" label="Email" type="email" placeholder="john@example.com" />
        </Form>
      </div>
      
      <div>
        <Text variant="h3" className="mb-3">Horizontal Layout</Text>
        <Form
          title="Horizontal Form"
          layout="horizontal"
          onSubmit={(formData) => console.log('Horizontal:', Object.fromEntries(formData))}
          card
        >
          <Input name="firstName" label="First Name" placeholder="John" />
          <Input name="lastName" label="Last Name" placeholder="Doe" />
          <Input name="email" label="Email" type="email" placeholder="john@example.com" />
          <Input name="phone" label="Phone" type="tel" placeholder="+1 (555) 123-4567" />
        </Form>
      </div>
    </div>
  ),
};

// Spacing variants
export const SpacingVariants = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      <Form
        title="Small Spacing"
        spacing="sm"
        onSubmit={(formData) => console.log('Small:', Object.fromEntries(formData))}
        card
      >
        <Input name="name" label="Name" placeholder="Your name" />
        <Input name="email" label="Email" placeholder="Your email" />
      </Form>
      
      <Form
        title="Medium Spacing"
        spacing="md"
        onSubmit={(formData) => console.log('Medium:', Object.fromEntries(formData))}
        card
      >
        <Input name="name" label="Name" placeholder="Your name" />
        <Input name="email" label="Email" placeholder="Your email" />
      </Form>
      
      <Form
        title="Large Spacing"
        spacing="lg"
        onSubmit={(formData) => console.log('Large:', Object.fromEntries(formData))}
        card
      >
        <Input name="name" label="Name" placeholder="Your name" />
        <Input name="email" label="Email" placeholder="Your email" />
      </Form>
    </div>
  ),
};

// Form with all actions
export const WithAllActions = {
  args: {
    title: 'User Profile',
    subtitle: 'Update your profile information',
    showCancel: true,
    showReset: true,
    submitText: 'Save Changes',
    cancelText: 'Cancel',
    resetText: 'Reset Form',
    onSubmit: (formData) => {
      console.log('Profile updated:', Object.fromEntries(formData));
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
    onReset: () => console.log('Form reset'),
    card: true,
    children: (
      <>
        <Input
          name="username"
          label="Username"
          placeholder="johndoe"
          startIcon="👤"
        />
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          startIcon="📧"
        />
        <Input
          name="bio"
          label="Biography"
          placeholder="Tell us about yourself..."
        />
      </>
    ),
  },
};

// Loading state
export const LoadingState = {
  args: {
    title: 'Processing Form',
    loading: true,
    children: (
      <>
        <Input name="name" label="Name" placeholder="Your name" />
        <Input name="email" label="Email" placeholder="Your email" />
      </>
    ),
  },
};

// Disabled state
export const DisabledState = {
  args: {
    title: 'Disabled Form',
    disabled: true,
    children: (
      <>
        <Input name="name" label="Name" placeholder="Cannot edit" />
        <Input name="email" label="Email" placeholder="Form is disabled" />
      </>
    ),
  },
};

// Without card wrapper
export const WithoutCard = {
  args: {
    title: 'Simple Form',
    subtitle: 'No card wrapper',
    card: false,
    onSubmit: (formData) => console.log('Simple form:', Object.fromEntries(formData)),
    children: (
      <>
        <Input name="query" label="Search Query" placeholder="What are you looking for?" />
        <Input name="category" label="Category" placeholder="Select category" />
      </>
    ),
  },
};

// Login form example
export const LoginForm = {
  render: () => {
    const [loginStatus, setLoginStatus] = useState('');

    const handleLogin = async (formData) => {
      setLoginStatus('logging-in');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoginStatus('success');
      console.log('Login:', Object.fromEntries(formData));
    };

    return (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Form
          title="Welcome Back"
          subtitle="Sign in to your account"
          onSubmit={handleLogin}
          loading={loginStatus === 'logging-in'}
          submitText="Sign In"
          card
          validation={{
            email: {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              requiredMessage: 'Email is required',
              patternMessage: 'Please enter a valid email',
            },
            password: {
              required: true,
              requiredMessage: 'Password is required',
            },
          }}
        >
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            startIcon="📧"
            required
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            startIcon="🔒"
            required
          />
        </Form>
        
        {loginStatus === 'success' && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--color-semantic-success)',
            color: 'white',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'center',
          }}>
            Welcome back! Login successful.
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete login form example with validation and loading states.',
      },
    },
  },
};