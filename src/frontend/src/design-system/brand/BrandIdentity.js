/**
 * Brand Identity System
 * Comprehensive brand guidelines and identity management
 */

import { designTokens } from '../tokens';

export const brandIdentity = {
  // Core Brand Values
  values: {
    innovation: 'Cutting-edge technology solutions',
    reliability: 'Enterprise-grade stability and performance',
    accessibility: 'Inclusive design for all users',
    scalability: 'Built to grow with your needs',
    integration: 'Seamless connectivity across platforms',
  },

  // Brand Personality
  personality: {
    professional: 'Serious, trustworthy, competent',
    innovative: 'Forward-thinking, creative, adaptable',
    approachable: 'User-friendly, inclusive, supportive',
    confident: 'Assured, authoritative, dependable',
  },

  // Voice and Tone Guidelines
  voice: {
    characteristics: [
      'Clear and concise',
      'Professional yet approachable',
      'Knowledgeable without being condescending',
      'Confident but not arrogant',
      'Helpful and solution-oriented',
    ],
    avoid: [
      'Technical jargon without explanation',
      'Overly casual language',
      'Aggressive or pushy tone',
      'Vague or ambiguous statements',
      'Negative or discouraging language',
    ],
  },

  // Visual Identity
  visual: {
    // Logo Guidelines
    logo: {
      primary: {
        symbol: '⚡',
        description: 'Lightning bolt representing energy, speed, and innovation',
        usage: 'Primary logo for main brand identity',
      },
      modules: {
        ai: {
          symbol: '🤖',
          description: 'Robot representing artificial intelligence and automation',
          usage: 'AI-HRMS module identification',
        },
        nose: {
          symbol: '🔬',
          description: 'Microscope representing research and discovery',
          usage: 'NOSE Research module identification',
        },
        hunter: {
          symbol: '🕸️',
          description: 'Web representing data mining and connectivity',
          usage: 'Web-Hunter module identification',
        },
      },
    },

    // Color Palette Guidelines
    colors: {
      primary: {
        color: designTokens.colors.brand.primary,
        name: 'Platform Blue',
        description: 'Primary brand color representing trust, stability, and professionalism',
        usage: 'Primary buttons, links, headers, key UI elements',
        accessibility: 'AA compliant with white text',
      },
      secondary: {
        color: designTokens.colors.brand.secondary,
        name: 'Energy Pink',
        description: 'Secondary brand color for accents and highlights',
        usage: 'Secondary buttons, highlights, call-to-action elements',
        accessibility: 'AA compliant with white text',
      },
      accent: {
        color: designTokens.colors.brand.accent,
        name: 'Innovation Orange',
        description: 'Accent color representing creativity and innovation',
        usage: 'Accent elements, badges, interactive states',
        accessibility: 'AA compliant with white text',
      },
      modules: {
        ai: {
          primary: designTokens.colors.modules.ai.primary,
          gradient: designTokens.colors.modules.ai.gradient,
          name: 'AI Intelligence Blue',
          description: 'Cool blue representing intelligence and automation',
          personality: 'Analytical, precise, efficient',
        },
        nose: {
          primary: designTokens.colors.modules.nose.primary,
          gradient: designTokens.colors.modules.nose.gradient,
          name: 'Research Growth Green',
          description: 'Natural green representing growth and discovery',
          personality: 'Organic, exploratory, methodical',
        },
        hunter: {
          primary: designTokens.colors.modules.hunter.primary,
          gradient: designTokens.colors.modules.hunter.gradient,
          name: 'Data Energy Orange',
          description: 'Vibrant orange representing energy and data mining',
          personality: 'Dynamic, aggressive, results-driven',
        },
      },
    },

    // Typography Guidelines
    typography: {
      primary: {
        family: designTokens.typography.fonts.primary,
        name: 'Inter',
        description: 'Clean, modern sans-serif for UI and body text',
        usage: 'Interface elements, body text, navigation',
        characteristics: 'Highly legible, neutral, professional',
      },
      secondary: {
        family: designTokens.typography.fonts.secondary,
        name: 'Playfair Display',
        description: 'Elegant serif for headings and emphasis',
        usage: 'Display headings, hero text, brand messaging',
        characteristics: 'Sophisticated, distinctive, attention-grabbing',
      },
      monospace: {
        family: designTokens.typography.fonts.monospace,
        name: 'Fira Code',
        description: 'Technical monospace with programming ligatures',
        usage: 'Code snippets, technical documentation, data display',
        characteristics: 'Technical, precise, developer-friendly',
      },
      hierarchy: {
        display: 'Hero sections, landing pages, major announcements',
        h1: 'Page titles, main headings',
        h2: 'Section headings, feature titles',
        h3: 'Subsection headings, card titles',
        h4: 'Minor headings, labels',
        body: 'Standard text content, descriptions',
        bodyLarge: 'Emphasized body text, lead paragraphs',
        caption: 'Supporting text, metadata, footnotes',
        code: 'Technical content, code examples',
      },
    },

    // Spacing and Layout
    spacing: {
      philosophy: 'Consistent, rhythmic spacing based on 4px base unit',
      scale: designTokens.spacing.scale,
      semantic: designTokens.spacing.semantic,
      guidelines: {
        component: 'Use semantic component spacing for consistent internal padding/margins',
        layout: 'Use layout spacing for page-level structure and sections',
        grid: 'Use grid spacing for consistent gaps in flex/grid layouts',
      },
    },

    // Visual Style Guidelines
    style: {
      borderRadius: {
        philosophy: 'Subtle rounded corners for modern, friendly appearance',
        usage: {
          none: 'Data tables, technical interfaces',
          sm: 'Badges, tags, small elements',
          base: 'Default for most UI elements',
          md: 'Cards, modals, larger components',
          lg: 'Hero sections, major containers',
          xl: 'Special emphasis elements',
          full: 'Pills, circular elements',
        },
      },
      shadows: {
        philosophy: 'Subtle depth to establish hierarchy and focus',
        usage: {
          none: 'Flat design elements, embedded content',
          sm: 'Subtle hover states, minimal elevation',
          base: 'Standard cards, buttons in normal state',
          md: 'Active/focused elements, dropdowns',
          lg: 'Modals, overlays, important content',
          xl: 'Major overlays, full-screen modals',
        },
      },
    },
  },

  // Module Brand Guidelines
  modules: {
    ai: {
      name: 'AI-HRMS',
      fullName: 'Artificial Intelligence Human Resources Management System',
      tagline: 'Intelligent workforce management',
      description: 'Advanced AI-powered solutions for modern HR challenges',
      personality: 'Analytical, precise, efficient, forward-thinking',
      imagery: 'Clean geometric patterns, data visualizations, technological elements',
      applications: ['Employee analytics', 'Performance tracking', 'Recruitment automation', 'Workforce planning'],
    },
    nose: {
      name: 'NOSE Research',
      fullName: 'Network of Scientific Excellence Research Platform',
      tagline: 'Advancing scientific discovery',
      description: 'Collaborative platform for academic research and knowledge sharing',
      personality: 'Methodical, collaborative, insightful, academic',
      imagery: 'Scientific patterns, network diagrams, academic illustrations',
      applications: ['Research collaboration', 'Publication management', 'Data analysis', 'Academic networking'],
    },
    hunter: {
      name: 'Web-Hunter',
      fullName: 'Web Data Mining and Analytics Platform',
      tagline: 'Unleashing the power of data',
      description: 'Powerful tools for web data extraction and business intelligence',
      personality: 'Aggressive, results-driven, dynamic, insightful',
      imagery: 'Network webs, data flows, hunting metaphors, connection patterns',
      applications: ['Web scraping', 'Data mining', 'Business intelligence', 'Market research'],
    },
  },

  // Application Guidelines
  application: {
    // UI Component Guidelines
    components: {
      buttons: {
        primary: 'Use for main actions, CTAs, form submissions',
        secondary: 'Use for secondary actions, cancellations',
        accent: 'Use sparingly for special promotions or highlights',
        ghost: 'Use for subtle actions, navigation elements',
      },
      cards: {
        default: 'Standard content containers',
        elevated: 'Important content that needs attention',
        outlined: 'Content that needs definition without heavy visual weight',
        ghost: 'Subtle content grouping',
      },
      badges: {
        status: 'Use semantic colors for status indicators',
        labels: 'Use brand colors for categorization',
        notifications: 'Use error color for urgent notifications',
      },
    },

    // Layout Guidelines
    layout: {
      navigation: 'Use Header organism with module-specific theming',
      content: 'Structure with Cards for content organization',
      forms: 'Use Form molecules with appropriate validation',
      search: 'Use SearchBox molecules for consistent search experience',
    },

    // Accessibility Guidelines
    accessibility: {
      contrast: 'All colors meet WCAG 2.1 AA standards',
      focus: 'Clear focus indicators on all interactive elements',
      labels: 'Descriptive labels and ARIA attributes',
      keyboard: 'Full keyboard navigation support',
      screen_readers: 'Semantic HTML and proper heading hierarchy',
    },
  },

  // Usage Examples
  examples: {
    // Do's and Don'ts
    dos: [
      'Use consistent spacing from the design token scale',
      'Apply module themes appropriately for each business area',
      'Maintain proper color contrast ratios',
      'Use semantic color meanings consistently',
      'Follow the established typography hierarchy',
      'Implement responsive design patterns',
    ],
    donts: [
      'Mix different spacing systems or arbitrary values',
      'Use module colors outside their intended context',
      'Override design tokens with hardcoded values',
      'Use colors that don\'t meet accessibility standards',
      'Break the typography hierarchy with inconsistent sizing',
      'Ignore mobile-first responsive principles',
    ],
  },
};

export default brandIdentity;