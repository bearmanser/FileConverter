from __future__ import annotations

SUPPORTED_CONVERSIONS: dict[str, list[str]] = {
    "pdf": ["docx", "txt", "html"],
    "docx": ["pdf", "txt", "html"],
    "txt": ["pdf", "docx", "md", "html"],
    "md": ["pdf", "docx", "html", "txt"],
    "html": ["pdf", "txt", "md", "docx"],
    "jpg": ["png", "webp", "pdf"],
    "jpeg": ["png", "webp", "pdf"],
    "png": ["jpg", "webp", "pdf"],
    "webp": ["png", "jpg", "pdf"],
    "csv": ["xlsx", "json", "txt", "pdf"],
    "json": ["csv", "txt", "xlsx", "pdf"],
    "xlsx": ["csv", "json", "txt", "pdf"],
}

MEDIA_TYPES: dict[str, str] = {
    "pdf": "application/pdf",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "txt": "text/plain; charset=utf-8",
    "md": "text/markdown; charset=utf-8",
    "html": "text/html; charset=utf-8",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
    "csv": "text/csv; charset=utf-8",
    "json": "application/json",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}

DOCUMENT_FORMATS = {"pdf", "docx", "txt", "md", "html"}
IMAGE_FORMATS = {"jpg", "jpeg", "png", "webp"}
TABULAR_FORMATS = {"csv", "json", "xlsx"}
