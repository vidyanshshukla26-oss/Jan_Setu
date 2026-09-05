# 🌉 Jan Setu

**Jan Setu** ("bridge to the people") is a full-stack civic-tech platform that lets citizens crowdsource, triage, and fund solutions to societal challenges. Built for **Smart India Hackathon 2026 (Problem Statement SIH26043)**, it combines AI-driven challenge scoring, geo-spatial visualization, and grant funding workflows to turn community-reported problems into fundable, actionable projects.

🔗 **Live demo:** [Jan-Setu](https://jan-setu-7vlg.onrender.com)

---

## ✨ Features

- **📝 Challenge Crowdsourcing** — Citizens submit societal challenges from their communities, with descriptions, categories, and supporting media.
- **🤖 AI Challenge Triage** — Incoming submissions are automatically classified, deduplicated, and routed using AI, cutting manual review overhead.
- **📊 Feasibility Scoring** — Each challenge is scored on feasibility, urgency, and impact to help prioritize which problems get attention first.
- **🗺️ Geo-Spatial Heatmaps** — Interactive maps visualize challenge density and hotspots across regions, helping identify where intervention is needed most.
- **💰 Grant & Funding Workflows** — A structured pipeline connects viable challenges with funding opportunities, from proposal to disbursement tracking.
- **👥 Community Engagement** — Voting, commenting, and progress tracking keep citizens involved from submission to resolution.

---

## 🛠️ Tech Stack

| Layer          | Technology                     |
|----------------|---------------------------------|
| Frontend       | React                            |
| Backend        | Node.js + Express                |
| Database       | MongoDB                          |
| Hosting        | Render |

---

## 📁 Project Structure

```
Jan_Setu/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
├── server/              # Node/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
├── .env.example
└── README.md
```
---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/vidyanshshukla26-oss/Jan_Setu.git
cd Jan_Setu
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `server/` (use `.env.example` as a template):

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/jansetu
# or your Atlas connection string:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/jansetu

# Auth
JWT_SECRET=your_jwt_secret_here

# AI / Third-party services (if used for triage & scoring)
AI_API_KEY=your_ai_service_key_here

# Maps (for geo-spatial heatmaps)
MAPS_API_KEY=your_maps_api_key_here
```

Create a `.env` file inside `client/` if the frontend needs its own variables:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_MAPS_API_KEY=your_maps_api_key_here
```

> ⚠️ Never commit `.env` files. Add them to `.gitignore` and keep `.env.example` updated with placeholder keys.

### 4. Run the app locally

```bash
# Start the backend (from /server)
npm run dev

# In a separate terminal, start the frontend (from /client)
npm start
```

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

### 5. Build for production

```bash
cd client
npm run build
```

Deploy the resulting `build/` folder (e.g., to Netlify) and point it at your hosted backend API.

---

## 🧭 Usage

1. Sign up / log in as a citizen.
2. Submit a societal challenge with a description, category, and location.
3. The AI triage pipeline classifies and scores the challenge for feasibility.
4. View challenges on the geo-spatial heatmap to spot regional hotspots.
5. Eligible, high-scoring challenges enter the grant/funding workflow for review and disbursement tracking.

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
