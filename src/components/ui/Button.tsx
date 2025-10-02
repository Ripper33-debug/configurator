import React from 'react';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  selected = false,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: '2px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        };
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          border: '2px solid rgba(107, 114, 128, 0.1)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '3px solid rgba(16, 185, 129, 0.8)',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(16, 185, 129, 0.3)',
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: 'none',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
        };
      case 'color-option':
        return {
          background: selected 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: selected 
            ? '3px solid rgba(16, 185, 129, 0.8)'
            : '2px solid rgba(59, 130, 246, 0.1)',
          boxShadow: selected
            ? '0 8px 25px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(16, 185, 129, 0.3)'
            : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 16px', fontSize: '12px' };
      case 'md':
        return { padding: '16px 20px', fontSize: '14px' };
      case 'lg':
        return { padding: '18px 24px', fontSize: '14px' };
      default:
        return {};
    }
  };

  const baseStyles: React.CSSProperties = {
    color: 'white',
    borderRadius: '16px',
    fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: disabled ? 'none' : 'auto',
    zIndex: 10,
    opacity: disabled ? 0.6 : 1,
    border: 'none',
    outline: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !selected) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !selected) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = variant === 'color-option' && selected
        ? '0 8px 25px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(16, 185, 129, 0.3)'
        : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
