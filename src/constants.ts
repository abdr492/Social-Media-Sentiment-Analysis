/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FAQItem, SocialMediaPost } from "./types";

export const INTERVIEW_FAQ: FAQItem[] = [
  {
    question: "Explain your project.",
    answer: "My project is a Social Media Sentiment Analysis Dashboard. I analyzed social media comments or posts and classified them into positive, negative, or neutral sentiment using machine learning and NLP techniques (Gemini AI). The system cleans the text data, converts it into numerical features, and displays the final results in a dashboard to help companies understand customer emotions."
  },
  {
    question: "What problem does this project solve?",
    answer: "This project solves the problem of manually analyzing thousands of social media comments. Companies can use it to quickly understand whether people are happy, unhappy, or neutral about a product, service, campaign, or brand."
  },
  {
    question: "What type of data did you use in this project?",
    answer: "I used text-based social media data such as comments, tweets, product reviews, or user feedback. The dataset contains text and sentiment labels like positive, negative, and neutral."
  },
  {
    question: "What is sentiment analysis?",
    answer: "Sentiment analysis is an NLP technique used to identify the emotion or opinion behind a text. It helps classify text as positive, negative, or neutral based on the words and patterns used by the user."
  },
  {
    question: "What preprocessing steps did you perform?",
    answer: "I performed text cleaning steps such as converting text to lowercase, removing punctuation, special characters, and preparing the text for feature extraction by the AI model."
  },
  {
    question: "What is TF-IDF and why did you use it?",
    answer: "TF-IDF stands for Term Frequency-Inverse Document Frequency. While modern LLMs like Gemini handle this internally via embeddings, traditional models use TF-IDF to convert text into numerical features by giving importance to meaningful words."
  },
  {
    question: "Which machine learning model did you use and why?",
    answer: "I used the Gemini 3 Flash model, a state-of-the-art Large Language Model (LLM). Unlike older models (Logistic Regression or Naive Bayes), LLMs understand context, sarcasm, and complex intent much better."
  },
  {
    question: "What evaluation metrics did you use?",
    answer: "I focused on confidence scores, precision, and sentiment distribution. The model provides a confidence score (0-1) for every classification, ensuring transparency in high-stakes business analysis."
  },
  {
    question: "How does the dashboard help users?",
    answer: "The dashboard helps users visually understand sentiment distribution through charts and summaries. It shows at a glance how many comments are positive, negative, or neutral to help businesses take faster decisions."
  },
  {
    question: "How can this project be improved further?",
    answer: "It can be improved by adding real-time social media API integrations (Twitter/Youtube), multilingual support, and deep-dive topic modeling to see *why* users are unhappy."
  }
];

export const MOCK_POSTS: SocialMediaPost[] = [
  {
    id: "1",
    author: "tech_guru",
    content: "The new update is absolutely incredible! Performance is up by 50%. Best release ever. #Tech #Innovation",
    timestamp: "2 mins ago",
    platform: "Twitter",
    sentiment: "positive",
    confidence: 0.98
  },
  {
    id: "2",
    author: "dissatisfied_user",
    content: "Why does the app keep crashing after the update? This is so frustrating. Thinking of switching to a competitor.",
    timestamp: "15 mins ago",
    platform: "Twitter",
    sentiment: "negative",
    confidence: 0.92
  },
  {
    id: "3",
    author: "movie_buff",
    content: "Just finished the new season. It was okay, not great but not terrible either. Some parts were slow.",
    timestamp: "1 hour ago",
    platform: "Reddit",
    sentiment: "neutral",
    confidence: 0.85
  },
  {
    id: "4",
    author: "foodie2024",
    content: "Worst service ever at the downtown location. We waited 40 minutes for a cold meal. Never coming back.",
    timestamp: "3 hours ago",
    platform: "Facebook",
    sentiment: "negative",
    confidence: 0.99
  },
  {
    id: "5",
    author: "sunny_days",
    content: "Lovely weather today! Perfect day for a walk in the park. #Blessed",
    timestamp: "5 hours ago",
    platform: "Twitter",
    sentiment: "positive",
    confidence: 0.95
  }
];

export const PROJECT_FACTS = [
  { label: "Market Growth", value: "USD 26.5B", sub: "Projected by 2028" },
  { label: "Cost Savings", value: "70%", sub: "Reduction in manual moderation" },
  { label: "NLP Efficiency", value: "Real-time", sub: "Instant emotion detection" }
];
