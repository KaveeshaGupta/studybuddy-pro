from fastapi import APIRouter

router = APIRouter()


@router.post("/quiz")
async def generate_quiz() -> dict[str, str]:
    return {"status": "Not Implemented"}


@router.post("/evaluate")
async def evaluate_quiz() -> dict[str, str]:
    return {"status": "Not Implemented"}
