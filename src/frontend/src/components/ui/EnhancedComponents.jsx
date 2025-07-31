import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transition, Dialog } from '@headlessui/react';
import clsx from 'clsx';
import { Icon } from './IconLibrary';

// Enhanced Card Component with Framer Motion
export const MotionCard = ({ 
  children, 
  className = '', 
  theme = 'default',
  hoverable = true,
  clickable = false,
  onClick,
  ...props 
}) => {
  const themeClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    ai: 'bg-gradient-to-br from-ai-50 to-ai-100 dark:from-ai-900 dark:to-ai-800 border border-ai-200 dark:border-ai-700',
    nose: 'bg-gradient-to-br from-nose-50 to-nose-100 dark:from-nose-900 dark:to-nose-800 border border-nose-200 dark:border-nose-700',
    hunter: 'bg-gradient-to-br from-hunter-50 to-hunter-100 dark:from-hunter-900 dark:to-hunter-800 border border-hunter-200 dark:border-hunter-700',
    glass: 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20'
  };

  return (
    <motion.div
      className={clsx(
        'rounded-xl shadow-lg transition-all duration-300',
        themeClasses[theme],
        hoverable && 'hover:shadow-xl hover:scale-[1.02]',
        clickable && 'cursor-pointer',
        className
      )}
      whileHover={hoverable ? { y: -4 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Button Component
export const MotionButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  theme = 'ai',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const variantClasses = {
    primary: {
      ai: 'bg-ai-500 hover:bg-ai-600 text-white focus:ring-ai-500 shadow-ai',
      nose: 'bg-nose-500 hover:bg-nose-600 text-white focus:ring-nose-500 shadow-nose',
      hunter: 'bg-hunter-500 hover:bg-hunter-600 text-white focus:ring-hunter-500 shadow-hunter'
    },
    secondary: {
      ai: 'bg-ai-100 hover:bg-ai-200 text-ai-700 focus:ring-ai-500 border border-ai-300',
      nose: 'bg-nose-100 hover:bg-nose-200 text-nose-700 focus:ring-nose-500 border border-nose-300',
      hunter: 'bg-hunter-100 hover:bg-hunter-200 text-hunter-700 focus:ring-hunter-500 border border-hunter-300'
    },
    outline: {
      ai: 'border-2 border-ai-500 text-ai-500 hover:bg-ai-500 hover:text-white focus:ring-ai-500',
      nose: 'border-2 border-nose-500 text-nose-500 hover:bg-nose-500 hover:text-white focus:ring-nose-500',
      hunter: 'border-2 border-hunter-500 text-hunter-500 hover:bg-hunter-500 hover:text-white focus:ring-hunter-500'
    },
    ghost: {
      ai: 'text-ai-500 hover:bg-ai-100 focus:ring-ai-500',
      nose: 'text-nose-500 hover:bg-nose-100 focus:ring-nose-500',
      hunter: 'text-hunter-500 hover:bg-hunter-100 focus:ring-hunter-500'
    }
  };

  return (
    <motion.button
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant][theme],
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Icon name="settings" className="animate-spin" size="sm" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <Icon name={icon} size="sm" />}
          {children}
          {icon && iconPosition === 'right' && <Icon name={icon} size="sm" />}
        </>
      )}
    </motion.button>
  );
};

// Enhanced Modal Component using Headless UI + Framer Motion
export const MotionModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  theme = 'default' 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClose={onClose}
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={clsx(
                  'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all',
                  sizeClasses[size]
                )}
              >
                {title && (
                  <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                    {title}
                  </Dialog.Title>
                )}
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

// Enhanced Badge Component
export const Badge = ({ 
  children, 
  variant = 'default', 
  theme = 'ai',
  size = 'md',
  icon,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const variantClasses = {
    default: {
      ai: 'bg-ai-100 text-ai-800 border border-ai-200',
      nose: 'bg-nose-100 text-nose-800 border border-nose-200',
      hunter: 'bg-hunter-100 text-hunter-800 border border-hunter-200'
    },
    solid: {
      ai: 'bg-ai-500 text-white',
      nose: 'bg-nose-500 text-white',
      hunter: 'bg-hunter-500 text-white'
    },
    outline: {
      ai: 'border border-ai-500 text-ai-500',
      nose: 'border border-nose-500 text-nose-500',
      hunter: 'border border-hunter-500 text-hunter-500'
    },
    dot: {
      ai: 'bg-ai-100 text-ai-800 border border-ai-200 relative pl-6',
      nose: 'bg-nose-100 text-nose-800 border border-nose-200 relative pl-6',
      hunter: 'bg-hunter-100 text-hunter-800 border border-hunter-200 relative pl-6'
    }
  };

  return (
    <span className={clsx(
      'inline-flex items-center font-medium rounded-full',
      sizeClasses[size],
      variantClasses[variant][theme],
      className
    )}>
      {variant === 'dot' && (
        <span className={clsx(
          'absolute left-2 w-2 h-2 rounded-full',
          theme === 'ai' && 'bg-ai-500',
          theme === 'nose' && 'bg-nose-500',
          theme === 'hunter' && 'bg-hunter-500'
        )} />
      )}
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </span>
  );
};

// Enhanced Progress Bar
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  theme = 'ai',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '' 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const themeClasses = {
    ai: 'bg-ai-500',
    nose: 'bg-nose-500',
    hunter: 'bg-hunter-500'
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          className={clsx(
            'h-full rounded-full',
            themeClasses[theme],
            animated && 'transition-all duration-500'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Enhanced Status Indicator
export const StatusIndicator = ({ 
  status = 'unknown', 
  label,
  size = 'md',
  animated = true 
}) => {
  const statusConfig = {
    running: { color: 'bg-status-running', label: 'Running', icon: 'success' },
    stopped: { color: 'bg-status-stopped', label: 'Stopped', icon: 'settings' },
    warning: { color: 'bg-status-warning', label: 'Warning', icon: 'notifications' },
    loading: { color: 'bg-status-loading', label: 'Loading', icon: 'settings' },
    unknown: { color: 'bg-status-unknown', label: 'Unknown', icon: 'settings' }
  };

  const config = statusConfig[status] || statusConfig.unknown;
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className={clsx(
        'rounded-full',
        sizeClasses[size],
        config.color,
        animated && status === 'loading' && 'animate-pulse',
        animated && status === 'running' && 'animate-pulse-slow'
      )} />
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label || config.label}
        </span>
      )}
    </div>
  );
};

// Enhanced Tooltip (using Headless UI)
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={clsx(
              'absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-nowrap',
              positionClasses[position]
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  MotionCard,
  MotionButton,
  MotionModal,
  Badge,
  ProgressBar,
  StatusIndicator,
  Tooltip
};