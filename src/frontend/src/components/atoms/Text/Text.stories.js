/**
 * Text Component Stories
 * Storybook documentation for Text atom
 */

import Text from './Text';

export default {
  title: 'Design System/Atoms/Text',
  component: Text,
  parameters: {
    docs: {
      description: {
        component: 'Typography component built with design tokens. Supports all text styles, colors, and semantic elements.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['display', 'h1', 'h2', 'h3', 'h4', 'body', 'bodyLarge', 'caption', 'code'],
      description: 'Typography variant based on design tokens',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'disabled', 'success', 'warning', 'error', 'info', 'brand', 'accent'],
      description: 'Text color from design system',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    as: {
      control: { type: 'select' },
      options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML element to render',
    },
    truncate: {
      control: { type: 'boolean' },
      description: 'Truncate text with ellipsis',
    },
    children: {
      control: { type: 'text' },
      description: 'Text content',
    },
  },
};

// Default story
export const Default = {
  args: {
    children: 'This is default body text using design tokens.',
  },
};

// Typography hierarchy
export const TypographyHierarchy = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text variant="display" as="h1">Display Text</Text>
      <Text variant="h1" as="h1">Heading 1</Text>
      <Text variant="h2" as="h2">Heading 2</Text>
      <Text variant="h3" as="h3">Heading 3</Text>
      <Text variant="h4" as="h4">Heading 4</Text>
      <Text variant="bodyLarge">Large body text for emphasis and readability</Text>
      <Text variant="body">Regular body text for most content and paragraphs</Text>
      <Text variant="caption">Caption text for supporting information</Text>
      <Text variant="code">Code text for technical content</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete typography hierarchy using design system tokens.',
      },
    },
  },
};

// Color variants
export const ColorVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text color="primary">Primary text color</Text>
      <Text color="secondary">Secondary text color</Text>
      <Text color="disabled">Disabled text color</Text>
      <Text color="brand">Brand color text</Text>
      <Text color="accent">Accent color text</Text>
      <Text color="success">Success message text</Text>
      <Text color="warning">Warning message text</Text>
      <Text color="error">Error message text</Text>
      <Text color="info">Information text</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available text colors from the design system.',
      },
    },
  },
};

// Text alignment
export const TextAlignment = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e0e0e0', padding: '1rem' }}>
      <Text align="left">Left aligned text (default)</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
      <Text align="justify">
        Justified text that will distribute words evenly across the line when the text is long enough to wrap to multiple lines.
      </Text>
    </div>
  ),
};

// Truncation
export const Truncation = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <Text>
        This is a long text that will wrap normally to multiple lines when it exceeds the container width.
      </Text>
      <Text truncate>
        This is a long text that will be truncated with an ellipsis when it exceeds the container width.
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text truncation with ellipsis for long content.',
      },
    },
  },
};

// Semantic HTML elements
export const SemanticElements = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text variant="h1" as="h1">Semantic H1 element</Text>
      <Text variant="body" as="p">Paragraph element with body text</Text>
      <Text variant="caption" as="span">Inline span element</Text>
      <Text variant="code" as="code">Code element for technical content</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Using different HTML semantic elements while maintaining design system styles.',
      },
    },
  },
};

// Brand module text
export const BrandModules = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text variant="h2" color="brand">Main Server Platform</Text>
      <Text variant="body" color="primary">
        Enterprise platform with AI-HRMS, NOSE Research, and Web-Hunter modules
      </Text>
      <Text variant="caption" color="secondary">
        Built with design tokens and atomic design methodology
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text components styled for brand identity and module themes.',
      },
    },
  },
};