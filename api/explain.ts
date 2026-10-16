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
