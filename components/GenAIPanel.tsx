import React, { useState } from 'react';
import { generateImage, generateSvgPath } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Code, Loader2 } from 'lucide-react';
import { GeminiImageConfig } from '../types';

interface GenAIPanelProps {
  onAddImage: (url: string) => void;
  onAddPath: (d: string) => void;
}

const GenAIPanel: React.FC<GenAIPanelProps> = ({ onAddImage, onAddPath }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'path'>('image');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image Generation Config
  const [aspectRatio, setAspectRatio] = useState<GeminiImageConfig['aspectRatio']>('1:1');
  const [imageSize, setImageSize] = useState<GeminiImageConfig['imageSize']>('1K');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'image') {
        // Use gemini-3-pro-image-preview
        const base64Image = await generateImage(prompt, { aspectRatio, imageSize });
        onAddImage(base64Image);
      } else {
        // Use gemini-2.5-flash for Text-to-Path
        const pathData = await generateSvgPath(prompt);
        onAddPath(pathData);
      }
      setPrompt(''); // Clear prompt on success
    } catch (err: any) {
        console.error(err);
      setError(err.message || "Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 text-purple-400 mb-2">
        <Sparkles size={20} />
        <h2 className="text-xl font-bold text-white">Gemini AI</h2>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'image' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ImageIcon size={16} />
          Image Gen
        </button>
        <button
          onClick={() => setActiveTab('path')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'path' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Code size={16} />
          Shape Gen
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'image' && (
            <div className="bg-gray-800/50 p-3 rounded border border-gray-700 text-sm space-y-3">
                <p className="text-gray-400 text-xs">Model: <span className="text-purple-300">Nano Banana Pro (gemini-3-pro-image-preview)</span></p>
                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">Size</label>
                        <select 
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value as any)}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                        >
                            <option value="1K">1K</option>
                            <option value="2K">2K</option>
                            <option value="4K">4K</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">Aspect Ratio</label>
                        <select 
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as any)}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                        >
                            <option value="1:1">1:1 (Square)</option>
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                        </select>
                    </div>
                </div>
            </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {activeTab === 'image' ? "Describe the image to generate" : "Describe the shape (e.g., 'a star', 'a checkmark')"}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder={activeTab === 'image' ? "A futuristic neon city..." : "A lightning bolt shape..."}
          />
        </div>

        {error && (
            <div className="text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-900">
                {error}
            </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenAIPanel;
