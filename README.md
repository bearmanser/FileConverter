# FileConverter

FileConverter is a web application for converting common file types directly in the browser through a simple upload-and-download workflow.

The live version is available at [grinderstudio.no/fileconvert](https://www.grinderstudio.no/fileconvert).

## Overview

This project is built for people who want file conversion to feel straightforward. Upload a file, choose the output format, and download the converted result in seconds.

FileConverter currently supports a range of everyday formats across:

- Documents
- Images
- Spreadsheets and structured data
- Audio
- Video

Examples include conversions such as:

- `PDF -> DOCX`
- `TXT -> PDF`
- `PNG -> WEBP`
- `CSV -> XLSX`
- `MP4 -> MP3`
- `WAV -> AAC`

## What This Repository Contains

This repository includes both parts of the application:

- `Frontend/` - a React + TypeScript + Vite interface deployed under `/fileconvert`
- `Backend/` - a FastAPI service that performs the file conversions and returns downloadable files

## Features

- Clean browser-based file upload flow
- Automatic format detection from the uploaded file
- Available output formats shown based on the selected file type
- Direct file download after conversion
- API endpoints for programmatic use
- Support for documents, media, images, and tabular data in one project

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Chakra UI
- Backend: FastAPI, Python
- Conversion libraries: `python-docx`, `pypdf`, `Pillow`, `openpyxl`, `reportlab`, `markdown`, `beautifulsoup4`, `imageio-ffmpeg`

## Project Structure

```text
FileConverter/
|-- Frontend/
|   |-- src/
|   |-- public/
|   `-- package.json
|-- Backend/
|   |-- app/
|   |-- tests/
|   |-- requirements.txt
|   `-- Dockerfile
`-- README.md
```

## Local Development

### 1. Start the backend

```powershell
cd C:\GitHub\FileConverter\Backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at `http://127.0.0.1:8000`.

### 2. Start the frontend

```powershell
cd C:\GitHub\FileConverter\Frontend
npm install
npm run dev
```

The frontend will be available at `http://127.0.0.1:5173/fileconvert/`.

During local development, the frontend talks to the backend at `http://127.0.0.1:8000` by default.

## Deployment Notes

- The frontend is configured with the Vite base path `/fileconvert/`
- The production frontend URL is [https://www.grinderstudio.no/fileconvert](https://www.grinderstudio.no/fileconvert)
- The frontend uses `VITE_API_BASE_URL` when provided
- If `VITE_API_BASE_URL` is not set in production, the frontend falls back to `https://fileconvert-api.grinderstudio.no`

## API Overview

The backend exposes a small HTTP API:

- `GET /` - basic service message
- `GET /api/health` - health check
- `GET /api/formats` - supported conversion map
- `POST /api/convert` - convert an uploaded file

`POST /api/convert` expects multipart form data:

- `file` - the uploaded file
- `target_format` - the requested output extension, such as `pdf`, `docx`, `png`, or `mp3`

Example:

```bash
curl -X POST "http://127.0.0.1:8000/api/convert" \
  -F "file=@sample.mp4" \
  -F "target_format=mp3" \
  --output sample.mp3
```

## Supported Conversion Areas

The application supports conversion flows across these categories:

- Documents: `pdf`, `docx`, `txt`, `md`, `html`
- Images: `jpg`, `jpeg`, `png`, `webp`
- Tabular data: `csv`, `json`, `xlsx`
- Video: `mp4`, `mov`, `avi`, `mkv`, `webm`
- Audio: `mp3`, `wav`, `aac`, `ogg`, `flac`, `m4a`

The exact list of allowed conversions is exposed by the backend through `GET /api/formats`.

## Notes For Contributors

- Frontend development happens in `Frontend`
- Backend development happens in `Backend`
- The frontend includes a user-facing conversion flow, pricing page, authentication screens, and API documentation page
- The backend is designed to run locally or in Docker

## License

No license file is currently included in this repository.
