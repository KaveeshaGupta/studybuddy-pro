import os
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from core.config import settings

embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
)

COLLECTION_NAME = "studybuddy"
_vectorstore = None

def get_vectorstore():
    global _vectorstore
    if _vectorstore is None and os.path.exists(settings.chroma_persist_directory):
        _vectorstore = Chroma(
            persist_directory=settings.chroma_persist_directory,
            embedding_function=embedding_model,
            collection_name=COLLECTION_NAME,
        )
    return _vectorstore

def add_documents(documents: list[Document]) -> int:
    global _vectorstore
    if _vectorstore is not None:
        try:
            _vectorstore.delete_collection()
        except:
            pass
        _vectorstore = None

    _vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        persist_directory=settings.chroma_persist_directory,
        collection_name=COLLECTION_NAME,
    )
    return _vectorstore._collection.count()

def similarity_search(query: str, top_k: int = 5) -> list:
    vs = get_vectorstore()
    if vs is None:
        return []
    retriever = vs.as_retriever(search_kwargs={"k": top_k})
    return retriever.invoke(query)

def get_sample_chunks(limit: int = 15) -> list[str]:
    vs = get_vectorstore()
    if vs is None:
        return []
    results = vs._collection.get(limit=limit)
    return results.get("documents", [])

def is_indexed() -> bool:
    vs = get_vectorstore()
    return vs is not None and vs._collection.count() > 0