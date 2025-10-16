import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// ModelViewerScene now lazy loaded
import ErrorBoundary from './ErrorBoundary';
import { preloadModel, getAvailableModels, testAWSConnection } from '../lib/aws';
// THREE.js will be loaded dynamically when needed
import { ConfigState, ColorOption } from '../types';
import { buildShareUrl, encodeConfigToQuery, saveShortCode, resolveShortCode } from '../lib/share';
import { estimatePrice } from '../lib/pricing';

// Aggressively lazy load all heavy components to reduce TBT
const ContactForm = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>(resolve => {
    // Delay loading to reduce TBT
    setTimeout(() => {
      import('./ContactForm').then(module => {
        resolve({ default: module.default });
      });
    }, 100);
  })
);

// Lazy load the 3D model viewer with delay to reduce TBT
const ModelViewerScene = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>(resolve => {
    // Delay heavy 3D library loading
    setTimeout(() => {
      import('./ModelViewer').then(module => {
        resolve({ default: module.ModelViewerScene });
      });
    }, 200);
  })
);

// Lazy load React Three Fiber Canvas to reduce initial blocking
const Canvas = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>(resolve => {
    setTimeout(() => {
      import('@react-three/fiber').then(module => {
        resolve({ default: module.Canvas });
      });
    }, 150);
  })
);

interface ShelterConfiguratorProps {
  shelterId?: string;
  defaultModel?: string;
  shelterName?: string;
}

