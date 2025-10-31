
import React, { useState, useEffect } from 'react';
import { SaveIcon, CloseIcon } from './icons';
import { type AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Partial<AppSettings>) => void;
  currentSettings: Partial<AppSettings>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [imageGenerator, setImageGenerator] = useState<'gemini' | 'comfyui'>('gemini');

  useEffect(() => {
    if (isOpen) {
      setImageGenerator(currentSettings.imageGenerator || 'gemini');
    }
  }, [isOpen, currentSettings]);

  const handleSave = () => {
    onSave({
      imageGenerator,
    });
  };

  if (!isOpen) return null;

  const inputStyles = "w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg border border-purple-500/30 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-700 flex justify-between items-center">
             <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Application Settings
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal"><CloseIcon className="w-7 h-7"/></button>
        </header>
       
        <div className="p-6 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Image Generator</label>
              <select
                  value={imageGenerator}
                  onChange={(e) => setImageGenerator(e.target.value as 'gemini' | 'comfyui')}
                  className={inputStyles}
                  aria-label="Select image generator"
              >
                  <option value="gemini">Gemini (Recommended)</option>
                  <option value="comfyui">ComfyUI (Local)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                  Select your preferred service for generating monster images.
              </p>
            </div>
        </div>

        <footer className="p-6 border-t border-gray-700">
            <button
              onClick={handleSave}
              className="w-full px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors flex items-center justify-center"
            >
                <SaveIcon className="w-5 h-5 mr-2" />
                Save Settings
            </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
