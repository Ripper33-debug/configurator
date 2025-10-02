'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '0 20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: 'clamp(6rem, 15vw, 12rem)',
            fontWeight: '700',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1'
          }}
        >
          404
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}
        >
          PAGE NOT FOUND
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontSize: '1.125rem',
            color: '#d1d5db',
            marginBottom: '48px',
            lineHeight: '1.6'
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '16px 32px',
                background: 'white',
                color: 'black',
                fontWeight: '500',
                fontSize: '16px',
                letterSpacing: '0.025em',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s ease'
              }}
            >
              GO HOME
            </motion.button>
          </Link>

          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '16px 32px',
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: '500',
                fontSize: '16px',
                letterSpacing: '0.025em',
                borderRadius: '8px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              CONTACT US
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            marginTop: '64px',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px'
          }}
        >
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}>
            POPULAR PAGES
          </h3>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { name: 'Solutions', href: '/solutions' },
              { name: 'Products', href: '/products' },
              { name: 'Case Studies', href: '/case-studies' },
              { name: 'About', href: '/about' }
            ].map((page, index) => (
              <Link key={page.name} href={page.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {page.name}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
