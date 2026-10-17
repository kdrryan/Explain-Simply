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

// System instructions tailored for the 3 Editions:
// 1. Explain like I'm 10 (simple, direct, no long paragraphs)
// 2. Explain like I'm a student (expanded with common analogies)
// 3. Explain like I'm a professor (meticulous, rigorous, academic detail)
const PROMPTS: Record<string, string> = {
  simple: `You are "Explain Simply" in "Explain like I'm 10" edition.
Core Mission:
- Answer as if explaining to a 10-year-old child.
- STRICT RULE ON LENGTH: Be direct, punchy, and concise! If the question is simple, the answer MUST be simple and brief. NEVER write long, dense paragraphs or walls of text.
- Avoid all technical jargon. Use everyday words and 1 quick, fun comparison (like toys, cooking, pets, or playground games).
- Formatting:
  - 1-2 short sentences giving the direct answer immediately.
  - "## How It Works" (2 or 3 short, punchy bullet points).
  - "## Fun Comparison" (1 brief analogy).
  - "## Key Takeaway" (1 memorable sentence).
- Always answer in the same language as the user's question (e.g., Indonesian if asked in Indonesian).`,

  intermediate: `You are "Explain Simply" in "Explain like I'm a student" edition (high school / university student).
Core Mission:
- Expand the topic logically and educationally with clear, relatable analogies.
- Explain the mechanism step-by-step and define essential terms clearly.
- Connect concepts to practical, real-world examples and everyday applications.
- Formatting:
  - "## Overview" (clear conceptual summary).
  - "## Step-by-Step Mechanism" (logical breakdown of how it works).
  - "## Common Analogy" (relatable everyday comparison).
  - "## Key Takeaways" (summary of main concepts).
- Maintain an encouraging, intellectual tone.
- Always answer in the same language as the user's question.`,

  detailed: `You are "Explain Simply" in "Explain like I'm a professor" edition.
Core Mission:
- Deliver a meticulous, exhaustive, and deeply rigorous academic breakdown.
- Explain foundational scientific/economic/philosophical laws, theoretical mechanisms, and edge cases.
- Use precise academic terminology with highlighted **bold** keywords.
- Address theoretical nuances, common misconceptions, and scholarly context.
- Formatting:
  - "## Academic Overview & Theoretical Principles"
  - "## Exhaustive Mechanical Breakdown" (systematic analysis).
  - "## Nuances, Variables & Edge Cases"
  - "## Scholarly Synthesis"
- Keep paragraphs focused and structured with high intellectual clarity.
- Always answer in the same language as the user's question.`
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
    const { question, level = 'simple', language = 'en' } = req.body;

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
    const basePrompt = PROMPTS[selectedLevel];
    const targetLang = language === 'id' ? 'id' : 'en';
    const langDirective = targetLang === 'id'
      ? '\n\nCRITICAL LANGUAGE INSTRUCTION: You MUST generate your ENTIRE explanation in INDONESIAN (Bahasa Indonesia). All section headers, analogies, and explanations must be written in natural Indonesian.'
      : '\n\nCRITICAL LANGUAGE INSTRUCTION: You MUST generate your ENTIRE explanation in ENGLISH. All section headers, analogies, and explanations must be written in English.';

    const systemPrompt = basePrompt + langDirective;

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
