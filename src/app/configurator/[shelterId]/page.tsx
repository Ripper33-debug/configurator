'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ErrorBoundary from '../../../components/ErrorBoundary';

// Animated percentage component - fluid natural progression
function AnimatedPercentage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 8000; // 8 seconds total
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Apply easing function for more natural progression
      // Ease-out cubic for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - (rawProgress / 100), 3);
      const newProgress = easedProgress * 100;
      
      setProgress(newProgress);
      
      if (rawProgress >= 100) {
        clearInterval(interval);
        setProgress(100); // Ensure we end at exactly 100%
      }
    }, 30); // Update every 30ms for ultra-smooth animation

    return () => clearInterval(interval);
  }, []);

  return <>{Math.round(progress)}%</>;
}

// Animated stage component - fluid progression
function AnimatedStage() {
  const [loadingStage, setLoadingStage] = useState('Initializing...');
  const [stageIcon, setStageIcon] = useState('⚡');

  useEffect(() => {
    const startTime = Date.now();
    const duration = 8000; // 8 seconds total
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / duration) * 100;
      
      // Fluid stage progression based on natural progress
      if (progress < 15) {
        setLoadingStage('Connecting to CloudFront CDN');
        setStageIcon('🌐');
      } else if (progress < 35) {
        setLoadingStage('Downloading 3D model data');
        setStageIcon('📦');
      } else if (progress < 55) {
        setLoadingStage('Processing geometry and textures');
        setStageIcon('🔧');
      } else if (progress < 75) {
        setLoadingStage('Optimizing for display');
        setStageIcon('⚙️');
      } else if (progress < 90) {
        setLoadingStage('Finalizing configuration');
        setStageIcon('✨');
      } else {
        setLoadingStage('Ready!');
        setStageIcon('✅');
        clearInterval(interval);
      }
    }, 50); // Check every 50ms for smoother transitions

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <span style={{ fontSize: '20px' }}>{stageIcon}</span>
      <span>{loadingStage}</span>
    </>
  );
}

// Animated progress bar component - fluid natural progression
function AnimatedProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 8000; // 8 seconds total
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Apply same easing function for consistency
      const easedProgress = 1 - Math.pow(1 - (rawProgress / 100), 3);
      const newProgress = easedProgress * 100;
      
      setProgress(newProgress);
      
      if (rawProgress >= 100) {
        clearInterval(interval);
        setProgress(100); // Ensure we end at exactly 100%
      }
    }, 30); // Update every 30ms for ultra-smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: `${progress}%`,
      height: '100%',
      background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
      borderRadius: '4px',
      transition: 'width 0.05s ease-out',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
      position: 'relative'
    }}>
      {/* Progress bar shine effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
        animation: 'shimmer 2s ease-in-out infinite'
      }} />
    </div>
  );
}

// Aggressively lazy load the configurator to reduce TBT
const ShelterConfigurator = dynamic(
  () => import('../../../components/ShelterConfigurator'),
  {
    loading: () => (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Loading Configurator</h3>
          <p style={{ margin: '8px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>
            Preparing 3D environment...
          </p>
        </div>
      </div>
    ),
    ssr: false // Disable server-side rendering for 3D components
  }
);

// Loading screen component that stays visible for full duration
function LoadingScreen() { return null; }

const shelterData = {
  'trecc': {
    name: 'TRECC',
    description: 'TRECC deployable shelter system with multiple configuration options',
    defaultModel: 'trecc.glb'
  },
  'command-posting': {
    name: 'Command Posting',
    description: 'Specialized command posting interior',
    defaultModel: 'CommandPosting.glb'
  },
  'herconn': {
    name: 'HERCONN',
    description: 'HERCONN deployable shelter system',
    defaultModel: 'trecc.glb'
  },
  'command-center': {
    name: 'Command Center',
    description: 'Specialized command and control facility',
    defaultModel: 'trecc.glb'
  },
  'field-hospital': {
    name: 'Field Hospital',
    description: 'Complete medical facility for emergency care',
    defaultModel: 'trecc.glb'
  },
  'disaster-relief': {
    name: 'Disaster Relief',
    description: 'Emergency shelter system for disaster response',
    defaultModel: 'trecc.glb'
  }
};

export default function ConfiguratorPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [shelterId, setShelterId] = useState<string>('');
  const [shelter, setShelter] = useState<any>(null);
  const [showInitialLoading, setShowInitialLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch with improved client-side detection
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
    
    if (params.shelterId) {
      const id = params.shelterId as string;
      setShelterId(id);
      setShelter(shelterData[id as keyof typeof shelterData]);
    }
  }, [params.shelterId]);

  // Show initial loading screen only once per session
  useEffect(() => {
    // Do not show an initial full-screen loading screen inside configurator
    setShowInitialLoading(false);
  }, [mounted, shelter]);

  // Enhanced hydration check with better fallback
  if (!isClient || !mounted) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Loading Configurator</h3>
          <p style={{ margin: '8px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>
            Initializing 3D environment...
          </p>
        </div>
      </div>
    );
  }

  if (!shelter) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Shelter Not Found</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.8 }}>
          The requested shelter configuration could not be found.
        </p>
        <Link href="/">
          <button style={{
            padding: '12px 24px',
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Back to Shelter Menu
          </button>
        </Link>
      </div>
    );
  }

  // Show initial loading screen
  // Do not render a full-screen loading screen in configurator

  return (
    <ErrorBoundary>
      <div style={{ position: 'relative' }}>
        {/* Header with Back Button */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <Link href="/">
            <button style={{
              padding: '10px 20px',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              ← Back to Menu
            </button>
          </Link>
          
          <div style={{
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {shelter.name}
          </div>
        </div>

        <ShelterConfigurator 
          shelterId={shelterId}
          defaultModel={shelter.defaultModel}
          shelterName={shelter.name}
        />
      </div>
    </ErrorBoundary>
  );
}
