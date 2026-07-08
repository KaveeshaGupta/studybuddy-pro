import os
import json
import shutil
import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from groq import Groq
import tempfile

load_dotenv()

app = FastAPI(title="StudyBuddy Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
)

CHROMA_DIR = "./chroma_store"
COLLECTION_NAME = "studybuddy"
vectorstore = None

def get_vectorstore():
    global vectorstore
    if vectorstore is None and os.path.exists(CHROMA_DIR):
        vectorstore = Chroma(
            persist_directory=CHROMA_DIR,
            embedding_function=embedding_model,
            collection_name=COLLECTION_NAME,
        )
    return vectorstore

# ── MODELS ──
class ChatRequest(BaseModel):
    question: str
    chat_history: Optional[List[dict]] = []

class QuizEvaluateRequest(BaseModel):
    questions: List[dict]
    answers: List[str]

class ReviseRequest(BaseModel):
    weak_topics: List[str]

# ── ENDPOINTS ──

@app.get("/")
def root():
    return {"status": "StudyBuddy Pro API is running"}

@app.get("/status")
def status():
    vs = get_vectorstore()
    if vs is None:
        return {"indexed": False, "chunk_count": 0}
    return {"indexed": True, "chunk_count": vs._collection.count()}

@app.post("/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    global vectorstore

    # Clear old index
    global vectorstore
    if vectorstore is not None:
        try:
            vectorstore.delete_collection()
        except:
            pass
        vectorstore = None

    all_chunks = []
    file_info = []

    for file in files:
        # Save temp file
        import tempfile
        temp_path = os.path.join(tempfile.gettempdir(), file.filename)
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extract text with PyMuPDF
        doc = fitz.open(temp_path)
        chunks = []
        for page_num, page in enumerate(doc, 1):
            text = page.get_text()
            if text.strip():
                chunks.append({
                    "text": text,
                    "source": file.filename,
                    "page": page_num
                })
        doc.close()
        os.remove(temp_path)

        file_info.append({"filename": file.filename, "pages": len(chunks)})

        # Split into smaller chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
        )

        from langchain_core.documents import Document
        docs = []
        for chunk in chunks:
            sub_chunks = splitter.split_text(chunk["text"])
            for sub in sub_chunks:
                docs.append(Document(
                    page_content=sub,
                    metadata={"source": chunk["source"], "page": chunk["page"]}
                ))
        all_chunks.extend(docs)

    # Index into ChromaDB
    vectorstore = Chroma.from_documents(
        documents=all_chunks,
        embedding=embedding_model,
        persist_directory=CHROMA_DIR,
        collection_name=COLLECTION_NAME,
    )

    return {
        "success": True,
        "files": file_info,
        "total_chunks": len(all_chunks)
    }

@app.post("/chat")
def chat(request: ChatRequest):
    vs = get_vectorstore()
    if vs is None:
        raise HTTPException(status_code=400, detail="No documents indexed yet.")

    retriever = vs.as_retriever(search_kwargs={"k": 5})
    chunks = retriever.invoke(request.question)

    context = "\n\n".join([
        f"[Source: {c.metadata.get('source','?')}, Page {c.metadata.get('page','?')}]\n{c.page_content}"
        for c in chunks
    ])

    citations = list(set([
        f"{c.metadata.get('source','?')} p.{c.metadata.get('page','?')}"
        for c in chunks
    ]))

    messages = [
        {"role": "system", "content": (
            "Answer using ONLY the context below. "
            "If the answer isn't there, say 'I don't have that information in the uploaded documents.' "
            "After your answer, list the sources used.\n\n"
            f"Context:\n{context}"
        )},
        {"role": "user", "content": request.question}
    ]

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0,
        reasoning_effort="low",
    )

    return {
        "answer": response.choices[0].message.content,
        "citations": citations
    }

@app.post("/quiz/generate")
def generate_quiz():
    vs = get_vectorstore()
    if vs is None:
        raise HTTPException(status_code=400, detail="No documents indexed yet.")

    # Get a broad sample of chunks
    results = vs._collection.get(limit=20)
    sample_text = "\n\n".join(results["documents"][:15])

    prompt = f"""Based on the following study material, generate exactly 10 questions:
- 5 Multiple Choice Questions (MCQ) with 4 options each
- 5 Short Answer Questions

Return ONLY valid JSON in this exact format, no other text:
{{
  "questions": [
    {{
      "id": 1,
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "topic": "topic name"
    }},
    {{
      "id": 6,
      "type": "short_answer",
      "question": "...",
      "correct_answer": "...",
      "topic": "topic name"
    }}
  ]
}}

Study Material:
{sample_text}"""

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        reasoning_effort="low",
    )

    raw = response.choices[0].message.content
    # Clean JSON
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        quiz = json.loads(raw)
        return quiz
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to generate valid quiz JSON.")

@app.post("/quiz/evaluate")
def evaluate_quiz(request: QuizEvaluateRequest):
    weak_topics = []
    results = []

    for i, (q, user_answer) in enumerate(zip(request.questions, request.answers)):
        correct = q.get("correct_answer", "").strip().lower()
        user = user_answer.strip().lower()

        is_correct = correct in user or user in correct

        results.append({
            "question_id": q.get("id", i+1),
            "correct": is_correct,
            "topic": q.get("topic", "Unknown"),
            "correct_answer": q.get("correct_answer", ""),
            "user_answer": user_answer,
        })

        if not is_correct:
            topic = q.get("topic", "Unknown")
            if topic not in weak_topics:
                weak_topics.append(topic)

    return {
        "results": results,
        "weak_topics": weak_topics,
        "score": sum(1 for r in results if r["correct"]),
        "total": len(results)
    }

@app.post("/quiz/revise")
def revise(request: ReviseRequest):
    vs = get_vectorstore()
    if vs is None:
        raise HTTPException(status_code=400, detail="No documents indexed yet.")

    summaries = []
    for topic in request.weak_topics:
        retriever = vs.as_retriever(search_kwargs={"k": 4})
        chunks = retriever.invoke(topic)

        context = "\n\n".join([c.page_content for c in chunks])
        citations = list(set([
            f"{c.metadata.get('source','?')} p.{c.metadata.get('page','?')}"
            for c in chunks
        ]))

        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": (
                    "Write a focused 2-paragraph revision summary using ONLY the context below. "
                    "Do not add any information not present in the context.\n\n"
                    f"Context:\n{context}"
                )},
                {"role": "user", "content": f"Summarize the key concepts about: {topic}"}
            ],
            temperature=0,
            reasoning_effort="low",
        )

        summaries.append({
            "topic": topic,
            "summary": response.choices[0].message.content,
            "citations": citations
        })

    return {"summaries": summaries}