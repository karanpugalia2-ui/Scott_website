"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { ArtistProject, SiteContent } from "@/lib/content";
import { apiJson, setAdminKey } from "./api";
import ArtistsPanel from "./ArtistsPanel";
import ContentPanel from "./ContentPanel";

type Tab = "artists" | "content";

interface Toast {
  id: number;
  message: string;
  kind: "ok" | "err";
}

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>("artists");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [artists, setArtists] = useState<ArtistProject[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [keyDraft, setKeyDraft] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  const toast = useCallback((message: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await apiJson<{ artists: ArtistProject[]; content: SiteContent }>(
        "/api/content",
      );
      setArtists(data.artists);
      setContent(data.content);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      const existing = localStorage.getItem("scott-admin-key") ?? "";
      setKeyDraft(existing);
      setKeySaved(Boolean(existing));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-bold tracking-tight">
              SCOTT
              <span className="text-[#c8ff00]">.</span>
            </Link>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#555] border-l border-white/10 pl-3">
              Admin
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {(["artists", "content"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-colors ${
                  tab === t
                    ? "bg-[#c8ff00]/10 text-[#c8ff00] border border-[#c8ff00]/30"
                    : "text-[#777] hover:text-[#ccc] border border-transparent"
                }`}
              >
                {t === "artists" ? "Artists" : "Content"}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <input
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="Admin API key (optional)"
              className="hidden md:block w-44 bg-[#0f0f0f] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#ccc] focus:border-[#c8ff00]/50 focus:outline-none"
              onBlur={() => {
                setAdminKey(keyDraft.trim());
                setKeySaved(Boolean(keyDraft.trim()));
              }}
            />
            {keySaved && (
              <span className="hidden md:inline text-[10px] text-[#c8ff00]">●</span>
            )}
            <Link
              href="/"
              className="text-[11px] text-[#777] hover:text-[#c8ff00] transition-colors"
            >
              View site ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <p className="text-[#555] text-sm tracking-wide py-20 text-center">
            Loading…
          </p>
        ) : loadError ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-red-400 text-sm">{loadError}</p>
            <button
              onClick={load}
              className="px-4 py-2 rounded-lg bg-[#c8ff00] text-[#0a0a0a] text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : tab === "artists" ? (
          <ArtistsPanel
            artists={artists}
            setArtists={setArtists}
            toast={toast}
          />
        ) : content ? (
          <ContentPanel
            content={content}
            setContent={setContent}
            toast={toast}
          />
        ) : null}
      </main>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[200] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2.5 rounded-lg text-xs tracking-wide shadow-lg border ${
              t.kind === "ok"
                ? "bg-[#111] border-[#c8ff00]/30 text-[#c8ff00]"
                : "bg-[#111] border-red-500/40 text-red-400"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      <p className="max-w-6xl mx-auto px-4 md:px-8 pb-10 text-[10px] text-[#444] leading-relaxed">
        Edits are saved to <span className="font-mono">data/store.json</span> on
        this machine and appear on the site instantly in development. On a
        serverless host (Vercel), runtime writes are not persistent — Firebase
        or another database can be wired into{" "}
        <span className="font-mono">src/lib/store.ts</span> later. If{" "}
        <span className="font-mono">ADMIN_API_KEY</span> is set in the server
        environment, the key above is required for writes.
      </p>
    </div>
  );
}
