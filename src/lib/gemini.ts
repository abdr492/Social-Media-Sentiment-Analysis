/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { SentimentAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert Social Media Sentiment Analyst. 
Your task is to analyze the sentiment of a given social media post (tweet, comment, or review).
Classify the sentiment as 'positive', 'negative', or 'neutral'.
Provide a confidence score between 0 and 1.
Explain the reasoning behind your choice.
Identity 2-5 key keywords that influenced the decision.

Strictly return the result as a JSON object matching the requested schema.`;

export async function analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Analyze the sentiment of this text: "${text}"` }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ["positive", "negative", "neutral"],
              description: "The primary sentiment of the text."
            },
            score: {
              type: Type.NUMBER,
              description: "Confidence score from 0 to 1."
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of the sentiment choice."
            },
            keyKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Keywords that determine the sentiment."
            }
          },
          required: ["sentiment", "score", "reasoning", "keyKeywords"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from AI");
    
    const result = JSON.parse(responseText);
    return result as SentimentAnalysisResult;
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    // Rethrow to allow UI to handle it specifically if needed, or return a failure flag
    throw new Error(error instanceof Error ? error.message : "AI analysis service is temporarily unavailable");
  }
}

export async function bulkAnalyzeSentiment(texts: string[]): Promise<SentimentAnalysisResult[]> {
  if (texts.length === 0) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Analyze the sentiment of these ${texts.length} social media posts individually. Return an array of objects. Posts: \n${texts.map((t, i) => `${i+1}. ${t}`).join('\n')}` }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING, enum: ["positive", "negative", "neutral"] },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              keyKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["sentiment", "score", "reasoning", "keyKeywords"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from AI");
    
    const results = JSON.parse(responseText);
    return results as SentimentAnalysisResult[];
  } catch (error) {
    console.error("Bulk Sentiment Analysis Error:", error);
    throw new Error("Batch analysis failed. Please try a manual analysis.");
  }
}
