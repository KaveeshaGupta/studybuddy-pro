from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.vectorstore import get_sample_chunks, is_indexed
from services.ai import generate_quiz

router = APIRouter()

class QuizEvaluateRequest(BaseModel):
    questions: List[dict]
    answers: List[str]

@router.post("/quiz")
async def generate_quiz_endpoint():
    if not is_indexed():
        raise HTTPException(status_code=400, detail="No documents indexed yet.")

    sample_chunks = get_sample_chunks(limit=15)
    sample_text = "\n\n".join(sample_chunks)

    try:
        quiz = generate_quiz(sample_text)
        return quiz
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {e}")

@router.post("/evaluate")
async def evaluate_quiz(request: QuizEvaluateRequest):
    weak_topics = []
    results = []

    for i, (q, user_answer) in enumerate(zip(request.questions, request.answers)):
        correct = q.get("correct_answer", "").strip().lower()
        user = user_answer.strip().lower()
        is_correct = False
        if q.get("type") == "mcq":
            user_clean = user.strip().lower()
            correct_clean = correct.strip().lower()
            if user_clean == correct_clean or user_clean.startswith(correct_clean + ".") or user_clean.startswith(correct_clean + " "):
                is_correct = True
        else:
            is_correct = correct in user or user in correct

        results.append({
            "question_id": q.get("id", i + 1),
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