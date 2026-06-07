import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { ISSUE_COVER_UPLOAD } from "@/config/issues";
import { JOURNAL_COVER_UPLOAD } from "@/config/journal";

const staticAssetUploadDirectory = path.join(
  process.cwd(),
  "data",
  "uploads",
  "static-assets",
);

function sanitizeFilename(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function saveStaticAssetUpload(file: File): Promise<{
  url: string;
  mimeType: string;
  sizeBytes: number;
}> {
  await mkdir(staticAssetUploadDirectory, { recursive: true });

  const safeName = sanitizeFilename(file.name || "asset");
  const filename = `${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(staticAssetUploadDirectory, filename), bytes);

  return {
    url: `/uploads/static-assets/${filename}`,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: bytes.byteLength,
  };
}

export function resolveStaticAssetUploadPath(filename: string): string {
  return path.join(staticAssetUploadDirectory, sanitizeFilename(filename));
}

const issueCoverUploadDirectory = path.join(
  process.cwd(),
  "data",
  "uploads",
  ISSUE_COVER_UPLOAD.directoryName,
);

export async function saveIssueCoverUpload(file: File): Promise<{
  url: string;
  mimeType: string;
  sizeBytes: number;
}> {
  await mkdir(issueCoverUploadDirectory, { recursive: true });

  const safeName = sanitizeFilename(file.name || "cover");
  const filename = `${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(issueCoverUploadDirectory, filename), bytes);

  return {
    url: `${ISSUE_COVER_UPLOAD.publicPathPrefix}/${filename}`,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: bytes.byteLength,
  };
}

export function resolveIssueCoverUploadPath(filename: string): string {
  return path.join(issueCoverUploadDirectory, sanitizeFilename(filename));
}

const journalCoverUploadDirectory = path.join(
  process.cwd(),
  "data",
  "uploads",
  JOURNAL_COVER_UPLOAD.directoryName,
);

export async function saveJournalCoverUpload(file: File): Promise<{
  url: string;
  mimeType: string;
  sizeBytes: number;
}> {
  await mkdir(journalCoverUploadDirectory, { recursive: true });

  const safeName = sanitizeFilename(file.name || "cover");
  const filename = `${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(journalCoverUploadDirectory, filename), bytes);

  return {
    url: `${JOURNAL_COVER_UPLOAD.publicPathPrefix}/${filename}`,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: bytes.byteLength,
  };
}

export function resolveJournalCoverUploadPath(filename: string): string {
  return path.join(journalCoverUploadDirectory, sanitizeFilename(filename));
}
