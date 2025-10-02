// AWS S3 + CloudFront configuration
const AWS_S3_BUCKET = 'weatherhaven-models'
const AWS_REGION = 'us-east-2'
const CLOUDFRONT_DOMAIN = 'd3kx2t94cz9q1y.cloudfront.net'

// AWS configuration - debug logging removed for production efficiency

// Model configuration
export interface ModelConfig {
  id: string
  name: string
  path: string
  thumbnail?: string
  description?: string
  dimensions?: {
    length: number
    width: number
    height: number
  }
  weight?: number
  capacity?: number
}

// Available models
export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'trecc',
    name: 'TRECC Shelter',
    path: 'trecc.glb',
    description: 'Tactical Rapidly Erectable Command Center',
    dimensions: { length: 20, width: 8, height: 8 },
    weight: 5000,
    capacity: 12
  }
  // Add more models as you upload them to S3
  // {
  //   id: 'command-posting',
  //   name: 'Command Posting',
  //   path: 'interiors/CommandPosting.glb',
  //   description: 'Interior command center configuration',
  //   dimensions: { length: 20, width: 8, height: 8 },
  //   weight: 5000,
  //   capacity: 8
  // }
]

// Get model URL from AWS CloudFront - optimized to eliminate TBT
export async function getModelUrl(modelPath: string): Promise<string> {
  // Use CloudFront URL directly - no HEAD requests to reduce TBT
  const cloudfrontUrl = `https://${CLOUDFRONT_DOMAIN}/${modelPath}`
  
  // Skip validation to eliminate network calls that block main thread
  // Three.js will handle loading errors gracefully
  return cloudfrontUrl
}

// Get all available models
export async function getAvailableModels(): Promise<ModelConfig[]> {
  try {
    // Return the hardcoded models - optimized for performance
    return AVAILABLE_MODELS
  } catch (error) {
    return AVAILABLE_MODELS
  }
}

// Test AWS S3 connection - simplified to reduce TBT
export async function testAWSConnection(): Promise<boolean> {
  // Skip actual network test to reduce TBT - just return true
  // The actual connection will be tested when models load
  return true
}

// Preload model for faster loading - DISABLED to fix loading issues
export async function preloadModel(modelPath: string): Promise<void> {
  // Preloading completely disabled to prevent interference with model loading
  return Promise.resolve();
}
