// Core configuration types
export interface ConfigState {
  color: string;
  isDeployed: boolean;
  isInteriorView: boolean;
  isInsideView: boolean;
  showConstructionWorker: boolean;
  showForestView: boolean;
  environmentView: 'none' | 'forest' | 'sand' | 'arctic';
}

export interface ColorOption {
  name: string;
  value: string;
}

// 3D Model types
export interface ModelViewerSceneProps {
  modelPath: string;
  color: string | null;
  isDeployed: boolean;
  isInteriorView: boolean;
  showConstructionWorker: boolean;
  showForestView: boolean;
  environmentView: 'none' | 'forest' | 'sand' | 'arctic';
  environment: string;
  weather: string;
  lighting: LightingConfig;
  background3D: Background3D;
  onModelReady?: () => void;
  onColorApplied?: () => void;
}

export interface LightingConfig {
  ambientIntensity: number;
  directionalIntensity: number;
  sunPosition: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Background3D {
  [key: string]: any;
}

export interface TreccModelProps {
  modelPath?: string;
  color?: string | null;
  onReady?: (info: ReadyInfo) => void;
  onColorApplied?: () => void;
}

export interface ReadyInfo {
  center: THREE.Vector3;
  radius: number;
}

// UI Component types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'color-option';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface PanelProps {
  children: React.ReactNode;
  title?: string;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface SectionProps {
  children: React.ReactNode;
  title: string;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Error Boundary types
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Video types
export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

// Import THREE for ReadyInfo
import * as THREE from 'three';
