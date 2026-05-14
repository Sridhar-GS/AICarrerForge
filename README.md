<p align="center">
  <img src="https://img.shields.io/badge/AI-CareerForge-blue?style=for-the-badge&logo=robot&logoColor=white" alt="AI CareerForge" />
  <br/>
  <strong>🚀 Measure Your Interview Readiness in Under 2 Minutes</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google&logoColor=white" />
</p>

---

## 📌 Problem Statement

Every year, millions of students graduate and enter the job market but struggle to assess whether they're truly ready for interviews. They often discover gaps in their preparation only **after** failed interviews — when it's too late.

**AI CareerForge** solves this by providing an AI-powered tool that evaluates multiple dimensions of interview preparation and delivers a comprehensive **Interview Readiness Score** with personalized improvement plans — all in **under 2 minutes**.

---

## 🎬 Live Demo Video

> 📹 **Screen Recording**: [Watch the Demo on Google Drive](https://drive.google.com/file/d/1f_0jYPeLKzKhvZ3yqFtJggz6RQ3w-DSC/view?usp=sharing)


---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Resume Analysis** | AI parses uploaded PDF resumes for ATS compatibility, missing keywords, formatting quality, and role alignment |
| 🔗 **Portfolio (GitHub) Review** | Evaluates public repositories for project quality, diversity, documentation, and relevance to the target role |
| 🧠 **Technical Quiz** | Role-specific MCQ questions (Software Engineer, Frontend, Backend, AI Engineer) with real-time scoring |
| 🎤 **Communication Evaluation** | Uses Web Speech API to capture voice responses, then AI analyzes clarity, confidence, and grammar |
| 📊 **Overall Readiness Score** | Weighted composite score (0–100) with levels: Beginner, Intermediate, Interview Ready |
| 📋 **Actionable Improvement Plan** | Personalized, specific suggestions — not just numbers |
| ⏱️ **Under 2 Minutes** | The entire assessment is designed to complete in less than 2 minutes |
| 🔐 **User Authentication** | JWT-based login/register system with MongoDB persistence |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** — Modern UI with functional components & hooks
- **Vite 8** — Lightning-fast dev server & build tool
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Lucide React** — Beautiful icon library
- **Recharts** — Data visualization
- **Web Speech API** — Browser-native speech recognition

### Backend
- **Node.js + Express 5** — RESTful API server
- **MongoDB + Mongoose** — NoSQL database for user data
- **Google Gemini AI** (gemini-1.5-flash) — AI-powered evaluation engine
- **Multer** — Resume PDF file upload handling
- **pdf-parse** — PDF text extraction
- **bcryptjs + JWT** — Authentication & security

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (React + Vite)             │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Landing  │  │  Auth    │  │    Dashboard       │  │
│  │  Page    │  │Login/Reg │  │ (4-Step Assessment)│  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────┴─────────────────────────────┐
│                 Server (Express.js)                  │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │ Auth Routes│  │ Eval Routes │  │ Gemini Utils │  │
│  └──────┬─────┘  └──────┬──────┘  └──────┬───────┘  │
│         │               │               │           │
│  ┌──────┴─────┐  ┌──────┴──────┐  ┌─────┴────────┐  │
│  │  MongoDB   │  │  PDF Parse  │  │  Gemini API  │  │
│  └────────────┘  └─────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Assessment Flow

```
Step 0: Profile Config          Step 1: Technical Quiz
┌────────────────────┐         ┌────────────────────┐
│ • Select Target Role│   →    │ • 3 Role-Specific  │
│ • Upload Resume PDF │        │   MCQ Questions     │
│ • Enter GitHub User │        │ • AI analyzing      │
│                    │         │   Resume & GitHub   │
└────────────────────┘         │   in background     │
                               └────────────────────┘
                                        │
Step 3: Results                Step 2: Communication
┌────────────────────┐         ┌────────────────────┐
│ • Overall Score Ring│   ←    │ • Voice Recording   │
│ • Category Breakdown│        │ • 30-sec Timer      │
│ • Readiness Level  │        │ • Live Transcript   │
│ • Improvement Plan │        │                    │
└────────────────────┘         └────────────────────┘
```

---

## 📊 Scoring System

| Category | Weight | Source |
|----------|--------|--------|
| Resume (ATS Score) | 25% | Gemini AI analysis of PDF content |
| Technical Quiz | 30% | MCQ correctness per role |
| Communication | 25% | AI analysis of voice transcript |
| Portfolio (GitHub) | 20% | AI analysis of public repos |

**Readiness Levels:**
- 🔴 **Beginner** (0–49) — Significant gaps in preparation
- 🟡 **Intermediate** (50–74) — Good foundation, needs improvement
- 🟢 **Interview Ready** (75–100) — Strong preparation across all areas

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** running locally or a MongoDB Atlas URI
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/Sridhar-GS/AICarrerForge.git
cd AICarrerForge
```

### 2. Setup Environment Variables

```bash
cp .env.example server/.env
```

Edit `server/.env` with your credentials:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aiforge
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the Application

**Terminal 1 — Start the backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
AICarrerForge/
├── client/                    # Frontend (React + Vite)
│   ├── public/                # Static assets (favicon, icons)
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx     # App shell (header, footer, nav)
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Landing page for visitors
│   │   │   ├── Login.jsx      # Authentication - login
│   │   │   ├── Register.jsx   # Authentication - register
│   │   │   └── Dashboard.jsx  # Main 4-step assessment tool
│   │   ├── App.jsx            # Root component with routing
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # Global styles + Tailwind
│   │   └── App.css            # App-level styles
│   ├── index.html             # HTML template with SEO meta tags
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── package.json
│
├── server/                    # Backend (Express.js)
│   ├── controllers/
│   │   ├── authController.js  # Register & Login logic
│   │   └── evalController.js  # Resume, GitHub, Communication, Finalize
│   ├── models/
│   │   └── User.js            # Mongoose User schema
│   ├── routes/
│   │   ├── authRoutes.js      # POST /api/auth/register, /login
│   │   └── evalRoutes.js      # POST /api/eval/resume, /github, etc.
│   ├── utils/
│   │   └── gemini.js          # Gemini AI client + prompt templates
│   ├── uploads/               # Temp directory for PDF uploads
│   ├── index.js               # Express server entry point
│   └── package.json
│
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login existing user |
| `POST` | `/api/eval/resume` | Upload & evaluate resume PDF |
| `POST` | `/api/eval/github` | Evaluate GitHub profile |
| `POST` | `/api/eval/communication` | Evaluate speech transcript |
| `POST` | `/api/eval/finalize` | Generate final score & improvement plan |
| `GET`  | `/api/health` | Health check endpoint |

---

## 🧪 Testing

```bash
# Verify server health
curl http://localhost:5000/api/health

# Build frontend for production
cd client && npm run build
```

---

## 🛡️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `VITE_API_URL` | Backend URL for frontend (default: http://localhost:5000) | No |

---

## 👤 Author

**Sridhar GS** — [@Sridhar-GS](https://github.com/Sridhar-GS)

---

## 📜 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ for the AI CareerForge Hackathon
</p>
