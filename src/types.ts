/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface SentimentAnalysisResult {
  sentiment: SentimentType;
  score: number; // 0 to 1
  reasoning: string;
  keyKeywords: string[];
}

export interface SocialMediaPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  platform: 'Twitter' | 'YouTube' | 'Facebook' | 'Reddit';
  sentiment?: SentimentType;
  confidence?: number;
}

export interface DashboardStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  lastUpdated: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
