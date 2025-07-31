#!/usr/bin/env node

/**
 * Design Token Build Script
 * Uses Style Dictionary to generate CSS, JS, TS, SCSS and JSON output from design tokens
 */

import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the configuration
const configPath = path.resolve(__dirname, 'config.js');
const config = await import(configPath);
const sd = new StyleDictionary(config.default);

// Ensure build directories exist
const buildDirs = [
  'src/design-system/tokens/build/css',
  'src/design-system/tokens/build/js', 
  'src/design-system/tokens/build/json',
  'src/design-system/tokens/build/scss'
];

for (const dir of buildDirs) {
  await fs.mkdir(dir, { recursive: true });
}

console.log('🎨 Building design tokens...');
console.log('📂 Source:', 'src/design-system/tokens/properties/');

try {
  // Build all platforms
  await sd.buildAllPlatforms();
  
  console.log('✅ Design tokens built successfully!');
  console.log('\n📦 Generated files:');
  console.log('   • CSS Variables: src/design-system/tokens/build/css/variables.css');
  console.log('   • JavaScript: src/design-system/tokens/build/js/tokens.js');
  console.log('   • TypeScript: src/design-system/tokens/build/js/tokens.d.ts');
  console.log('   • SCSS Variables: src/design-system/tokens/build/scss/_variables.scss');
  console.log('   • JSON: src/design-system/tokens/build/json/tokens.json');
  
} catch (error) {
  console.error('❌ Error building design tokens:', error);
  process.exit(1);
}