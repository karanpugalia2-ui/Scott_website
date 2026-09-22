"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ArtistProject } from "@/lib/data";

const TYPE_LABEL: Record<ArtistProject["type"], string> = {
  concert: "Concert",
  "music-video": "Music Video",
  documentary: "Documentary",
  event: "Event",
};

export default function ArtistGallery({
  artist,
  onClose,
}: {
  artist: ArtistProject | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!artist) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [artist, onClose]);

  return (
    <AnimatePresence>
      {artist && (
        <motion.div
          className="fixed inset-0 z-[10002] flex flex-col items-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-4xl flex flex-col min-h-0 flex-1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pt-2 md:pt-4 pb-5 shrink-0 relative z-10 bg-black/95 backdrop-blur-md rounded-t-lg">
              <div>
                <div className="text-[#c8ff00] text-xs tracking-[0.3em] uppercase mb-1 font-medium">
                  {TYPE_LABEL[artist.type]} — {artist.year}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {artist.artist}
                </h3>
                {artist.tagline && (
                  <p className="text-[#999] text-sm mt-1">{artist.tagline}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:border-[#c8ff00] hover:text-[#c8ff00] transition-colors flex-shrink-0"
                aria-label="Close gallery"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              className="flex-1 min-h-0 overflow-y-auto pb-10 pr-1"
              onClick={onClose}
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                {artist.images.map((src, i) => (
                  <div
                    key={src}
                    className="relative overflow-hidden rounded-lg ring-1 ring-white/10"
                  >
                    <img
                      src={src}
                      alt={`${artist.artist} — photo ${i + 1}`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 text-[10px] text-white/70 rounded-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}