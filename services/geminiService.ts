import { GoogleGenAI, Type } from "@google/genai";
import { type GenerationCriteria, type Rarity } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface MonsterDetails {
    name: string;
    shortDescription: string;
    description: string;
    visualDescription: string;
    rarity: Rarity;
    attack: number;
    defense: number;
}

export const generateMonsterDetails = async (criteria: GenerationCriteria): Promise<MonsterDetails> => {
    const prompt = `
    You are a creative world-builder creating a creature for a bestiary. Based on the following criteria, generate a monster.
    Criteria:
    - Appearance based on textures: '${criteria.textures[0]}' and '${criteria.textures[1]}'.
    - Lives in a '${criteria.habitat}' habitat.
    - Fulfills the role of a '${criteria.character}'.
    
    Please provide a response in JSON format.
    The monster should have a rarity ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'), and attack/defense ratings from 1 to 5.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: "A unique and fitting name for the monster."
                        },
                        shortDescription: {
                            type: Type.STRING,
                            description: "A short, one-sentence summary of the monster, suitable for a card display."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A 2-3 paragraph description of its lore, behavior, and role in its habitat."
                        },
                        visualDescription: {
                            type: Type.STRING,
                            description: "A detailed paragraph focusing on its physical appearance, suitable for an AI image generator. Describe its form, colors, and textures vividly."
                        },
                        rarity: {
                            type: Type.STRING,
                            description: "The monster's rarity level. Must be one of: 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'."
                        },
                        attack: {
                            type: Type.INTEGER,
                            description: "An integer rating for attack strength, from 1 to 5."
                        },
                        defense: {
                            type: Type.INTEGER,
                            description: "An integer rating for defense strength, from 1 to 5."
                        }
                    },
                    required: ["name", "shortDescription", "description", "visualDescription", "rarity", "attack", "defense"]
                },
                temperature: 0.9,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MonsterDetails;

    } catch (error) {
        console.error("Error generating monster details with Gemini:", error);
        throw new Error("Failed to generate monster details.");
    }
};

export const generateMonsterImages = async (visualDescription: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A cinematic, detailed fantasy art illustration of a creature. ${visualDescription}`,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio: '3:4',
            },
        });
        
        return response.generatedImages.map(img => img.image.imageBytes);

    } catch (error) {
        console.error("Error generating monster images with Gemini:", error);
        throw new Error("Failed to generate monster images.");
    }
};