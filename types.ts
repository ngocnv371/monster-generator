import { type RARITIES } from './constants';

export interface MonsterImage {
  base64: string;
}

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
  name: string;
  shortDescription: string;
  description: string;
  visualDescription: string;
  criteria: GenerationCriteria;
  images: MonsterImage[];
  primaryImageIndex: number | null;
  textGenerationStatus: GenerationStatus;
  imageGenerationStatus: GenerationStatus;
  rarity: Rarity | string; // Allow string for "Generating..." state
  attack: number;
  defense: number;
}
