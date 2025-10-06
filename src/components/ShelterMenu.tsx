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
        alignItems: 'center'
      }}>
        
        {/* Left Side - Video */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: '100%',
            height: '700px',
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
        <div style={{
          height: '700px',
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
          `}</style>

          {/* Section 1: Your TRECC Model */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 0.8 }}
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 0.8 }}
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
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
                fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
              }}>
                Choose from desert tan, olive green, or arctic white configurations.
              </p>
            </div>
          </motion.div>

          {/* Section 3: View in 3D */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 0.8 }}
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
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
                View Your Shelter<br />in 3D Deployed<br />Views
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
                Rotate, zoom, and explore every detail from all angles.
              </p>
            </div>
          </motion.div>

          {/* Section 4: Configure TRECC */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 0.8 }}
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div style={{ width: '100%' }}>
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
                Configure<br />TRECC
              </h2>
              <div style={{
                width: '80px',
                height: '2px',
                background: 'linear-gradient(90deg, #ffffff, transparent)',
                marginBottom: '48px'
              }} />
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
                    textAlign: 'center'
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
  );
}
