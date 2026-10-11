export function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("scott-admin-key") ?? "";
}

export function setAdminKey(key: string): void {
  if (typeof window === "undefined") return;
  if (key) localStorage.setItem("scott-admin-key", key);
  else localStorage.removeItem("scott-admin-key");
}

export async function api(path: string, init?: RequestInit): Promise<Response> {
  const key = getAdminKey();
  const headers = new Headers(init?.headers);
  if (key) headers.set("x-admin-key", key);
  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(path, { cache: "no-store", ...init, headers });
}

export async function apiJson<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await api(path, init);
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}
