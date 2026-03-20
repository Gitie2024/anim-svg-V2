import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Layers, Plus, Download, Upload, Settings, X, Info } from 'lucide-react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import GenAIPanel from './components/GenAIPanel';
import { ShapeData, ShapeType } from './types';
import { CSS_ANIMATIONS, SHAPE_OPTIONS } from './constants';

const DEFAULT_SHAPE_STYLE = {
  fill: '#3b82f6',
  stroke: '#1e40af',
  strokeWidth: 0,
  opacity: 1,
};

function App() {
  // State
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSettings, setCanvasSettings] = useState({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  });
  
  // UI Panel State
  const [rightPanel, setRightPanel] = useState<'properties' | 'ai'>('properties');
  
  // Actions
  const addShape = (type: ShapeType, extras: Partial<ShapeData> = {}) => {
    const id = uuidv4();
    const newShape: ShapeData = {
      id,
      type,
      name: `${type} ${shapes.length + 1}`,
      style: { ...DEFAULT_SHAPE_STYLE },
      dimensions: {
        x: canvasSettings.width / 2 - 50,
        y: canvasSettings.height / 2 - 50,
        width: 100,
        height: 100,
        rotation: 0
      },
      animation: 'none',
      animationDuration: 2,
      ...extras
    };
    
    setShapes([...shapes, newShape]);
    setSelectedId(id);
    setRightPanel('properties');
  };

  const updateShape = (id: string, updates: Partial<ShapeData>) => {
    setShapes(shapes.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteShape = (id: string) => {
    setShapes(shapes.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateShape = (id: string) => {
    const original = shapes.find(s => s.id === id);
    if (original) {
      addShape(original.type, {
        ...original,
        id: uuidv4(), // ensure new ID
        name: `${original.name} (Copy)`,
        dimensions: {
          ...original.dimensions,
          x: original.dimensions.x + 20,
          y: original.dimensions.y + 20
        }
      });
    }
  };

  // Import / Export
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Simple heuristic to detect if it's an SVG text or binary image
        if (file.type.includes('svg')) {
             // For simplicity in this demo, we treat imported SVGs as image layers if complex, 
             // or could try to parse. We'll use the image tag approach for robustness.
             const blob = new Blob([content], {type: 'image/svg+xml'});
             const url = URL.createObjectURL(blob);
             addShape('image', { href: url, name: file.name, style: { fill: 'transparent', stroke: 'none', strokeWidth: 0, opacity: 1 } });
        } else {
             // It's likely an image
             const url = URL.createObjectURL(file);
             addShape('image', { href: url, name: file.name, style: { fill: 'transparent', stroke: 'none', strokeWidth: 0, opacity: 1 } });
        }
      };
      if (file.type.includes('svg') || file.type.includes('text')) {
          reader.readAsText(file);
      } else {
          reader.readAsDataURL(file); // Read as base64 for images
      }
    }
  };

  const exportFile = async (format: 'svg' | 'html') => {
    // Specifically target the main canvas SVG by ID
    const svgEl = document.querySelector('#main-canvas') as SVGSVGElement;
    if (!svgEl) {
        console.error("Main canvas SVG not found for export.");
        return;
    }
    
    // Clone to manipulate for export without affecting UI
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    
    // 1. Remove UI-specific artifacts (selection highlights)
    // The selection is applied as an inline style `filter: drop-shadow(...)`
    const elementsWithFilter = clone.querySelectorAll('[style*="filter"]');
    elementsWithFilter.forEach(el => {
        if (el instanceof HTMLElement || el instanceof SVGElement) {
            el.style.filter = '';
        }
    });
    
    // 2. Ensure CSS styles for animations are embedded
    if (!clone.querySelector('style')) {
        const style = document.createElement('style');
        style.innerHTML = CSS_ANIMATIONS;
        clone.prepend(style);
    }
    
    // 3. Convert Blob URLs to Base64 to ensure images work offline/outside session
    const images = clone.querySelectorAll('image');
    for (const img of Array.from(images)) {
        const href = img.getAttribute('href');
        if (href && href.startsWith('blob:')) {
            try {
                const response = await fetch(href);
                const blob = await response.blob();
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                img.setAttribute('href', base64);
            } catch (err) {
                console.warn('Failed to convert blob URL to base64 during export:', err);
            }
        }
    }
    
    const svgData = new XMLSerializer().serializeToString(clone);

    let content = svgData;
    let mimeType = 'image/svg+xml';
    let extension = 'svg';

    if (format === 'html') {
      content = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AnimSVG Export</title>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: #f3f4f6;
    font-family: sans-serif;
  }
  svg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-width: 100%;
    height: auto;
  }
</style>
</head>
<body>
${svgData}
</body>
</html>`;
      mimeType = 'text/html';
      extension = 'html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `animation-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedShape = shapes.find(s => s.id === selectedId);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      {/* Left Sidebar - Layers & Add */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col z-10">
        <div className="p-4 border-b border-gray-700 font-bold text-xl tracking-tight flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
           </div>
           AnimSVG
        </div>
        
        <div className="p-4 grid grid-cols-2 gap-2">
            {SHAPE_OPTIONS.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => addShape(opt.value)}
                    className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                >
                    <Plus size={16} className="mb-1" />
                    {opt.label.split(' ')[0]}
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto px-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Layers</h3>
            <div className="space-y-1">
                {shapes.slice().reverse().map(shape => (
                    <div 
                        key={shape.id}
                        onClick={() => setSelectedId(shape.id)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${selectedId === shape.id ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'hover:bg-gray-700 text-gray-300'}`}
                    >
                        <span className="truncate">{shape.name}</span>
                        {selectedId === shape.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                    </div>
                ))}
                {shapes.length === 0 && (
                    <div className="text-center text-gray-600 text-sm py-4 italic">No layers</div>
                )}
            </div>
        </div>

        <div className="p-4 border-t border-gray-700 space-y-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".svg,.png,.jpg,.jpeg" 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm transition-colors"
            >
                <Upload size={16} /> Import File
            </button>
             <div className="flex gap-2">
                <button onClick={() => exportFile('svg')} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 p-2 rounded text-sm transition-colors">
                    <Download size={16} /> SVG
                </button>
                 <button onClick={() => exportFile('html')} className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm transition-colors">
                    <Download size={16} /> HTML
                </button>
            </div>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 relative flex flex-col min-w-0">
          <Canvas 
            shapes={shapes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            width={canvasSettings.width}
            height={canvasSettings.height}
            backgroundColor={canvasSettings.backgroundColor}
          />
      </div>

      {/* Right Sidebar - Properties & AI */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col z-10">
         <div className="flex border-b border-gray-700">
             <button 
                onClick={() => setRightPanel('properties')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${rightPanel === 'properties' ? 'text-white border-b-2 border-blue-500 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200'}`}
             >
                 <Settings size={16} /> Properties
             </button>
             <button 
                onClick={() => setRightPanel('ai')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${rightPanel === 'ai' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-900/10' : 'text-gray-400 hover:text-gray-200'}`}
             >
                 <span className="flex h-4 w-4 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500"></span>
                 </span>
                 AI Studio
             </button>
         </div>

         <div className="flex-1 overflow-hidden">
            {rightPanel === 'properties' ? (
                <Controls
                    selectedShape={selectedShape}
                    onUpdateShape={updateShape}
                    onDeleteShape={deleteShape}
                    onDuplicateShape={duplicateShape}
                    canvasSettings={canvasSettings}
                    onUpdateCanvas={(updates) => setCanvasSettings(prev => ({...prev, ...updates}))}
                />
            ) : (
                <GenAIPanel 
                    onAddImage={(url) => addShape('image', { 
                        href: url, 
                        name: 'AI Generated Image',
                        dimensions: {
                            x: 0,
                            y: 0,
                            width: canvasSettings.width,
                            height: canvasSettings.height,
                            rotation: 0
                        },
                        style: { opacity: 1, fill: 'none', stroke: 'none', strokeWidth: 0 }
                    })}
                    onAddPath={(d) => addShape('path', { 
                        d, 
                        name: 'AI Generated Path',
                        style: { ...DEFAULT_SHAPE_STYLE, fill: 'none', stroke: '#a855f7', strokeWidth: 2 } 
                    })}
                />
            )}
         </div>
      </div>
    </div>
  );
}

export default App;