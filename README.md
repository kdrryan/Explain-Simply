<div align="center">
<img src="public/icon-192.png" alt="Explain Simply logo" width="96" height="96" />
Explain Simply
Hard topics, explained at the level you need, from age 10 to professor.
An AI study companion powered by Google Gemini that turns complex questions into clear, structured explanations. It's built mobile-first for quick study sessions.
Live Demo Gemini
React TypeScript Vite Tailwind CSS Express PWA Last commit Repo size
Live Demo · Features · Installation · Deploy · Report a Bug
</div>
📸 Screenshots
<div align="center">
Ask anything
About and learning levels
<img src="Screenshot_20261017-015157.png" alt="Asking a question in Explain Simply" width="300" />
<img src="Screenshot_20261017-015224.png" alt="About Explain Simply and its three learning levels" width="300" />
</div>
✨ Features
🎚️ Three learning levels. You pick how deep the answer goes:
Level
Best for
What you get
Explain like I'm 10
Quick understanding
Short, jargon-free answers with one fun comparison
Explain like I'm a student
High school and university
Step-by-step mechanisms, analogies, and real-world examples
Explain like I'm a professor
Deep study
Rigorous academic breakdowns, edge cases, and terminology
🔁 Switch the level instantly. The same question gets re-explained at a new depth in one tap.
🌏 Replies in your language. Ask in Indonesian and the answer comes back in Indonesian, and the same goes for any other language.
💡 Example topics. Try Photosynthesis, Airplane Flight, Inflation & Prices, DNA & Genes, or Black Holes.
🎨 Five themes: Midnight Slate, Cutie Blossom, Cozy Cats, Cosmic Space, and The Daily News. Your choice is remembered between visits.
📋 Copy and share any explanation with one tap.
📱 Installable PWA. Add it to your home screen and it opens like a native app.
🔐 Secure by design. Gemini API calls run only on the server, so your keys never reach the browser.
⚡ Resilient AI backend. Requests cascade across several lightweight Gemini models and rotate through up to 5 API keys, so the app keeps answering when a model or quota runs out.
🧱 Tech Stack
Layer
Tools
Frontend
React 19, TypeScript, Vite, Tailwind CSS 4, Motion, Lucide icons
Backend
Node.js, Express (local), Vercel Serverless Functions (production)
AI
Google Gemini via @google/genai
Hosting
Vercel
🗂️ Project Structure
Explain-Simply/
├── api/                 # Vercel serverless functions
│   ├── explain.ts       # POST /api/explain: generates the explanation
│   └── status.ts        # GET  /api/status: AI configuration status
├── public/              # PWA manifest, service worker, app icons
├── scripts/             # Icon generation script
├── src/
│   ├── components/      # MarkdownView, ShareModal, ThemeSelector
│   ├── App.tsx          # Main application
│   ├── themes.ts        # Theme definitions
│   └── types.ts         # Shared TypeScript types
├── server.ts            # Express server for local development
├── vercel.json          # Vercel build and routing config
└── .env.example         # Environment variable template
🚀 Getting Started
Prerequisites
Node.js 18 or newer
npm
A free Gemini API key from Google AI Studio
Installation
# 1. Clone the repository
git clone https://github.com/kdrryan/Explain-Simply.git
cd Explain-Simply

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
Configure environment variables
Open .env and add your key:
GEMINI_API_KEY="your_gemini_api_key"

# Optional: extra keys for automatic fallback
# GEMINI_API_KEY_2="second_key"
# GEMINI_API_KEY_3="third_key"

Run locally
npm run dev
Then open http://localhost:3000.
Available scripts
Command
Description
npm run dev
Start the Express and Vite dev server
npm run build
Build the production bundle into dist/
npm run preview
Preview the production build
npm run lint
Type-check the project
npm run clean
Remove build output
☁️ Deploy to Vercel
Fork this repository.
Import it in Vercel.
Add GEMINI_API_KEY under Settings → Environment Variables.
Deploy. vercel.json already handles the build and the /api routes.
🔌 API
POST /api/explain
{
  "question": "What is a black hole?",
  "level": "simple"
}
level is one of simple, intermediate, or detailed.
GET /api/status
Returns whether the AI is configured and how many keys are active.
🗺️ Roadmap
[ ] Explanation history
[ ] Text-to-speech for answers
[ ] Quiz mode to test understanding
[ ] Export explanations as PDF

👤 Author
GitHub: @kdrryan
Instagram: @kdrryann
<div align="center">
If this project helped you, consider giving it a ⭐
</div>