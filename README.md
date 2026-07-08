# StudyBuddy

Transform passive notes into active learning.

## Project Overview

StudyBuddy is an AI-powered study companion. Students upload multiple PDFs, chat with grounded citations, generate quizzes, identify weak topics, and receive personalized revision summaries.

This repository contains the scaffolded architecture only — routing, boilerplate, and configuration. Business logic, RAG, prompts, and AI behavior are implemented separately.

## Folder Structure

```
studybuddy-pro/
├── frontend/               Next.js 15+ App Router client
│   ├── app/                Routes: /, /chat, /quiz, /results, /revision, /progress
│   ├── components/         chat/ quiz/ revision/ upload/ progress/ common/ ui/
│   ├── lib/                 api.ts (typed API client), utils.ts
│   ├── types/                Shared TypeScript interfaces
│   └── public/               Static assets
├── backend/                 FastAPI service
│   ├── api/                  upload.py chat.py quiz.py (generate + evaluate) revision.py
│   ├── core/                  config.py
│   ├── services/               vectorstore.py (Chroma) ai.py (RAG, quiz, evaluation, revision)
│   ├── main.py                 FastAPI app entrypoint
│   ├── requirements.txt
│   ├── Dockerfile               HF Spaces deployment
│   ├── uploads/                   Uploaded source documents
│   └── chroma_db/                   Chroma vector store persistence
```

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

**Backend**
- FastAPI
- Python

**AI Stack**
- LangChain
- ChromaDB
- HuggingFace `all-MiniLM-L6-v2`
- Groq

**Deployment**
- Frontend → Vercel
- Backend → Hugging Face Spaces (Docker)

## Run Instructions

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`.

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your GROQ_API_KEY
uvicorn main:app --reload
```

Runs at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

## API Reference

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/upload` | Upload and index source PDFs |
| POST | `/api/chat` | Ask a question, get a cited answer |
| POST | `/api/quiz` | Generate a quiz from indexed content |
| POST | `/api/evaluate` | Grade submitted quiz answers |
| POST | `/api/revision` | Generate a personalized revision summary |

All endpoints currently return `{"status": "Not Implemented"}` pending business logic.

## Architecture Overview

The frontend is a Next.js App Router client that talks to the FastAPI backend over a typed REST client (`frontend/lib/api.ts`). The backend exposes one router per user-facing feature (`upload`, `chat`, `quiz`, `revision`), each delegating to plain-function services: `vectorstore.py` owns the one genuinely stateful piece (the Chroma client), and `ai.py` holds every LLM-orchestration function (answer, generate quiz, evaluate, summarize) since they share the same shape — retrieve context, call Groq, return structured output. Uploaded documents and their embeddings persist to `backend/uploads/` and `backend/chroma_db/`.

Deployment is split rather than bundled: the frontend deploys to Vercel (its native platform — zero config, preview URLs per push), and the backend ships as a Docker container to Hugging Face Spaces, where the embedding model and Chroma persistence actually need a real filesystem.