const ShelterConfigurator: React.FC<ShelterConfiguratorProps> = ({ 
  shelterId = 'trecc', 
  defaultModel = 'trecc.glb',
  shelterName = 'TRECC Shelter'
}) => {
  // Removed development console logs for better performance

  const colorOptions: ColorOption[] = useMemo(() => [
    { name: 'CARC Tan (Desert)', value: '#B8A082' },
    { name: 'Green', value: '#6B7C32' },
    { name: 'Arctic White', value: '#F8F8F8' }
  ], []);

  const [configState, setConfigState] = useState<ConfigState>({
    color: '#B8A082', // Default to CARC Tan (Desert) - faster loading
    isDeployed: false,
    isInteriorView: false,
    isInsideView: false,
    showConstructionWorker: false,
    showForestView: false,
    environmentView: 'none', // 'none', 'forest', 'sand', 'arctic'
  });

  // Loading states
  const [isApplyingColor, setIsApplyingColor] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true); // Start as true since model needs to load
  const [isModelReady, setIsModelReady] = useState(false); // Track when model is fully loaded
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  // Simplified initialization - no heavy work on mount to reduce TBT
  useEffect(() => {
    // Just set basic state - no heavy AWS calls
    setIsModelLoading(true);
    setIsModelReady(false);
    
    // Load models list synchronously from static data
    setAvailableModels([]); // Empty for now to reduce TBT
    
    // Skip all heavy initialization that was causing TBT
    console.log('🚀 Configurator initialized with minimal TBT impact');
  }, []);

  // Video walkthrough state
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string>('');
  
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [prefillMsg, setPrefillMsg] = useState<string>('');
  const [shortCode, setShortCode] = useState<string>('');

  const getWalkthroughVideo = () => {
    if (shelterId === 'trecc') {
      if (configState.isInteriorView) {
        return '/videos/trecc-interior-walkthrough.mp4';
      } else if (configState.isDeployed) {
        return '/videos/trecc-open-walkthrough.mp4';
      } else {
        return '/videos/trecc-closed-walkthrough.mp4';
      }
    } else if (shelterId === 'herconn') {
      return '/videos/herconn-walkthrough.mp4';
    } else if (shelterId === 'command-posting') {
      return '/videos/command-posting-walkthrough.mp4';
    }
    return '';
  };

  const handleColorChange = (newColor: string) => {
    console.log('🎨 Color change requested:', newColor);
    console.log('🎨 Current configState:', configState);
    setIsModelLoading(true); // Show loading while switching models
    setIsModelReady(false); // Model needs to reload
    setConfigState(prev => {
      const newState = { ...prev, color: newColor };
      console.log('🎨 New state:', newState);
      return newState;
    });
  };

  const handleDeployToggle = () => {
    console.log('🔄 DEPLOY TOGGLE CLICKED!');
    console.log('🎨 Current state before toggle:', { 
      color: configState.color, 
      isDeployed: configState.isDeployed 
    });
    
    setIsModelLoading(true); // Show loading while switching models
    setIsModelReady(false); // Model needs to reload
    setConfigState(prev => {
      const newState = { ...prev, isDeployed: !prev.isDeployed };
      console.log('🎨 New state after toggle:', newState);
      return newState;
    });
  };

  const handleInteriorViewToggle = () => {
    setIsModelLoading(true); // Show loading while switching models
    setIsModelReady(false); // Model needs to reload
    setConfigState(prev => ({ ...prev, isInteriorView: !prev.isInteriorView }));
  };


  const handleWalkthroughVideo = () => {
    const videoPath = getWalkthroughVideo();
    if (videoPath) {
      setCurrentVideo(videoPath);
      setShowVideo(true);
    } else {
      // Show error message for missing videos
      alert('Video walkthrough is not available for this configuration.');
    }
  };


  // Update video when configuration changes
  React.useEffect(() => {
    if (showVideo) {
      const videoPath = getWalkthroughVideo();
      if (videoPath && videoPath !== currentVideo) {
        setCurrentVideo(videoPath);
      }
    }
  }, [configState.isDeployed, configState.isInteriorView, shelterId]);

  const getModelPath = useCallback(() => {
    // Always use AWS CloudFront models - no local paths
    if (shelterId === 'command-posting') {
      return "CommandPosting.glb"; // AWS path
    } else {
      // Check if environment view is enabled (highest priority)
      if (configState.environmentView === 'forest') {
        return "Forest and shelter.glb"; // Use forest and shelter model
      } else if (configState.environmentView === 'sand') {
        // Use desert tan model with sand environment
        return "Tanmodelopen.glb";
      } else if (configState.environmentView === 'arctic') {
        // Use arctic white model with arctic environment
        return "ArcticWhiteOpenModel.glb";
      }
      
      // Check if interior view is enabled (priority over open/closed)
      if (configState.isInteriorView) {
        return "Green_Open_Interior_command_post-v1.glb"; // Use actual interior model
      }
      
      // Check if deployed view is enabled
      if (configState.isDeployed) {
        // Use specific deployed models based on color
        if (configState.color === '#B8A082') {
          return "Tanmodelopen.glb"; // Desert Tan open model
        } else if (configState.color === '#6B7C32') {
          return "Greenmodelopen.glb"; // Green open model
        } else if (configState.color === '#F8F8F8') {
          return "ArcticWhiteOpenModel.glb"; // Arctic White open model
        }
      }
      
      // Use pre-colored models based on selected color for stowed view
      const colorModelMap: Record<string, string> = {
        '#6B7C32': 'Greenstowedreduced.glb',      // Military Green
        '#B8A082': 'Tanstowedreduced.glb', // Desert Tan
        '#F8F8F8': 'Arcticwhitereducedstowed.glb'  // Arctic White
      };
      
      return colorModelMap[configState.color] || 'Tanstowedreduced.glb'; // fallback to Desert Tan
    }
  }, [shelterId, configState.isInteriorView, configState.isDeployed, configState.color, configState.environmentView]);

  // Colors are now applied dynamically to the loaded model

  if (process.env.NODE_ENV === 'development') {
  console.log('🎯 Current state:', configState);
  console.log('📁 Model path:', getModelPath());
  console.log('📷 Camera position:', [5, 3, 5]);
  console.log('🏠 Interior view active:', configState.isInteriorView);
  console.log('🔍 Model path details:', {
    isInteriorView: configState.isInteriorView,
    isDeployed: configState.isDeployed,
    color: configState.color,
    selectedModel: getModelPath()
  });
  console.log('📷 Camera details:', {
    isInteriorView: configState.isInteriorView,
    cameraPosition: [5, 3, 5],
    cameraFOV: 50
  });
  }

  // Apply config from URL or short code on mount
  useEffect(() => {
    try {
      const query = typeof window !== 'undefined' ? window.location.search : '';
      const params = new URLSearchParams(query);
      const code = params.get('c');
      if (code) {
        const cfg = resolveShortCode(code);
        if (cfg) {
          setConfigState(prev => ({
            ...prev,
            color: cfg.color ?? prev.color,
            isDeployed: !!cfg.isDeployed,
            isInteriorView: !!cfg.isInteriorView,
            isInsideView: !!cfg.isInsideView
          }));
        }
      } else {
        const color = params.get('color');
        if (color) {
          setConfigState(prev => ({
            ...prev,
            color,
            isDeployed: params.get('d') === '1',
            isInteriorView: params.get('i') === '1',
            isInsideView: params.get('in') === '1'
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleShareUrl = () => {
    const cfg = {
      color: configState.color,
      isDeployed: configState.isDeployed,
      isInteriorView: configState.isInteriorView,
      isInsideView: configState.isInsideView
    };
    const url = buildShareUrl(window.location.href.split('?')[0], cfg);
    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard.'));
  };

  const handleCreateShortCode = () => {
    const cfg = {
      color: configState.color,
      isDeployed: configState.isDeployed,
      isInteriorView: configState.isInteriorView,
      isInsideView: configState.isInsideView
    };
    const code = saveShortCode(cfg);
    setShortCode(code);
    const base = window.location.href.split('?')[0];
    const url = `${base}?c=${code}`;
    navigator.clipboard.writeText(url).then(() => alert(`Short link copied: ${url}`));
  };

  const handleRequestQuote = () => {
    const estimate = estimatePrice({
      shelterId: shelterId,
      isDeployed: configState.isDeployed,
      isInteriorView: configState.isInteriorView,
      color: configState.color
    });
    const params = encodeURIComponent(encodeConfigToQuery({
      color: configState.color,
      isDeployed: configState.isDeployed,
      isInteriorView: configState.isInteriorView,
      isInsideView: configState.isInsideView
    }));
    const msg = `Requesting quote for ${shelterName}\n\n` +
      `Configuration: ${decodeURIComponent(params)}\n` +
      `Estimate: $${estimate.total.toLocaleString()} (base $${estimate.base.toLocaleString()} + options ${estimate.options.map(o=>o.label+': $'+o.amount.toLocaleString()).join(', ') || 'none'})\n` +
      `${estimate.note}`;
    setPrefillMsg(msg);
    setShowContactForm(true);
  };

  return (
    <div className="configurator-container" style={{
      height: '100vh',
      width: '100vw',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Main Layout */}
      <div className="configurator-main" style={{
        flex: 1,
        display: 'flex',
        height: '100%',
        position: 'relative'
      }}>
        {/* Left Side - Lighting Controls (Visible by default) */}
        <div className="left-controls" style={{
          width: '360px',
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '2px solid rgba(255, 255, 255, 0.15)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflowY: 'auto',
          zIndex: 10,
          position: 'absolute',
          left: '0px',
          top: 0,
          height: '100%',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px'
        }}>
          {/* Simple Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
            position: 'relative',
            padding: '0'
          }}>
            {/* Back Button - Positioned absolutely at top left */}
            <Link href="/" style={{ textDecoration: 'none', position: 'absolute', top: '-8px', left: '0' }}>
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{
                  opacity: 0.6
                }}
                whileTap={{ scale: 0.9 }}
              >
                <span style={{
                  fontSize: '1.4rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '100'
                }}>←</span>
              </motion.div>
            </Link>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '100',
              color: '#ffffff',
              margin: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
              textShadow: 'none'
            }}>
              TRECC
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#cccccc',
              margin: '8px 0 0 0',
              fontWeight: '300',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              SHELTER CONFIGURATOR
            </p>
          </div>




          {/* View Options */}
          <div style={{ marginBottom: '32px' }}>
            
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
                  <button
                    onClick={handleDeployToggle}
                    style={{
                      background: 'transparent',
                color: '#ffffff',
                      border: 'none',
                borderRadius: '8px',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: '300',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                boxShadow: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                      position: 'relative',
                      overflow: 'hidden',
                      textDecoration: configState.isDeployed ? 'underline' : 'none',
                      textDecorationColor: 'rgba(255, 255, 255, 0.8)',
                      textDecorationThickness: '2px',
                      textUnderlineOffset: '4px'
                    }}
                  >
              {configState.isDeployed ? 'STOWED' : 'DEPLOYED'}
                  </button>


                  <button
                    onClick={() => {
                      setIsModelLoading(true); // Show loading while switching models
                      setIsModelReady(false); // Model needs to reload
                      setConfigState(prev => ({ ...prev, showConstructionWorker: !prev.showConstructionWorker }));
                    }}
                    style={{
                      background: 'transparent',
                color: '#ffffff',
                      border: 'none',
                borderRadius: '8px',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: '300',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                boxShadow: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                      position: 'relative',
                      overflow: 'hidden',
                      textDecoration: configState.showConstructionWorker ? 'underline' : 'none',
                      textDecorationColor: 'rgba(255, 255, 255, 0.8)',
                      textDecorationThickness: '2px',
                      textUnderlineOffset: '4px'
                    }}
                  >
              SCALE
                  </button>

                  {/* Environment Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <select
                      value={configState.environmentView}
                      onChange={(e) => {
                        setIsModelLoading(true); // Show loading while switching models
                        setIsModelReady(false); // Model needs to reload
                        setConfigState(prev => ({ 
                          ...prev, 
                          environmentView: e.target.value as 'none' | 'forest' | 'sand' | 'arctic',
                          showForestView: e.target.value === 'forest' // Keep for backward compatibility
                        }));
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '16px 24px',
                        fontSize: '1rem',
                        fontWeight: '300',
                        color: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                        position: 'relative',
                        overflow: 'hidden',
                        width: '100%',
                        outline: 'none',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        backgroundSize: '16px',
                        paddingRight: '32px',
                        textAlign: 'center',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      } as React.CSSProperties}
                    >
                      <option value="none" style={{ background: 'rgba(20, 20, 20, 0.98)', color: 'white', padding: '12px' }}>ENVIRONMENT</option>
                    </select>
                  </div>

                  <Link href="/360-interior" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        background: 'transparent',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '16px 24px',
                        fontSize: '1rem',
                        fontWeight: '300',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                        position: 'relative',
                        overflow: 'hidden',
                        width: '100%'
                      }}
                    >
                      360 INTERIOR
                    </button>
                  </Link>
                </div>
                </div>

          {/* Color Options */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 20px 0',
              textAlign: 'left',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
              position: 'relative',
              paddingLeft: '12px'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '20px',
                background: 'linear-gradient(135deg, #ffffff, #cccccc)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
              }}></span>
              Color Options
            </h3>
            
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                onClick={() => {
                  console.log('🔴 BUTTON CLICKED!', option.name, option.value);
                  handleColorChange(option.value);
                }}
                  style={{
                    background: configState.color === option.value 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                  color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                  padding: '16px 24px',
                  fontSize: '1rem',
                  fontWeight: '300',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  position: 'relative',
                  overflow: 'hidden',
                  pointerEvents: 'auto',
                  zIndex: 10,
                  fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
                  }}
                >
                  <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                  <span>{option.name}</span>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: option.value,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }} />
            </div>
                </button>
              ))}
            </div>
          </div>

          {/* Specifications */}
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '300',
              color: 'white',
              margin: '0 0 20px 0',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
            }}>
            SPECIFICATIONS
            </h3>
            
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '300', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Dimensions (deployed):</span>
              <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '400', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>20' × 8' × 8'</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '300', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Weight:</span>
              <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '400', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>2,000 lbs</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '300', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Capacity:</span>
              <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '400', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>6</span>
              </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '300', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Deployment:</span>
              <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '400', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>3 mins</span>
              </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '300', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Power:</span>
              <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '400', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Solar + Generator</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '300', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Temperature:</span>
              <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '400', letterSpacing: '0.05em', fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>-51°C to 49°C</span>
            </div>
          </div>

          {/* Reset Button */}
              <button
            onClick={() => {
              setConfigState({
                color: '#B8A082', // Default to CARC Tan (Desert) - faster loading
                isDeployed: false,
                isInteriorView: false,
                isInsideView: false,
                showConstructionWorker: false,
                showForestView: false,
                environmentView: 'none',
              });
            }}
                style={{
              background: 'rgba(107, 114, 128, 0.9)',
              color: '#e2e8f0',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'rgba(107, 114, 128, 1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.9)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
            Reset Configuration
              </button>

          {/* Contact Sales Button */}
              <button
            onClick={handleRequestQuote}
                style={{
              background: 'rgba(30, 64, 175, 0.9)',
              color: '#e2e8f0',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'rgba(30, 64, 175, 1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(30, 64, 175, 0.9)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
          >
            REQUEST QUOTE WITH CONFIG
          </button>

          {/* Share Row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleShareUrl}
              style={{
                flex: 1,
                background: 'rgba(75, 85, 99, 0.9)',
                color: '#e2e8f0',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(75, 85, 99, 1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(75, 85, 99, 0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
              }}
            >
              COPY SHARE URL
            </button>
            <button
              onClick={handleCreateShortCode}
              style={{
                flex: 1,
                background: 'rgba(71, 85, 105, 0.9)',
                color: '#e2e8f0',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(71, 85, 105, 1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(71, 85, 105, 0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
              }}
            >
              CREATE SHORT CODE
              </button>
            </div>
          </div>


        {/* 3D Viewer Section */}
        <div className="viewer-section" style={{
          flex: 1,
          position: 'relative',
          height: '100%',
          background: 'transparent'
        }}>
          {/* 3D Model Loading Overlay - Optimized for LCP */}
          {isModelLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              color: 'white',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              willChange: 'opacity', // Optimize for animations
              transform: 'translateZ(0)' // GPU acceleration
            }}>
              {/* Optimized Loading Spinner */}
              <div style={{
                width: '48px',
                height: '48px',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginBottom: '20px',
                willChange: 'transform'
              }} />
              
              {/* Streamlined Loading Text */}
              <div style={{
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  margin: '0 0 6px 0',
                  letterSpacing: '0.3px'
                }}>
                  Loading 3D Model
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  margin: '0',
                  fontWeight: '400'
                }}>
                  Preparing configuration...
                </p>
              </div>
              
              {/* Simplified Progress Dots */}
              <div style={{ 
                display: 'flex', 
                gap: '6px',
                alignItems: 'center'
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      animation: `pulse 1.2s ease-in-out infinite ${i * 0.15}s`,
                      willChange: 'opacity, transform'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <ErrorBoundary>
          <Suspense fallback={
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 12px'
                }} />
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Loading 3D Engine...</div>
              </div>
            </div>
          }>
            <Canvas
              camera={{ 
                position: [5, 3, 5], 
                fov: 50 
              }}
              shadows={false}
              gl={{
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false
              }}
              dpr={[1, 1.5]}
              performance={{ min: 0.8 }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <ModelViewerScene
              modelPath={getModelPath()}
              color={null} // No dynamic coloring - using pre-colored models
              isDeployed={configState.isDeployed}
              isInteriorView={configState.isInteriorView}
              showConstructionWorker={configState.showConstructionWorker}
              showForestView={configState.environmentView === 'forest'}
              environmentView={configState.environmentView}
              environment="studio"
              weather="none"
                lighting={{
                  ambientIntensity: 0.3,
                  directionalIntensity: 1.2,
                  sunPosition: { x: 5, y: 8, z: 5 }
                }}
                background3D={{}}
                onModelReady={() => {
                  console.log('🎨 Model ready callback triggered');
                  setIsModelLoading(false);
                  setIsModelReady(true);
                }}
                onColorApplied={() => {
                  console.log('🎨 Color applied callback triggered');
                  setIsApplyingColor(false);
                }}
                />
              </Suspense>
            </Canvas>
          </Suspense>
          </ErrorBoundary>

          {/* Onboarding Cue - Top Center */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '8px 16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            letterSpacing: '0.2px',
            zIndex: 100,
            transition: 'all 0.3s ease',
            opacity: 0.8,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
          }}
          >
            Drag to rotate • Scroll to zoom • Right-drag to pan
          </div>

          {/* Powered By Badge - Bottom Right */}
          <a 
            href="https://nexraft.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              zIndex: 100,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textDecoration: 'none',
              textDecorationColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ opacity: 0.6 }}>Powered by</span>
            <span style={{ 
              color: '#60a5fa', 
              fontWeight: '700',
              fontFamily: '"Space Grotesk", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.5px',
              opacity: 1 
            }}>
              Nexraft
            </span>
          </a>
        </div>
      </div>


      {/* Walkthrough Video Modal */}
      {showVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxWidth: '1200px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ×
            </button>

            {/* Video Title */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {configState.isInteriorView ? 'Interior Walkthrough' : 
               configState.isDeployed ? 'Open Configuration Walkthrough' : 
               'Closed Configuration Walkthrough'}
            </div>

            {/* Video Player */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '0',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              background: '#000',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
            <video
              controls
              style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                width: '100%',
                height: '100%',
                  objectFit: 'cover'
              }}
                poster="/videos/trecc-poster.jpg"
                onError={(e) => {
                  console.error('Video failed to load:', currentVideo);
                  alert('Sorry, this video is currently unavailable.');
                  setShowVideo(false);
                }}
            >
                <source src={currentVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form */}
      <Suspense fallback={<div>Loading...</div>}>
        <ContactForm
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          shelterName={shelterName}
          prefillMessage={prefillMsg}
        />
      </Suspense>
    </div>
  );
};

export default ShelterConfigurator;
