# FileConverter Backend

Local FastAPI backend for file conversion during development.

## Run locally

```powershell
cd C:\GitHub\FileConverter\Backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Media conversion is powered by `imageio-ffmpeg`, which bundles an FFmpeg binary as part of the Python dependency install. No separate system FFmpeg install is required.

## API

- `GET /api/health`
- `GET /api/formats`
- `POST /api/convert`

`POST /api/convert` expects multipart form data:

- `file`: uploaded file
- `target_format`: output extension like `pdf`, `docx`, `png`, `mp4`, or `mp3`

## Supported local conversions

- Documents: `pdf`, `docx`, `txt`, `md`, `html`
- Images: `jpg`, `jpeg`, `png`, `webp`
- Tabular: `csv`, `json`, `xlsx`
- Video: `mp4`, `mov`, `avi`, `mkv`, `webm`
- Audio: `mp3`, `wav`, `aac`, `ogg`, `flac`, `m4a`

Supported media flows include:

- Video to video, such as `mp4 -> webm`
- Audio to audio, such as `wav -> mp3`
- Video to audio extraction, such as `mp4 -> mp3`
