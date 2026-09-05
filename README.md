# 🌉 Jan Setu

**Jan Setu** ("bridge to the people") is a full-stack civic-tech platform where citizens crowdsource, triage, and fund solutions to societal challenges. Built for **Smart India Hackathon 2026 (Problem Statement SIH26043)**, it combines AI-driven challenge triage and feasibility scoring, geo-spatial visualization, and grant/funding workflows to turn community-reported problems into fundable, actionable projects.

🔗 **Live demo:** [Jan-Setu](https://jan-setu-7vlg.onrender.com)

---

## ✨ Features

- **📝 Challenge Crowdsourcing** — Citizens submit societal challenges with a title, category, SDG alignment, location, severity, and supporting images.
- **🤖 AI Challenge Triage** — Gemini-powered analysis classifies, scores severity/urgency, and flags likely duplicate submissions.
- **📊 Feasibility & Solution Evaluation** — AI evaluates submitted solutions (TRL level, budget, methodology) and scores their feasibility.
- **🗺️ Geo-Spatial Data** — Challenges carry lat/long + city/state, ready for map/heatmap visualization of hotspots.
- **💰 Grant & Funding Workflows** — Bounties, sponsor pledges, and AI-generated formal grant/pilot proposals (targeted at bodies like Smart Cities Mission, Jal Jeevan Mission, MeitY, NITI Aayog, and CSR foundations).
- **🗣️ Multilingual Assist** — Converts vernacular-language input into a structured English problem statement with bilingual confirmation.
- **💬 JanSetu AI Civic Assistant** — A chatbot that helps citizens, student innovators, and officials navigate the platform.
- **👥 Community Engagement** — Upvoting on challenges and solutions, commenting, and solution endorsements.

---

## 🛠️ Tech Stack

| Layer         | Technology                                      |
|---------------|--------------------------------------------------|
| Frontend      | React 19 + Vite 6 + TypeScript + Tailwind CSS v4 |
| Backend       | Node.js + Express (single `server.ts`)           |
| AI            | Google Gemini API (`@google/genai`)               |
| Data storage  | In-memory store, seeded on server start (no database) |
| Hosting       | Render (current live deploy); `vercel.json` included for Vercel |

> Note: there is no MongoDB or separate `client/`/`server/` split in this repo — data currently lives in memory and resets on server restart. Anything persistent (users, challenges, solutions) would need a database added.

---

## 📁 Project Structure

```
jan-setu/
├── server.ts              # Express app: REST API + Vite middleware (dev) / static serving (prod)
├── src/
│   ├── main.tsx            # React app entry
│   ├── data/
│   │   └── seedChallenges.ts   # Initial in-memory challenge data
│   └── types.ts            # Shared TypeScript types (Challenge, Solution, Comment, ...)
├── index.html               # Vite HTML entry point
├── vite.config.ts
├── tsconfig.json
├── vercel.json              # Rewrites for optional Vercel deployment
├── metadata.json            # AI Studio app metadata
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Gemini API key](https://ai.google.dev/) (for the AI triage, scoring, proposal-generation, and chatbot features)
- npm, or [bun](https://bun.sh/) (a `bun.lock` is included)

### 1. Clone the repository

```bash
git clone https://github.com/vidyanshshukla26-oss/Jan_Setu.git
cd Jan_Setu
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Required for Gemini AI API calls (challenge triage, scoring, proposals, chatbot, multilingual assist)
GEMINI_API_KEY="your_gemini_api_key_here"

# URL where the app is hosted (used for self-referential links / callbacks)
APP_URL="http://localhost:3000"
```

> ⚠️ Never commit `.env` files — they're already covered by `.gitignore`. Only `.env.example` should be committed.

### 4. Run the app locally

```bash
npm start
```

This runs `tsx server.ts`, which starts Express with Vite in middleware mode — a single server on **http://localhost:3000** serving both the React frontend (with HMR) and the `/api/*` routes.

If you only want the Vite dev server without the API (e.g. for pure frontend work), you can instead run:

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build   # builds the frontend into dist/
NODE_ENV=production npm start   # serves dist/ + API from the same Express server
```

---

## 📡 API Overview

All routes are prefixed with `/api`. Highlights:

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Health check + total challenge count |
| `/api/challenges` | GET | List challenges (filter/search/sort) |
| `/api/challenges/:id` | GET | Get a single challenge |
| `/api/challenges` | POST | Submit a new challenge |
| `/api/challenges/:id/vote` | POST | Upvote/un-upvote a challenge |
| `/api/challenges/:id/solutions` | POST | Submit a solution to a challenge |
| `/api/challenges/:id/comments` | POST | Comment on a challenge |
| `/api/challenges/:id/pledge` | POST | Pledge sponsor funding |
| `/api/solutions/:id/vote` | POST | Upvote a solution |
| `/api/solutions/:id/endorse` | POST | Endorse a solution |
| `/api/analytics` | GET | Platform-wide analytics summary |
| `/api/ai/analyze-challenge` | POST | AI triage: classify/score a new challenge |
| `/api/ai/evaluate-solution` | POST | AI feasibility scoring for a solution |
| `/api/ai/duplicate-check` | POST | AI duplicate-challenge detection |
| `/api/ai/generate-proposal` | POST | AI-generated grant/pilot proposal |
| `/api/ai/civic-assistant` | POST | JanSetu AI chatbot |
| `/api/ai/multilingual-assist` | POST | Vernacular-language problem drafting |

---

## 🧭 Usage

1. Browse or submit a societal challenge with a description, category, and location.
2. The AI triage pipeline classifies, scores, and checks the challenge for duplicates.
3. Innovators submit solutions; AI scores their feasibility.
4. Sponsors pledge bounty funding, and high-scoring challenges can generate a formal grant proposal via AI.
5. Citizens engage by upvoting and commenting throughout.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

Specify your license here (e.g., MIT, Apache 2.0). If none is chosen yet, add a `LICENSE` file to the repo.

---

## 🙏 Acknowledgements

Built for **Smart India Hackathon 2026** — Problem Statement **SIH26043**.
