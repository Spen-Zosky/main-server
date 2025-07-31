/**
 * Form Molecule Component
 * Complete form wrapper with validation and submission handling
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { Card } from '../../atoms/Card';
import { designTokens } from '../../../design-system/tokens';

const Form = React.forwardRef(({
  children,
  title,
  subtitle,
  onSubmit,
  onCancel,
  onReset,
  submitText = 'Submit',
  cancelText = 'Cancel',
  resetText = 'Reset',
  variant = 'default',
  layout = 'vertical',
  spacing = 'md',
  showActions = true,
  showCancel = false,
  showReset = false,
  loading = false,
  disabled = false,
  card = false,
  validation = {},
  className,
  ...props
}, ref) => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    const fieldValidation = validation[name];
    if (!fieldValidation) return null;

    // Required validation
    if (fieldValidation.required && (!value || value.toString().trim() === '')) {
      return fieldValidation.requiredMessage || `${name} is required`;
    }

    // Pattern validation
    if (fieldValidation.pattern && value && !fieldValidation.pattern.test(value)) {
      return fieldValidation.patternMessage || `${name} format is invalid`;
    }

    // Custom validation
    if (fieldValidation.custom && value) {
      const customResult = fieldValidation.custom(value);
      if (customResult !== true) {
        return customResult || `${name} is invalid`;
      }
    }

    return null;
  }, [validation]);

  const validateForm = useCallback((formData) => {
    const errors = {};
    Object.keys(validation).forEach(fieldName => {
      const error = validateField(fieldName, formData.get(fieldName));
      if (error) {
        errors[fieldName] = error;
      }
    });
    return errors;
  }, [validateField, validation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || disabled || isSubmitting) return;

    const formData = new FormData(e.target);
    const errors = validateForm(formData);
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData, e);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (e) => {
    setFormErrors({});
    onReset?.(e);
  };

  const baseStyles = {
    width: '100%',
  };

  const layoutStyles = {
    vertical: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing === 'sm' ? designTokens.spacing.scale[3] : 
           spacing === 'md' ? designTokens.spacing.scale[4] : 
           designTokens.spacing.scale[6],
    },
    horizontal: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: spacing === 'sm' ? designTokens.spacing.scale[3] : 
           spacing === 'md' ? designTokens.spacing.scale[4] : 
           designTokens.spacing.scale[6],
    },
  };

  const headerStyles = {
    marginBottom: spacing === 'sm' ? designTokens.spacing.scale[3] : 
                 spacing === 'md' ? designTokens.spacing.scale[4] : 
                 designTokens.spacing.scale[6],
  };

  const actionsStyles = {
    display: 'flex',
    gap: designTokens.spacing.scale[3],
    marginTop: spacing === 'sm' ? designTokens.spacing.scale[4] : 
              spacing === 'md' ? designTokens.spacing.scale[6] : 
              designTokens.spacing.scale[8],
    ...(layout === 'horizontal' && {
      gridColumn: '1 / -1',
    }),
  };

  const FormContent = () => (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      onReset={handleReset}
      className={clsx(
        'form',
        `form--${variant}`,
        `form--${layout}`,
        `form--spacing-${spacing}`,
        {
          'form--loading': loading || isSubmitting,
          'form--disabled': disabled,
          'form--with-actions': showActions,
        },
        className
      )}
      style={{ ...baseStyles, ...layoutStyles[layout] }}
      {...props}
    >
      {(title || subtitle) && (
        <div style={headerStyles} className="form__header">
          {title && (
            <Text variant="h2" className="form__title">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="body" color="secondary" className="form__subtitle">
              {subtitle}
            </Text>
          )}
        </div>
      )}

      <div className="form__fields">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          
          // Inject error state for form fields
          const fieldName = child.props.name;
          const hasError = formErrors[fieldName];
          
          if (child.type?.displayName === 'Input' && fieldName) {
            return React.cloneElement(child, {
              key: index,
              error: Boolean(hasError),
              errorText: hasError,
              ...child.props,
            });
          }
          
          return child;
        })}
      </div>

      {showActions && (
        <div style={actionsStyles} className="form__actions">
          <Button
            type="submit"
            variant="primary"
            loading={loading || isSubmitting}
            disabled={disabled}
          >
            {submitText}
          </Button>
          
          {showCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading || isSubmitting}
            >
              {cancelText}
            </Button>
          )}
          
          {showReset && (
            <Button
              type="reset"
              variant="ghost"
              disabled={loading || isSubmitting}
            >
              {resetText}
            </Button>
          )}
        </div>
      )}
    </form>
  );

  if (card) {
    return (
      <Card padding="lg" shadow="md">
        <FormContent />
      </Card>
    );
  }

  return <FormContent />;
});

Form.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onReset: PropTypes.func,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  resetText: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'compact', 'spacious']),
  layout: PropTypes.oneOf(['vertical', 'horizontal']),
  spacing: PropTypes.oneOf(['sm', 'md', 'lg']),
  showActions: PropTypes.bool,
  showCancel: PropTypes.bool,
  showReset: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  card: PropTypes.bool,
  validation: PropTypes.object,
  className: PropTypes.string,
};

Form.displayName = 'Form';

export default Form;