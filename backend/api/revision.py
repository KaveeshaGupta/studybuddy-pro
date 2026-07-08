from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.vectorstore import similarity_search, is_indexed
from services.ai import generate_revision_summary

router = APIRouter()

class ReviseRequest(BaseModel):
    weak_topics: List[str]

@router.post("/revision")
async def generate_revision(request: ReviseRequest):
    if not is_indexed():
        raise HTTPException(status_code=400, detail="No documents indexed yet.")

    summaries = []
    for topic in request.weak_topics:
        chunks = similarity_search(topic, top_k=4)

        context = "\n\n".join([c.page_content for c in chunks])
        citations = list(set([
            f"{c.metadata.get('source','?')} p.{c.metadata.get('page','?')}"
            for c in chunks
        ]))

        summary = generate_revision_summary(topic, context)

        summaries.append({
            "topic": topic,
            "summary": summary,
            "citations": citations
        })

    return {"summaries": summaries}