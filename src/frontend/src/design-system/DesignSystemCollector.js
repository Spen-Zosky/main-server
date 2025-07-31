/**
 * Design System Collector
 * Collection and organization system for GUI Brand Identity information
 */

import { format } from 'date-fns';

export class DesignSystemCollector {
  constructor() {
    this.collections = new Map();
    this.currentCollection = null;
  }

  /**
   * Create a new brand identity collection
   * @param {string} name - Collection name
   * @param {string} description - Collection description
   * @param {string} version - Collection version
   * @param {string} status - Collection status (active, default, archived)
   */
  createCollection(name, description, version = '1.0.0', status = 'draft') {
    const collection = {
      id: this.generateId(),
      name,
      description,
      version,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Core Brand Identity
      theme: {
        primaryTheme: null,
        supportedThemes: [],
        darkModeSupport: false,
        colorScheme: 'light' // light, dark, auto
      },

      // Color System
      colors: {
        primary: {},
        secondary: {},
        modules: {
          ai: {},
          nose: {},
          hunter: {}
        },
        neutrals: {},
        status: {},
        gradients: {},
        semantic: {}
      },

      // Typography System
      typography: {
        fontFamilies: {
          primary: null,
          secondary: null,
          monospace: null,
          display: null
        },
        fontSizes: {},
        fontWeights: {},
        lineHeights: {},
        letterSpacing: {}
      },

      // Component System
      components: {
        buttons: {
          variants: [],
          sizes: [],
          states: []
        },
        cards: {
          variants: [],
          themes: [],
          effects: []
        },
        inputs: {
          variants: [],
          states: [],
          validation: []
        },
        modals: {
          sizes: [],
          animations: [],
          variants: []
        },
        navigation: {
          types: [],
          states: [],
          responsive: []
        }
      },

      // Icon System
      icons: {
        libraries: [],
        categories: {},
        sizes: [],
        themes: [],
        animations: []
      },

      // Animation System
      animations: {
        keyframes: [],
        utilities: [],
        durations: [],
        easings: [],
        interactions: []
      },

      // Layout System
      layout: {
        breakpoints: {},
        spacing: {},
        grids: {},
        containers: {}
      },

      // Design Tokens
      tokens: {
        spacing: {},
        borderRadius: {},
        shadows: {},
        opacity: {},
        zIndex: {}
      },

      // Accessibility
      accessibility: {
        colorContrast: {},
        focusManagement: {},
        keyboardNavigation: {},
        screenReaderSupport: {},
        reducedMotion: false
      },

      // Performance
      performance: {
        bundleSize: {},
        loadingStates: [],
        optimizations: []
      },

      // Technical Implementation
      technical: {
        framework: null,
        libraries: [],
        buildTools: [],
        cssFramework: null,
        preprocessors: []
      }
    };

    this.collections.set(collection.id, collection);
    this.currentCollection = collection.id;
    
    return collection;
  }

  /**
   * Update the current collection
   * @param {object} updates - Update object
   */
  updateCurrentCollection(updates) {
    if (!this.currentCollection) {
      throw new Error('No active collection');
    }

    const collection = this.collections.get(this.currentCollection);
    const updatedCollection = this.deepMerge(collection, updates);
    updatedCollection.updatedAt = new Date();
    
    this.collections.set(this.currentCollection, updatedCollection);
    return updatedCollection;
  }

  /**
   * Get the current collection
   */
  getCurrentCollection() {
    if (!this.currentCollection) return null;
    return this.collections.get(this.currentCollection);
  }

  /**
   * Get all collections
   */
  getAllCollections() {
    return Array.from(this.collections.values());
  }

  /**
   * Get a specific collection
   * @param {string} id - Collection ID
   */
  getCollection(id) {
    return this.collections.get(id);
  }

  /**
   * Analyze the current system and populate the collection
   */
  analyzeCurrentSystem() {
    if (!this.currentCollection) {
      throw new Error('No active collection for analysis');
    }

    // Analyze colors from CSS
    const colorAnalysis = this.analyzeColors();
    
    // Analyze typography
    const typographyAnalysis = this.analyzeTypography();
    
    // Analyze components
    const componentAnalysis = this.analyzeComponents();
    
    // Analyze icons
    const iconAnalysis = this.analyzeIcons();
    
    // Analyze animations
    const animationAnalysis = this.analyzeAnimations();

    // Analyze layout
    const layoutAnalysis = this.analyzeLayout();

    // Analyze accessibility
    const accessibilityAnalysis = this.analyzeAccessibility();

    // Analyze technical specifications
    const technicalAnalysis = this.analyzeTechnical();

    // Update collection with analysis results
    this.updateCurrentCollection({
      colors: colorAnalysis,
      typography: typographyAnalysis,
      components: componentAnalysis,
      icons: iconAnalysis,
      animations: animationAnalysis,
      layout: layoutAnalysis,
      accessibility: accessibilityAnalysis,
      technical: technicalAnalysis,
      theme: {
        primaryTheme: 'enterprise-modern',
        supportedThemes: ['light', 'dark'],
        darkModeSupport: true,
        colorScheme: 'auto'
      }
    });

    return this.getCurrentCollection();
  }

