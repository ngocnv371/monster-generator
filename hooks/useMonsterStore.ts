
import { useState, useEffect, useCallback } from 'react';
import { type Monster } from '../types';
import { supabase } from '../services/supabaseClient';

export const useMonsterStore = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonsters = useCallback(async () => {
    try {
      setLoading(true);
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) return;

      const { data, error } = await supabase
        .from('monsters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setMonsters(data || []);
    } catch (error) {
      console.error("Error fetching monsters from Supabase:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonsters();
    
    // Listen for auth changes to refetch data
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            fetchMonsters();
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [fetchMonsters]);

  const addMonster = useCallback(async (monsterData: Omit<Monster, 'id' | 'created_at' | 'user_id'>) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const fullMonsterData = { ...monsterData, user_id: user.id };

        const { data, error } = await supabase
            .from('monsters')
            .insert([fullMonsterData])
            .select();

        if (error) {
            throw error;
        }
        
        if (data && data[0]) {
             setMonsters(prevMonsters => [data[0], ...prevMonsters]);
        }
    } catch (error) {
        console.error("Error adding monster to Supabase:", error);
        throw error;
    }
  }, []);

  const updateMonster = useCallback(async (id: string, updatedMonsterData: Partial<Monster>) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { id: monsterId, created_at, user_id, ...updateData } = updatedMonsterData;

        const { data, error } = await supabase
            .from('monsters')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select();
        
        if (error) {
            throw error;
        }

        if (data && data[0]) {
             setMonsters(prevMonsters =>
                prevMonsters.map(monster =>
                    monster.id === id ? data[0] : monster
                )
            );
        }
    } catch (error) {
         console.error("Error updating monster in Supabase:", error);
    }
  }, []);
  
  const removeMonster = useCallback(async (id: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        // First, get the monster to find its images for deletion from storage
        const monsterToRemove = monsters.find(m => m.id === id);
        
        if (monsterToRemove && monsterToRemove.images.length > 0) {
            const filePaths = monsterToRemove.images.map(url => {
                const urlParts = new URL(url);
                // The path is something like /storage/v1/object/public/monster-images/path/to/file.jpg
                // We need to extract 'path/to/file.jpg'
                const pathSegments = urlParts.pathname.split('/');
                return pathSegments.slice(pathSegments.indexOf('monster-images') + 1).join('/');
            });

            if (filePaths.length > 0) {
                 const { error: storageError } = await supabase.storage.from('monster-images').remove(filePaths);
                 if (storageError) {
                     console.error("Error deleting images from storage: ", storageError);
                     // Decide if you want to stop the deletion process if storage fails
                 }
            }
        }


        const { error } = await supabase
            .from('monsters')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }

        setMonsters(prevMonsters => prevMonsters.filter(monster => monster.id !== id));
    } catch (error) {
         console.error("Error removing monster from Supabase:", error);
    }
  }, [monsters]);

  return { monsters, loading, addMonster, updateMonster, removeMonster };
};
