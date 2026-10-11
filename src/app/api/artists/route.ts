import { isAuthorized, unauthorized, badRequest, serverError } from "@/lib/adminAuth";
import { readStore, createArtist, StoreError } from "@/lib/store";
import type { ArtistProject } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const { artists } = await readStore();
  return Response.json(artists, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  let body: Partial<ArtistProject>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  try {
    const artist = await createArtist(body ?? {});
    return Response.json({ ok: true, artist }, { status: 201 });
  } catch (err) {
    if (err instanceof StoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return serverError();
  }
}
