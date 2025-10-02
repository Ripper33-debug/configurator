// Model loading with Web Workers to eliminate TBT
export class ModelWorkerManager {
  private worker: Worker | null = null;
  private modelCache = new Map<string, ArrayBuffer>();
  private loadingPromises = new Map<string, Promise<ArrayBuffer>>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWorker();
    }
  }

  private initWorker() {
    try {
      this.worker = new Worker('/model-loader-worker.js');
      this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
      this.worker.addEventListener('error', (error) => {
        console.error('🔧 Worker error:', error);
      });
    } catch (error) {
      console.warn('🔧 Web Worker not available, falling back to main thread loading');
    }
  }

  private handleWorkerMessage(e: MessageEvent) {
    const { type, id, data, error, url } = e.data;
    
    if (type === 'MODEL_LOADED') {
      // Cache the model data
      this.modelCache.set(url, data);
      console.log('✅ Model cached:', url);
    } else if (type === 'MODEL_ERROR') {
      console.error('❌ Worker model loading failed:', error);
    }
  }

  async loadModel(modelUrl: string): Promise<ArrayBuffer | null> {
    // Check cache first
    if (this.modelCache.has(modelUrl)) {
      console.log('🎯 Model loaded from cache:', modelUrl);
      return this.modelCache.get(modelUrl)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(modelUrl)) {
      return this.loadingPromises.get(modelUrl)!;
    }

    // Start loading
    const loadPromise = this.loadModelInternal(modelUrl);
    this.loadingPromises.set(modelUrl, loadPromise);
    
    try {
      const result = await loadPromise;
      this.loadingPromises.delete(modelUrl);
      return result;
    } catch (error) {
      this.loadingPromises.delete(modelUrl);
      throw error;
    }
  }

  private async loadModelInternal(modelUrl: string): Promise<ArrayBuffer> {
    if (this.worker) {
      // Use Web Worker for non-blocking loading
      return new Promise((resolve, reject) => {
        const id = Math.random().toString(36).substr(2, 9);
        
        const handleMessage = (e: MessageEvent) => {
          const { type, id: responseId, data, error } = e.data;
          
          if (responseId === id) {
            this.worker!.removeEventListener('message', handleMessage);
            
            if (type === 'MODEL_LOADED') {
              this.modelCache.set(modelUrl, data);
              resolve(data);
            } else if (type === 'MODEL_ERROR') {
              reject(new Error(error));
            }
          }
        };
        
        this.worker!.addEventListener('message', handleMessage);
        this.worker!.postMessage({ modelUrl, id });
      });
    } else {
      // Fallback to main thread with requestIdleCallback
      return new Promise((resolve, reject) => {
        const loadInIdle = () => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
              try {
                const response = await fetch(modelUrl, { mode: 'cors' });
                const data = await response.arrayBuffer();
                this.modelCache.set(modelUrl, data);
                resolve(data);
              } catch (error) {
                reject(error);
              }
            });
          } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(async () => {
              try {
                const response = await fetch(modelUrl, { mode: 'cors' });
                const data = await response.arrayBuffer();
                this.modelCache.set(modelUrl, data);
                resolve(data);
              } catch (error) {
                reject(error);
              }
            }, 100);
          }
        };
        
        loadInIdle();
      });
    }
  }

  // Preload models in background without blocking
  preloadModels(modelUrls: string[]) {
    if (!this.worker) return;
    
    modelUrls.forEach((url, index) => {
      // Stagger preloading to avoid overwhelming the worker
      setTimeout(() => {
        if (!this.modelCache.has(url)) {
          this.loadModel(url).catch(() => {
            // Ignore preload errors
            console.log('⚠️ Preload failed for:', url);
          });
        }
      }, index * 200); // 200ms between each preload
    });
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.modelCache.clear();
    this.loadingPromises.clear();
  }
}

// Singleton instance
export const modelWorkerManager = new ModelWorkerManager();

