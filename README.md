# Social Media Sentiment Analysis

A modern sentiment analysis dashboard for social media content, built with React, Vite, TypeScript, and Google Gemini AI.

## Overview

Social Media Sentiment Analysis is a web app that pulls public Reddit posts, evaluates their sentiment using the Gemini API, and displays insights in a clean dashboard. It combines a responsive frontend with a lightweight Express/Vite backend for fast local development.

## Features

- Real-time Reddit search and post retrieval
- AI-powered sentiment classification: positive / negative / neutral
- Confidence scoring and keyword explanation
- Interactive charts and social feed display
- Fully built with TypeScript and modern web tooling

## Tech Stack

- Frontend: React, Vite, TypeScript
- Styling: Tailwind CSS (via Vite plugin)
- Backend: Express.js
- AI Integration: Google Gemini API
- Package management: npm

## Prerequisites

- Node.js
- npm
- A Gemini API key

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/abdr492/Social-Media-Sentiment-Analysis.git
   cd Social-Media-Sentiment-Analysis
   Install dependencies:
2. Install dependencies
   npm install
   
3. Create a .env.local file in the project root and add your Gemini API key:
   GEMINI_API_KEY=your_gemini_api_key_here
   
4. Start the app:
   npx tsx server.ts

5. Open the app in your browser:
   http://localhost:3000

Project Structure
server.ts — Express server with Vite middleware
src/ — React application source code
src/lib/gemini.ts — Gemini sentiment analysis integration
src/components/ — UI components and chart views
README.md — Project documentation
requirements.txt — Python dependency snapshot (if using Python tooling)
Notes
Do not commit your .env.local file or API keys.
The app uses server-side AI calls, so your Gemini key stays secure.
If you want to deploy, ensure all environment variables are configured on the host.
License
Use this project as a portfolio or starter template for AI-powered sentiment analysis.
   
   
