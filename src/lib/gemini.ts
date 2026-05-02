import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Only throw in production or if used, otherwise it breaks build if not set
if (typeof window === "undefined" && !apiKey && process.env.NODE_ENV === "production") {
  console.warn("GEMINI_API_KEY is not defined in environment variables");
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getGeminiModel = (systemInstruction?: string) => {
  if (!genAI) {
    throw new Error("Gemini API client not initialized. Check your GEMINI_API_KEY.");
  }
  return genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    ...(systemInstruction && { systemInstruction })
  });
};
