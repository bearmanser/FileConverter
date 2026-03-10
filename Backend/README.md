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

## Run with Docker

```powershell
cd C:\GitHub\FileConverter\Backend
docker build -t fileconverter-backend .
docker run --rm -p 8000:8000 fileconverter-backend
```

The container serves the API on port `8000`.

`ALLOWED_ORIGINS` can be used to override the default CORS list with a comma-separated set of origins. By default, the backend allows:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `https://grinderstudio.no`
- `https://www.grinderstudio.no`

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
