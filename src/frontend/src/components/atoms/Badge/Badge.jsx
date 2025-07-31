/**
 * Badge Atom Component
 * Small status and labeling component with design tokens
 */

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { designTokens } from '../../../design-system/tokens';

const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  outline = false,
  dot = false,
  className,
  ...props
}, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: designTokens.typography.fonts.primary,
    fontWeight: designTokens.typography.fontWeights.medium,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    userSelect: 'none',
    border: 'none',
    textDecoration: 'none',
  };

  const variantStyles = {
    default: {
      backgroundColor: designTokens.colors.neutral[100],
      color: designTokens.colors.text.primary.light,
      ...(outline && {
        backgroundColor: 'transparent',
        border: `1px solid ${designTokens.colors.neutral[300]}`,
      }),
    },
    primary: {
      backgroundColor: designTokens.colors.brand.primary,
      color: '#ffffff',
      ...(outline && {
        backgroundColor: 'transparent',
        color: designTokens.colors.brand.primary,
        border: `1px solid ${designTokens.colors.brand.primary}`,
      }),
    },
    secondary: {
      backgroundColor: designTokens.colors.brand.secondary,
      color: '#ffffff',
      ...(outline && {
        backgroundColor: 'transparent',
        color: designTokens.colors.brand.secondary,
        border: `1px solid ${designTokens.colors.brand.secondary}`,
      }),
    },
    accent: {
      backgroundColor: designTokens.colors.brand.accent,
      color: '#ffffff',
      ...(outline && {
        backgroundColor: 'transparent',
        color: designTokens.colors.brand.accent,
        border: `1px solid ${designTokens.colors.brand.accent}`,
      }),
    },
    success: {
      backgroundColor: designTokens.colors.semantic.success,
      color: '#ffffff',
      ...(outline && {
        backgroundColor: 'transparent',
        color: designTokens.colors.semantic.success,
        border: `1px solid ${designTokens.colors.semantic.success}`,
      }),
    },
    warning: {
      backgroundColor: designTokens.colors.semantic.warning,
      color: '#ffffff',
      ...(outline && {
        backgroundColor: 'transparent',
        color: designTokens.colors.semantic.warning,
        border: `1px solid ${designTokens.colors.semantic.warning}`,
      }),
    },
    error: {
      backgroundColor: designTokens.colors.semantic.error,
      color: '#ffffff',
      ...(outline && {
        backgroundColor: 'transparent',
        color: designTokens.colors.semantic.error,
        border: `1px solid ${designTokens.colors.semantic.error}`,
      }),
    },
    info: {
      backgroundColor: designTokens.colors.semantic.info,
      color: '#ffffff',
      ...(outline && {
        backgroundColor: 'transparent',
        color: designTokens.colors.semantic.info,
        border: `1px solid ${designTokens.colors.semantic.info}`,
      }),
    },
  };

  const sizeStyles = {
    xs: {
      fontSize: designTokens.typography.fontSizes.xs,
      padding: `${designTokens.spacing.scale[1]} ${designTokens.spacing.scale[2]}`,
      minHeight: '16px',
      lineHeight: '1',
    },
    sm: {
      fontSize: designTokens.typography.fontSizes.xs,
      padding: `${designTokens.spacing.scale[1]} ${designTokens.spacing.scale[2]}`,
      minHeight: '20px',
      lineHeight: '1.2',
    },
    md: {
      fontSize: designTokens.typography.fontSizes.sm,
      padding: `${designTokens.spacing.scale[1]} ${designTokens.spacing.scale[3]}`,
      minHeight: '24px',
      lineHeight: '1.2',
    },
    lg: {
      fontSize: designTokens.typography.fontSizes.base,
      padding: `${designTokens.spacing.scale[2]} ${designTokens.spacing.scale[3]}`,
      minHeight: '28px',
      lineHeight: '1.2',
    },
  };

  const roundedStyles = {
    borderRadius: rounded ? designTokens.borderRadius.full : designTokens.borderRadius.sm,
  };

  const dotStyles = dot ? {
    width: size === 'xs' ? '8px' : size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px',
    height: size === 'xs' ? '8px' : size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px',
    padding: '0',
    minHeight: 'auto',
    borderRadius: '50%',
  } : {};

  const styles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...roundedStyles,
    ...dotStyles,
  };

  if (dot) {
    return (
      <span
        ref={ref}
        className={clsx(
          'badge',
          'badge--dot',
          `badge--${variant}`,
          `badge--${size}`,
          {
            'badge--outline': outline,
          },
          className
        )}
        style={styles}
        {...props}
      />
    );
  }

  return (
    <span
      ref={ref}
      className={clsx(
        'badge',
        `badge--${variant}`,
        `badge--${size}`,
        {
          'badge--outline': outline,
          'badge--rounded': rounded,
        },
        className
      )}
      style={styles}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'default',
    'primary', 
    'secondary',
    'accent',
    'success',
    'warning',
    'error',
    'info'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  rounded: PropTypes.bool,
  outline: PropTypes.bool,
  dot: PropTypes.bool,
  className: PropTypes.string,
};

Badge.displayName = 'Badge';

export default Badge;