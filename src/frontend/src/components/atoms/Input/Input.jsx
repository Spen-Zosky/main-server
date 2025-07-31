/**
 * Input Atom Component  
 * Form input component using design tokens
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { designTokens } from '../../../design-system/tokens';

const Input = React.forwardRef(({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error = false,
  success = false,
  required = false,
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  label,
  helperText,
  errorText,
  id,
  name,
  className,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(Boolean(e.target.value));
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
    onChange?.(e);
  };

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = {
    width: fullWidth ? '100%' : 'auto',
    fontFamily: designTokens.typography.fonts.primary,
    fontSize: designTokens.typography.fontSizes.base,
    lineHeight: designTokens.typography.lineHeights.normal,
    border: `1px solid ${designTokens.colors.neutral[300]}`,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: '#ffffff',
    color: designTokens.colors.text.primary.light,
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    '&::placeholder': {
      color: designTokens.colors.text.disabled.light,
    },
  };

  const sizeStyles = {
    sm: {
      padding: `${designTokens.spacing.scale[2]} ${designTokens.spacing.scale[3]}`,
      fontSize: designTokens.typography.fontSizes.sm,
      minHeight: '32px',
    },
    md: {
      padding: `${designTokens.spacing.scale[3]} ${designTokens.spacing.scale[4]}`,
      fontSize: designTokens.typography.fontSizes.base,
      minHeight: '40px',
    },
    lg: {
      padding: `${designTokens.spacing.scale[4]} ${designTokens.spacing.scale[5]}`,
      fontSize: designTokens.typography.fontSizes.lg,
      minHeight: '48px',
    },
  };

  const stateStyles = {
    default: {
      borderColor: designTokens.colors.neutral[300],
      '&:hover': {
        borderColor: designTokens.colors.neutral[400],
      },
      '&:focus': {
        borderColor: designTokens.colors.brand.primary,
        boxShadow: `0 0 0 2px ${designTokens.colors.brand.primary}20`,
      },
    },
    error: {
      borderColor: designTokens.colors.semantic.error,
      '&:focus': {
        borderColor: designTokens.colors.semantic.error,
        boxShadow: `0 0 0 2px ${designTokens.colors.semantic.error}20`,
      },
    },
    success: {
      borderColor: designTokens.colors.semantic.success,
      '&:focus': {
        borderColor: designTokens.colors.semantic.success,
        boxShadow: `0 0 0 2px ${designTokens.colors.semantic.success}20`,
      },
    },
    disabled: {
      backgroundColor: designTokens.colors.neutral[100],
      borderColor: designTokens.colors.neutral[200],
      color: designTokens.colors.text.disabled.light,
      cursor: 'not-allowed',
    },
  };

  const getCurrentState = () => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (success) return 'success';
    return 'default';
  };

  const currentState = getCurrentState();
  const styles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...stateStyles[currentState],
    ...(focused && currentState === 'default' && stateStyles.default['&:focus']),
    ...(focused && currentState === 'error' && stateStyles.error['&:focus']),
    ...(focused && currentState === 'success' && stateStyles.success['&:focus']),
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.scale[1],
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles = {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
    color: error ? designTokens.colors.semantic.error : designTokens.colors.text.primary.light,
    marginBottom: designTokens.spacing.scale[1],
  };

  const helperTextStyles = {
    fontSize: designTokens.typography.fontSizes.xs,
    color: error ? designTokens.colors.semantic.error : designTokens.colors.text.secondary.light,
    marginTop: designTokens.spacing.scale[1],
  };

  const inputWrapperStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyles = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: designTokens.colors.text.secondary.light,
    fontSize: designTokens.typography.fontSizes.lg,
    zIndex: 1,
  };

  const startIconStyles = {
    ...iconStyles,
    left: designTokens.spacing.scale[3],
  };

  const endIconStyles = {
    ...iconStyles,
    right: designTokens.spacing.scale[3],
  };

  const inputWithIconStyles = {
    ...styles,
    ...(startIcon && { paddingLeft: `calc(${designTokens.spacing.scale[4]} + ${designTokens.spacing.scale[6]})` }),
    ...(endIcon && { paddingRight: `calc(${designTokens.spacing.scale[4]} + ${designTokens.spacing.scale[6]})` }),
  };

  return (
    <div style={containerStyles} className={clsx('input-container', className)}>
      {label && (
        <label htmlFor={inputId} style={labelStyles} className="input-label">
          {label}
          {required && <span style={{ color: designTokens.colors.semantic.error }}> *</span>}
        </label>
      )}
      
      <div style={inputWrapperStyles} className="input-wrapper">
        {startIcon && (
          <span style={startIconStyles} className="input-start-icon">
            {startIcon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={clsx(
            'input',
            `input--${size}`,
            `input--${currentState}`,
            {
              'input--focused': focused,
              'input--has-value': hasValue,
              'input--with-start-icon': startIcon,
              'input--with-end-icon': endIcon,
            }
          )}
          style={startIcon || endIcon ? inputWithIconStyles : styles}
          {...props}
        />
        
        {endIcon && (
          <span style={endIconStyles} className="input-end-icon">
            {endIcon}
          </span>
        )}
      </div>
      
      {(helperText || errorText) && (
        <span style={helperTextStyles} className="input-helper-text">
          {error && errorText ? errorText : helperText}
        </span>
      )}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search']),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  success: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  label: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
};

Input.displayName = 'Input';

export default Input;