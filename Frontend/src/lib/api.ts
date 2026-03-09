import { API_BASE_URL } from "../constants";
import type { ConversionMap } from "../types";

const FORMATS_ENDPOINT = `${API_BASE_URL}/api/formats`;
const CONVERT_ENDPOINT = `${API_BASE_URL}/api/convert`;

type FormatsResponse = {
  conversions: ConversionMap;
};

export async function fetchSupportedFormats(): Promise<ConversionMap> {
  const response = await fetch(FORMATS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Supported formats could not be loaded.");
  }

  const payload = (await response.json()) as FormatsResponse;
  return payload.conversions;
}

export async function convertFile(file: File, targetFormat: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const response = await fetch(CONVERT_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = await extractErrorMessage(response);
    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const fileName = extractFileName(response.headers.get("content-disposition"), file.name, targetFormat);

  downloadBlob(blob, fileName);

  return {
    fileName,
    message: `${file.name} was converted to ${targetFormat.toUpperCase()} and downloaded as ${fileName}.`,
  };
}

async function extractErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail ?? "The conversion request could not be completed.";
  } catch {
    return "The conversion request could not be completed.";
  }
}

function extractFileName(
  contentDisposition: string | null,
  originalName: string,
  targetFormat: string
) {
  const match = contentDisposition?.match(/filename="?([^";]+)"?/i);
  if (match?.[1]) {
    return match[1];
  }

  const sourceParts = originalName.split(".");
  if (sourceParts.length > 1) {
    sourceParts.pop();
  }

  return `${sourceParts.join(".") || "converted-file"}.${targetFormat}`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
