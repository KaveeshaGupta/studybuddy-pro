import os
import fitz
import tempfile
from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from services.vectorstore import add_documents

router = APIRouter()

@router.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    all_docs = []
    file_info = []

    for file in files:
        # Save to temp file
        temp_path = os.path.join(tempfile.gettempdir(), file.filename)
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extract text with PyMuPDF
        doc = fitz.open(temp_path)
        raw_chunks = []
        for page_num, page in enumerate(doc, 1):
            text = page.get_text()
            if text.strip():
                raw_chunks.append({
                    "text": text,
                    "source": file.filename,
                    "page": page_num
                })
        doc.close()
        os.remove(temp_path)

        # Split into smaller chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
        )

        docs = []
        for chunk in raw_chunks:
            sub_chunks = splitter.split_text(chunk["text"])
            for sub in sub_chunks:
                docs.append(Document(
                    page_content=sub,
                    metadata={"source": chunk["source"], "page": chunk["page"]}
                ))
        all_docs.extend(docs)
        file_info.append({"filename": file.filename, "pages": len(raw_chunks)})

    total_chunks = add_documents(all_docs)

    return {
        "success": True,
        "files": file_info,
        "total_chunks": total_chunks
    }