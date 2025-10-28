import { COMFYUI_URL, COMFYUI_WORKFLOW_TEMPLATE } from '../constants';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("Failed to read blob as string"));
            }
            // remove data:image/...;base64, prefix
            resolve(reader.result.split(',')[1]); 
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
};


const queuePrompt = async (prompt: object): Promise<{ prompt_id: string }> => {
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
        throw new Error(`Failed to queue prompt: ${response.statusText}`);
    }
    return response.json();
};

const getHistory = async (promptId: string): Promise<any> => {
    const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
     if (!response.ok) {
        throw new Error(`Failed to get history: ${response.statusText}`);
    }
    return response.json();
};

const getImage = async (filename: string, subfolder: string, type: string): Promise<Blob> => {
    const response = await fetch(`${COMFYUI_URL}/view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=${encodeURIComponent(type)}`);
    if (!response.ok) {
        throw new Error(`Failed to get image: ${response.statusText}`);
    }
    return response.blob();
}


export const generateImagesWithComfyUI = async (visualDescription: string): Promise<string[]> => {
    try {
        // Deep copy the template
        const workflow = JSON.parse(JSON.stringify(COMFYUI_WORKFLOW_TEMPLATE));
        
        // Inject the prompt and randomize the seed
        workflow["6"].inputs.text = `A cinematic, detailed fantasy art illustration of a creature. ${visualDescription}`;
        workflow["3"].inputs.seed = Math.floor(Math.random() * 1_000_000_000_000_000);

        const { prompt_id } = await queuePrompt(workflow);
        
        return await new Promise<string[]>((resolve, reject) => {
            const timeout = 90000; // 90 seconds timeout
            const interval = 2000; // Poll every 2 seconds
            let timeElapsed = 0;

            const pollInterval = setInterval(async () => {
                try {
                    const history = await getHistory(prompt_id);
                    if (Object.keys(history).length > 0) {
                        clearInterval(pollInterval);
                        const outputs = history[prompt_id].outputs;
                        const imagePromises: Promise<string>[] = [];

                        for (const nodeId in outputs) {
                            const nodeOutput = outputs[nodeId];
                            if (nodeOutput.images) {
                                for (const image of nodeOutput.images) {
                                    const imageBlob = await getImage(image.filename, image.subfolder, image.type);
                                    imagePromises.push(blobToBase64(imageBlob));
                                }
                            }
                        }
                        
                        const base64Images = await Promise.all(imagePromises);
                        resolve(base64Images);
                    }

                    timeElapsed += interval;
                    if (timeElapsed >= timeout) {
                        clearInterval(pollInterval);
                        reject(new Error("ComfyUI image generation timed out."));
                    }
                } catch (error) {
                    // This could be a network error or the server still processing
                    console.warn("Polling ComfyUI...", error);
                }
            }, interval);
        });

    } catch (error) {
        console.error("Error generating images with ComfyUI:", error);
        throw new Error(`Failed to generate images with ComfyUI. Is the server running at ${COMFYUI_URL}?`);
    }
};
