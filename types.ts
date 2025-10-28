
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

export interface Monster {
  id: string;
  name: string;
  description: string;
  visualDescription: string;
  criteria: GenerationCriteria;
  images: MonsterImage[];
  primaryImageIndex: number | null;
  textGenerationStatus: GenerationStatus;
  imageGenerationStatus: GenerationStatus;
}
