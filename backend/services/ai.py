import json
import os
from groq import Groq
from core.config import settings

client = Groq(api_key=settings.groq_api_key)
MODEL = "openai/gpt-oss-20b"

def answer_question(question: str, context: str) -> str:
    messages = [
        {"role": "system", "content": (
            "Answer using ONLY the context below. "
            "If the answer isn't there, say 'I don't have that information in the uploaded documents.' "
            "After your answer, add a Sources line.\n\n"
            f"Context:\n{context}"
        )},
        {"role": "user", "content": question}
    ]
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0,
        reasoning_effort="low",
    )
    return response.choices[0].message.content

def generate_quiz(sample_text: str) -> dict:
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

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        reasoning_effort="low",
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    return json.loads(raw)

def generate_revision_summary(topic: str, context: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
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
    return response.choices[0].message.content