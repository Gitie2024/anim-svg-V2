import React, { useRef, useEffect } from 'react';
import { ShapeData } from '../types';
import { CSS_ANIMATIONS } from '../constants';

interface CanvasProps {
  shapes: ShapeData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  width: number;
  height: number;
  backgroundColor: string;
}

const Canvas: React.FC<CanvasProps> = ({ shapes, selectedId, onSelect, width, height, backgroundColor }) => {
  
  const renderShape = (shape: ShapeData) => {
    const commonProps = {
      key: shape.id,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(shape.id);
      },
      fill: shape.style.fill,
      stroke: shape.style.stroke,
      strokeWidth: shape.style.strokeWidth,
      opacity: shape.style.opacity,
      style: {
         transformOrigin: 'center', 
         transformBox: 'fill-box' as const,
         cursor: 'pointer',
         animationDuration: `${shape.animationDuration}s`
      },
      className: shape.animation !== 'none' ? `anim-${shape.animation}` : '',
    };
    
    // Add outline if selected
    const filter = selectedId === shape.id ? 'drop-shadow(0px 0px 4px #3b82f6)' : undefined;

    switch (shape.type) {
      case 'rectangle':
        return (
          <rect
            {...commonProps}
            x={shape.dimensions.x}
            y={shape.dimensions.y}
            width={shape.dimensions.width}
            height={shape.dimensions.height}
            transform={`rotate(${shape.dimensions.rotation} ${shape.dimensions.x + shape.dimensions.width/2} ${shape.dimensions.y + shape.dimensions.height/2})`}
            style={{...commonProps.style, filter}}
          />
        );
      case 'circle':
        return (
          <circle
            {...commonProps}
            cx={shape.dimensions.x}
            cy={shape.dimensions.y}
            r={shape.dimensions.width / 2}
             transform={`rotate(${shape.dimensions.rotation} ${shape.dimensions.x} ${shape.dimensions.y})`}
            style={{...commonProps.style, filter}}
          />
        );
      case 'triangle':
        // Equilateral triangle logic roughly based on bounding box
        const tx = shape.dimensions.x;
        const ty = shape.dimensions.y;
        const w = shape.dimensions.width;
        const h = shape.dimensions.height;
        const points = `${tx + w/2},${ty} ${tx},${ty + h} ${tx + w},${ty + h}`;
        return (
          <polygon
            {...commonProps}
            points={points}
            transform={`rotate(${shape.dimensions.rotation} ${tx + w/2} ${ty + h/2})`}
            style={{...commonProps.style, filter}}
          />
        );
      case 'polygon':
        // Default hexagon
        return (
           <polygon
            {...commonProps}
            points={shape.points || "100,50 75,93 25,93 0,50 25,7 75,7"} // Fallback if points missing
             transform={`translate(${shape.dimensions.x}, ${shape.dimensions.y}) scale(${shape.dimensions.width/100}) rotate(${shape.dimensions.rotation})`}
            style={{...commonProps.style, filter}}
          />
        )
      case 'line':
        return (
          <line
            {...commonProps}
            x1={shape.dimensions.x}
            y1={shape.dimensions.y}
            x2={shape.dimensions.x + shape.dimensions.width}
            y2={shape.dimensions.y + shape.dimensions.height}
            style={{...commonProps.style, filter}}
          />
        );
      case 'path':
        return (
          <path
            {...commonProps}
            d={shape.d || "M10 10 H 90 V 90 H 10 Z"}
            transform={`translate(${shape.dimensions.x}, ${shape.dimensions.y}) scale(${shape.dimensions.width/100}) rotate(${shape.dimensions.rotation})`}
            style={{...commonProps.style, filter}}
          />
        );
      case 'image':
        return (
            <image
                key={shape.id}
                href={shape.href}
                x={shape.dimensions.x}
                y={shape.dimensions.y}
                width={shape.dimensions.width}
                height={shape.dimensions.height}
                preserveAspectRatio="none"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(shape.id);
                }}
                className={shape.animation !== 'none' ? `anim-${shape.animation}` : ''}
                style={{
                    cursor: 'pointer',
                    animationDuration: `${shape.animationDuration}s`,
                    filter: selectedId === shape.id ? 'drop-shadow(0px 0px 4px #3b82f6)' : undefined,
                    transformBox: 'fill-box' as const,
                    transformOrigin: 'center',
                }}
                transform={`rotate(${shape.dimensions.rotation} ${shape.dimensions.x + shape.dimensions.width/2} ${shape.dimensions.y + shape.dimensions.height/2})`}
            />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-800 overflow-auto p-8 relative">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
       </div>

      <div className="shadow-2xl border border-gray-700 bg-white" style={{ width, height }}>
        <svg
          id="main-canvas"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => onSelect('')}
          style={{ backgroundColor }}
        >
          <style>{CSS_ANIMATIONS}</style>
          {shapes.map(renderShape)}
        </svg>
      </div>
    </div>
  );
};

export default Canvas;