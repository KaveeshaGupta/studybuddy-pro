from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.vectorstore import similarity_search, is_indexed
from services.ai import answer_question

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

    citations = list(set([
        f"{c.metadata.get('source','?')} p.{c.metadata.get('page','?')}"
        for c in chunks
    ]))

    answer = answer_question(request.question, context)

    return {
        "answer": answer,
        "citations": citations
    }