import { isAuthorized, unauthorized, badRequest, notFound, serverError } from "@/lib/adminAuth";
import { updateArtist, deleteArtist, moveArtist, getArtist, StoreError } from "@/lib/store";
import type { ArtistProject } from "@/lib/content";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  let body: Partial<ArtistProject> & { move?: "up" | "down" };
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  try {
    if (body.move === "up" || body.move === "down") {
      const artists = await moveArtist(id, body.move);
      return Response.json({ ok: true, artists });
    }
    const patch = { ...body };
    delete patch.move;
    const artist = await updateArtist(id, patch);
    return Response.json({ ok: true, artist });
  } catch (err) {
    if (err instanceof StoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return serverError();
  }
}

export async function DELETE(req: Request, { params }: Params) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  try {
    await deleteArtist(id);
    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof StoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return serverError();
  }
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const artist = await getArtist(id);
    return Response.json(artist, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof StoreError) {
      return err.status === 404 ? notFound(err.message) : badRequest(err.message);
    }
    return serverError();
  }
}
