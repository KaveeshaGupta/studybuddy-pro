from fastapi import APIRouter

router = APIRouter()


@router.post("/chat")
async def chat() -> dict[str, str]:
    return {"status": "Not Implemented"}
