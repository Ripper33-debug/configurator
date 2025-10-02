'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { generateShelterPDF, generateComparisonPDF, ShelterSpecs } from '../lib/pdfExport';
import ContactForm from './ContactForm';

interface Shelter {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  features: string[];
  modelPath: string;
  specs?: string[];
  deploymentTime: number; // in hours
  weatherRating: number; // 1-5 scale
  capacity: number; // max personnel
  availability: 'available' | 'limited' | 'unavailable';
  deploymentDifficulty: 'easy' | 'moderate' | 'complex';
  useCases?: string[];
  technicalSpecs?: {
    dimensions: string;
    weight: string;
    materials: string;
    power: string;
    climate: string;
    certifications: string;
  };
}

const shelters: Shelter[] = [
  {
    id: 'trecc',
    name: 'TRECC',
    description: 'Advanced deployable shelter system with multiple configuration options for military, emergency response, and remote operations.',
    category: 'TRECC',
    image: '/models/trecc-preview.jpg',
    features: ['Multiple configurations', 'Rapid deployment', 'Modular design', 'Extreme weather protection', 'Military-grade construction'],
    modelPath: 'Tanstowedreduced.glb',
    specs: ['Deployment time: 3 minutes', 'Capacity: 4-6 personnel', 'Weather rating: Extreme', 'Configurations: Open/Closed/Interior'],
    deploymentTime: 0.05,
    weatherRating: 5,
    capacity: 6,
    availability: 'available',
    deploymentDifficulty: 'moderate',
    useCases: ['Military Operations', 'Emergency Response', 'Remote Research', 'Disaster Relief', 'Field Command Centers'],
    technicalSpecs: {
      dimensions: '20ft x 8ft x 8ft (closed)',
      weight: '2,500 lbs',
      materials: 'Aluminum frame, composite panels',
      power: 'Solar + generator compatible',
      climate: '-40°F to +120°F',
      certifications: 'MIL-STD-810G, NATO approved'
    }
  }
];

