export const TEXTURES: string[] = [
  "rough", "smooth", "slimy", "furry", "scaled", "metallic", "crystalline",
  "gaseous", "liquid", "origami", "ethereal", "shadowy", "luminescent", "brittle",
  "mossy", "wooden", "stone", "fleshy", "gelatinous", "porous", "fluid"
];

export const HABITATS: string[] = [
  "forest", "mountain", "cave", "swamp", "desert", "tundra", "ocean trench",
  "volcano", "city ruins", "astral plane", "dreamscape", "cybernetic grid",
  "swarm", "slum", "temple", "library", "abyss", "sky island", "crystal cavern"
];

export const CHARACTERS: string[] = [
  "hunter", "prey", "guardian", "trickster", "scavenger", "hermit", "alpha",
  "symbiote", "parasite", "queen", "worker", "builder", "destroyer", "explorer",
  "oracle", "mimic", "shaman", "warrior"
];

export const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'] as const;

export const ITEMS_PER_PAGE = 12;

// NOTE: Update this URL to point to your running ComfyUI instance.
export const COMFYUI_URL = 'http://127.0.0.1:8188';

export const COMFYUI_WORKFLOW_TEMPLATE = {
  "4": {
    "inputs": { "ckpt_name": "v1-5-pruned-emaonly.ckpt" },
    "class_type": "CheckpointLoaderSimple"
  },
  "5": {
    "inputs": { "width": 768, "height": 1024, "batch_size": 4 },
    "class_type": "EmptyLatentImage"
  },
  "6": {
    "inputs": { "text": "placeholder_prompt", "clip": ["4", 1] },
    "class_type": "CLIPTextEncode"
  },
  "7": {
    "inputs": { "text": "text, wattermark, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, blurred, watermark, grainy, signature, cut off, draft", "clip": ["4", 1] },
    "class_type": "CLIPTextEncode"
  },
  "8": {
    "inputs": { "samples": ["3", 0], "vae": ["4", 2] },
    "class_type": "VAEDecode"
  },
  "9": {
    "inputs": { "filename_prefix": "Beastiary", "images": ["8", 0] },
    "class_type": "SaveImage"
  },
  "3": {
    "inputs": {
      "seed": 0, // Placeholder, will be randomized
      "steps": 20,
      "cfg": 8,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1,
      "model": ["4", 0],
      "positive": ["6", 0],
      "negative": ["7", 0],
      "latent_image": ["5", 0]
    },
    "class_type": "KSampler"
  }
};
