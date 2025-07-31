// ⚠️ DEPRECATED: This file has been replaced by IconLibrarySimple.jsx
// Use IconLibrarySimple for all new development to maintain Material-UI design consistency
// This file exists only for backward compatibility during migration

import React from 'react'
import { Icons, Icon as SimpleIcon } from './IconLibrarySimple'

// Legacy compatibility mapping - DEPRECATED
// All icons now use Material-UI equivalents for design consistency
export const IconLibrary = {
  // Dashboard & Analytics - mapped to Material-UI equivalents
  dashboard: { mui: Icons.dashboard },
  analytics: { mui: Icons.analytics },
  
  // Users & People
  users: { mui: Icons.users },
  
  // System & Settings
  settings: { mui: Icons.settings },
  notifications: { mui: Icons.notifications },
  
  // Security
  security: { mui: Icons.security },
  
  // Data & Storage
  data: { mui: Icons.dataUsage },
  cloud: { mui: Icons.cloudDownload },
  
  // Performance & Monitoring
  performance: { mui: Icons.speed },
  memory: { mui: Icons.memory },
  server: { mui: Icons.server },
  
  // AI & Research specific - mapped to enhanced icons
  ai: { mui: Icons.brain },
  search: { mui: Icons.search },
  research: { mui: Icons.research },
  
  // Status & Quality
  success: { mui: Icons.success },
  trending: { mui: Icons.trending },
  premium: { mui: Icons.star },
  magic: { mui: Icons.sparkles },
  rocket: { mui: Icons.rocket },
  network: { mui: Icons.network },
  security_lock: { mui: Icons.lock }
}

// Legacy Icon component wrapper - DEPRECATED
// Use Icon from IconLibrarySimple.jsx instead
export const Icon = ({ 
  name, 
  library = 'mui', // Force Material-UI as default
  size = 'md', 
  className = '', 
  color = 'currentColor',
  ...props 
}) => {
  console.warn(`DEPRECATED: Icon component from IconLibrary.jsx is deprecated. Use Icon from IconLibrarySimple.jsx instead.`)
  
  // Redirect to SimpleIcon for consistent behavior
  return <SimpleIcon name={name} {...props} />
}

// Themed icon variants - Enhanced for Material-UI
export const ThemedIcon = ({ name, theme = 'ai', ...props }) => {
  const themeColors = {
    ai: 'text-purple-500',
    nose: 'text-blue-500', 
    hunter: 'text-green-500',
    primary: 'text-indigo-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  }

  return (
    <SimpleIcon 
      name={name}
      sx={{ 
        color: themeColors[theme] || themeColors.primary,
        ...props.sx 
      }}
      {...props}
    />
  )
}

// Icon with background - Enhanced for Material-UI
export const IconWithBackground = ({ 
  name, 
  theme = 'ai', 
  size = 'medium',
  shape = 'rounded',
  ...props 
}) => {
  const themeClasses = {
    ai: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    nose: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    hunter: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    primary: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
  }

  const shapeStyles = {
    rounded: { borderRadius: '8px' },
    circle: { borderRadius: '50%' },
    square: { borderRadius: '0' }
  }

  return (
    <div 
      className={`inline-flex items-center justify-center p-3 ${themeClasses[theme] || themeClasses.primary}`}
      style={shapeStyles[shape]}
    >
      <SimpleIcon name={name} fontSize={size} {...props} />
    </div>
  )
}

// Animated icon wrapper - Simplified for Material-UI
export const AnimatedIcon = ({ 
  name, 
  animation = 'pulse',
  ...props 
}) => {
  const animationStyles = {
    pulse: { animation: 'pulse 2s infinite' },
    spin: { animation: 'spin 2s linear infinite' },
    bounce: { animation: 'bounce 1s infinite' }
  }

  return (
    <SimpleIcon 
      name={name}
      sx={{ 
        ...animationStyles[animation],
        ...props.sx 
      }}
      {...props}
    />
  )
}

// Export both legacy compatibility and modern approach
export default SimpleIcon
export { Icons, SimpleIcon as Icon }