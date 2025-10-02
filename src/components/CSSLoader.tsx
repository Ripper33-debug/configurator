'use client';

import { useEffect } from 'react';

export default function CSSLoader() {
  useEffect(() => {
    // Load non-critical CSS after initial render
    const loadCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/index.css';
      link.media = 'all';
      document.head.appendChild(link);
    };

    // Load CSS after a short delay to not block initial render
    const timer = setTimeout(loadCSS, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

