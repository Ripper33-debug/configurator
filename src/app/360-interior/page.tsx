'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Interior360Page() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      color: '#ffffff',
      fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
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
        <Link href="/configurator/trecc">
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
            ← Back to Configurator
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            fontSize: 'clamp(3.5rem, 7vw, 6rem)',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '20px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
          }}
        >
          360 INTERIOR
        </motion.h1>

        {/* Divider Line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{
            width: '300px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
            margin: '0 auto 40px auto',
            borderRadius: '1px'
          }}
        />

        {/* Large Image Module */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -8 }}
          style={{
            width: '100%',
            maxWidth: '1200px',
            height: '600px',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
            borderRadius: '24px',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Placeholder for 360 Image */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              fontSize: '4rem',
              opacity: 0.6
            }}>
              🏠
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '300',
              color: '#cccccc',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              360° Interior View
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#999999',
              fontWeight: '300'
            }}>
              Interactive 360° experience coming soon
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            maxWidth: '800px',
            marginTop: '40px'
          }}
        >
          <p style={{
            fontSize: '1.2rem',
            color: '#cccccc',
            fontWeight: '300',
            letterSpacing: '0.05em',
            lineHeight: '1.6'
          }}>
            Experience the TRECC shelter from the inside with our immersive 360° interior view. 
            Navigate through the space and explore every detail of the deployable shelter system.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
