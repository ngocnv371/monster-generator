
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MonsterGrid from './components/MonsterGrid';
import MonsterDetailModal from './components/MonsterDetailModal';
import { useMonsterStore } from './hooks/useMonsterStore';
import { generateMonsterDetails } from './services/geminiService';
import { TEXTURES, HABITATS, CHARACTERS } from './constants';
import { type Monster, GenerationStatus } from './types';

const App: React.FC = () => {
  const { monsters, addMonster, updateMonster, removeMonster } = useMonsterStore();
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMonster = useCallback(async () => {
    setIsGenerating(true);

    const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const textures: [string, string] = [getRandomItem(TEXTURES), getRandomItem(TEXTURES)];
    const habitat = getRandomItem(HABITATS);
    const character = getRandomItem(CHARACTERS);

    const criteria = { textures, habitat, character };
    const tempId = crypto.randomUUID();

    const placeholderMonster: Monster = {
      id: tempId,
      name: 'Generating...',
      description: '',
      visualDescription: '',
      criteria,
      images: [],
      primaryImageIndex: null,
      textGenerationStatus: GenerationStatus.PENDING,
      imageGenerationStatus: GenerationStatus.IDLE,
    };
    addMonster(placeholderMonster);

    try {
      const details = await generateMonsterDetails(criteria);
      const newMonster: Monster = {
        ...placeholderMonster,
        name: details.name,
        description: details.description,
        visualDescription: details.visualDescription,
        textGenerationStatus: GenerationStatus.SUCCESS,
      };
      updateMonster(tempId, newMonster);
    } catch (error) {
      console.error("Failed to generate monster details:", error);
      updateMonster(tempId, { ...placeholderMonster, name: 'Generation Failed', textGenerationStatus: GenerationStatus.ERROR });
    } finally {
      setIsGenerating(false);
    }
  }, [addMonster, updateMonster]);
  
  const selectedMonster = monsters.find(m => m.id === selectedMonsterId);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onGenerate={handleGenerateMonster} isGenerating={isGenerating} />
      <main className="container mx-auto px-4 py-8">
        <MonsterGrid monsters={monsters} onSelectMonster={setSelectedMonsterId} />
      </main>
      {selectedMonster && (
        <MonsterDetailModal
          monster={selectedMonster}
          onClose={() => setSelectedMonsterId(null)}
          onUpdate={updateMonster}
          onDelete={removeMonster}
        />
      )}
    </div>
  );
};

export default App;
