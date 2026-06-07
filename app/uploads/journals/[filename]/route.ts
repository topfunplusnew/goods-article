import { readFile } from "node:fs/promises";

import { resolveJournalCoverUploadPath } from "@/server/uploads";

export const runtime = "nodejs";

interface JournalUploadRouteParams {
  params: Promise<{
    filename: string;
  }>;
}

function contentTypeFor(filename: string): string {
  if (filename.endsWith(".svg")) {
    return "image/svg+xml";
  }
  if (filename.endsWith(".png")) {
    return "image/png";
  }
  if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (filename.endsWith(".webp")) {
    return "image/webp";
  }

  return "application/octet-stream";
}

export async function GET(_request: Request, { params }: JournalUploadRouteParams) {
  const { filename } = await params;

  try {
    const body = await readFile(resolveJournalCoverUploadPath(filename));
    return new Response(body, {
      headers: {
        "content-type": contentTypeFor(filename),
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