  /**
   * Analyze color system
   */
  analyzeColors() {
    return {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // Main primary
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      modules: {
        ai: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1976d2', // AI Primary
          600: '#1565c0',
          700: '#0d47a1',
          800: '#0a1958',
          900: '#061242'
        },
        nose: {
          50: '#e8f5e8',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#388e3c', // NOSE Primary
          600: '#2e7d32',
          700: '#1b5e20',
          800: '#0a4614',
          900: '#052910'
        },
        hunter: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc02',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#f57c00', // Hunter Primary
          600: '#ef6c00',
          700: '#e65100',
          800: '#bf360c',
          900: '#8f2708'
        }
      },
      neutrals: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b'
      },
      status: {
        running: '#4ade80',
        stopped: '#ef4444',
        warning: '#f59e0b',
        loading: '#3b82f6',
        unknown: '#6b7280',
        success: '#10b981',
        info: '#06b6d4',
        error: '#f87171'
      },
      gradients: {
        ai: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)',
        nose: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 50%, #a5d6a7 100%)',
        hunter: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 50%, #ffcc02 100%)',
        purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #9c27b0 100%)',
        rainbow: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
      }
    };
  }

  /**
   * Analyze typography system
   */
  analyzeTypography() {
    return {
      fontFamilies: {
        primary: 'Inter',
        secondary: 'Playfair Display',
        monospace: 'Fira Code',
        display: 'Cal Sans'
      },
      fontSizes: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }]
      },
      fontWeights: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      }
    };
  }

  /**
   * Analyze components
   */
  analyzeComponents() {
    return {
      buttons: {
        variants: ['primary', 'secondary', 'outline', 'ghost', 'ai', 'nose', 'hunter'],
        sizes: ['sm', 'md', 'lg', 'xl'],
        states: ['default', 'hover', 'active', 'disabled', 'loading']
      },
      cards: {
        variants: ['default', 'glass', 'elevated'],
        themes: ['ai', 'nose', 'hunter', 'neutral'],
        effects: ['hover-lift', 'glow', 'scale', 'shadow']
      },
      inputs: {
        variants: ['default', 'outlined', 'filled'],
        states: ['default', 'focus', 'error', 'disabled'],
        validation: ['success', 'warning', 'error']
      },
      modals: {
        sizes: ['sm', 'md', 'lg', 'xl', 'full'],
        animations: ['fade', 'scale', 'slide'],
        variants: ['default', 'centered', 'drawer']
      },
      navigation: {
        types: ['header', 'sidebar', 'breadcrumb', 'tabs'],
        states: ['default', 'active', 'disabled'],
        responsive: ['mobile', 'tablet', 'desktop']
      }
    };
  }

  /**
   * Analyze icon system
   */
  analyzeIcons() {
    return {
      libraries: ['Material-UI', 'Heroicons', 'Lucide React'],
      categories: {
        dashboard: ['dashboard', 'analytics', 'activity'],
        users: ['users', 'person', 'user-group'],
        system: ['settings', 'notifications', 'cpu'],
        security: ['security', 'shield', 'lock'],
        data: ['data', 'database', 'cloud'],
        performance: ['performance', 'memory', 'zap'],
        ai: ['brain', 'cpu-chip', 'analytics'],
        status: ['success', 'trending', 'star']
      },
      sizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      themes: ['ai', 'nose', 'hunter', 'primary'],
      animations: ['float', 'pulse', 'spin', 'bounce', 'wiggle']
    };
  }

  /**
   * Analyze animation system
   */
  analyzeAnimations() {
    return {
      keyframes: [
        'float', 'pulse', 'slideInUp', 'fadeInScale', 'fadeIn', 'fadeInUp', 
        'fadeInDown', 'scaleIn', 'slideInLeft', 'slideInRight', 'wiggle', 
        'glow', 'shimmer', 'rotate', 'bounce'
      ],
      utilities: [
        'animate-fade-in', 'animate-fade-in-up', 'animate-scale-in',
        'animate-slide-in-left', 'animate-slide-in-right', 'hover-glow'
      ],
      durations: ['150ms', '200ms', '300ms', '500ms', '800ms', '2s', '3s'],
      easings: ['ease', 'ease-in', 'ease-out', 'ease-in-out'],
      interactions: ['hover', 'focus', 'active', 'scroll']
    };
  }

  /**
   * Analyze layout system
   */
  analyzeLayout() {
    return {
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem'
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem'
      },
      containers: {
        'screen-minus-nav': 'calc(100vh - 4rem)'
      }
    };
  }

  /**
   * Analyze accessibility
   */
  analyzeAccessibility() {
    return {
      colorContrast: {
        aa: 'supported',
        aaa: 'partial'
      },
      focusManagement: {
        focusVisible: true,
        focusTrapping: true,
        skipLinks: false
      },
      keyboardNavigation: {
        tabIndex: 'managed',
        arrowKeys: 'supported',
        escapeKey: 'supported'
      },
      screenReaderSupport: {
        ariaLabels: true,
        semanticHtml: true,
        announcements: true
      },
      reducedMotion: true
    };
  }

  /**
   * Analyze technical specifications
   */
  analyzeTechnical() {
    return {
      framework: 'React 18.3.1',
      libraries: [
        'Material-UI 5.16.7',
        'Framer Motion 12.23.6',
        'Headless UI 2.2.4',
        'Heroicons 2.2.0',
        'Lucide React 0.525.0',
        'React Hot Toast 2.5.2',
        'Clsx 2.1.1'
      ],
      buildTools: ['Vite 5.4.10'],
      cssFramework: 'TailwindCSS 3.4.14',
      preprocessors: ['PostCSS 8.4.47', 'Autoprefixer 10.4.20']
    };
  }

  /**
   * Export collection in JSON format
   * @param {string} collectionId - Collection ID to export
   */
  exportCollection(collectionId) {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error(`Collection ${collectionId} not found`);
    }

    return {
      ...collection,
      exportedAt: new Date(),
      format: 'design-system-v1.0'
    };
  }

  /**
   * Save collection to file
   * @param {string} collectionId - Collection ID
   * @param {string} filename - File name
   */
  saveToFile(collectionId, filename) {
    const collection = this.exportCollection(collectionId);
    const content = JSON.stringify(collection, null, 2);
    
    // Simulate saving (in a real app we would use fs)
    return {
      filename: filename || `design-system-${collection.name}-${format(new Date(), 'yyyyMMdd-HHmmss')}.json`,
      content,
      size: content.length
    };
  }

  /**
   * Generate a unique ID
   */
  generateId() {
    return `ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  /**
   * Check if a value is an object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Set a collection as active/default
   * @param {string} collectionId - Collection ID
   * @param {string} status - New status (active, default, active|default)
   */
  setCollectionStatus(collectionId, status) {
    if (this.collections.has(collectionId)) {
      const collection = this.collections.get(collectionId);
      collection.status = status;
      collection.updatedAt = new Date();
      
      // If set as default, remove default from other collections
      if (status.includes('default')) {
        this.collections.forEach((coll, id) => {
          if (id !== collectionId && coll.status && coll.status.includes('default')) {
            coll.status = coll.status.replace('|default', '').replace('default|', '').replace('default', 'active');
          }
        });
      }
      
      return collection;
    }
    throw new Error(`Collection ${collectionId} not found`);
  }

  /**
   * Get the active/default collection
   */
  getActiveCollection() {
    for (const [id, collection] of this.collections) {
      if (collection.status && (collection.status.includes('active') || collection.status.includes('default'))) {
        return { id, ...collection };
      }
    }
    return null;
  }

  /**
   * Get collection statistics
   * @param {string} collectionId - Collection ID
   */
  getCollectionStats(collectionId) {
    const collection = this.collections.get(collectionId);
    if (!collection) return null;

    return {
      id: collection.id,
      name: collection.name,
      version: collection.version,
      status: collection.status || 'draft',
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      stats: {
        colorTokens: Object.keys(collection.colors.primary).length + 
                    Object.keys(collection.colors.modules.ai).length +
                    Object.keys(collection.colors.modules.nose).length +
                    Object.keys(collection.colors.modules.hunter).length,
        components: Object.keys(collection.components).length,
        animations: collection.animations.keyframes.length,
        iconLibraries: collection.icons.libraries.length,
        breakpoints: Object.keys(collection.layout.breakpoints).length,
        techLibraries: collection.technical.libraries.length
      }
    };
  }
}

export default DesignSystemCollector;