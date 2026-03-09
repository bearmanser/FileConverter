from __future__ import annotations

VIDEO_FORMAT_OPTIONS = ("mp4", "mov", "avi", "mkv", "webm")
AUDIO_FORMAT_OPTIONS = ("mp3", "wav", "aac", "ogg", "flac", "m4a")

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
    **{
        source: [
            *(target for target in VIDEO_FORMAT_OPTIONS if target != source),
            *AUDIO_FORMAT_OPTIONS,
        ]
        for source in VIDEO_FORMAT_OPTIONS
    },
    **{
        source: [target for target in AUDIO_FORMAT_OPTIONS if target != source]
        for source in AUDIO_FORMAT_OPTIONS
    },
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
    "mp4": "video/mp4",
    "mov": "video/quicktime",
    "avi": "video/x-msvideo",
    "mkv": "video/x-matroska",
    "webm": "video/webm",
    "mp3": "audio/mpeg",
    "wav": "audio/wav",
    "aac": "audio/aac",
    "ogg": "audio/ogg",
    "flac": "audio/flac",
    "m4a": "audio/mp4",
}

DOCUMENT_FORMATS = {"pdf", "docx", "txt", "md", "html"}
IMAGE_FORMATS = {"jpg", "jpeg", "png", "webp"}
TABULAR_FORMATS = {"csv", "json", "xlsx"}
VIDEO_FORMATS = set(VIDEO_FORMAT_OPTIONS)
AUDIO_FORMATS = set(AUDIO_FORMAT_OPTIONS)
