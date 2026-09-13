"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
        <Image
          src={project.cover}
          alt={project.artist}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 320px, (max-width: 1200px) 420px, 500px"
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
  onClose,
}: {
  project: ArtistProject;
  onClose: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setCurrentImage((p) =>
          p < project.images.length - 1 ? p + 1 : p
        );
      if (e.key === "ArrowLeft")
        setCurrentImage((p) => (p > 0 ? p - 1 : p));
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, project.images.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white">{project.artist}</h3>
          <p className="text-sm text-[#666]">{project.tagline}</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#999] hover:text-white hover:border-white/30 transition-colors"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        {showVideo && project.video ? (
          <video
            src={project.video}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              className="relative w-full h-full max-w-5xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={project.images[currentImage]}
                alt={`${project.artist} - Photo ${currentImage + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {project.video && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all ${
                showVideo
                  ? "bg-[#c8ff00] text-[#0a0a0a]"
                  : "border border-white/10 text-[#999] hover:text-white hover:border-white/30"
              }`}
            >
              {showVideo ? "Viewing Video" : "Play Video"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!showVideo && (
            <span className="text-sm text-[#666]">
              {currentImage + 1} / {project.images.length}
            </span>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : p))}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#999] hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
              disabled={showVideo || currentImage === 0}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentImage((p) =>
                  p < project.images.length - 1 ? p + 1 : p
                )
              }
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#999] hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
              disabled={
                showVideo || currentImage === project.images.length - 1
              }
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] =
    useState<ArtistProject | null>(null);
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
              onClick={() => setSelectedProject(project)}
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
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-[3/4] overflow-lg rounded-lg mb-3 ring-1 ring-white/5 group-hover:ring-[#c8ff00]/30 transition-all duration-300">
                <Image
                  src={project.cover}
                  alt={project.artist}
                  fill
                  className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  sizes="260px"
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
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
