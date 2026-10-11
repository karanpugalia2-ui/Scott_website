import { isAuthorized, unauthorized, badRequest, serverError } from "@/lib/adminAuth";
import { readStore, updateContent, StoreError } from "@/lib/store";
import type { SiteContent } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const store = await readStore();
  return Response.json(store, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  let body: { content?: Partial<SiteContent> };
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  if (!body || typeof body.content !== "object" || body.content === null) {
    return badRequest("Missing content object");
  }
  try {
    const content = await updateContent(body.content);
    return Response.json({ ok: true, content });
  } catch (err) {
    if (err instanceof StoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return serverError();
  }
}
