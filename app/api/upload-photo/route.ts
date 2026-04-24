import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Client-upload handler for Vercel Blob. The browser calls this route to get
 * a short-lived signed token, then uploads the file directly to Blob without
 * going through our serverless function. This keeps us well under the 4.5 MB
 * server action body limit and cuts CPU on image uploads.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Scope uploads to the annonce-photos folder so we can later
        // list/cleanup orphans with a simple prefix query.
        const cleanPath = `annonce-photos/${pathname.replace(/^\/+/, "")}`;
        return {
          allowedContentTypes: ALLOWED_TYPES,
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_BYTES,
          pathname: cleanPath,
        };
      },
      onUploadCompleted: async () => {
        // No-op for now. Could log to DB, run image analysis, etc.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
