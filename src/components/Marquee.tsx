"use client";

import { motion } from "framer-motion";
import { useRef, useMemo } from "react";
import { useSite } from "@/components/SiteContext";

export default function Marquee() {
  const { content } = useSite();
  const ref = useRef<HTMLDivElement>(null);

  const marqueeItems = useMemo(
    () =>
      content.marquee.items.flatMap((item) => [
        item,
        "•",
      ]),
    [content.marquee.items],
  );

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
