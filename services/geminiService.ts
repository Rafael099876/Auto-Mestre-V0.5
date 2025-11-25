
import { GoogleGenAI, Type } from "@google/genai";
import { MaintenanceGuide, Vehicle } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development if the env var isn't set.
  // In a real deployed environment, the process.env.API_KEY should be available.
  console.warn("API_KEY is not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const schema = {
  type: Type.OBJECT,
  properties: {
    tools: {
      type: Type.ARRAY,
      description: 'A list of tools required for the maintenance task.',
      items: { type: Type.STRING }
    },
    steps: {
      type: Type.ARRAY,
      description: 'A step-by-step guide to perform the maintenance task.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'A short title for the step.' },
          description: { type: Type.STRING, description: 'A detailed description of the step.' }
        },
        required: ['title', 'description']
      }
    }
  },
  required: ['tools', 'steps']
};

export const generateMaintenanceGuide = async (vehicle: Vehicle, taskName: string): Promise<MaintenanceGuide | null> => {
  if (!API_KEY) {
    console.error("Gemini API key not configured.");
    // Return mock data if API key is not available
    return {
        tools: ["Wrench Set", "Oil Filter Wrench", "Oil Drain Pan", "Funnel", "Gloves"],
        steps: [
            { title: "Prepare Vehicle", description: "Park the car on a level surface and engage the parking brake. Let the engine cool down for at least 30 minutes." },
            { title: "Locate Drain Plug", description: "Find the oil drain plug under the engine. Place the drain pan underneath it." },
            { title: "Drain Oil", description: "Unscrew the drain plug and let the old oil drain completely into the pan." },
            { title: "Replace Filter", description: "Remove the old oil filter using the filter wrench. Apply a thin layer of new oil to the gasket of the new filter and screw it on hand-tight." },
            { title: "Add New Oil", description: "Replace the drain plug. Using a funnel, add the new oil specified for your vehicle. Check the dipstick to ensure the correct level." }
        ]
    };
  }

  try {
    const prompt = `
      Generate a vehicle maintenance guide.
      Vehicle: ${vehicle.year} ${vehicle.brand} ${vehicle.model}
      Task: ${taskName}

      Provide a list of necessary tools and a detailed step-by-step guide for a beginner.
      Ensure the response is in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text;
    const guide: MaintenanceGuide = JSON.parse(jsonString);
    return guide;
  } catch (error) {
    console.error("Error generating maintenance guide:", error);
    return null;
  }
};
