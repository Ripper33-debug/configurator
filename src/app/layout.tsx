import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CSSLoader from '../components/CSSLoader';
import ErrorBoundary from '../components/ErrorBoundary';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Don't preload to reduce blocking
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'sans-serif']
});
const roboto = Roboto({ 
  weight: ['400', '600'], // Reduce font weights to decrease bundle size
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Don't preload to reduce blocking
  variable: '--font-roboto',
  fallback: ['system-ui', '-apple-system', 'sans-serif']
});

export const metadata: Metadata = {
  title: {
    default: 'TRECC Configurator',
    template: '%s | TRECC Configurator'
  },
  description: 'Interactive 3D configurator for TRECC deployable shelter systems',
  keywords: [
    'TRECC',
    'configurator',
    '3D',
    'shelter',
    'deployable'
  ],
  authors: [{ name: 'TRECC' }],
  creator: 'TRECC',
  publisher: 'TRECC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://trecc-configurator.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trecc-configurator.vercel.app',
    title: 'TRECC Configurator',
    description: 'Interactive 3D configurator for TRECC deployable shelter systems',
    siteName: 'TRECC Configurator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRECC Configurator',
    description: 'Interactive 3D configurator for TRECC deployable shelter systems',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png?v=3" />
        <link rel="apple-touch-icon" href="/favicon.png?v=3" />
        <link rel="shortcut icon" href="/favicon.png?v=3" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0066cc" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://d3kx2t94cz9q1y.cloudfront.net" />
        <link rel="dns-prefetch" href="https://d3kx2t94cz9q1y.cloudfront.net" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical LCP resources */}
        <link 
          rel="preload" 
          href="https://d3kx2t94cz9q1y.cloudfront.net/Picture_of_trecc.jpg" 
          as="image" 
          fetchPriority="high"
        />
        <link 
          rel="preload" 
          href="https://d3kx2t94cz9q1y.cloudfront.net/Tanstowedreduced.glb" 
          as="fetch" 
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        
        {/* Comprehensive Critical CSS - Inlined to prevent render blocking */}
        <style>{`
          /* Reset and base styles */
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { 
            font-display: swap; 
            font-size: 16px;
            height: 100%;
          }
          body { 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 0;
            background: #1a1a2e; 
            color: #e2e8f0; 
            line-height: 1.6;
            min-height: 100vh;
            overflow-x: hidden;
            font-weight: 300;
            /* Hide scrollbar for webkit browsers */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          
          /* Hide scrollbar for webkit browsers */
          body::-webkit-scrollbar {
            display: none;
          }
          
          /* Critical layout styles */
          .configurator-container {
            width: 100vw;
            height: 100vh;
            position: relative;
            overflow: hidden;
            background: transparent;
            display: flex;
            flex-direction: column;
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
            /* Hide scrollbar */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          
          .configurator-container::-webkit-scrollbar {
            display: none;
          }
          
          /* Critical typography */
          h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            line-height: 1.2;
            margin: 0;
            color: #ffffff;
          }
          h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
          h2 { font-size: 1.8rem; }
          h3 { font-size: 1.2rem; }
          
          /* Critical button styles */
          button {
            font-family: inherit;
            cursor: pointer;
            border: none;
            outline: none;
            transition: all 0.3s ease;
          }
          
          /* Remove blue highlight from select elements */
          select {
            outline: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          select:focus,
          select:active {
            outline: none !important;
            box-shadow: none !important;
          }
          
          option {
            outline: none !important;
          }
          
          option:hover,
          option:focus,
          option:checked {
            background: rgba(20, 20, 20, 0.98) !important;
            color: white !important;
          }
          
          /* Critical loading styles */
          .loading-placeholder {
            width: 100%;
            height: 240px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(20px);
          }
          
          /* Critical animations */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          /* Critical layout components */
          .left-controls {
            width: 360px;
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(148, 163, 184, 0.2);
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            overflow-y: auto;
            z-index: 10;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            border-top-right-radius: 24px;
            border-bottom-right-radius: 24px;
            /* Hide scrollbar */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          
          .left-controls::-webkit-scrollbar {
            display: none;
          }
          
          .viewer-section {
            flex: 1;
            position: relative;
            height: 100%;
            background: transparent;
          }
        `}</style>
        
        {/* Defer non-critical CSS to prevent render blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/index.css';
                document.head.appendChild(link);
              })();
            `,
          }}
        />
      </head>
      <body style={{
        fontFamily: `${roboto.style.fontFamily}, ${inter.style.fontFamily}, system-ui, -apple-system, sans-serif`,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        color: '#e2e8f0',
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        lineHeight: 1.6,
        fontWeight: 300
      }}>
        <CSSLoader />
        <ErrorBoundary>
          <main>
            {children}
          </main>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
