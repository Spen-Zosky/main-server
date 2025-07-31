/**
 * Card Atom Component
 * Flexible card component with design tokens
 */

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { designTokens } from '../../../design-system/tokens';

const Card = React.forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'base',
  radius = 'md',
  border = false,
  hoverable = false,
  clickable = false,
  header,
  footer,
  className,
  onClick,
  ...props
}, ref) => {
  const baseStyles = {
    backgroundColor: designTokens.colors.surface.paper.light,
    transition: 'all 0.2s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
  };

  const variantStyles = {
    default: {
      border: border ? `1px solid ${designTokens.colors.neutral[200]}` : 'none',
    },
    elevated: {
      border: 'none',
    },
    outlined: {
      border: `1px solid ${designTokens.colors.neutral[300]}`,
      backgroundColor: 'transparent',
    },
    ghost: {
      backgroundColor: 'transparent',
      border: 'none',
    },
  };

  const paddingStyles = {
    none: { padding: '0' },
    sm: { padding: designTokens.spacing.scale[3] },
    md: { padding: designTokens.spacing.scale[4] },
    lg: { padding: designTokens.spacing.scale[6] },
    xl: { padding: designTokens.spacing.scale[8] },
  };

  const shadowStyles = {
    none: { boxShadow: designTokens.shadows.none },
    sm: { boxShadow: designTokens.shadows.sm },
    base: { boxShadow: designTokens.shadows.base },
    md: { boxShadow: designTokens.shadows.md },
    lg: { boxShadow: designTokens.shadows.lg },
    xl: { boxShadow: designTokens.shadows.xl },
  };

  const radiusStyles = {
    none: { borderRadius: designTokens.borderRadius.none },
    sm: { borderRadius: designTokens.borderRadius.sm },
    base: { borderRadius: designTokens.borderRadius.base },
    md: { borderRadius: designTokens.borderRadius.md },
    lg: { borderRadius: designTokens.borderRadius.lg },
    xl: { borderRadius: designTokens.borderRadius.xl },
    '2xl': { borderRadius: designTokens.borderRadius['2xl'] },
    '3xl': { borderRadius: designTokens.borderRadius['3xl'] },
  };

  const interactiveStyles = {
    cursor: clickable ? 'pointer' : 'default',
    ...(hoverable && {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: designTokens.shadows.lg,
      },
    }),
    ...(clickable && {
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: designTokens.shadows.md,
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    }),
  };

  const cardStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...paddingStyles[padding],
    ...shadowStyles[shadow],
    ...radiusStyles[radius],
    ...interactiveStyles,
  };

  const headerStyles = {
    padding: padding !== 'none' ? `0 0 ${designTokens.spacing.scale[3]} 0` : '0',
    borderBottom: header ? `1px solid ${designTokens.colors.neutral[100]}` : 'none',
    marginBottom: header ? designTokens.spacing.scale[3] : '0',
  };

  const footerStyles = {
    padding: padding !== 'none' ? `${designTokens.spacing.scale[3]} 0 0 0` : '0',
    borderTop: footer ? `1px solid ${designTokens.colors.neutral[100]}` : 'none',
    marginTop: footer ? designTokens.spacing.scale[3] : '0',
  };

  const contentStyles = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div
      ref={ref}
      className={clsx(
        'card',
        `card--${variant}`,
        `card--padding-${padding}`,
        `card--shadow-${shadow}`,
        `card--radius-${radius}`,
        {
          'card--border': border,
          'card--hoverable': hoverable,
          'card--clickable': clickable,
          'card--with-header': header,
          'card--with-footer': footer,
        },
        className
      )}
      style={cardStyles}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {header && (
        <div style={headerStyles} className="card__header">
          {header}
        </div>
      )}
      
      <div style={contentStyles} className="card__content">
        {children}
      </div>
      
      {footer && (
        <div style={footerStyles} className="card__footer">
          {footer}
        </div>
      )}
    </div>
  );
});

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'base', 'md', 'lg', 'xl']),
  radius: PropTypes.oneOf(['none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl']),
  border: PropTypes.bool,
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Card.displayName = 'Card';

export default Card;