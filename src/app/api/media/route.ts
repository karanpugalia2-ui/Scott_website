import { isAuthorized, unauthorized, badRequest, serverError } from "@/lib/adminAuth";
import {
  isImageFile,
  isVideoFile,
  saveMediaUpload,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return badRequest("Expected multipart form data");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return badRequest("No file provided");
  }

  try {
    if (isImageFile(file)) {
      if (file.size > MAX_IMAGE_BYTES) return badRequest("Image too large (max 25MB)");
      const result = await saveMediaUpload(file, "image");
      return Response.json({ ok: true, ...result });
    }
    if (isVideoFile(file)) {
      if (file.size > MAX_VIDEO_BYTES) return badRequest("Video too large (max 100MB)");
      const result = await saveMediaUpload(file, "video");
      return Response.json({ ok: true, ...result });
    }
    return badRequest(
      `Unsupported file type: ${file.type || file.name}. Use jpeg/png/webp/avif/gif or mp4/webm.`,
    );
  } catch (err) {
    return serverError(err instanceof Error ? err.message : undefined);
  }
}
