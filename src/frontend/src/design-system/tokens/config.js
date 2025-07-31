/**
 * Style Dictionary Configuration
 * Enterprise Design Token System for Main Server Platform
 */

export default {
  source: [
    'src/design-system/tokens/properties/**/*.json'
  ],
  platforms: {
    // CSS Custom Properties
    css: {
      transformGroup: 'css',
      buildPath: 'src/design-system/tokens/build/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    
    // JavaScript/TypeScript modules
    js: {
      transformGroup: 'js',
      buildPath: 'src/design-system/tokens/build/js/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }, {
        destination: 'tokens.d.ts',
        format: 'typescript/es6-declarations'
      }]
    },
    
    // JSON for documentation
    json: {
      transformGroup: 'js',
      buildPath: 'src/design-system/tokens/build/json/',
      files: [{
        destination: 'tokens.json',
        format: 'json/nested'
      }]
    },
    
    // SCSS variables
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/design-system/tokens/build/scss/',
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables'
      }]
    }
  }
};