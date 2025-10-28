import React, { useState, useEffect } from 'react';
import { type Monster, GenerationStatus } from '../types';
import { generateMonsterImages } from '../services/geminiService';
import { CloseIcon, SaveIcon, TrashIcon, ImageIcon, CheckCircleIcon, ScissorsIcon } from './icons';
import Spinner from './Spinner';
import { RARITIES } from '../constants';
import ConfirmModal from './ConfirmModal';


interface MonsterDetailModalProps {
  monster: Monster;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Monster>) => void;
  onDelete: (id: string) => void;
}

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

const MonsterDetailModal: React.FC<MonsterDetailModalProps> = ({ monster, onClose, onUpdate, onDelete }) => {
  const [editableMonster, setEditableMonster] = useState(monster);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    setEditableMonster(monster);
  }, [monster]);
  
  const handleFieldChange = (field: keyof Monster, value: string) => {
    if (field === 'attack' || field === 'defense') {
      let numValue = parseInt(value, 10);
      if (isNaN(numValue)) numValue = 1;
      if (numValue < 1) numValue = 1;
      if (numValue > 5) numValue = 5;
      setEditableMonster(prev => ({ ...prev, [field]: numValue }));
    } else {
      setEditableMonster(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    onUpdate(monster.id, editableMonster);
    onClose();
  };
  
  const handleDelete = () => {
    setConfirmState({
        isOpen: true,
        title: 'Delete Monster',
        message: `Are you sure you want to delete ${monster.name}? This action cannot be undone.`,
        onConfirm: () => {
            onDelete(monster.id);
            onClose();
        }
    });
  };

  const handleGenerateImages = async () => {
    setIsGeneratingImages(true);
    onUpdate(monster.id, { imageGenerationStatus: GenerationStatus.PENDING });
    try {
      const imageBytesArray = await generateMonsterImages(monster.visualDescription);
      const newImages = imageBytesArray.map(base64 => ({ base64 }));
      onUpdate(monster.id, { 
        images: newImages, 
        primaryImageIndex: 0,
        imageGenerationStatus: GenerationStatus.SUCCESS
      });
    } catch (error) {
      console.error("Failed to generate images", error);
      onUpdate(monster.id, { imageGenerationStatus: GenerationStatus.ERROR });
    } finally {
      setIsGeneratingImages(false);
    }
  };
  
  const setPrimaryImage = (index: number) => {
    onUpdate(monster.id, { primaryImageIndex: index });
  };
  
  const handleRemoveNonPrimaryImages = () => {
    if (monster.primaryImageIndex === null || monster.images.length <= 1) return;
    setConfirmState({
        isOpen: true,
        title: 'Remove Non-Primary Images',
        message: 'Are you sure you want to remove all other images? This cannot be undone.',
        onConfirm: () => {
            const primaryImage = monster.images[monster.primaryImageIndex!];
            onUpdate(monster.id, {
                images: [primaryImage],
                primaryImageIndex: 0
            });
        }
    });
  };

  const closeConfirm = () => setConfirmState({ ...confirmState, isOpen: false });

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-purple-500/30">
          <header className="p-4 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{monster.name}</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete monster"><TrashIcon className="w-6 h-6"/></button>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal"><CloseIcon className="w-7 h-7"/></button>
            </div>
          </header>
          
          <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" value={editableMonster.name} onChange={e => handleFieldChange('name', e.target.value)} className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Short Description</label>
                <textarea value={editableMonster.shortDescription} onChange={e => handleFieldChange('shortDescription', e.target.value)} rows={3} className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Description</label>
                <textarea value={editableMonster.description} onChange={e => handleFieldChange('description', e.target.value)} rows={6} className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Visual Description</label>
                <textarea value={editableMonster.visualDescription} onChange={e => handleFieldChange('visualDescription', e.target.value)} rows={6} className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div className="grid grid-cols-3 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Rarity</label>
                      <select value={editableMonster.rarity} onChange={e => handleFieldChange('rarity', e.target.value)} className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                          {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Attack</label>
                      <input type="number" min="1" max="5" value={editableMonster.attack} onChange={e => handleFieldChange('attack', e.target.value)} className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Defense</label>
                      <input type="number" min="1" max="5" value={editableMonster.defense} onChange={e => handleFieldChange('defense', e.target.value)} className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                  </div>
              </div>
               <div className="text-xs text-gray-500 mt-2">
                  <p><strong className="text-gray-400">Habitat:</strong> {monster.criteria.habitat}</p>
                  <p><strong className="text-gray-400">Role:</strong> {monster.criteria.character}</p>
                  <p><strong className="text-gray-400">Textures:</strong> {monster.criteria.textures.join(', ')}</p>
              </div>
            </div>
            
            {/* Right Column: Images */}
            <div className="flex flex-col gap-4">
              <button onClick={handleGenerateImages} disabled={isGeneratingImages || monster.textGenerationStatus !== GenerationStatus.SUCCESS} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                {isGeneratingImages ? <Spinner className="w-5 h-5 mr-2"/> : <ImageIcon className="w-5 h-5 mr-2" />}
                {isGeneratingImages ? 'Generating Images...' : 'Generate Images'}
              </button>
              
              {monster.images.length > 1 && monster.primaryImageIndex !== null && (
                  <button onClick={handleRemoveNonPrimaryImages} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                      <ScissorsIcon className="w-5 h-5 mr-2" />
                      Keep Only Primary Image
                  </button>
              )}

              {monster.imageGenerationStatus === GenerationStatus.ERROR && <p className="text-red-400 text-center">Image generation failed. Please try again.</p>}

              <div className="grid grid-cols-2 gap-4">
                {monster.images.map((image, index) => (
                  <div key={index} className="relative group aspect-square cursor-pointer" onClick={() => setPrimaryImage(index)}>
                    <img src={`data:image/jpeg;base64,${image.base64}`} alt={`Generated monster image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                    {monster.primaryImageIndex === index && (
                      <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center rounded-md">
                        <CheckCircleIcon className="w-12 h-12 text-white" />
                      </div>
                    )}
                     {monster.primaryImageIndex !== index && (
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                          <p className="text-white font-semibold">Set as Primary</p>
                      </div>
                     )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <footer className="p-4 border-t border-gray-700 mt-auto">
            <button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
              <SaveIcon className="w-5 h-5 mr-2"/> Save Changes
            </button>
          </footer>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => {
            confirmState.onConfirm();
            closeConfirm();
        }}
        onCancel={closeConfirm}
        confirmButtonClass='bg-red-600 hover:bg-red-700'
        confirmText='Confirm'
      />
    </>
  );
};

export default MonsterDetailModal;