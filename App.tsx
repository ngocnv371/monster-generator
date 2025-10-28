import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MonsterGrid from './components/MonsterGrid';
import MonsterDetailModal from './components/MonsterDetailModal';
import GenerationModal from './components/GenerationModal';
import { useMonsterStore } from './hooks/useMonsterStore';
import { generateMonsterDetails } from './services/geminiService';
import { type Monster, type GenerationCriteria, GenerationStatus } from './types';

const App: React.FC = () => {
  const { monsters, addMonster, updateMonster, removeMonster } = useMonsterStore();
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [imageGenerator, setImageGenerator] = useState<'gemini' | 'comfyui'>('gemini');

  const handleGenerateMonster = useCallback(async (criteria: GenerationCriteria) => {
    setIsGenerating(true);
    setIsGenerationModalOpen(false);

    const tempId = crypto.randomUUID();

    const placeholderMonster: Monster = {
      id: tempId,
      name: 'Generating...',
      shortDescription: 'Summoning from the aether...',
      description: '',
      visualDescription: '',
      criteria,
      images: [],
      primaryImageIndex: null,
      textGenerationStatus: GenerationStatus.PENDING,
      imageGenerationStatus: GenerationStatus.IDLE,
      rarity: 'Pending...',
      attack: 0,
      defense: 0,
    };
    addMonster(placeholderMonster);

    try {
      const details = await generateMonsterDetails(criteria);
      const newMonster: Monster = {
        ...placeholderMonster,
        name: details.name,
        shortDescription: details.shortDescription,
        description: details.description,
        visualDescription: details.visualDescription,
        rarity: details.rarity,
        attack: details.attack,
        defense: details.defense,
        textGenerationStatus: GenerationStatus.SUCCESS,
      };
      updateMonster(tempId, newMonster);
    } catch (error) {
      console.error("Failed to generate monster details:", error);
      updateMonster(tempId, { 
        ...placeholderMonster, 
        name: 'Generation Failed', 
        shortDescription: 'The ritual failed.', 
        textGenerationStatus: GenerationStatus.ERROR,
        rarity: 'Unknown',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [addMonster, updateMonster]);
  
  const handleExport = useCallback(() => {
    if (monsters.length === 0) {
        alert("Your beastiary is empty. Nothing to export.");
        return;
    }
    const dataStr = JSON.stringify(monsters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'beastiary_export.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }, [monsters]);

  const selectedMonster = monsters.find(m => m.id === selectedMonsterId);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header 
        onGenerate={() => setIsGenerationModalOpen(true)} 
        onExport={handleExport} 
        isGenerating={isGenerating}
        imageGenerator={imageGenerator}
        onImageGeneratorChange={setImageGenerator}
      />
      <main className="container mx-auto px-4 py-8">
        <MonsterGrid monsters={monsters} onSelectMonster={setSelectedMonsterId} />
      </main>
      
      {isGenerationModalOpen && (
        <GenerationModal
            isOpen={isGenerationModalOpen}
            onClose={() => setIsGenerationModalOpen(false)}
            onSubmit={handleGenerateMonster}
        />
      )}

      {selectedMonster && (
        <MonsterDetailModal
          monster={selectedMonster}
          onClose={() => setSelectedMonsterId(null)}
          onUpdate={updateMonster}
          onDelete={removeMonster}
          imageGenerator={imageGenerator}
        />
      )}
    </div>
  );
};

export default App;