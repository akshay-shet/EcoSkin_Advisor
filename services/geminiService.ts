import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { ChatMessage, SkinAnalysisResult, SkinRemedies, ColorAdvisorResult, MakeupAdvisorResult, ProductAnalysisResult, SkincareRoutine, WeeklySkincareRoutine, DailyRoutine, HairAdvisorResult, HairAnalysisResult, HairTreatmentsResult } from '../types';

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// Helper to convert a file to the format needed for video generation
const fileToImagePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        imageBytes: await base64EncodedDataPromise,
        mimeType: file.type
    };
};

// Helper to convert base64 data URL back to a generative part
const dataUrlToGenerativePart = (dataUrl: string) => {
    const [header, data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return {
        inlineData: { data, mimeType },
    };
};

export const analyzeSkin = async (image: File, language: string): Promise<SkinAnalysisResult> => {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(image);
    // FIX: Enhanced prompt to include a "deep dive" into the primary skin concern for more detailed user feedback.
    const prompt = `Analyze the user's facial skin in this image with high detail. Identify potential skin conditions like acne, redness, dark spots, or dryness. For each, provide confidence, severity (Mild, Moderate, Severe), and coordinates. Determine overall skin type and tone. Provide a concise overall assessment. Most importantly, identify the single most prominent skin concern and provide a "primaryConcernDeepDive" with a detailed description, potential causes, and actionable lifestyle tips. Respond in ${language}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            // FIX: Updated schema to match the enhanced prompt, including the new 'primaryConcernDeepDive' object.
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    conditions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT, properties: {
                                condition: { type: Type.STRING },
                                confidence: { type: Type.NUMBER },
                                severity: { type: Type.STRING },
                                location: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } }
                            }
                        }
                    },
                    overallAssessment: { type: Type.STRING },
                    skinType: { type: Type.STRING },
                    skinTone: { type: Type.STRING },
                    primaryConcernDeepDive: {
                        type: Type.OBJECT,
                        properties: {
                            concern: { type: Type.STRING, description: "The single most prominent skin concern identified." },
                            description: { type: Type.STRING, description: "A detailed description of the primary concern as seen on the user's face." },
                            potentialCauses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of potential causes for this concern." },
                            lifestyleTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable lifestyle tips to help manage the concern." }
                        }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from analyzeSkin response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const recommendSkinRemedies = async (conditions: string[], skinType: string, language: string): Promise<SkinRemedies> => {
    const ai = getAiClient();
    const prompt = `Based on the following skin conditions: ${conditions.join(', ')} and a skin type of '${skinType}', provide tailored advice. Include specific Ayurvedic remedies, modern medical recommendations, and some general advice. The advice should be suitable for the identified skin type. Respond in ${language}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    ayurvedic: {
                        type: Type.ARRAY,
                        items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } }
                    },
                    modern: {
                        type: Type.ARRAY,
                        items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } }
                    },
                    generalAdvice: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from recommendSkinRemedies response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const generateVisualForRemedy = async (remedyName: string, language: string): Promise<string> => {
    const ai = getAiClient();
    const prompt = `Create a visually appealing, photorealistic image representing the skincare remedy: '${remedyName}'. The image should clearly depict the key ingredient or the product itself in a clean, aesthetic, minimalist setting. For example, for 'Aloe Vera Gel', show an aloe vera plant with its gel. For 'Salicylic Acid Cleanser', show a modern, minimalist cleanser bottle. Focus on a high-quality, product-photography style. Do not include any text or branding on the image. Respond in ${language}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error(`Failed to generate image for remedy: ${remedyName}`);
};

// FIX: Added 'createFacialTimeLapse' function to implement video generation.
export const createFacialTimeLapse = async (imageFile: File, transformation: 'childhood' | 'old age', language: string): Promise<string> => {
    const ai = getAiClient();
    const imagePart = await fileToImagePart(imageFile);
    
    const prompt = `Create a short time-lapse video showing the person in this photo's face transforming to ${transformation}. The video should be a smooth and realistic progression.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: imagePart.imageBytes,
            mimeType: imagePart.mimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '1:1' 
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed, no download link found.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY as string}`);
    if (!videoResponse.ok) {
        const errorText = await videoResponse.text();
        throw new Error(`Failed to download video: ${videoResponse.statusText}. Details: ${errorText}`);
    }
    
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
}


export const recommendOutfitColors = async (image: File, language: string): Promise<ColorAdvisorResult> => {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(image);
    // FIX: Enhanced prompt to include actionable outfit suggestions, making the color advice more practical for the user.
    const prompt = `Analyze the user's skin tone to determine their 'color season'. Based on this, generate three 5-color palettes (Summer, Winter, Monsoon). Also, provide two distinct 'outfitSuggestions', each with an occasion (e.g., 'Casual Brunch', 'Evening Event') and a descriptive combination using colors from the generated palettes. Respond in ${language}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            // FIX: Updated schema to include the new 'outfitSuggestions' array.
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    colorSeason: { type: Type.STRING },
                    palettes: {
                        type: Type.OBJECT,
                        properties: {
                            summer: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, hexCodes: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                            winter: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, hexCodes: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                            monsoon: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, hexCodes: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                        }
                    },
                    outfitSuggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                occasion: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from recommendOutfitColors response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const recommendMakeup = async (image: File, language: string): Promise<MakeupAdvisorResult> => {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(image);
    // FIX: Enhanced prompt to generate a complete, themed makeup look with application steps, in addition to shade recommendations.
    const prompt = `Analyze the user's skin tone. Recommend specific shades (product, shadeName, hexCode) for foundation, blush, eyeshadow, and lipstick. Also, create a complete 'suggestedLook' with a creative lookName (e.g., 'Golden Hour Glow'), a brief description, and simple, step-by-step applicationSteps on how to use the recommended products to achieve the look. Respond in ${language}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            // FIX: Updated schema to return a single object containing both the shade recommendations and the new suggested look.
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recommendations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT, properties: {
                                product: { type: Type.STRING },
                                shadeName: { type: Type.STRING },
                                hexCode: { type: Type.STRING }
                            }
                        }
                    },
                    suggestedLook: {
                        type: Type.OBJECT,
                        properties: {
                            lookName: { type: Type.STRING },
                            description: { type: Type.STRING },
                            applicationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from recommendMakeup response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const analyzeSkincareProduct = async (image: File, language: string): Promise<ProductAnalysisResult> => {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(image);
    // FIX: Enhanced prompt to identify potential ingredient flags and suggest eco-friendly alternatives, aligning with the "ECOSKIN" brand.
    const prompt = `Analyze this skincare product. Identify its name, key ingredients and benefits, usage instructions, and suitable skin types. Additionally, analyze the full ingredient list for 'potentialFlags' (like common irritants, allergens, or comedogenic ingredients) and provide a 'type' ('warning' or 'info') and 'message' for each flag. Finally, suggest two 'ecoFriendlyAlternatives' with a generic productType and a reason. Respond in ${language}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            // FIX: Updated schema to include the new 'potentialFlags' and 'ecoFriendlyAlternatives' arrays.
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    productName: { type: Type.STRING },
                    keyIngredients: {
                        type: Type.ARRAY, items: {
                            type: Type.OBJECT, properties: { name: { type: Type.STRING }, benefit: { type: Type.STRING } }
                        }
                    },
                    usageInstructions: { type: Type.STRING },
                    suitableFor: { type: Type.STRING },
                    potentialFlags: {
                        type: Type.ARRAY, items: {
                            type: Type.OBJECT, properties: { type: { type: Type.STRING }, message: { type: Type.STRING } }
                        }
                    },
                    ecoFriendlyAlternatives: {
                        type: Type.ARRAY, items: {
                            type: Type.OBJECT, properties: { productType: { type: Type.STRING }, reason: { type: Type.STRING } }
                        }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from analyzeSkincareProduct response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const generateSkincareRoutine = async (conditions: string[], skinType: string, language: string): Promise<SkincareRoutine> => {
    const ai = getAiClient();
    const prompt = `Based on the following skin conditions: ${conditions.join(', ')} and a skin type of '${skinType}', generate a personalized daily skincare routine. Provide a simple morning routine and an evening routine. For each step, suggest a generic product type (e.g., 'Gentle foaming cleanser', 'Vitamin C serum') and brief, clear instructions on how to apply it. The routine should be suitable for the identified skin type. Respond in ${language}.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    morning: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                step: { type: Type.NUMBER },
                                productType: { type: Type.STRING },
                                instructions: { type: Type.STRING }
                            }
                        }
                    },
                    evening: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                step: { type: Type.NUMBER },
                                productType: { type: Type.STRING },
                                instructions: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from generateSkincareRoutine response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const generateWeeklySkincarePlan = async (skinType: string, language: string): Promise<WeeklySkincareRoutine> => {
    const ai = getAiClient();
    // FIX: Enhanced prompt to include a unique 'dailyTip' for each day, making the routine more engaging and informative.
    const prompt = `Create a 7-day skincare plan for ${skinType} skin. For each day (Monday-Sunday), provide morning/evening routines with steps (productType, instructions). Include a 'weeklyFocus'. For each day, also provide a unique and helpful 'dailyTip' related to that day's routine (e.g., on an exfoliation day, the tip could be about sun sensitivity). Ensure special treatments like exfoliation or masks are included on appropriate days. Respond in ${language}.`;
    
    const dailyRoutineSchema = {
        type: Type.OBJECT,
        properties: {
            morning: {
                type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: { step: { type: Type.NUMBER }, productType: { type: Type.STRING }, instructions: { type: Type.STRING } }
                }
            },
            evening: {
                 type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: { step: { type: Type.NUMBER }, productType: { type: Type.STRING }, instructions: { type: Type.STRING } }
                }
            },
            // FIX: Added 'dailyTip' to the schema to match the updated prompt.
            dailyTip: { type: Type.STRING }
        }
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    weeklyFocus: { type: Type.STRING },
                    monday: dailyRoutineSchema,
                    tuesday: dailyRoutineSchema,
                    wednesday: dailyRoutineSchema,
                    thursday: dailyRoutineSchema,
                    friday: dailyRoutineSchema,
                    saturday: dailyRoutineSchema,
                    sunday: dailyRoutineSchema,
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from generateWeeklySkincarePlan response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const compareSkinHealth = async (newImageFile: File, previousImageDataUrl: string | null, userNotes: string, language: string): Promise<string> => {
    const ai = getAiClient();
    const newImagePart = await fileToGenerativePart(newImageFile);
    
    let prompt: string;
    let contents: { parts: any[] };

    if (previousImageDataUrl) {
        // This is a comparative entry
        const previousImagePart = dataUrlToGenerativePart(previousImageDataUrl);
        prompt = `Analyze the user's skin progress. Image 1 is the previous entry, and Image 2 is the new entry. Compare the two images, noting any changes in redness, texture, acne, or overall radiance. Provide an encouraging and friendly summary of their progress or suggestions for improvement based on the changes. The user's notes for today are: "${userNotes}". Respond in ${language}.`;
        contents = { parts: [
            { text: "Image 1 (Previous):" },
            previousImagePart,
            { text: "Image 2 (New):" },
            newImagePart,
            { text: prompt }
        ]};
    } else {
        // This is the first journal entry
        prompt = `This is the user's first skin journal entry. Analyze their skin in the photo, identify key conditions, and provide an encouraging baseline assessment for them to track their progress against. The user added these notes: "${userNotes}". Be positive and welcoming. Respond in ${language}.`;
        contents = { parts: [newImagePart, { text: prompt }] };
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
    });
    
    return response.text;
};

export const getHairAdvice = async (image: File, language: string): Promise<HairAdvisorResult> => {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(image);
    const prompt = `Act as an expert hairstylist. Analyze the user's photo to determine their face shape (e.g., Oval, Round, Square, Heart, Long, Diamond) and current hair type (e.g., Straight, Wavy, Curly, Coily; fine, medium, thick). Based on this, provide 3 distinct hairstyle suggestions and 3 hair color suggestions that would be flattering. For each suggestion, provide a name, a detailed description, and a clear 'reasoning' explaining why it suits the user's features. Also, provide a few general hair care tips tailored to their likely hair type. Respond in ${language}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    hairTypeAnalysis: { type: Type.STRING },
                    faceShape: { type: Type.STRING },
                    hairstyleSuggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING },
                                reasoning: { type: Type.STRING }
                            },
                            required: ["name", "description", "reasoning"]
                        }
                    },
                    hairColorSuggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                colorName: { type: Type.STRING },
                                description: { type: Type.STRING },
                                reasoning: { type: Type.STRING }
                            },
                            required: ["colorName", "description", "reasoning"]
                        }
                    },
                    hairCareTips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from getHairAdvice response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

// FIX: Added a new function to generate a virtual hairstyle try-on image, providing a highly engaging user experience.
export const generateVirtualTryOn = async (imageFile: File, hairstyleDescription: string): Promise<string> => {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `Photo edit request: Edit the user's photo to give them the following hairstyle: "${hairstyleDescription}". Maintain the user's facial features and the original background. The result should be a realistic portrait showing the new hairstyle on the person in the photo.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, { text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error(`Failed to generate virtual try-on for hairstyle: ${hairstyleDescription}`);
};

export const analyzeHair = async (image: File, language: string): Promise<HairAnalysisResult> => {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(image);
    const prompt = `Act as a trichologist. Analyze the user's photo. Determine their face shape (e.g., Oval, Round, Square, Heart). Also analyze their hair in this image. Determine hair type, texture, porosity, and assess scalp health. Provide a concise overall assessment. Most importantly, identify the single most prominent hair or scalp concern and provide a "primaryConcernDeepDive" with the concern name, a detailed explanation, and a list of specific 'ingredientsToLookFor' in hair products. Respond in ${language}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    hairType: { type: Type.STRING },
                    texture: { type: Type.STRING },
                    porosity: { type: Type.STRING },
                    scalpHealth: { type: Type.STRING },
                    faceShape: { type: Type.STRING },
                    overallAssessment: { type: Type.STRING },
                    primaryConcernDeepDive: {
                        type: Type.OBJECT,
                        properties: {
                            concern: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                            ingredientsToLookFor: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                },
                required: ["hairType", "texture", "porosity", "scalpHealth", "faceShape", "overallAssessment"]
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from analyzeHair response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};

export const recommendHairTreatments = async (analysis: HairAnalysisResult, language: string): Promise<HairTreatmentsResult> => {
    const ai = getAiClient();
    const prompt = `Based on the following hair analysis: Hair Type: ${analysis.hairType}, Texture: ${analysis.texture}, Porosity: ${analysis.porosity}, Scalp Health: ${analysis.scalpHealth}, and Assessment: "${analysis.overallAssessment}", provide tailored advice for improving hair health. Include specific home remedies, recommendations for generic product types with reasoning (e.g., 'Sulfate-free shampoo to prevent stripping natural oils'), professional treatments if applicable, and some general hair care tips. Respond in ${language}.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    homeRemedies: {
                        type: Type.ARRAY,
                        items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } }
                    },
                    productRecommendations: {
                        type: Type.ARRAY,
                        items: { type: Type.OBJECT, properties: { productType: { type: Type.STRING }, reason: { type: Type.STRING } } }
                    },
                    professionalTreatments: {
                        type: Type.ARRAY,
                        items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } }
                    },
                    generalTips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from recommendHairTreatments response:", response.text, e);
        throw new Error("Received an invalid response from the AI model. Please check the console for details.");
    }
};


let chatInstance: Chat | null = null;
let currentLanguage: string = 'en';

export const getChatInstance = (language: string): Chat => {
    if (!chatInstance || currentLanguage !== language) {
        const ai = getAiClient();
        currentLanguage = language;
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are AURA, a friendly and witty AI skincare expert. Your goal is to make skincare fun and easy to understand. Keep your replies short, friendly, and engaging, like you're texting a friend. Use emojis where appropriate. Only give detailed explanations if the user asks for them. Stick strictly to skincare, beauty, and wellness topics. If asked about anything else, politely deflect with a touch of humor and guide the conversation back to skincare. For example: "Whoa there! I'm a skincare guru, not a math whiz. Got any skin questions for me instead? 😉". All your responses must be in ${language}.`,
                tools: [{googleSearch: {}}],
            },
        });
    }
    return chatInstance;
};

export const chatWithAuraStream = async (newMessage: string, language: string) => {
    const chat = getChatInstance(language);
    
    // The Gemini Chat API manages history internally, so we just send the new message
    return chat.sendMessageStream({ message: newMessage });
};