'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'white' | 'primary' | 'secondary';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'white', 
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  };

  const colorMap = {
    white: '#ffffff',
    primary: '#667eea',
    secondary: '#764ba2'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }} className={className}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: `2px solid ${colorMap[color]}20`,
          borderTop: `2px solid ${colorMap[color]}`,
          borderRadius: '50%'
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            color: colorMap[color],
            fontSize: '0.875rem',
            fontWeight: '500',
            margin: 0
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