export default function ShelterMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({
    deploymentTime: 'all',
    capacity: 'all',
    weatherRating: 'all'
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactShelter, setContactShelter] = useState<string>('');

  // Helper to format deployment time (hours to h or minutes)
  const formatDuration = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    return `${hours}h`;
  };

  // Helper functions for visual indicators
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#00ff88';
      case 'limited': return '#ffaa00';
      case 'unavailable': return '#ff4444';
      default: return '#666';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available': return '●';
      case 'limited': return '●';
      case 'unavailable': return '●';
      default: return '●';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#00ff88';
      case 'moderate': return '#ffaa00';
      case 'complex': return '#ff4444';
      default: return '#666';
    }
  };

  const getWeatherIcon = (rating: number) => {
    if (rating >= 5) return '🌪️';
    if (rating >= 4) return '⛈️';
    if (rating >= 3) return '🌧️';
    if (rating >= 2) return '🌤️';
    return '☀️';
  };

  // Prevent hydration mismatch and preload models
  useEffect(() => {
    setMounted(true);
    
    // Temporarily disable preloading to fix black screen issue
    const preloadModels = async () => {
      console.log('🚀 Preloading disabled to fix model loading issues');
      // Preloading temporarily disabled due to interference with model loading
      // await preloadModel('Shelter_Stowed_DesertTan-v1.glb');
      // await preloadModel('Model_stowed_green-v1.glb');
    };
    
    preloadModels();
  }, []);

  const categories = ['all', ...Array.from(new Set(shelters.map(s => s.category)))];
  
  const filteredShelters = shelters.filter(shelter => {
    // Category filter only
    const categoryMatch = selectedCategory === 'all' || shelter.category === selectedCategory;
    
    return categoryMatch;
  });

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCategory(category);
      setIsTransitioning(false);
    }, 150);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setIsFiltering(true);
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setTimeout(() => {
      setIsFiltering(false);
    }, 200);
  };

  const handleExportPDF = (shelter: Shelter) => {
    const shelterSpecs: ShelterSpecs = {
      name: shelter.name,
      description: shelter.description,
      category: shelter.category,
      deploymentTime: shelter.deploymentTime,
      weatherRating: shelter.weatherRating,
      capacity: shelter.capacity,
      availability: shelter.availability,
      deploymentDifficulty: shelter.deploymentDifficulty,
      features: shelter.features,
      useCases: shelter.useCases,
      technicalSpecs: shelter.technicalSpecs
    };
    generateShelterPDF(shelterSpecs);
  };

  const handleExportComparisonPDF = () => {
    const shelterSpecs: ShelterSpecs[] = shelters.map(shelter => ({
      name: shelter.name,
      description: shelter.description,
      category: shelter.category,
      deploymentTime: shelter.deploymentTime,
      weatherRating: shelter.weatherRating,
      capacity: shelter.capacity,
      availability: shelter.availability,
      deploymentDifficulty: shelter.deploymentDifficulty,
      features: shelter.features,
      useCases: shelter.useCases,
      technicalSpecs: shelter.technicalSpecs
    }));
    generateComparisonPDF(shelterSpecs);
  };

  const handleContactSales = (shelterName?: string) => {
    setContactShelter(shelterName || '');
    setShowContactForm(true);
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      padding: '60px 24px',
      fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.02)'
    }}>
      
      

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'clamp(3.5rem, 7vw, 6rem)',
            fontWeight: '200',
            color: '#ffffff',
          marginBottom: '30px',
            letterSpacing: '0.25em',
            lineHeight: '1.0',
            position: 'relative',
            fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            textTransform: 'uppercase'
        }}>
          Configure TRECC
        </h1>
        
        {/* Sexy Divider Line */}
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
        </div>
      </motion.div>

      {/* Category Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '60px',
          padding: '0 20px'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory('all')}
          style={{
            background: selectedCategory === 'all' 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
            border: selectedCategory === 'all'
              ? '2px solid rgba(255, 255, 255, 0.4)'
              : '2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '16px 32px',
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
            boxShadow: selectedCategory === 'all'
              ? '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          All
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory('TRECC')}
          style={{
            background: selectedCategory === 'TRECC' 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
            border: selectedCategory === 'TRECC'
              ? '2px solid rgba(255, 255, 255, 0.4)'
              : '2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '16px 32px',
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
            boxShadow: selectedCategory === 'TRECC'
              ? '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          TRECC
        </motion.button>
      </motion.div>

      {/* Shelter Grid */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isTransitioning ? 0.3 : 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {filteredShelters.map((shelter, index) => (
          <motion.div
            key={shelter.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              width: '100%',
              maxWidth: '1000px',
              alignItems: 'center'
            }}
          >

            {/* SEXY Adam-Style Clickable Text */}
            <Link href={`/configurator/${shelter.id}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'inline-block',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}
              >
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: '100',
                  color: '#ffffff',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #ffffff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  padding: '32px 64px',
                  border: '3px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden'
                }}>
                  Launch Configurator
                  {/* Enhanced inner glow */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)'
                  }}></div>
                  {/* Bottom accent */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                  }}></div>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }}></div>
              </motion.div>
            </Link>

            {/* Large Video Section - SEXY */}
            <motion.div 
              whileHover={{ scale: 1.03, y: -12 }}
              style={{
                width: '100vw',
                maxWidth: 'none',
                height: '700px',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)'
              }}
            >
              <video 
                src="/videos/rotating.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onLoad={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement;
                  if (fallback) {
                    fallback.innerHTML = `
                      <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                        border-radius: 24px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                      ">
                        <div style="font-size: 4rem; color: #fff; margin-bottom: 16px;">🏠</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: #ffffff; text-align: center;">TRECC</div>
                      </div>
                    `;
                  }
                }}
              />
            </motion.div>

            {/* What You Can Configure Section */}
            <div style={{
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '60px 20px'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '60px'
              }}>
                <h2 style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '20px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  What You Can Configure
                </h2>
                <p style={{
                  fontSize: '1.2rem',
                  color: '#cccccc',
                  fontWeight: '300',
                  letterSpacing: '0.05em'
                }}>
                  Explore all the customization options available in our 3D configurator.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
              }}>
                {/* COLOR Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '32px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: '#ffffff',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    COLOR
                  </h3>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '16px',
                    letterSpacing: '0.05em'
                  }}>
                    Color Options
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: '#cccccc',
                    lineHeight: '1.6',
                    fontWeight: '300'
                  }}>
                    Choose from military-grade color schemes including desert tan, olive drab, and arctic white.
                  </p>
                </motion.div>

                {/* VIEW Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '32px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: '#ffffff',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    VIEW
                  </h3>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '16px',
                    letterSpacing: '0.05em'
                  }}>
                    View Modes
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: '#cccccc',
                    lineHeight: '1.6',
                    fontWeight: '300'
                  }}>
                    Switch between closed, open, and interior views to see all configurations.
                  </p>
                </motion.div>

                {/* 3D Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '32px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: '#ffffff',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    3D
                  </h3>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '16px',
                    letterSpacing: '0.05em'
                  }}>
                    3D Interaction
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: '#cccccc',
                    lineHeight: '1.6',
                    fontWeight: '300'
                  }}>
                    Rotate, zoom, and explore your shelter from every angle in real-time.
                  </p>
                </motion.div>

                {/* SPECS Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '32px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: '#ffffff',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    SPECS
                  </h3>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '16px',
                    letterSpacing: '0.05em'
                  }}>
                    Technical Specs
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: '#cccccc',
                    lineHeight: '1.6',
                    fontWeight: '300'
                  }}>
                    View detailed specifications including dimensions, capacity, and deployment time.
                  </p>
                </motion.div>
              </div>
            </div>


          </motion.div>
        ))}
      </motion.div>

      {/* Comparison Modal */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowComparison(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '1000px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowComparison(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              ×
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                color: '#1e3a8a',
                margin: 0
              }}>
                TRECC vs HERCONN Comparison
              </h2>
              <button
                onClick={handleExportComparisonPDF}
                style={{
                  padding: '8px 16px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#218838'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#28a745'}
              >
                Export PDF
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {shelters.map((shelter) => (
                <div key={shelter.id} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    color: '#1e3a8a',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    {shelter.name}
                  </h3>

                  {/* Key Specs */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>Key Specifications</h4>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                      <div><strong>Deployment Time:</strong> {formatDuration(shelter.deploymentTime)}</div>
                      <div><strong>Capacity:</strong> {shelter.capacity} personnel</div>
                      <div><strong>Weather Rating:</strong> {'★'.repeat(shelter.weatherRating)}</div>
                      <div><strong>Difficulty:</strong> {shelter.deploymentDifficulty}</div>
                    </div>
                  </div>

                  {/* Technical Specs */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>Technical Details</h4>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                      <div><strong>Dimensions:</strong> {shelter.technicalSpecs?.dimensions}</div>
                      <div><strong>Weight:</strong> {shelter.technicalSpecs?.weight}</div>
                      <div><strong>Materials:</strong> {shelter.technicalSpecs?.materials}</div>
                      <div><strong>Power:</strong> {shelter.technicalSpecs?.power}</div>
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>Use Cases</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {shelter.useCases?.map((useCase, index) => (
                        <span key={index} style={{
                          background: '#e9ecef',
                          color: '#495057',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '0.8rem'
                        }}>
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Contact Form */}
      <ContactForm
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        shelterName={contactShelter}
      />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{
          textAlign: 'center',
          marginTop: '80px',
          padding: '40px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <p style={{
          color: '#ffffff',
          fontSize: '0.9rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          Weatherhaven - Global Leader in Deployable Shelter Solutions
        </p>
        
        {/* Powered by Nexraft */}
        <a 
          href="https://nexraft.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '8px 12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500',
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
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
      </motion.div>

      {/* Sexy Specifications Section - Bottom of Page */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '80px auto 0 auto',
        padding: '60px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '20px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            TRECC Specifications
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#cccccc',
            fontWeight: '300',
            letterSpacing: '0.05em'
          }}>
            Advanced deployable shelter system with military-grade specifications.
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {/* Capacity Spec */}
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '200px',
              flex: '1'
            }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              6
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Capacity
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#cccccc',
              lineHeight: '1.6',
              fontWeight: '300',
              textAlign: 'center'
            }}>
              Maximum personnel capacity
            </p>
          </motion.div>

          {/* Deployment Time Spec */}
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '200px',
              flex: '1'
            }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              3
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Minutes
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#cccccc',
              lineHeight: '1.6',
              fontWeight: '300',
              textAlign: 'center'
            }}>
              Rapid deployment time
            </p>
          </motion.div>

          {/* Temperature Range Spec */}
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '200px',
              flex: '1'
            }}
          >
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              -30°C to +50°C
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Temperature
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#cccccc',
              lineHeight: '1.6',
              fontWeight: '300',
              textAlign: 'center'
            }}>
              Operating temperature range
            </p>
          </motion.div>

          {/* All Climates Spec */}
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '200px',
              flex: '1'
            }}
          >
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              ALL
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Climates
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#cccccc',
              lineHeight: '1.6',
              fontWeight: '300',
              textAlign: 'center'
            }}>
              Extreme weather protection
            </p>
          </motion.div>
        </div>

        {/* Cool Feature Showcase Section */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '80px auto 0 auto',
          padding: '60px 20px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '20px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Why Choose TRECC?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#cccccc',
              fontWeight: '300',
              letterSpacing: '0.05em'
            }}>
              Cutting-edge technology meets military-grade reliability.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Military Grade Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -12 }}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.7) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '40px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                fontSize: '4rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}></div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textAlign: 'center'
              }}>
                Military Grade
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#cccccc',
                lineHeight: '1.6',
                fontWeight: '300',
                textAlign: 'center'
              }}>
                Built to NATO standards with extreme weather protection and battlefield-tested durability.
              </p>
            </motion.div>

            {/* Rapid Deployment Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -12 }}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.7) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '40px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                fontSize: '4rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}></div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textAlign: 'center'
              }}>
                Rapid Deployment
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#cccccc',
                lineHeight: '1.6',
                fontWeight: '300',
                textAlign: 'center'
              }}>
                Set up in just 3 minutes with minimal personnel. Perfect for emergency response and quick operations.
              </p>
            </motion.div>

            {/* Modular Design Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -12 }}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.7) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '40px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                fontSize: '4rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}></div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textAlign: 'center'
              }}>
                Modular Design
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#cccccc',
                lineHeight: '1.6',
                fontWeight: '300',
                textAlign: 'center'
              }}>
                Multiple configurations for different missions. Adapt to any environment with our flexible system.
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '60px 40px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 64px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '20px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Ready to Configure?
            </h3>
            <p style={{
              fontSize: '1.3rem',
              color: '#cccccc',
              fontWeight: '300',
              letterSpacing: '0.05em',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px auto'
            }}>
              Experience the future of deployable shelter technology with our interactive 3D configurator.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                fontSize: '1.1rem',
                color: '#ffffff',
                fontWeight: '600',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                ✓ Real-time 3D Preview
              </div>
              <div style={{
                fontSize: '1.1rem',
                color: '#ffffff',
                fontWeight: '600',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                ✓ Instant Pricing
              </div>
              <div style={{
                fontSize: '1.1rem',
                color: '#ffffff',
                fontWeight: '600',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                ✓ Export Configurations
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
