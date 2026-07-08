from typing import Any


def add_documents(documents: list[Any]) -> None:
    raise NotImplementedError


def similarity_search(query: str, top_k: int = 5) -> list[Any]:
    raise NotImplementedError
