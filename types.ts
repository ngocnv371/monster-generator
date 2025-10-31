import { type RARITIES } from './constants';

export interface GenerationCriteria {
  textures: [string, string];
  habitat: string;
  character: string;
}

export enum GenerationStatus {
  IDLE,
  PENDING,
  SUCCESS,
  ERROR,
}

export type Rarity = typeof RARITIES[number];

export interface Monster {
  id: string;
  user_id: string;
  // Fix: made created_at mandatory as it should always be present on a fetched monster record.
  created_at: string;
  name: string;
  shortDescription: string;
  description: string;
  visualDescription: string;
  criteria: GenerationCriteria;
  images: string[];
  primaryImageIndex: number | null;
  textGenerationStatus: GenerationStatus;
  imageGenerationStatus: GenerationStatus;
  rarity: Rarity | string; // Allow string for "Generating..." state
  attack: number;
  defense: number;
}

// Fix: Add AppSettings interface to be used by SettingsModal
export interface AppSettings {
  supabaseUrl: string;
  supabaseAnonKey: string;
  imageGenerator: 'gemini' | 'comfyui';
}