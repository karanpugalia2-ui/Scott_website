"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import type { GearItem } from "@/lib/content";
import { useSite } from "@/components/SiteContext";

function GearCard({
  item,
  index,
}: {
  item: GearItem;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`gear-card group relative rounded-2xl overflow-hidden cursor-pointer bg-[#0c0c0c] ${item.span} flex flex-col h-full`}
      style={{ "--accent": item.accent } as React.CSSProperties}
    >
      {/* Glow border on hover — CSS only */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${item.accent}44, 0 0 30px ${item.accent}12`,
        }}
      />

      {/* Category tag — top left */}
      <div className="absolute top-3 left-3 z-30">
        <div
          className="px-2.5 py-0.5 rounded-full text-[9px] tracking-[0.18em] uppercase font-medium backdrop-blur-md"
          style={{
            color: item.accent,
            background: `${item.accent}12`,
            border: `1px solid ${item.accent}22`,
          }}
        >
          {item.category}
        </div>
      </div>

      {/* Watermark number */}
      <div
        className="absolute top-2 right-4 text-[80px] md:text-[100px] font-black leading-none select-none pointer-events-none z-0"
        style={{ color: `${item.accent}06` }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Image area — CSS hover transition */}
      <div className="gear-card-image relative flex items-center justify-center overflow-hidden z-10 rounded-t-2xl transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
        <div className="relative w-full h-full flex items-center justify-center px-2 md:px-4 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-1 group-hover:scale-[0.88]">
          <Image
            src={item.image}
            alt={item.name}
            width={item.imageW}
            height={item.imageH}
            className="w-full h-full object-contain transition-[filter] duration-500 ease-out group-hover:drop-shadow-[0_0_20px_var(--accent)]"
            style={{
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      </div>

      {/* Name — always visible */}
      <div className="px-4 py-1.5 z-20 relative bg-[#0c0c0c]">
        <h3 className="text-[13px] md:text-[15px] font-bold text-white tracking-tight leading-tight">
          {item.name}
        </h3>
      </div>

      {/* Details — CSS height/opacity transition */}
      <div className="gear-card-details px-4 pb-3 z-20 relative bg-[#0c0c0c] overflow-hidden mt-auto">
        <div className="border-t border-white/5 pt-2">
          <p
            className="text-[15px] md:text-[16px] italic mb-1 font-semibold"
            style={{ color: item.accent }}
          >
            {item.tagline}
          </p>
          <p className="text-[15px] md:text-[16px] text-[#999] leading-snug mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.specs.map((spec, i) => (
              <span
                key={spec}
                className="gear-spec px-2 py-0.5 rounded-full text-[10px] md:text-[11px] tracking-wider font-medium opacity-0 translate-y-1 scale-90 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                style={{
                  color: `${item.accent}cc`,
                  background: `${item.accent}10`,
                  border: `1px solid ${item.accent}18`,
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Shine sweep — CSS only */}
      <div
        className="absolute inset-0 pointer-events-none z-40 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-600 ease-in-out"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)",
          width: "200%",
        }}
      />
    </motion.div>
  );
}

export default function Gear() {
  const { content } = useSite();
  const gear = content.gear;
  const leftItems = gear.items.filter((i) => i.column !== "right");
  const rightItems = gear.items.filter((i) => i.column === "right");
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      id="gear"
      ref={sectionRef}
      className="py-24 md:py-32 relative"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #c8ff00 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Vertical scroll line */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] bg-white/5">
        <motion.div
          className="w-full bg-[#c8ff00]/30"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Section header */}
      <div className="px-6 md:px-12 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#c8ff00]" />
            <span className="text-sm tracking-[0.3em] uppercase text-[#c8ff00]">
              {gear.eyebrow}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            {gear.heading}
          </h2>
          <p className="text-[#999] mt-4 max-w-lg text-lg">
            {gear.description}
          </p>
        </motion.div>
      </div>

      {/* Gear layout — 2×2 grid left + tall gimbal right */}
      <div className="px-6 md:px-12 relative z-10">
        <div className="gear-layout">
          {/* Left: 2×2 grid */}
          <div className="gear-grid-left">
            {leftItems.map((item, i) => (
              <GearCard key={item.id} item={item} index={i} />
            ))}
          </div>
          {/* Right: tall gimbal */}
          {rightItems.length > 0 && (
            <div className="gear-grid-right">
              {rightItems.map((item, i) => (
                <GearCard key={item.id} item={item} index={leftItems.length + i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="mt-12 mx-6 md:mx-12 h-[1px] bg-white/5"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: "left" }}
      />
    </section>
  );
}
