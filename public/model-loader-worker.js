// Web Worker for loading 3D models without blocking main thread
self.addEventListener('message', async function(e) {
  const { modelUrl, id } = e.data;
  
  try {
    console.log('🔧 Worker: Starting model download:', modelUrl);
    
    // Download model in background thread
    const response = await fetch(modelUrl, {
      mode: 'cors',
      cache: 'force-cache' // Aggressive caching
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Get the model data as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    console.log('✅ Worker: Model downloaded successfully:', modelUrl, 'Size:', arrayBuffer.byteLength);
    
    // Send back to main thread
    self.postMessage({
      type: 'MODEL_LOADED',
      id,
      data: arrayBuffer,
      url: modelUrl
    });
    
  } catch (error) {
    console.error('❌ Worker: Model loading failed:', error);
    
    self.postMessage({
      type: 'MODEL_ERROR',
      id,
      error: error.message,
      url: modelUrl
    });
  }
});

console.log('🔧 Model Loader Worker initialized');

