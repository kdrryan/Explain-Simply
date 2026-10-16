import { GoogleGenAI } from '@google/genai';

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

  for (let i = 2; i <= 5; i++) {
    const extraKey = process.env[`GEMINI_API_KEY_${i}`];
    if (extraKey && extraKey.trim() !== '' && extraKey !== 'MY_GEMINI_API_KEY') {
      keys.push(extraKey.trim());
    }
  }

  return [...new Set(keys)];
}

const MODELS_CASCADE = [
  'gemini-flash-lite-latest', // Top priority: ultra lightweight, blazing fast, independent free quota
  'gemini-3.5-flash-lite',   // Lightweight fallback with independent free quota
  'gemini-3.5-flash',        // Reliable fast flash fallback
  'gemma-4-26b-a4b-it',      // Fast instruction-tuned model
  'gemini-3.1-flash-lite',   // Flash lite variant
  'gemini-3.8-flash',        // Standard flash fallback
];

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question, level = 'simple' } = req.body || {};

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question or topic to explain.' });
    }

    const keys = getAllApiKeys();
    if (keys.length === 0) {
      return res.status(503).json({
        code: 'MISSING_API_KEY',
        error: 'AI is not configured yet. Please configure GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.',
        instructions: 'Go to Vercel Project Settings > Environment Variables and add GEMINI_API_KEY.'
      });
    }

    const validLevels = ['simple', 'intermediate', 'detailed'];
    const selectedLevel = validLevels.includes(level) ? level : 'simple';
    const systemPrompt = PROMPTS[selectedLevel];

    let lastError: any = null;
    let explanation: string | undefined;
    let successfulModel = '';

    // Overlap cascade across keys and models
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
            break keyLoop;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[Vercel API Overlap] Model ${modelName} with key #${kIdx + 1} notice:`, err?.status || err?.message || err);

          if (err?.status === 429 || (err?.message && err.message.includes('429'))) {
            break; // Switch to next key
          }

          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }

    if (!explanation || explanation.trim() === '') {
      const message = lastError?.message || 'High demand across all available models';
      return res.status(502).json({
        error: `Model sedang sibuk: ${message}. Silakan coba lagi sebentar lagi.`
      });
    }

    return res.status(200).json({
      explanation: explanation.trim(),
      level: selectedLevel,
      question: question.trim(),
      model: successfulModel,
    });
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({
      error: `AI generation failed: ${err?.message || 'Unexpected server error'}`
    });
  }
}
