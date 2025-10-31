
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MonsterGrid from './components/MonsterGrid';
import MonsterDetailModal from './components/MonsterDetailModal';
import GenerationModal from './components/GenerationModal';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';
import { useMonsterStore } from './hooks/useMonsterStore';
import { generateMonsterDetails } from './services/geminiService';
import { type Monster, type GenerationCriteria, GenerationStatus, type AppSettings } from './types';
import { supabase } from './services/supabaseClient';
import { type Session } from '@supabase/supabase-js';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [imageGenerator, setImageGenerator] = useState<'gemini' | 'comfyui'>('gemini');
  
  const { monsters, addMonster, updateMonster, removeMonster, loading } = useMonsterStore();
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const savedGenerator = localStorage.getItem('ai-beastiary-image-generator');
    if (savedGenerator === 'gemini' || savedGenerator === 'comfyui') {
        setImageGenerator(savedGenerator as 'gemini' | 'comfyui');
    }
  }, []);

  useEffect(() => {
    setSessionLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);


  const handleGenerateMonster = useCallback(async (criteria: GenerationCriteria) => {
    setIsGenerating(true);
    setIsGenerationModalOpen(false);

    try {
      const details = await generateMonsterDetails(criteria);
      const newMonster: Omit<Monster, 'id' | 'created_at' | 'user_id'> = {
        name: details.name,
        shortDescription: details.shortDescription,
        description: details.description,
        visualDescription: details.visualDescription,
        rarity: details.rarity,
        attack: details.attack,
        defense: details.defense,
        criteria,
        images: [],
        primaryImageIndex: null,
        textGenerationStatus: GenerationStatus.SUCCESS,
        imageGenerationStatus: GenerationStatus.IDLE,
      };
      await addMonster(newMonster);
    } catch (error) {
      console.error("Failed to generate and save monster:", error);
      // Optionally, show an error notification to the user
      alert("Failed to create a new monster. Please check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  }, [addMonster]);
  
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
  
  const handleLogout = async () => {
    if(supabase) await supabase.auth.signOut();
  }

  const handleSaveSettings = (settings: Partial<AppSettings>) => {
    if (settings.imageGenerator) {
        setImageGenerator(settings.imageGenerator);
        localStorage.setItem('ai-beastiary-image-generator', settings.imageGenerator);
    }
    setIsSettingsModalOpen(false);
  };

  const selectedMonster = monsters.find(m => m.id === selectedMonsterId);

  if (sessionLoading) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <Spinner className="w-12 h-12 text-purple-400" />
        </div>
      );
  }
  
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header 
        onGenerate={() => setIsGenerationModalOpen(true)} 
        onExport={handleExport} 
        isGenerating={isGenerating}
        session={session}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      <main className="container mx-auto px-4 py-8">
        <MonsterGrid monsters={monsters} onSelectMonster={setSelectedMonsterId} loading={loading} />
      </main>
      
      {isGenerationModalOpen && (
        <GenerationModal
            isOpen={isGenerationModalOpen}
            onClose={() => setIsGenerationModalOpen(false)}
            onSubmit={handleGenerateMonster}
        />
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={{ imageGenerator }}
      />

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
