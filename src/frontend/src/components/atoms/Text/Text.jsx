/**
 * Text Atom Component
 * Typography component using design tokens
 */

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { designTokens } from '../../../design-system/tokens';

const Text = React.forwardRef(({
  children,
  variant = 'body',
  color = 'primary',
  align = 'left',
  weight,
  size,
  as: Component = 'p',
  truncate = false,
  className,
  ...props
}, ref) => {
  // Get text style from design tokens
  const textStyle = designTokens.typography.textStyles[variant] || designTokens.typography.textStyles.body;
  
  const baseStyles = {
    margin: 0,
    padding: 0,
    textAlign: align,
    wordBreak: 'break-word',
    ...(truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  };

  // Apply text style from tokens
  const variantStyles = {
    fontSize: size || textStyle.fontSize,
    fontWeight: weight || textStyle.fontWeight,
    lineHeight: textStyle.lineHeight,
    fontFamily: textStyle.fontFamily,
    letterSpacing: textStyle.letterSpacing,
  };

  // Color mapping
  const colorStyles = {
    primary: { color: designTokens.colors.text.primary.light },
    secondary: { color: designTokens.colors.text.secondary.light },
    disabled: { color: designTokens.colors.text.disabled.light },
    success: { color: designTokens.colors.semantic.success },
    warning: { color: designTokens.colors.semantic.warning },
    error: { color: designTokens.colors.semantic.error },
    info: { color: designTokens.colors.semantic.info },
    brand: { color: designTokens.colors.brand.primary },
    accent: { color: designTokens.colors.brand.accent },
  };

  const styles = {
    ...baseStyles,
    ...variantStyles,
    ...colorStyles[color],
  };

  return (
    <Component
      ref={ref}
      className={clsx(
        'text',
        `text--${variant}`,
        `text--${color}`,
        {
          'text--truncate': truncate,
        },
        className
      )}
      style={styles}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'display',
    'h1',
    'h2', 
    'h3',
    'h4',
    'body',
    'bodyLarge',
    'caption',
    'code'
  ]),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'disabled',
    'success',
    'warning',
    'error',
    'info',
    'brand',
    'accent'
  ]),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  weight: PropTypes.oneOf(['light', 'regular', 'medium', 'semiBold', 'bold', 'extraBold']),
  size: PropTypes.string,
  as: PropTypes.elementType,
  truncate: PropTypes.bool,
  className: PropTypes.string,
};

Text.displayName = 'Text';

export default Text;