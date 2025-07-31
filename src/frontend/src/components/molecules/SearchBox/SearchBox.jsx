/**
 * SearchBox Molecule Component
 * Combines Input and Button atoms for search functionality
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { designTokens } from '../../../design-system/tokens';

const SearchBox = React.forwardRef(({
  placeholder = 'Search...',
  value,
  onSearch,
  onChange,
  onClear,
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  clearable = true,
  autoFocus = false,
  className,
  ...props
}, ref) => {
  const [searchValue, setSearchValue] = useState(value || '');

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(e);
  };

  const handleSearch = () => {
    if (searchValue.trim() && !loading && !disabled) {
      onSearch?.(searchValue.trim());
    }
  };

  const handleClear = () => {
    setSearchValue('');
    onClear?.();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const containerStyles = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: designTokens.spacing.scale[2],
    width: fullWidth ? '100%' : 'auto',
  };

  const inputWrapperStyles = {
    flex: 1,
    position: 'relative',
  };

  const clearButtonStyles = {
    position: 'absolute',
    right: size === 'lg' ? '56px' : '48px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    color: designTokens.colors.text.secondary.light,
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: searchValue ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: designTokens.colors.neutral[100],
      color: designTokens.colors.text.primary.light,
    },
  };

  return (
    <div 
      className={clsx('search-box', `search-box--${size}`, {
        'search-box--full-width': fullWidth,
        'search-box--loading': loading,
        'search-box--disabled': disabled,
      }, className)}
      style={containerStyles}
    >
      <div style={inputWrapperStyles}>
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          size={size}
          fullWidth
          disabled={disabled}
          startIcon="🔍"
          autoFocus={autoFocus}
          {...props}
        />
        
        {clearable && searchValue && (
          <button
            type="button"
            onClick={handleClear}
            style={clearButtonStyles}
            className="search-box__clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      <Button
        variant="primary"
        size={size}
        onClick={handleSearch}
        disabled={disabled || loading || !searchValue.trim()}
        loading={loading}
        className="search-box__button"
      >
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
});

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
};

SearchBox.displayName = 'SearchBox';

export default SearchBox;