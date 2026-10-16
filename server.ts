import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Collect all configured API keys (supports single, comma-separated, or numbered env vars)
function getAllApiKeys(): string[] {
  const keys: string[] = [];

  const mainKey = process.env.GEMINI_API_KEY;
  if (mainKey && mainKey.trim() !== '' && mainKey !== 'MY_GEMINI_API_KEY') {
    if (mainKey.includes(',')) {
      keys.push(...mainKey.split(',').map(k => k.trim()).filter(Boolean));
    } else {
      keys.push(mainKey.trim());
    }
  }

  // Also check alternative keys (GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.)
  for (let i = 2; i <= 5; i++) {
    const extraKey = process.env[`GEMINI_API_KEY_${i}`];
    if (extraKey && extraKey.trim() !== '' && extraKey !== 'MY_GEMINI_API_KEY') {
      keys.push(extraKey.trim());
    }
  }

  return [...new Set(keys)]; // Deduplicate
}

// Lightweight models in priority order: fastest/lightest first, followed by fallbacks
const MODELS_CASCADE = [
  'gemini-flash-lite-latest', // Top priority: ultra lightweight, blazing fast, independent free quota
  'gemini-3.5-flash-lite',   // Lightweight fallback with independent free quota
  'gemini-3.5-flash',        // Reliable fast flash fallback
  'gemma-4-26b-a4b-it',      // Fast instruction-tuned model
  'gemini-3.1-flash-lite',   // Flash lite variant
  'gemini-3.8-flash',        // Standard flash fallback
];

// System instructions tailored for each level
const PROMPTS: Record<string, string> = {
  simple: `You are "Explain Simply", a friendly, patient tutor who explains complex topics so clearly that a 10-year-old or beginner immediately gets it.
Guidelines:
- Use clear everyday analogies, vivid real-world comparisons, and simple words.
- Zero unexplained jargon: if you must introduce a term, instantly explain it with a fun analogy.
- Keep sentences and paragraphs short and bite-sized (great for mobile reading).
- Use clear markdown:
  - An introductory opening analogy
  - "## How It Works in 3 Simple Steps" with bullet points
  - "## Fun Analogy"
  - "## Key Takeaway" (1 memorable sentence)
- Keep the tone encouraging, warm, and curious.`,

  intermediate: `You are "Explain Simply", an insightful tutor for high school and introductory college students.
Guidelines:
- Explain the topic with conceptual depth while remaining clear and approachable.
- Define essential terms precisely and explain the mechanism step-by-step.
- Connect theoretical concepts with practical real-world examples or applications.
- Use clear markdown:
  - "## Overview"
  - "## Core Mechanism & Principles" (step-by-step breakdown)
  - "## Real-World Example"
  - "## Key Takeaways"
- Maintain an engaging, educational tone.`,

  detailed: `You are "Explain Simply", an expert educational mentor providing comprehensive, rigorous, and structured explanations.
Guidelines:
- Break down foundational laws, technical principles, nuances, and edge cases.
- Walk through the underlying mechanisms systematically.
- Highlight important keywords and definitions in **bold**.
- Address common misconceptions or FAQs related to the topic.
- Use structured markdown:
  - "## Foundational Principles"
  - "## Detailed Breakdown"
  - "## Real-World Nuance & Edge Cases"
  - "## Summary & Academic Context"
- Keep formatting clean and readable with short, focused paragraphs and clear bulleted lists.`
};

// Check AI status
app.get('/api/status', (_req, res) => {
  const keys = getAllApiKeys();
  res.json({
    configured: keys.length > 0,
    provider: 'Google Gemini',
    activeKeysCount: keys.length,
    models: MODELS_CASCADE,
  });
});

// Explain endpoint with multi-key and multi-model overlap cascading
app.post('/api/explain', async (req, res) => {
  try {
    const { question, level = 'simple' } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question or topic to explain.' });
    }

    const keys = getAllApiKeys();
    if (keys.length === 0) {
      return res.status(503).json({
        code: 'MISSING_API_KEY',
        error: 'AI is not configured yet. Please configure GEMINI_API_KEY in your environment or Secrets panel.',
        instructions: 'Add GEMINI_API_KEY in your AI Studio Secrets panel or environment variables.'
      });
    }

    const validLevels = ['simple', 'intermediate', 'detailed'];
    const selectedLevel = validLevels.includes(level) ? level : 'simple';
    const systemPrompt = PROMPTS[selectedLevel];

    let lastError: any = null;
    let explanation: string | undefined;
    let successfulModel = '';

    // Cascade across available keys and models
    keyLoop: for (let kIdx = 0; kIdx < keys.length; kIdx++) {
      const apiKey = keys[kIdx];
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      for (const modelName of MODELS_CASCADE) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: question.trim(),
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.6,
            },
          });

          const candidateText = response.text;
          if (candidateText && candidateText.trim() !== '') {
            explanation = candidateText;
            successfulModel = modelName;
            break keyLoop; // Success!
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[API Overlap] Model ${modelName} on key #${kIdx + 1} notice:`, err?.status || err?.message || err);

          // If quota exceeded (429), switch immediately to the next API key
          if (err?.status === 429 || (err?.message && err.message.includes('429'))) {
            console.warn(`[API Overlap] Key #${kIdx + 1} quota reached. Cascading to next key...`);
            break; // Try next key in keyLoop
          }

          // Small delay before trying next fallback model
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }

    if (!explanation || explanation.trim() === '') {
      const errorDetail = lastError?.message || 'High server demand across all models';
      return res.status(502).json({
        error: `Server sedang mengalami lonjakan antrean: ${errorDetail}. Silakan coba lagi dalam beberapa detik.`,
        code: 'ALL_MODELS_BUSY'
      });
    }

    return res.json({
      explanation: explanation.trim(),
      level: selectedLevel,
      question: question.trim(),
      model: successfulModel,
    });
  } catch (err: any) {
    console.error('Explain API Error:', err);
    const message = err?.message || 'An unexpected error occurred while generating the explanation.';
    return res.status(500).json({
      error: `AI generation failed: ${message}`
    });
  }
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Explain Simply server listening at http://0.0.0.0:${PORT}`);
});
