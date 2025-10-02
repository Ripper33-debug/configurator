'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 600,
  height = 400,
  className,
  style,
  priority = false,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div style={{ position: 'relative', width, height, ...style }} className={className}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          quality={85} // Optimized quality for performance
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            borderRadius: '12px',
            transition: 'opacity 0.3s ease',
            opacity: isLoading ? 0 : 1
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      ) : (
        // Fallback placeholder
        <div style={{
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#666'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏠</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '500', textAlign: 'center' }}>
            {alt}
          </div>
        </div>
      )}
      
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '12px'
        }} />
      )}
    </div>
  );
}

