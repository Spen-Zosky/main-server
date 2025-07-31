/**
 * Button Atom Component
 * Base button component using design tokens
 */

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { designTokens } from '../../../design-system/tokens';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: designTokens.borderRadius.md,
    fontFamily: designTokens.typography.fonts.primary,
    fontWeight: designTokens.typography.fontWeights.medium,
    textDecoration: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles = {
    primary: {
      backgroundColor: designTokens.colors.brand.primary,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: designTokens.colors.modules.ai.dark,
        transform: 'translateY(-1px)',
        boxShadow: designTokens.shadows.md,
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: designTokens.colors.brand.primary,
      border: `1px solid ${designTokens.colors.brand.primary}`,
      '&:hover': {
        backgroundColor: designTokens.colors.brand.primary,
        color: '#ffffff',
      },
    },
    accent: {
      backgroundColor: designTokens.colors.brand.accent,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: designTokens.colors.modules.hunter.dark,
        transform: 'translateY(-1px)',
        boxShadow: designTokens.shadows.md,
      },
    },
    success: {
      backgroundColor: designTokens.colors.semantic.success,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#45a049',
      },
    },
    warning: {
      backgroundColor: designTokens.colors.semantic.warning,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#e68900',
      },
    },
    error: {
      backgroundColor: designTokens.colors.semantic.error,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#d32f2f',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: designTokens.colors.text.primary.light,
      '&:hover': {
        backgroundColor: designTokens.colors.neutral[100],
      },
    },
  };

  const sizeStyles = {
    sm: {
      fontSize: designTokens.typography.fontSizes.sm,
      padding: `${designTokens.spacing.scale[2]} ${designTokens.spacing.scale[3]}`,
      minHeight: '32px',
    },
    md: {
      fontSize: designTokens.typography.fontSizes.base,
      padding: `${designTokens.spacing.scale[3]} ${designTokens.spacing.scale[4]}`,
      minHeight: '40px',
    },
    lg: {
      fontSize: designTokens.typography.fontSizes.lg,
      padding: `${designTokens.spacing.scale[4]} ${designTokens.spacing.scale[6]}`,
      minHeight: '48px',
    },
  };

  const styles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx('btn', `btn--${variant}`, `btn--${size}`, {
        'btn--loading': loading,
        'btn--full-width': fullWidth,
        'btn--disabled': disabled,
      }, className)}
      style={styles}
      {...props}
    >
      {loading && (
        <span style={{ 
          marginRight: designTokens.spacing.scale[2],
          display: 'inline-block',
          animation: 'spin 1s linear infinite',
        }}>
          ⟳
        </span>
      )}
      
      {startIcon && !loading && (
        <span style={{ marginRight: designTokens.spacing.scale[2] }}>
          {startIcon}
        </span>
      )}
      
      <span>{children}</span>
      
      {endIcon && (
        <span style={{ marginLeft: designTokens.spacing.scale[2] }}>
          {endIcon}
        </span>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

Button.displayName = 'Button';

export default Button;