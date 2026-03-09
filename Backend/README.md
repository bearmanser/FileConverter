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

## API

- `GET /api/health`
- `GET /api/formats`
- `POST /api/convert`

`POST /api/convert` expects multipart form data:

- `file`: uploaded file
- `target_format`: output extension like `pdf`, `docx`, `png`, or `xlsx`

## Supported local conversions

- Documents: `pdf`, `docx`, `txt`, `md`, `html`
- Images: `jpg`, `jpeg`, `png`, `webp`
- Tabular: `csv`, `json`, `xlsx`

This setup intentionally avoids external desktop dependencies like LibreOffice and FFmpeg, so audio/video conversions are not included in the first local backend version.
