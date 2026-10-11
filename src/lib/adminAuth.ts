export function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return true;
  return req.headers.get("x-admin-key") === expected;
}

export function unauthorized(): Response {
  return Response.json(
    { error: "Unauthorized — set a matching admin key" },
    { status: 401 },
  );
}

export function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(message: string): Response {
  return Response.json({ error: message }, { status: 404 });
}

export function serverError(message = "Internal error"): Response {
  return Response.json({ error: message }, { status: 500 });
}
