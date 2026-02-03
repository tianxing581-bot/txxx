
import { GoogleGenAI } from "@google/genai";

export async function generateChatResponse(
  modelName: string,
  systemInstruction: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userMessage: string,
  useSearch: boolean = false
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const config: any = {
    systemInstruction,
    temperature: 0.7,
  };

  if (useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    config
  });

  return {
    text: response.text || "抱歉，我未能生成回复。",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

export async function generateMarketingVideoPrompt(productDesc: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Upgraded to Pro for better creative output as per PDF expectations
    contents: `根据以下产品描述，生成一个高质量、具有感染力的视频生成提示词（用于Veo/Sora）：${productDesc}. 
    要求包含：镜头语言、光影气氛、情感基调。参考风格：复库蒙太奇、感人、专业。`,
  });
  return response.text;
}
