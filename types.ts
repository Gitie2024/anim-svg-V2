export type ShapeType = 'rectangle' | 'circle' | 'polygon' | 'triangle' | 'line' | 'path' | 'image';

export type AnimationType = 'none' | 'rotate' | 'pulse' | 'bounce' | 'slide-x' | 'slide-y' | 'fade';

export interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

export interface ShapeDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface ShapeData {
  id: string;
  type: ShapeType;
  name: string;
  style: ShapeStyle;
  dimensions: ShapeDimensions;
  // Specifics
  points?: string; // for polygon/triangle
  d?: string; // for path
  href?: string; // for image
  animation: AnimationType;
  animationDuration: number;
}

export interface GeminiImageConfig {
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  imageSize: "1K" | "2K" | "4K";
}
