
import { GoogleGenAI, Type } from "@google/genai";
import { type GenerationCriteria } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface MonsterDetails {
    name: string;
    shortDescription: string;
    description: string;
    visualDescription: string;
}

export const generateMonsterDetails = async (criteria: GenerationCriteria): Promise<MonsterDetails> => {
    const prompt = `
    You are a creative world-builder creating a creature for a bestiary. Based on the following criteria, generate a monster.
    Criteria:
    - Appearance based on textures: '${criteria.textures[0]}' and '${criteria.textures[1]}'.
    - Lives in a '${criteria.habitat}' habitat.
    - Fulfills the role of a '${criteria.character}'.
    
    Please provide a response in JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
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
                        }
                    },
                    required: ["name", "shortDescription", "description", "visualDescription"]
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
                aspectRatio: '2:3',
            },
        });
        
        return response.generatedImages.map(img => img.image.imageBytes);

    } catch (error) {
        console.error("Error generating monster images with Gemini:", error);
        throw new Error("Failed to generate monster images.");
    }
};
