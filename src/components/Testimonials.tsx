"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useSite } from "@/components/SiteContext";

export default function Testimonials() {
  const { content } = useSite();
  const t = content.testimonials;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-[#0d0d0d] relative overflow-hidden">
      {/* Background photo */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${t.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/60 via-transparent to-[#0d0d0d]/80 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#c8ff00]" />
            <span className="text-sm tracking-[0.3em] uppercase text-[#c8ff00]">
              {t.eyebrow}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            {t.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.items.map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="p-8 rounded-xl bg-[#141414]/80 border border-white/5 hover:border-[#c8ff00]/20 transition-all duration-500 relative group backdrop-blur-sm"
            >
              <div className="text-[#c8ff00] text-6xl font-serif absolute top-4 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                &ldquo;
              </div>
              <p className="text-[#ccc] leading-relaxed mb-8 relative z-10 text-sm md:text-base italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="border-t border-white/5 pt-4">
                <div className="font-medium text-[#ededed] text-sm">
                  {item.author}
                </div>
                <div className="text-[#666] text-xs tracking-wider mt-1">
                  {item.event}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
