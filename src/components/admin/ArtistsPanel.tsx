"use client";

import { useEffect, useRef, useState } from "react";
import type { ArtistProject } from "@/lib/content";
import { ARTIST_TYPES } from "@/lib/content";
import { apiJson } from "./api";
import { Btn, Checkbox, Empty, Field, Label, Select } from "./ui";

type ToastFn = (message: string, kind?: "ok" | "err") => void;

export default function ArtistsPanel({
  artists,
  setArtists,
  toast,
}: {
  artists: ArtistProject[];
  setArtists: (fn: ArtistProject[] | ((prev: ArtistProject[]) => ArtistProject[])) => void;
  toast: ToastFn;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ArtistProject | null>(null);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = artists.find((a) => a.id === selectedId) ?? null;

  useEffect(() => {
    const t = setTimeout(() => {
      if (selected) setDraft({ ...selected, images: [...selected.images] });
      else setDraft(null);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, artists.length, selected?.artist, selected?.tagline, selected?.type, selected?.year, selected?.featured, selected?.video, selected?.cover, selected?.images.join(",")]);

  async function addArtist() {
    const name = newName.trim();
    if (!name) return toast("Enter an artist name", "err");
    setBusy(true);
    try {
      const { artist } = await apiJson<{ artist: ArtistProject }>("/api/artists", {
        method: "POST",
        body: JSON.stringify({ artist: name, year: String(new Date().getFullYear()) }),
      });
      setArtists((prev) => [...prev, artist]);
      setSelectedId(artist.id);
      setNewName("");
      toast(`Added ${artist.artist}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to add", "err");
    } finally {
      setBusy(false);
    }
  }

  async function saveMeta() {
    if (!draft) return;
    setBusy(true);
    try {
      const { artist } = await apiJson<{ artist: ArtistProject }>(
        `/api/artists/${draft.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            artist: draft.artist,
            tagline: draft.tagline,
            type: draft.type,
            year: draft.year,
            featured: draft.featured,
            video: draft.video ?? "",
          }),
        },
      );
      setArtists((prev) => prev.map((a) => (a.id === artist.id ? artist : a)));
      toast("Saved");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setBusy(false);
    }
  }

  async function move(id: string, direction: "up" | "down") {
    try {
      const { artists: updated } = await apiJson<{ artists: ArtistProject[] }>(
        `/api/artists/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ move: direction }),
        },
      );
      setArtists(updated);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Move failed", "err");
    }
  }

  async function removeArtist(id: string, name: string) {
    if (!window.confirm(`Delete ${name} and all its photos?`)) return;
    setBusy(true);
    try {
      await apiJson(`/api/artists/${id}`, { method: "DELETE" });
      setArtists((prev) => prev.filter((a) => a.id !== id));
      if (selectedId === id) setSelectedId(null);
      toast(`Deleted ${name}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed", "err");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhotos(files: FileList) {
    if (!selected || !files.length) return;
    setUploading(true);
    try {
      const form = new FormData();
      for (const f of Array.from(files)) form.append("files", f);
      const result = await apiJson<{ added: string[]; artist: ArtistProject }>(
        `/api/artists/${selected.id}/photos`,
        { method: "POST", body: form },
      );
      setArtists((prev) =>
        prev.map((a) => (a.id === result.artist.id ? result.artist : a)),
      );
      toast(`Uploaded ${result.added.length} photo${result.added.length > 1 ? "s" : ""}`);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "err");
    } finally {
      setUploading(false);
    }
  }

  async function deletePhoto(path: string) {
    if (!selected) return;
    try {
      const { artist } = await apiJson<{ artist: ArtistProject }>(
        `/api/artists/${selected.id}/photos`,
        { method: "DELETE", body: JSON.stringify({ path }) },
      );
      setArtists((prev) => prev.map((a) => (a.id === artist.id ? artist : a)));
      toast("Photo removed");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Remove failed", "err");
    }
  }

  async function setCover(path: string) {
    if (!selected) return;
    try {
      const { artist } = await apiJson<{ artist: ArtistProject }>(
        `/api/artists/${selected.id}`,
        { method: "PATCH", body: JSON.stringify({ cover: path }) },
      );
      setArtists((prev) => prev.map((a) => (a.id === artist.id ? artist : a)));
      toast("Cover updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Cover failed", "err");
    }
  }

  async function reorderPhoto(index: number, direction: "up" | "down") {
    if (!selected) return;
    const images = [...selected.images];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    try {
      const { artist } = await apiJson<{ artist: ArtistProject }>(
        `/api/artists/${selected.id}`,
        { method: "PATCH", body: JSON.stringify({ images }) },
      );
      setArtists((prev) => prev.map((a) => (a.id === artist.id ? artist : a)));
    } catch (err) {
      toast(err instanceof Error ? err.message : "Reorder failed", "err");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* List */}
      <div className="space-y-4">
        <div className="border border-white/10 rounded-xl bg-[#0c0c0c] p-4">
          <Label>Add artist</Label>
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addArtist()}
              placeholder="Artist name"
              className="flex-1 min-w-0 bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#c8ff00]/50 focus:outline-none"
            />
            <Btn variant="primary" onClick={addArtist} disabled={busy}>
              Add
            </Btn>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl bg-[#0c0c0c] divide-y divide-white/5 max-h-[70vh] overflow-y-auto">
          {artists.length === 0 && <Empty text="No artists yet" />}
          {artists.map((a, i) => (
            <div
              key={a.id}
              className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
                selectedId === a.id
                  ? "bg-[#c8ff00]/[0.06] border-l-2 border-[#c8ff00]"
                  : "border-l-2 border-transparent hover:bg-white/[0.02]"
              }`}
              onClick={() => setSelectedId(a.id)}
            >
              <div className="w-9 h-12 rounded overflow-hidden bg-[#161616] flex-shrink-0">
                {a.cover ? (
                  <img src={a.cover} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#444]">
                    —
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate flex items-center gap-1.5">
                  {a.artist}
                  {a.featured && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#c8ff00]/15 text-[#c8ff00] tracking-wider uppercase">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#555] font-mono">
                  {a.id} · {a.images.length} photos
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    move(a.id, "up");
                  }}
                  disabled={i === 0}
                  className="text-[#555] hover:text-[#c8ff00] disabled:opacity-20 p-0.5"
                  aria-label="Move up"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    move(a.id, "down");
                  }}
                  disabled={i === artists.length - 1}
                  className="text-[#555] hover:text-[#c8ff00] disabled:opacity-20 p-0.5"
                  aria-label="Move down"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {!draft ? (
        <div className="border border-dashed border-white/10 rounded-xl flex items-center justify-center min-h-[300px] text-[#444] text-sm">
          Select an artist to edit
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-white/10 rounded-xl bg-[#0c0c0c] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                {draft.artist || draft.id}
              </h2>
              <Btn
                variant="danger"
                onClick={() => removeArtist(draft.id, draft.artist)}
                disabled={busy}
              >
                Delete artist
              </Btn>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name" value={draft.artist} onChange={(v) => setDraft({ ...draft, artist: v })} />
              <Field label="Tagline" value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} />
              <Select
                label="Type"
                value={draft.type}
                onChange={(v) => setDraft({ ...draft, type: v as ArtistProject["type"] })}
                options={ARTIST_TYPES}
              />
              <Field label="Year" value={draft.year} onChange={(v) => setDraft({ ...draft, year: v })} />
              <Field
                label="Video URL (optional)"
                value={draft.video ?? ""}
                onChange={(v) => setDraft({ ...draft, video: v })}
                placeholder="/videos/…"
                mono
              />
              <div className="flex items-end pb-1.5">
                <Checkbox
                  label="Featured"
                  checked={Boolean(draft.featured)}
                  onChange={(v) => setDraft({ ...draft, featured: v })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Btn variant="primary" onClick={saveMeta} disabled={busy}>
                {busy ? "Saving…" : "Save details"}
              </Btn>
              <span className="text-[10px] text-[#444] font-mono">
                id: {draft.id}
              </span>
            </div>
          </div>

          {/* Photos */}
          <div className="border border-white/10 rounded-xl bg-[#0c0c0c] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-tight">
                Photos ({selected?.images.length ?? 0})
              </h3>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && uploadPhotos(e.target.files)}
                />
                <Btn
                  variant="primary"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Upload photos"}
                </Btn>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selected?.images.map((src, i) => (
                <div
                  key={src}
                  className={`relative rounded-lg overflow-hidden border group ${
                    selected.cover === src
                      ? "border-[#c8ff00]/60"
                      : "border-white/10"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-28 object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-1.5 py-1 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={() => reorderPhoto(i, "up")}
                        disabled={i === 0}
                        className="text-[#aaa] hover:text-[#c8ff00] disabled:opacity-25 p-0.5"
                        aria-label="Move photo up"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => reorderPhoto(i, "down")}
                        disabled={i === (selected?.images.length ?? 0) - 1}
                        className="text-[#aaa] hover:text-[#c8ff00] disabled:opacity-25 p-0.5"
                        aria-label="Move photo down"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex gap-1">
                      {selected.cover !== src && (
                        <button
                          onClick={() => setCover(src)}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-[#c8ff00] text-[#0a0a0a] font-semibold"
                        >
                          Cover
                        </button>
                      )}
                      <button
                        onClick={() => deletePhoto(src)}
                        className="text-[#aaa] hover:text-red-400 p-0.5"
                        aria-label="Delete photo"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {selected.cover === src && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-[#c8ff00] text-[#0a0a0a] font-bold tracking-wider uppercase">
                      Cover
                    </span>
                  )}
                  <span className="absolute top-1.5 right-1.5 text-[9px] px-1 py-0.5 rounded bg-black/60 text-white/60 font-mono">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
            {(selected?.images.length ?? 0) === 0 && (
              <Empty text="No photos — upload some above" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
