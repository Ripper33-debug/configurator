'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShelterMenu() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center'
      }}>
        
        {/* Left Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: '100%',
            height: '600px',
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

        {/* Right Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '24px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: '1.1',
            fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
          }}>
            TRECC<br />Configurator
          </h1>
          
          <div style={{
            width: '120px',
            height: '3px',
            background: 'linear-gradient(90deg, #ffffff, transparent)',
            marginBottom: '32px'
          }} />
          
          <p style={{
            fontSize: '1.3rem',
            color: '#cccccc',
            lineHeight: '1.8',
            fontWeight: '300',
            marginBottom: '40px',
            letterSpacing: '0.02em'
          }}>
            Experience the next generation of deployable shelter systems. Built for extreme conditions, designed for rapid deployment, engineered for excellence.
          </p>

          {/* Specs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '48px'
          }}>
            {[
              { label: 'Deployment', value: '3 MIN' },
              { label: 'Capacity', value: '6 PPL' },
              { label: 'Temperature', value: '-30° to 50°' },
              { label: 'All Climates', value: '✓' }
            ].map((spec, i) => (
              <div key={i} style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '4px'
                }}>
                  {spec.value}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#999999',
                  fontWeight: '500',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  {spec.label}
                </div>
              </div>
            ))}
          </div>

          {/* Launch Button */}
          <Link href="/configurator/trecc" style={{ textDecoration: 'none' }}>
            <motion.button
              style={{
                width: '100%',
                padding: '24px 48px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: '3px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 16px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.6)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Launch Configurator
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
