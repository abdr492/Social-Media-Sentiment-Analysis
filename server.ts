/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Real-time Social Data Proxy (Reddit Public JSON)
  app.get('/api/social-search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
      // Fetching from Reddit search endpoint
      const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(q as string)}&sort=new&limit=15`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'SentiPulse/1.0 (Portfolio Project)'
        }
      });

      if (!response.ok) {
        throw new Error(`External API responded with ${response.status}`);
      }

      const data = await response.json();
      
      // Transform Reddit data into our SocialMediaPost format
      const posts = data.data.children.map((child: any) => ({
        id: child.data.id,
        author: child.data.author,
        content: child.data.title + (child.data.selftext ? ': ' + child.data.selftext.substring(0, 200) : ''),
        timestamp: new Date(child.data.created_utc * 1000).toLocaleTimeString(),
        platform: 'Reddit',
      }));

      res.json(posts);
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch social data' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] SentiPulse Dynamic Engine running on http://localhost:${PORT}`);
  });
}

startServer();
