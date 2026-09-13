"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const marqueeItems = [
  "CONCERTS",
  "•",
  "PORTRAITS",
  "•",
  "MUSIC VIDEOS",
  "•",
  "EVENTS",
  "•",
  "ARTIST TOURS",
  "•",
  "LIVE MUSIC",
  "•",
  "CONCERTS",
  "•",
  "PORTRAITS",
  "•",
  "MUSIC VIDEOS",
  "•",
  "EVENTS",
  "•",
  "ARTIST TOURS",
  "•",
  "LIVE MUSIC",
  "•",
];

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="py-12 overflow-hidden border-y border-white/5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex whitespace-nowrap"
      >
        <div className="animate-marquee flex items-center gap-8">
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className={`text-3xl md:text-5xl font-bold tracking-tight ${
                item === "•"
                  ? "text-[#c8ff00] text-xl"
                  : "text-[#333] hover:text-[#ededed] transition-colors duration-500"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="animate-marquee flex items-center gap-8 ml-8" aria-hidden>
          {marqueeItems.map((item, i) => (
            <span
              key={`dup-${i}`}
              className={`text-3xl md:text-5xl font-bold tracking-tight ${
                item === "•"
                  ? "text-[#c8ff00] text-xl"
                  : "text-[#333] hover:text-[#ededed] transition-colors duration-500"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
