/**
 * Google Gen AI SDK — Vertex AI backend
 * SDK: @google/genai v1.51+ (replaces deprecated @google-cloud/vertexai)
 * Auth: Application Default Credentials (ADC)
 *   Local: Run once → "C:\Users\dsouh\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login
 *   Cloud Run: Automatic via attached service account
 *
 * Env vars read automatically by the SDK:
 *   GOOGLE_GENAI_USE_VERTEXAI=true
 *   GOOGLE_CLOUD_PROJECT=promptwars-apr-26
 *   GOOGLE_CLOUD_LOCATION=global
 */

import { GoogleGenAI } from "@google/genai";
import path from "path";
import os from "os";

// Set ADC credentials path in-process to avoid Windows backslash parsing issues in .env files
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
    os.homedir(),
    "AppData",
    "Roaming",
    "gcloud",
    "application_default_credentials.json"
  );
}

// Best available model: Gemini 2.5 Pro (GA, global availability, Vertex AI billing)
export const MODEL_NAME = "gemini-2.5-pro";

let _ai: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || "promptwars-apr-26",
      location: process.env.GOOGLE_CLOUD_LOCATION || process.env.GCP_LOCATION || "global",
    });
    console.log(
      `[GenAI] Vertex AI initialized — model: ${MODEL_NAME}, project: ${process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || "promptwars-apr-26"}, location: ${process.env.GOOGLE_CLOUD_LOCATION || process.env.GCP_LOCATION || "global"}`
    );
    console.log(`[GenAI] ADC path: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  }
  return _ai;
}
