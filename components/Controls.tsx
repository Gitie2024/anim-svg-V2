import React from 'react';
import { ShapeData, AnimationType } from '../types';
import { ANIMATION_OPTIONS, SHAPE_OPTIONS } from '../constants';
import { Trash2, Copy, Play } from 'lucide-react';

interface ControlsProps {
  selectedShape: ShapeData | undefined;
  onUpdateShape: (id: string, updates: Partial<ShapeData>) => void;
  onDeleteShape: (id: string) => void;
  onDuplicateShape: (id: string) => void;
  canvasSettings: { width: number; height: number; backgroundColor: string };
  onUpdateCanvas: (updates: any) => void;
}

const Controls: React.FC<ControlsProps> = ({
  selectedShape,
  onUpdateShape,
  onDeleteShape,
  onDuplicateShape,
  canvasSettings,
  onUpdateCanvas
}) => {

  const handleDimensionChange = (key: keyof ShapeData['dimensions'], value: string) => {
    if (!selectedShape) return;
    onUpdateShape(selectedShape.id, {
      dimensions: {
        ...selectedShape.dimensions,
        [key]: Number(value)
      }
    });
  };

  const handleStyleChange = (key: keyof ShapeData['style'], value: string | number) => {
    if (!selectedShape) return;
    onUpdateShape(selectedShape.id, {
      style: {
        ...selectedShape.style,
        [key]: value
      }
    });
  };

  if (!selectedShape) {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold text-gray-200">Canvas Settings</h2>
        <div className="space-y-4">
           <div>
            <label className="block text-sm text-gray-400 mb-1">Width (px)</label>
            <input
              type="number"
              value={canvasSettings.width}
              onChange={(e) => onUpdateCanvas({ width: Number(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Height (px)</label>
            <input
              type="number"
              value={canvasSettings.height}
              onChange={(e) => onUpdateCanvas({ height: Number(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Background</label>
            <div className="flex gap-2">
                 <input
                type="color"
                value={canvasSettings.backgroundColor}
                onChange={(e) => onUpdateCanvas({ backgroundColor: e.target.value })}
                className="w-10 h-10 p-0 border-0 rounded overflow-hidden cursor-pointer"
                />
                <input
                type="text"
                value={canvasSettings.backgroundColor}
                onChange={(e) => onUpdateCanvas({ backgroundColor: e.target.value })}
                className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm"
                />
            </div>
          </div>
        </div>
        <div className="pt-8 text-center text-gray-500 text-sm">
            Select a shape to edit properties.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-lg font-bold text-white truncate">{selectedShape.name}</h2>
        <div className="flex gap-2">
           <button onClick={() => onDuplicateShape(selectedShape.id)} className="p-1.5 hover:bg-gray-700 rounded text-gray-300" title="Duplicate">
             <Copy size={16} />
           </button>
           <button onClick={() => onDeleteShape(selectedShape.id)} className="p-1.5 hover:bg-red-900/50 rounded text-red-400" title="Delete">
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      {/* Animation Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Animation</h3>
        <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select
                value={selectedShape.animation}
                onChange={(e) => onUpdateShape(selectedShape.id, { animation: e.target.value as AnimationType })}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm"
            >
                {ANIMATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
        {selectedShape.animation !== 'none' && (
             <div>
                <label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label>
                <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={selectedShape.animationDuration}
                    onChange={(e) => onUpdateShape(selectedShape.id, { animationDuration: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                />
                <div className="text-right text-xs text-gray-400">{selectedShape.animationDuration}s</div>
            </div>
        )}
      </div>

      {/* Dimensions Section */}
      <div className="space-y-3 border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Layout</h3>
        <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-xs text-gray-500 mb-1">X Position</label>
                <input
                    type="number"
                    value={selectedShape.dimensions.x}
                    onChange={(e) => handleDimensionChange('x', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-white text-sm"
                />
            </div>
            <div>
                <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                <input
                    type="number"
                    value={selectedShape.dimensions.y}
                    onChange={(e) => handleDimensionChange('y', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-white text-sm"
                />
            </div>
             <div>
                <label className="block text-xs text-gray-500 mb-1">Width</label>
                <input
                    type="number"
                    value={selectedShape.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-white text-sm"
                />
            </div>
            <div>
                <label className="block text-xs text-gray-500 mb-1">Height</label>
                <input
                    type="number"
                    value={selectedShape.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-white text-sm"
                />
            </div>
            <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Rotation (deg)</label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedShape.dimensions.rotation}
                    onChange={(e) => handleDimensionChange('rotation', e.target.value)}
                    className="w-full accent-blue-500"
                />
            </div>
        </div>
      </div>

      {/* Appearance Section - Hide for images if needed, but opacity is useful */}
      <div className="space-y-3 border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Appearance</h3>
        
        {selectedShape.type !== 'image' && (
            <>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Fill Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={selectedShape.style.fill}
                            onChange={(e) => handleStyleChange('fill', e.target.value)}
                            className="w-8 h-8 rounded border-0 p-0 cursor-pointer"
                        />
                         <input
                            type="text"
                            value={selectedShape.style.fill}
                            onChange={(e) => handleStyleChange('fill', e.target.value)}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded p-1.5 text-white text-sm"
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Stroke Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={selectedShape.style.stroke}
                            onChange={(e) => handleStyleChange('stroke', e.target.value)}
                            className="w-8 h-8 rounded border-0 p-0 cursor-pointer"
                        />
                         <input
                            type="text"
                            value={selectedShape.style.stroke}
                            onChange={(e) => handleStyleChange('stroke', e.target.value)}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded p-1.5 text-white text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Stroke Width</label>
                    <input
                        type="number"
                        min="0"
                        value={selectedShape.style.strokeWidth}
                        onChange={(e) => handleStyleChange('strokeWidth', Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-white text-sm"
                    />
                </div>
            </>
        )}
        
        <div>
            <label className="block text-xs text-gray-500 mb-1">Opacity</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedShape.style.opacity}
                onChange={(e) => handleStyleChange('opacity', Number(e.target.value))}
                className="w-full accent-blue-500"
            />
        </div>
      </div>
    </div>
  );
};

export default Controls;
