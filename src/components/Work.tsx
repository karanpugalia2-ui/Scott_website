"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { artists, type ArtistProject } from "@/lib/data";

function ArtistSlide({
  project,
  isActive,
  onClick,
}: {
  project: ArtistProject;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      className="flex-shrink-0 w-[320px] md:w-[420px] lg:w-[500px] group cursor-pointer relative"
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-xl transition-all duration-500 ${
          isActive
            ? "ring-2 ring-[#c8ff00] shadow-[0_0_40px_rgba(200,255,0,0.15)]"
            : "ring-1 ring-white/5"
        }`}
      >
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

        {/* Play icon for video projects */}
        {project.video && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 ml-1"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
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
          <div className="flex items-center gap-2 mt-3 text-xs text-[#666]">
            <span>{project.images.length} photos</span>
            {project.video && (
              <>
                <span>•</span>
                <span className="text-[#c8ff00]">+ Video</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({
  project,
  artistIndex,
  totalArtists,
  onClose,
  onPrevArtist,
  onNextArtist,
}: {
  project: ArtistProject;
  artistIndex: number;
  totalArtists: number;
  onClose: () => void;
  onPrevArtist: () => void;
  onNextArtist: () => void;
}) {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);

  const totalMedia = project.images.length + (project.video ? 1 : 0);
  const isVideo = project.video && currentMedia === project.images.length;

  const goNextMedia = () => {
    if (currentMedia < totalMedia - 1) {
      setDirection(1);
      setCurrentMedia((p) => p + 1);
    }
  };
  const goPrevMedia = () => {
    if (currentMedia > 0) {
      setDirection(-1);
      setCurrentMedia((p) => p - 1);
    }
  };

  // Reset to first image when project changes
  useEffect(() => {
    setCurrentMedia(0);
    setDirection(0);
  }, [project.id]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNextMedia();
      if (e.key === "ArrowLeft") goPrevMedia();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, currentMedia, totalMedia]);

  // Swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNextMedia();
      else goPrevMedia();
    }
  };

  // Preload adjacent images
  useEffect(() => {
    project.images.forEach((src, i) => {
      if (Math.abs(i - currentMedia) <= 1) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [currentMedia, project.images]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col h-[100dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shrink-0 relative z-20">
        <div className="min-w-0">
          <motion.h3
            key={project.id + "-name"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl font-bold text-white truncate"
          >
            {project.artist}
          </motion.h3>
          <motion.p
            key={project.id + "-tag"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm text-[#666] truncate"
          >
            {project.tagline}
          </motion.p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 flex items-center justify-center text-[#999] hover:text-white hover:border-white/30 transition-colors shrink-0"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative flex items-center justify-center min-h-0">
        {/* OUTER NAV — Previous artist (left edge) */}
        {artistIndex > 0 && (
          <button
            onClick={onPrevArtist}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all"
            aria-label="Previous artist"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* OUTER NAV — Next artist (right edge) */}
        {artistIndex < totalArtists - 1 && (
          <button
            onClick={onNextArtist}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all"
            aria-label="Next artist"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* INNER NAV — Previous media */}
        {currentMedia > 0 && (
          <button
            onClick={goPrevMedia}
            className="absolute left-12 sm:left-20 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
            aria-label="Previous photo"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* INNER NAV — Next media */}
        {currentMedia < totalMedia - 1 && (
          <button
            onClick={goNextMedia}
            className="absolute right-12 sm:right-20 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
            aria-label="Next photo"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Media content */}
        <div className="px-16 sm:px-24 py-2 w-full h-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {isVideo && project.video ? (
              <motion.video
                key={project.id + "-video"}
                src={project.video}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.img
                key={project.id + "-" + currentMedia}
                src={project.images[currentMedia]}
                alt={`${project.artist} - Photo ${currentMedia + 1}`}
                className="max-w-full max-h-full object-contain select-none"
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                draggable={false}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 relative z-20">
        {/* Video toggle */}
        <div className="w-24">
          {project.video && (
            <button
              onClick={() => setCurrentMedia(isVideo ? 0 : project.images.length)}
              className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs tracking-wider uppercase transition-all ${
                isVideo
                  ? "bg-[#c8ff00] text-[#0a0a0a]"
                  : "border border-white/10 text-[#999] hover:text-white hover:border-white/30"
              }`}
            >
              {isVideo ? "Viewing Video" : "Play Video"}
            </button>
          )}
        </div>

        {/* Counter + dots */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs sm:text-sm text-[#666] tabular-nums">
            {currentMedia + 1} / {totalMedia}
          </span>
          {totalMedia <= 15 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: totalMedia }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentMedia ? 1 : -1);
                    setCurrentMedia(i);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentMedia
                      ? "bg-[#c8ff00] w-4 h-1.5"
                      : "bg-white/20 hover:bg-white/40 w-1.5 h-1.5"
                  }`}
                  aria-label={`Go to media ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Artist position */}
        <div className="w-24 flex justify-end">
          <span className="text-[10px] sm:text-xs text-[#444] tabular-nums">
            {artistIndex + 1} / {totalArtists} artists
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? artists.find((a) => a.id === selectedProjectId) ?? null
    : null;
  const artistIndex = selectedProject
    ? artists.findIndex((a) => a.id === selectedProject.id)
    : -1;

  const openArtist = (project: ArtistProject) => {
    setSelectedProjectId(project.id);
  };

  const closeLightbox = () => {
    setSelectedProjectId(null);
  };

  const prevArtist = () => {
    if (artistIndex > 0) {
      setSelectedProjectId(artists[artistIndex - 1].id);
    }
  };

  const nextArtist = () => {
    if (artistIndex < artists.length - 1) {
      setSelectedProjectId(artists[artistIndex + 1].id);
    }
  };
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const featuredProjects = artists.filter((p) => p.featured);
  const allProjects = artists;

  return (
    <section id="work" ref={sectionRef} className="py-24 md:py-32 relative" style={{ contentVisibility: "auto" as const, containIntrinsicSize: "0 2000px" }}>
      <div className="px-6 md:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
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
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
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
              isActive={selectedProject?.id === project.id}
              onClick={() => openArtist(project)}
            />
          ))}
        </div>
      </motion.div>

      {/* All artists grid — horizontal scroll */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
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
              className="flex-shrink-0 w-[200px] md:w-[260px] cursor-pointer group"
              onClick={() => openArtist(project)}
            >
              <div className="relative aspect-[3/4] overflow-lg rounded-lg mb-3 ring-1 ring-white/5 group-hover:ring-[#c8ff00]/30 transition-all duration-300">
                <img
                  src={project.cover}
                  alt={project.artist}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm font-bold text-white">
                    {project.artist}
                  </h4>
                  <p className="text-[10px] text-[#666] mt-0.5">
                    {project.images.length} photos
                    {project.video ? " • Video" : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <Lightbox
            project={selectedProject}
            artistIndex={artistIndex}
            totalArtists={artists.length}
            onClose={closeLightbox}
            onPrevArtist={prevArtist}
            onNextArtist={nextArtist}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
