Update: test commit to trigger deploy

# Weatherhaven Shelter Configurator

A professional interactive 3D configurator for Weatherhaven's deployable shelter systems, built with Next.js, TypeScript, and Three.js. Features a modern military-industrial aesthetic with advanced 3D visualization capabilities.

## 👥 Contributors

- **Aleksandar Cridge** - CAD designer, full stack developer, and AI integration
- **Barry Castelli** - Full stack developer and AI integration

*Both programmers logged into ripper33debug account*

## 🚀 Quick Start

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
```bash
npm run build
npm start
```

## 🎯 Key Features

### 3D Configurator
- **Interactive 3D Models**: Real-time shelter visualization with AWS S3 hosted models
- **Multiple View Modes**: Closed, Open, and Interior views with dynamic camera positioning
- **Color Options**: Arctic White, Military Green, and Desert Tan with live model switching
- **Construction Worker Toggle**: Optional construction worker model for scale reference
- **Professional UI**: Clean, military-industrial aesthetic with enhanced typography
- **Responsive Design**: Optimized for desktop and mobile viewing

### Model Management
- **AWS S3 Integration**: All 3D models hosted on AWS S3 with CloudFront CDN
- **Dynamic Model Loading**: Intelligent model switching based on configuration
- **Model Orientation**: Automatic rotation fixes for proper display
- **Interior View**: First-person perspective from inside the shelter

### Brand Integration
- **Weatherhaven Colors**: Blue (#0066cc), White, and Orange (#ff6600) color scheme
- **Custom Favicon**: Branded favicon with Weatherhaven colors
- **Professional Styling**: Military-industrial design aesthetic
- **Enhanced Typography**: Improved font hierarchy and spacing

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                  # Homepage with shelter selection
│   ├── configurator/[shelterId]/ # 3D Configurator pages
│   ├── layout.tsx                # Root layout with favicon and analytics
│   └── globals.css               # Global styles
├── components/
│   ├── ShelterMenu.tsx           # Homepage shelter selection
│   ├── ShelterConfigurator.tsx   # Main configurator component
│   ├── ModelViewer.tsx           # 3D model rendering
│   ├── MiniModelViewer.tsx       # Homepage 3D previews
│   └── ContactForm.tsx           # Contact sales modal
├── types/
│   └── index.ts                  # TypeScript interfaces
└── lib/
    └── aws.ts                    # AWS S3 model loading utilities
```

## 🎨 UI Features

### Enhanced Design
- **Professional Header**: Gradient background with enhanced typography
- **Section Headers**: Colored accent bars for visual hierarchy
- **Modern Buttons**: Clean, minimal design with subtle hover effects
- **Glassmorphism Effects**: Subtle backdrop blur for depth
- **Responsive Layout**: Optimized spacing and typography

### Configuration Options
- **View Modes**: 
  - Open View: Deployed shelter with open configuration
  - Interior View: First-person perspective from inside
  - Construction Worker: Optional scale reference model
- **Color Selection**: Real-time model switching between color variants
- **Action Buttons**: Reset, Quote Request, Share URL, and Short Code generation

## 🔧 Technical Implementation

### 3D Rendering
- **React Three Fiber**: React renderer for Three.js
- **Drei Helpers**: useGLTF, OrbitControls, Environment, etc.
- **Dynamic Camera**: Position and FOV adjustments based on view mode
- **Model Loading**: AWS S3 integration with error handling

### AWS Integration
- **S3 Models**: All .glb files hosted on AWS S3
- **CloudFront CDN**: Fast global content delivery
- **Dynamic URLs**: Model paths generated based on configuration
- **Error Handling**: Fallback models and loading states

### Performance
- **Vercel Analytics**: Built-in performance tracking
- **Optimized Models**: Compressed .glb files for fast loading
- **Lazy Loading**: Models loaded on demand
- **Caching**: Browser caching for improved performance

## 🎮 Usage

### Homepage
1. **Select Shelter**: Choose from available shelter types
2. **3D Preview**: Hover over cards to see spinning 3D models
3. **Configure**: Click "Configure" to open the 3D configurator

### 3D Configurator
1. **View Options**: Toggle between Open, Interior, and Construction Worker views
2. **Color Selection**: Choose from Arctic White, Military Green, or Desert Tan
3. **Camera Control**: 
   - **Exterior Views**: Full orbit, zoom, and pan controls
   - **Interior View**: Locked first-person perspective with rotation only
4. **Actions**: Reset configuration, request quote, share URL, or create short code

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Custom AWS S3 configuration
AWS_REGION=us-east-1
AWS_BUCKET=your-bucket-name
```

### Model Management
Models are automatically loaded from AWS S3. Current model inventory:
- `arctic_white_closed-v1.glb` (43.8 MB)
- `arctic_white_open-v1.glb` (32.0 MB)
- `construction.glb` (3.2 MB)
- `Green_Open_Interior_command_post-v1.glb` (32.8 MB)
- `green_open-v1.glb` (32.0 MB)
- `Green_stowedv2-v1.glb` (45.3 MB)
- `Shelter_Stowed_DesertTan-v1.glb` (43.8 MB)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables if needed
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## 🎨 Customization

### Adding New Models
1. Upload .glb files to AWS S3
2. Update model paths in `ShelterConfigurator.tsx`
3. Add color options and view modes as needed

### Styling Updates
- **Colors**: Update Weatherhaven brand colors in components
- **Typography**: Modify font families and sizing in layout
- **Layout**: Adjust spacing and component positioning

## 📊 Analytics & Performance

- **Vercel Analytics**: Automatic performance tracking
- **Model Loading**: Optimized for fast 3D model display
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG AA compliant components

## 🛠️ Development

### Adding New Features
1. **New View Modes**: Add to `ConfigState` interface and implement in `ModelViewer.tsx`
2. **New Colors**: Update color options and model paths
3. **New Actions**: Add buttons and functionality to `ShelterConfigurator.tsx`

### Troubleshooting
- **Model Loading Issues**: Check AWS S3 paths and permissions
- **Camera Problems**: Verify OrbitControls configuration
- **Styling Issues**: Check CSS-in-JS syntax and responsive breakpoints

## 📞 Support

For technical support or questions:
- Check the component documentation in `/src/components/`
- Review the AWS S3 model configuration
- Verify browser compatibility for WebGL/Three.js features

## 🔄 Recent Updates

### UI Enhancements
- Enhanced header with gradient background and improved typography
- Section headers with colored accent bars for better visual hierarchy
- Simplified button styling with clean, minimal design
- Professional spacing and layout improvements

### Technical Improvements
- Fixed favicon with Weatherhaven brand colors and cache-busting
- Improved model loading with better error handling
- Enhanced interior view camera positioning
- Optimized 3D model orientation and display

### Brand Integration
- Weatherhaven color scheme implementation
- Custom favicon and theme colors
- Military-industrial aesthetic throughout
- Professional typography and spacing

---

Built with ❤️ for Weatherhaven's deployable shelter solutions.

## Latest Update
- Fixed Desert Tan open model path issue
- Added debug logging for model loading verification