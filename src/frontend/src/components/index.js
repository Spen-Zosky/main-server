/**
 * Main Server Platform Design System
 * Complete atomic design system export
 */

// Design Tokens
export * from '../design-system/tokens';

// Atoms - Basic building blocks
export * from './atoms';

// Molecules - Simple combinations of atoms
export * from './molecules';

// Organisms - Complex combinations of molecules and atoms
export * from './organisms';

// Re-export all components for convenience
export { Button, Text, Input } from './atoms';
export { SearchBox } from './molecules';
export { Header } from './organisms';