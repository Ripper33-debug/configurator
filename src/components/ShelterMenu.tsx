'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShelterMenu() {
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom smooth scroll with slower duration
  useEffect(() => {
    if (!mounted || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      
      e.preventDefault();
      isScrolling = true;

      const delta = e.deltaY;
      const currentScroll = scrollContainer.scrollTop;
      const sectionHeight = 650;
      const currentSection = Math.round(currentScroll / sectionHeight);
      
      let targetSection = currentSection;
      if (delta > 0) {
        targetSection = Math.min(currentSection + 1, 2);
      } else {
        targetSection = Math.max(currentSection - 1, 0);
      }

      const targetScroll = targetSection * sectionHeight;

      // Ultra fast smooth scroll (100ms)
      const startScroll = currentScroll;
      const distance = targetScroll - startScroll;
      const duration = 100;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart for fast, smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        scrollContainer.scrollTop = startScroll + (distance * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          isScrolling = false;
        }
      };

      requestAnimationFrame(animateScroll);
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 40px 60px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: 'center',
          marginBottom: '60px',
          width: '100%'
        }}
      >
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: '100',
          color: '#ffffff',
          letterSpacing: '0.2em',
            textTransform: 'uppercase',
          lineHeight: '1',
          fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            marginBottom: '16px'
          }}>
          TRECC
        </h1>
        <div style={{
          fontSize: 'clamp(1rem, 2vw, 1.5rem)',
          fontWeight: '300',
          color: '#999999',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
        }}>
          CONFIGURATOR
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1600px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '60px',
        alignItems: 'center',
        transform: 'translate(-50px, -40px)'
      }}>
        
        {/* Left Side - Video */}
      <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        style={{
            width: '100%',
            height: '650px',
            position: 'relative'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            boxShadow: '0 25px 100px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            position: 'relative'
          }}>
            <video
              autoPlay
              loop
              muted
              playsInline
        style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src="/videos/rotating.mp4" type="video/mp4" />
            </video>
            
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
              pointerEvents: 'none'
            }} />
        </div>
      </motion.div>

        {/* Right Side - Scrolling Text Sections */}
        <div style={{ position: 'relative', height: '650px' }}>
          {/* Floating Scroll CTA */}
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
            display: 'flex',
              flexDirection: 'column',
            alignItems: 'center',
              gap: '8px',
              pointerEvents: 'none'
            }}
          >
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
              fontWeight: '300'
            }}>
              Scroll
            </span>
        <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
          style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              ↓
        </motion.div>
          </motion.div>

          <div 
            ref={scrollContainerRef}
        style={{
              height: '650px',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingRight: '20px'
            }}>
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
              @media (prefers-reduced-motion: no-preference) {
                * {
                  scroll-behavior: smooth;
                }
              }
            `}</style>

          {/* Section 1: Your TRECC Model */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              minHeight: '650px', 
              display: 'flex', 
              alignItems: 'center',
              scrollSnapAlign: 'start'
            }}
          >
            <div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '100',
                color: '#ffffff',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                lineHeight: '1.3',
                marginBottom: '24px'
              }}>
                Your TRECC<br />Model
              </h2>
              <div style={{
                width: '80px',
                height: '2px',
                background: 'linear-gradient(90deg, #ffffff, transparent)',
                marginBottom: '24px'
              }} />
              <p style={{
                fontSize: '1.1rem',
                color: '#999999',
                lineHeight: '1.8',
                fontWeight: '300',
                letterSpacing: '0.05em',
                fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
              }}>
                Experience the next generation of deployable shelter systems. Built for extreme conditions.
              </p>
              </div>
          </motion.div>

          {/* Section 2: Customize Colour */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ 
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{ 
              minHeight: '650px', 
              display: 'flex',
              alignItems: 'center',
              scrollSnapAlign: 'start'
            }}
          >
            <div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '100',
                  color: '#ffffff',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                lineHeight: '1.3',
                marginBottom: '24px'
              }}>
                Customize Colour<br />to Match Your<br />Deployment
              </h2>
                <div style={{
                width: '80px',
                height: '2px',
                background: 'linear-gradient(90deg, #ffffff, transparent)',
                marginBottom: '24px'
              }} />
              <p style={{
                fontSize: '1.1rem',
                color: '#999999',
                lineHeight: '1.8',
                fontWeight: '300',
                  letterSpacing: '0.05em',
                fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                marginBottom: '32px'
              }}>
                Choose from desert tan, olive green, or arctic white configurations.
              </p>
              
              {/* Color Circles */}
                <div style={{
                  display: 'flex',
                gap: '24px',
                marginTop: '32px'
              }}>
                {[
                  { name: 'Desert Tan', color: '#B8A082' },
                  { name: 'Olive Green', color: '#6B7C32' },
                  { name: 'Arctic White', color: '#F8F8F8' }
                ].map((colorOption, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ 
                      duration: 0.8,
                      delay: 0.3 + (i * 0.15),
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    whileHover={{ 
                      scale: 1.15,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: colorOption.color,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }} />
                    <span style={{
                  fontSize: '0.75rem',
                      color: '#666666',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                      fontWeight: '300'
                    }}>
                      {colorOption.name}
                    </span>
                  </motion.div>
                ))}
                </div>
              </div>
          </motion.div>

          {/* Section 3: View in 3D */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ 
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1]
            }}
                        style={{
              minHeight: '650px', 
              display: 'flex', 
              alignItems: 'center',
              scrollSnapAlign: 'start'
            }}
          >
            <div style={{ width: '100%' }}>
              <motion.h2
                animate={{
                  y: [0, -2, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '100',
                  color: '#ffffff',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                  lineHeight: '1.3',
                  marginBottom: '24px'
                }}
              >
                View Your Shelter<br />in 3D Deployed<br />Views
              </motion.h2>
                  <div style={{
                width: '80px',
                height: '2px',
                background: 'linear-gradient(90deg, #ffffff, transparent)',
                marginBottom: '24px'
              }} />
              <p style={{
                fontSize: '1.1rem',
                color: '#999999',
                lineHeight: '1.8',
                fontWeight: '300',
                letterSpacing: '0.05em',
                fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                marginBottom: '48px'
              }}>
                Rotate, zoom, and explore every detail from all angles.
              </p>
              
              {/* 3D Features */}
                  <div style={{
                    display: 'flex',
                gap: '32px',
                marginBottom: '48px',
                justifyContent: 'center'
              }}>
                {/* 3D Rotation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    transition: { duration: 0.8, ease: "easeInOut" }
                  }}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  {/* Curved arrows for rotation */}
                  <svg width="32" height="32" viewBox="0 0 32 32" style={{ opacity: 0.8 }}>
                    <path 
                      d="M16 4 L16 8 M16 4 C9 4 4 9 4 16 C4 23 9 28 16 28 C23 28 28 23 28 16 C28 9 23 4 16 4" 
                      stroke="white" 
                      strokeWidth="1.5" 
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path d="M13 4 L16 4 L16 7 Z" fill="white" />
                  </svg>
      </motion.div>

                {/* Zoom */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  {/* Magnifying glass */}
                  <svg width="28" height="28" viewBox="0 0 28 28" style={{ opacity: 0.8 }}>
                    <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="1.5" fill="none" />
                    <line x1="16" y1="16" x2="22" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="11" y1="8" x2="11" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8" y1="11" x2="14" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>

                {/* Movement */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 0 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: false }}
                  animate={{
                    x: [0, 3, 0, -3, 0]
                  }}
                  whileHover={{
                    scale: 1.1,
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    x: [0, 5, 0, -5, 0],
                    transition: { 
                      scale: { duration: 0.3 },
                      borderColor: { duration: 0.3 },
                      boxShadow: { duration: 0.3 },
                      x: { duration: 0.8, repeat: Infinity }
                    }
                  }}
                  transition={{
                    x: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    opacity: {
                      duration: 0.6,
                      delay: 0.2
                    },
                    scale: {
                      duration: 0.6,
                      delay: 0.2
                    }
                  }}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  {/* Four directional arrows */}
                  <svg width="32" height="32" viewBox="0 0 32 32" style={{ opacity: 0.8 }}>
                    <path d="M16 6 L16 12 M16 6 L13 9 M16 6 L19 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M16 26 L16 20 M16 26 L13 23 M16 26 L19 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6 16 L12 16 M6 16 L9 13 M6 16 L9 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M26 16 L20 16 M26 16 L23 13 M26 16 L23 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
            </div>

              {/* Launch Button */}
              <Link href="/configurator/trecc" style={{ textDecoration: 'none' }}>
      <motion.div
        style={{
                    width: '100%',
                    padding: '28px 48px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    fontWeight: '100',
                    color: '#ffffff',
                    letterSpacing: '0.2em',
            textTransform: 'uppercase',
                    fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            transition: 'all 0.3s ease',
                    textAlign: 'center',
                    marginTop: '24px'
                  }}
                  whileHover={{
                    borderBottomColor: 'rgba(255, 255, 255, 0.8)',
                    letterSpacing: '0.25em'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Launch Configurator
      </motion.div>
              </Link>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
