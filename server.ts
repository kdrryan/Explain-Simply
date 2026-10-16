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

// Helper to get initialized GoogleGenAI instance or null
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

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
  const client = getGeminiClient();
  res.json({
    configured: Boolean(client),
    provider: 'Google Gemini',
    model: 'gemini-3.8-flash',
  });
});

// Explain endpoint
app.post('/api/explain', async (req, res) => {
  try {
    const { question, level = 'simple' } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question or topic to explain.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        code: 'MISSING_API_KEY',
        error: 'AI is not configured yet. Please configure GEMINI_API_KEY in the AI Studio Secrets panel or set it in your environment variables.',
        instructions: 'Open the Secrets panel in AI Studio or add GEMINI_API_KEY to your environment to enable live explanations.'
      });
    }

    const validLevels = ['simple', 'intermediate', 'detailed'];
    const selectedLevel = validLevels.includes(level) ? level : 'simple';
    const systemPrompt = PROMPTS[selectedLevel];

    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let explanation: string | undefined;

    for (const modelName of modelsToTry) {
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
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} notice:`, err?.message || err);
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (!explanation || explanation.trim() === '') {
      const message = lastError?.message || 'Received an empty response from the AI model.';
      return res.status(502).json({
        error: `Could not generate explanation right now: ${message}. Please tap Try Again.`
      });
    }

    return res.json({
      explanation: explanation.trim(),
      level: selectedLevel,
      question: question.trim(),
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
