# Source Code Structure

This directory contains all the React application code and components.

## Directory Structure

```
src/
├── components/          # React components
│   ├── LoginPage.tsx           # Login interface
│   ├── CommandCenter.tsx       # Main dashboard
│   ├── ShelterConfigurator.tsx # 3D configurator
│   ├── ModelViewer.tsx         # 3D model rendering
│   ├── Controls.tsx            # Configuration controls
│   ├── PricingPanel.tsx        # Pricing and quotes
│   ├── DemoMode.tsx            # Demo mode interface
│   ├── ARVRMode.tsx            # AR/VR functionality
│   ├── CollaborationProvider.tsx # Real-time collaboration
│   └── LoadingSpinner.tsx      # Loading animations
├── config/             # Configuration files
│   └── users.ts        # User authentication data
├── App.tsx             # Main application component
├── App.css             # Main application styles
├── index.css           # Global styles
├── index.tsx           # Application entry point
├── react-app-env.d.ts  # TypeScript declarations
└── reportWebVitals.ts  # Performance monitoring
```

## Key Components

- **LoginPage**: User authentication interface
- **CommandCenter**: Main dashboard with shelter catalog
- **ShelterConfigurator**: 3D model configuration interface
- **ModelViewer**: Three.js 3D rendering
- **Controls**: Configuration controls (color, deploy, etc.)
- **PricingPanel**: Pricing calculation and quote generation

## Configuration

- **users.ts**: Contains user credentials and authentication logic
- **App.tsx**: Main application state management and routing

## Styling

- **App.css**: Component-specific styles
- **index.css**: Global styles and CSS variables
