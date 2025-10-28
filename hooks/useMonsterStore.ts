
import { useState, useEffect, useCallback } from 'react';
import { type Monster } from '../types';

const STORE_KEY = 'beastiary_monsters';

export const useMonsterStore = () => {
  const [monsters, setMonsters] = useState<Monster[]>(() => {
    try {
      const item = window.localStorage.getItem(STORE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(monsters));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [monsters]);

  const addMonster = useCallback((monster: Monster) => {
    setMonsters(prevMonsters => [monster, ...prevMonsters]);
  }, []);

  const updateMonster = useCallback((id: string, updatedMonsterData: Partial<Monster>) => {
    setMonsters(prevMonsters =>
      prevMonsters.map(monster =>
        monster.id === id ? { ...monster, ...updatedMonsterData } : monster
      )
    );
  }, []);
  
  const removeMonster = useCallback((id: string) => {
    setMonsters(prevMonsters => prevMonsters.filter(monster => monster.id !== id));
  }, []);

  return { monsters, addMonster, updateMonster, removeMonster };
};
