"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { artists, type ArtistProject } from "@/lib/data";
import ArtistGallery from "@/components/ArtistGallery";

const DRAG_THRESHOLD = 8;

function ArtistSlide({
  project,
  onPointerDown,
  onClick,
}: {
  project: ArtistProject;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: (e?: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      className="flex-shrink-0 w-[320px] md:w-[420px] lg:w-[500px] group relative cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      onPointerDown={onPointerDown}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-white/5 transition-all duration-500">
        <img
          src={project.cover}
          alt={project.artist}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#c8ff00] text-[#0a0a0a] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            Featured
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-[#c8ff00] text-xs tracking-[0.3em] uppercase mb-2 font-medium">
            {project.type === "concert"
              ? "Concert"
              : project.type === "music-video"
              ? "Music Video"
              : project.type === "documentary"
              ? "Documentary"
              : "Event"}{" "}
            — {project.year}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            {project.artist}
          </h3>
          <p className="text-[#999] text-sm leading-relaxed line-clamp-2">
            {project.tagline}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[#c8ff00] text-xs tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
            View Gallery
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selected, setSelected] = useState<ArtistProject | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const checkScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = direction === "left" ? -440 : 440;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleSelect = useCallback((project: ArtistProject) => (e?: React.MouseEvent) => {
    const start = dragStartRef.current;
    if (
      start &&
      e &&
      (Math.abs(e.clientX - start.x) > DRAG_THRESHOLD ||
        Math.abs(e.clientY - start.y) > DRAG_THRESHOLD)
    ) {
      return;
    }
    setSelected(project);
  }, []);

  const featuredProjects = artists.filter((p) => p.featured);
  const allProjects = artists;

  return (
    <section id="work" ref={sectionRef} className="py-24 md:py-32 relative">
      <div className="px-6 md:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#c8ff00]" />
              <span className="text-sm tracking-[0.3em] uppercase text-[#c8ff00]">
                Selected Work
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Artists & Events
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#999] hover:text-white hover:border-[#c8ff00] hover:text-[#c8ff00] transition-all disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-[#999]"
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#999] hover:text-white hover:border-[#c8ff00] hover:text-[#c8ff00] transition-all disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-[#999]"
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Featured carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-16"
      >
        <div className="px-6 md:px-12 mb-6">
          <span className="text-xs tracking-[0.3em] uppercase text-[#666]">
            Featured
          </span>
        </div>
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {featuredProjects.map((project) => (
            <ArtistSlide
              key={project.id}
              project={project}
              onPointerDown={handlePointerDown}
              onClick={handleSelect(project)}
            />
          ))}
        </div>
      </motion.div>

      {/* All artists grid — horizontal scroll */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="px-6 md:px-12 mb-6">
          <span className="text-xs tracking-[0.3em] uppercase text-[#666]">
            All Projects
          </span>
        </div>
        <div
          className="flex gap-5 overflow-x-auto px-6 md:px-12 pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {allProjects.map((project) => (
            <div
              key={project.id}
              className="flex-shrink-0 w-[200px] md:w-[260px] group cursor-pointer"
              onClick={handleSelect(project)}
              onPointerDown={handlePointerDown}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(project)();
                }
              }}
            >
              <div className="aspect-[3/4] rounded-lg mb-3 ring-1 ring-white/5 group-hover:ring-[#c8ff00]/30 group-hover:shadow-[0_0_20px_rgba(200,255,0,0.15)] transition-all duration-300">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                <img
                  src={project.cover}
                  alt={project.artist}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm font-bold text-white">
                    {project.artist}
                  </h4>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <ArtistGallery artist={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
