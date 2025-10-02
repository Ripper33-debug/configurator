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
      background: '#0a0a0a',
      padding: '60px 24px',
      fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      
      {/* Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '20px'
        }}
      >
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <Link href="/" style={{ 
            color: '#f97316', 
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#f97316'}
          >
            Home
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>›</span>
          <span style={{ color: 'rgba(255, 255, 255, 1)', fontWeight: '800' }}>Shelter Configurator</span>
        </nav>
      </motion.div>

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
          <div style={{
            fontSize: '14px',
            fontWeight: '900',
            color: '#ffffff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Weatherhaven
          </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            color: '#ffffff',
          marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            letterSpacing: '-0.01em',
            lineHeight: '1.2'
        }}>
          Weatherhaven Configurator
        </h1>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '50px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => handleCategoryChange(category)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '14px 28px',
              background: selectedCategory === category 
                ? '#1a1a1a' 
                : 'rgba(0, 0, 0, 0.8)',
              border: selectedCategory === category 
                ? '2px solid #ffffff' 
                : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textTransform: 'capitalize',
              backdropFilter: 'blur(20px)',
              boxShadow: selectedCategory === category 
                ? '0 8px 25px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                : '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              fontSize: '15px',
              letterSpacing: '0.025em'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>
              {category}
            </span>
          </motion.button>
        ))}
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
          maxWidth: '1800px',
          margin: '0 auto',
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
            whileHover={{ y: -12, scale: 1.03 }}
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              transformStyle: 'preserve-3d',
              width: '600px',
              minHeight: '400px'
            }}
          >

            {/* Minimal Status Indicator */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 2
            }}>
              <div style={{
                padding: '6px 12px',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#22c55e',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {shelter.availability}
              </div>
            </div>

            {/* Minimal Preview Section */}
            <div style={{
              width: '100%',
              height: '180px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              
              {/* Shelter Photo */}
              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '12px'
              }}>
                {/* Optimized image with priority loading and blur placeholder */}
                <img 
                  src="https://d3kx2t94cz9q1y.cloudfront.net/Picture_of_trecc.jpg"
                  alt={`${shelter.name} deployed shelter system`}
                  loading="eager" // Priority loading for above-the-fold
                  decoding="async"
                  fetchPriority="high"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    transition: 'opacity 0.3s ease'
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onError={(e) => {
                    // Fallback to a simple placeholder if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement;
                    if (fallback) {
                      fallback.innerHTML = `
                        <div style="
                          width: 100%;
                          height: 100%;
                          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                          border-radius: 12px;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          border: 1px solid rgba(59, 130, 246, 0.2);
                        ">
                          <div style="font-size: 2rem; color: #fff; margin-bottom: 8px;">🏠</div>
                          <div style="font-size: 0.9rem; font-weight: 500; color: #cbd5e1; text-align: center;">${shelter.name}</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              
            </div>

            {/* Shelter Info */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '4px',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}>
                  {shelter.name}
                </h3>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  color: '#cccccc',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Shelter Configurator
                </div>
              </div>
              
              <p style={{
                color: '#ffffff',
                lineHeight: '1.4',
                marginBottom: '20px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {shelter.description}
              </p>

              {/* Simple Deployment Info */}
              <div style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#ffffff'
                }}>
                  Deployment: {formatDuration(shelter.deploymentTime)}
                </span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#ffffff'
                }}>
                  Capacity: {shelter.capacity}
                </span>
              </div>


              {/* Features */}
              <div style={{
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#cccccc',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>
                  {shelter.features.slice(0, 3).join(' • ')}
                </div>
              </div>


              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href={`/configurator/${shelter.id}`} style={{ flex: 1 }}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Configure {shelter.name}
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    // Open walkthrough video modal
                    const videoPath = '/videos/trecc-walkthrough.mp4';
                    if (videoPath) {
                      const modal = document.createElement('div');
                      modal.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.9);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        backdrop-filter: blur(10px);
                      `;
                      
                      const videoContainer = document.createElement('div');
                      videoContainer.style.cssText = `
                        position: relative;
                        width: 90%;
                        max-width: 1200px;
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                      `;
                      
                      const closeButton = document.createElement('button');
                      closeButton.innerHTML = '×';
                      closeButton.style.cssText = `
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: rgba(255, 255, 255, 0.1);
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        color: white;
                        font-size: 20px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                      `;
                      
                      const videoTitle = document.createElement('div');
                      videoTitle.innerHTML = 'TRECC Walkthrough Video';
                      videoTitle.style.cssText = `
                        text-align: center;
                        margin-bottom: 30px;
                        color: white;
                        font-size: 24px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      `;
                      
                      const videoWrapper = document.createElement('div');
                      videoWrapper.style.cssText = `
                        position: relative;
                        width: 100%;
                        height: 0;
                        padding-bottom: 56.25%;
                        background: #000;
                        border-radius: 10px;
                        overflow: hidden;
                      `;
                      
                      const video = document.createElement('video');
                      video.controls = true;
                      video.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      `;
                      video.src = videoPath;
                      video.poster = '/videos/trecc-poster.jpg';
                      
                      video.onerror = () => {
                        alert('Sorry, this video is currently unavailable.');
                        document.body.removeChild(modal);
                      };
                      
                      closeButton.onclick = () => document.body.removeChild(modal);
                      modal.onclick = (e) => {
                        if (e.target === modal) document.body.removeChild(modal);
                      };
                      
                      videoWrapper.appendChild(video);
                      videoContainer.appendChild(closeButton);
                      videoContainer.appendChild(videoTitle);
                      videoContainer.appendChild(videoWrapper);
                      modal.appendChild(videoContainer);
                      document.body.appendChild(modal);
                    } else {
                      alert('Video walkthrough is not available for this shelter.');
                    }
                  }}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minWidth: '100px'
                  }}
                >
                  🎥 Walkthrough
                </motion.button>
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
    </div>
  );
}
