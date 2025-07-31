/**
 * Header Organism Component
 * Complete header with navigation, search, and user actions
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { SearchBox } from '../../molecules/SearchBox';
import { designTokens } from '../../../design-system/tokens';

const Header = ({
  title = 'Main Server Platform',
  subtitle,
  theme = 'default',
  showSearch = true,
  showUserActions = true,
  navigation = [],
  user,
  onSearch,
  onLogin,
  onLogout,
  onNavigate,
  className,
  ...props
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Theme-based styling
  const themeStyles = {
    default: {
      backgroundColor: designTokens.colors.surface.background.light,
      borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
      color: designTokens.colors.text.primary.light,
    },
    ai: {
      background: designTokens.colors.modules.ai.gradient,
      color: '#ffffff',
      borderBottom: 'none',
    },
    nose: {
      background: designTokens.colors.modules.nose.gradient,
      color: '#ffffff',
      borderBottom: 'none',
    },
    hunter: {
      background: designTokens.colors.modules.hunter.gradient,
      color: '#ffffff',
      borderBottom: 'none',
    },
    dark: {
      backgroundColor: designTokens.colors.surface.background.dark,
      borderBottom: `1px solid ${designTokens.colors.neutral[700]}`,
      color: designTokens.colors.text.primary.dark,
    },
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${designTokens.spacing.scale[4]} ${designTokens.spacing.scale[6]}`,
    minHeight: '64px',
    boxShadow: designTokens.shadows.sm,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    ...themeStyles[theme],
  };

  const brandStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.scale[3],
    flex: '0 0 auto',
  };

  const logoStyles = {
    width: '32px',
    height: '32px',
    borderRadius: designTokens.borderRadius.md,
    background: theme === 'default' ? designTokens.colors.brand.primary : 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: theme === 'default' ? '#ffffff' : 'inherit',
  };

  const titleGroupStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const navStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.scale[6],
    flex: '1 1 auto',
    justifyContent: 'center',
    maxWidth: '600px',
    margin: `0 ${designTokens.spacing.scale[6]}`,
  };

  const navItemStyles = {
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: designTokens.typography.fontSizes.base,
    fontWeight: designTokens.typography.fontWeights.medium,
    padding: `${designTokens.spacing.scale[2]} ${designTokens.spacing.scale[3]}`,
    borderRadius: designTokens.borderRadius.md,
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };

  const actionsStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.scale[3],
    flex: '0 0 auto',
  };

  const searchStyles = {
    maxWidth: '300px',
    minWidth: '200px',
  };

  const userMenuStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.scale[3],
  };

  const avatarStyles = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const mobileMenuButtonStyles = {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: '24px',
    padding: designTokens.spacing.scale[2],
    '@media (max-width: 768px)': {
      display: 'block',
    },
  };

  const responsiveNavStyles = {
    ...navStyles,
    '@media (max-width: 768px)': {
      display: mobileMenuOpen ? 'flex' : 'none',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      flexDirection: 'column',
      backgroundColor: 'inherit',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: designTokens.spacing.scale[4],
      maxWidth: 'none',
      margin: 0,
    },
  };

  return (
    <header 
      className={clsx('header', `header--${theme}`, {
        'header--mobile-menu-open': mobileMenuOpen,
      }, className)}
      style={headerStyles}
      {...props}
    >
      {/* Brand Section */}
      <div style={brandStyles} className="header__brand">
        <div style={logoStyles} className="header__logo">
          {theme === 'ai' ? '🤖' : theme === 'nose' ? '🔬' : theme === 'hunter' ? '🕸️' : '⚡'}
        </div>
        <div style={titleGroupStyles}>
          <Text 
            variant="h4" 
            color={theme === 'default' ? 'brand' : 'primary'}
            style={{ color: 'inherit' }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              variant="caption" 
              style={{ 
                color: 'inherit', 
                opacity: 0.8,
                fontSize: designTokens.typography.fontSizes.xs 
              }}
            >
              {subtitle}
            </Text>
          )}
        </div>
      </div>

      {/* Navigation */}
      {navigation.length > 0 && (
        <nav style={responsiveNavStyles} className="header__nav">
          {navigation.map((item, index) => (
            <button
              key={index}
              style={navItemStyles}
              onClick={() => onNavigate?.(item)}
              className="header__nav-item"
            >
              {item.icon && <span style={{ marginRight: designTokens.spacing.scale[1] }}>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </nav>
      )}

      {/* Actions Section */}
      <div style={actionsStyles} className="header__actions">
        {/* Search */}
        {showSearch && (
          <div style={searchStyles} className="header__search">
            <SearchBox
              placeholder="Search..."
              size="sm"
              onSearch={onSearch}
              fullWidth
            />
          </div>
        )}

        {/* User Actions */}
        {showUserActions && (
          <div style={userMenuStyles} className="header__user">
            {user ? (
              <>
                <div style={avatarStyles} className="header__avatar">
                  {user.avatar || user.name?.charAt(0).toUpperCase() || '👤'}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  style={{ color: 'inherit' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant={theme === 'default' ? 'primary' : 'secondary'}
                size="sm"
                onClick={onLogin}
              >
                Login
              </Button>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          style={mobileMenuButtonStyles}
          onClick={toggleMobileMenu}
          className="header__mobile-menu-toggle"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .header__nav {
            display: ${mobileMenuOpen ? 'flex' : 'none'};
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background-color: inherit;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: ${designTokens.spacing.scale[4]};
            max-width: none;
            margin: 0;
          }
          
          .header__mobile-menu-toggle {
            display: block;
          }
          
          .header__search {
            display: none;
          }
        }
        
        @media (min-width: 769px) {
          .header__mobile-menu-toggle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'ai', 'nose', 'hunter', 'dark']),
  showSearch: PropTypes.bool,
  showUserActions: PropTypes.bool,
  navigation: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    href: PropTypes.string,
    onClick: PropTypes.func,
  })),
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
  }),
  onSearch: PropTypes.func,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onNavigate: PropTypes.func,
  className: PropTypes.string,
};

Header.displayName = 'Header';

export default Header;