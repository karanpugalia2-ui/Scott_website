import { promises as fs } from "fs";
import path from "path";
import { isAuthorized, unauthorized, badRequest, serverError } from "@/lib/adminAuth";
import {
  addPhotos,
  deletePhoto,
  getArtist,
  StoreError,
} from "@/lib/store";
import {
  isImageFile,
  nextPhotoPath,
  MAX_IMAGE_BYTES,
} from "@/lib/uploads";

export const runtime = "nodejs";

const MAX_FILES = 20;

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;

  let artist;
  try {
    artist = await getArtist(id);
  } catch (err) {
    if (err instanceof StoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return serverError();
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return badRequest("Expected multipart form data");
  }

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return badRequest("No files provided");
  if (files.length > MAX_FILES) return badRequest(`Max ${MAX_FILES} files at once`);

  for (const file of files) {
    if (!isImageFile(file)) {
      return badRequest(`Unsupported file type: ${file.type || file.name}`);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return badRequest(`Image too large: ${file.name}`);
    }
  }

  const saved: string[] = [];
  try {
    await fs.mkdir(path.join(process.cwd(), "public", "work", artist.id), {
      recursive: true,
    });
    for (const file of files) {
      const ext = file.name.toLowerCase().endsWith(".png") ? ".png" : ".jpg";
      const { absPath, publicPath } = await nextPhotoPath(artist.id, ext);
      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(absPath, buf);
      saved.push(publicPath);
    }
    const updated = await addPhotos(artist.id, saved);
    return Response.json({ ok: true, added: saved, artist: updated });
  } catch (err) {
    for (const p of saved) {
      await fs
        .rm(path.join(process.cwd(), "public", p.replace(/^\//, "")), {
          force: true,
        })
        .catch(() => {});
    }
    if (err instanceof StoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return serverError();
  }
}

export async function DELETE(req: Request, { params }: Params) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;

  let body: { path?: string };
  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = { path: String(formData.get("path") ?? "") };
    }
  } catch {
    return badRequest("Invalid request body");
  }

  if (!body.path) return badRequest("Missing photo path");
  try {
    const artist = await deletePhoto(id, body.path);
    return Response.json({ ok: true, artist });
  } catch (err) {
    if (err instanceof StoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return serverError();
  }
}
