from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .conversion_map import SUPPORTED_CONVERSIONS
from .converters import (
    ConversionError,
    build_download_name,
    convert_file,
    normalize_extension,
)

DEFAULT_ALLOWED_ORIGINS = (
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://grinderstudio.no",
    "https://www.grinderstudio.no",
)


def get_allowed_origins() -> list[str]:
    configured = os.getenv("ALLOWED_ORIGINS")
    if not configured:
        return list(DEFAULT_ALLOWED_ORIGINS)

    return [origin.strip() for origin in configured.split(",") if origin.strip()]


app = FastAPI(
    title="FileConverter API",
    version="0.1.0",
    description="Local FastAPI service for converting common document, image, spreadsheet, audio, and video files.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "FileConverter backend is running."}


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/formats")
def get_formats() -> dict[str, dict[str, list[str]]]:
    return {"conversions": SUPPORTED_CONVERSIONS}


@app.post("/api/convert")
async def convert_upload(
    file: UploadFile = File(...),
    target_format: str = Form(...),
) -> StreamingResponse:
    source_format = normalize_extension(Path(file.filename or "").suffix)
    target_format = normalize_extension(target_format)

    if not source_format:
        raise HTTPException(status_code=400, detail="The uploaded file must have a file extension.")

    if source_format not in SUPPORTED_CONVERSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"The .{source_format} file type is not supported by the local converter.",
        )

    if target_format not in SUPPORTED_CONVERSIONS[source_format]:
        raise HTTPException(
            status_code=400,
            detail=f"Conversion from {source_format} to {target_format} is not supported.",
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    try:
        converted_bytes, media_type = convert_file(
            filename=file.filename or "upload",
            content=content,
            source_format=source_format,
            target_format=target_format,
        )
    except ConversionError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="The server could not complete the conversion for this file.",
        ) from error

    download_name = build_download_name(file.filename or "converted-file", target_format)
    headers = {"Content-Disposition": f'attachment; filename="{download_name}"'}

    return StreamingResponse(
        iter([converted_bytes]),
        media_type=media_type,
        headers=headers,
    )
