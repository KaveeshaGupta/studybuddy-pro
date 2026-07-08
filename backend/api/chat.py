from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.vectorstore import similarity_search, is_indexed
from services.ai import answer_question, generate_suggested_questions

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    chat_history: Optional[List[dict]] = []

@router.post("/chat")
async def chat(request: ChatRequest):
    if not is_indexed():
        raise HTTPException(status_code=400, detail="No documents indexed yet.")

    chunks = similarity_search(request.question, top_k=5)

    context = "\n\n".join([
        f"[Source: {c.metadata.get('source','?')}, Page {c.metadata.get('page','?')}]\n{c.page_content}"
        for c in chunks
    ])

    # Structured citations as objects
    seen = set()
    citations = []
    for c in chunks:
        key = (c.metadata.get('source','?'), c.metadata.get('page','?'))
        if key not in seen:
            seen.add(key)
            citations.append({
                "filename": c.metadata.get('source','?'),
                "page": c.metadata.get('page','?')
            })

    answer = answer_question(request.question, context)
    suggested = generate_suggested_questions(request.question, answer)

    return {
        "answer": answer,
        "citations": citations,
        "suggested_questions": suggested
    }