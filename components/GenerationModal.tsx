import React, { useState, useEffect, useCallback } from 'react';
import { TEXTURES, HABITATS, CHARACTERS } from '../constants';
import { type GenerationCriteria } from '../types';
import { SparklesIcon, DiceIcon } from './icons';

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (criteria: GenerationCriteria) => void;
}

const GenerationModal: React.FC<GenerationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [texture1, setTexture1] = useState('');
  const [texture2, setTexture2] = useState('');
  const [habitat, setHabitat] = useState('');
  const [character, setCharacter] = useState('');

  const getRandomItem = useCallback(<T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)], []);

  const handleRandomize = useCallback(() => {
    setTexture1(getRandomItem(TEXTURES));
    setTexture2(getRandomItem(TEXTURES));
    setHabitat(getRandomItem(HABITATS));
    setCharacter(getRandomItem(CHARACTERS));
  }, [getRandomItem]);
  
  useEffect(() => {
    if (isOpen) {
      handleRandomize();
    }
  }, [isOpen, handleRandomize]);

  const handleSubmit = () => {
    if (!texture1 || !texture2 || !habitat || !character) {
      alert("Please select all criteria before generating.");
      return;
    }
    onSubmit({
      textures: [texture1, texture2],
      habitat,
      character,
    });
  };

  if (!isOpen) return null;
  
  const selectStyles = "w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg border border-purple-500/30 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-700">
             <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Generate a New Monster
            </h2>
            <p className="text-gray-400 mt-1">Select the core elements of your creature or randomize them.</p>
        </header>
       
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Texture 1</label>
                <select value={texture1} onChange={e => setTexture1(e.target.value)} className={selectStyles}>
                    {TEXTURES.map(t => <option key={`t1-${t}`} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Texture 2</label>
                <select value={texture2} onChange={e => setTexture2(e.target.value)} className={selectStyles}>
                    {TEXTURES.map(t => <option key={`t2-${t}`} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Habitat</label>
                <select value={habitat} onChange={e => setHabitat(e.target.value)} className={selectStyles}>
                    {HABITATS.map(h => <option key={h} value={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role in Habitat</label>
                <select value={character} onChange={e => setCharacter(e.target.value)} className={selectStyles}>
                    {CHARACTERS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
            </div>
        </div>

        <footer className="p-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleRandomize}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors flex items-center justify-center"
          >
            <DiceIcon className="w-5 h-5 mr-2" />
            Randomize
          </button>
          <div className="flex w-full sm:w-auto items-center gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors flex items-center justify-center"
            >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generate
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GenerationModal;