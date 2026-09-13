"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote:
      "Scott doesn't just take photos — he captures feelings. Every shot from our concert was electric.",
    author: "Festival Organizer",
    event: "NH7 Weekender",
  },
  {
    quote:
      "Professional, creative, and always delivers beyond expectations. His video work is cinematic gold.",
    author: "Independent Artist",
    event: "Music Video Project",
  },
  {
    quote:
      "The energy in his concert photos is unreal. You can literally hear the music through the images.",
    author: "Music Blog Editor",
    event: "Coverage Review",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-[#0d0d0d] relative overflow-hidden" style={{ contentVisibility: "auto" as const, containIntrinsicSize: "0 800px" }}>
      {/* Background Seedhe Maut photo */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url(/work/seedhe-maut/3.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/60 via-transparent to-[#0d0d0d]/80 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#c8ff00]" />
            <span className="text-sm tracking-[0.3em] uppercase text-[#c8ff00]">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Words That Matter
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
              className="p-8 rounded-xl bg-[#141414] border border-white/5 hover:border-[#c8ff00]/20 transition-all duration-500 relative group"
            >
              <div className="text-[#c8ff00] text-6xl font-serif absolute top-4 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                &ldquo;
              </div>
              <p className="text-[#ccc] leading-relaxed mb-8 relative z-10 text-sm md:text-base italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-white/5 pt-4">
                <div className="font-medium text-[#ededed] text-sm">
                  {t.author}
                </div>
                <div className="text-[#666] text-xs tracking-wider mt-1">
                  {t.event}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
