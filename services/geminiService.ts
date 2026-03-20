import { GoogleGenAI } from "@google/genai";
import { GeminiImageConfig } from "../types";

// Helper to get client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const generateSvgPath = async (prompt: string): Promise<string> => {
  const ai = getClient();
  const fullPrompt = `You are an SVG expert. Generate ONLY the 'd' attribute string for an SVG path that represents: "${prompt}". 
  Do not include <svg> tags, do not include quotes around the string. Just the path data. 
  Keep it relatively simple and centered if possible.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
  });

  const text = response.text || "";
  // Simple cleanup to remove any markdown code block syntax if the model adds it
  return text.replace(/`/g, '').replace(/xml/g, '').trim();
};

export const generateImage = async (prompt: string, config: GeminiImageConfig): Promise<string> => {
  const ai = getClient();
  
  // Using the Nano Banana Pro model as requested
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio,
        imageSize: config.imageSize,
      }
    }
  });

  // Extract image
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image generated.");
};
