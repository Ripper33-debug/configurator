import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      
      <div className="loading-text">
        <h3>Loading TRECC Configurator</h3>
        <p>Preparing 3D environment...</p>
      </div>
      
      {/* Progress dots */}
      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          borderRadius: '50%',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          borderRadius: '50%',
          animation: 'pulse 1.5s ease-in-out infinite 0.2s'
        }}></div>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          borderRadius: '50%',
          animation: 'pulse 1.5s ease-in-out infinite 0.4s'
        }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
