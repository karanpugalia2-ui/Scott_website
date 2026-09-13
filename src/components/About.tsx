"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12 relative"
    >
      {/* Subtle background accent */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#c8ff00]/[0.02] to-transparent pointer-events-none"
        style={{ y: parallaxY }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
              About
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            The Story Behind
            <br />
            <span className="text-stroke">the Lens</span>
          </h2>
        </motion.div>

        {/* Photo + Text layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          {/* Photo — takes 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-2"
          >
            <div className="sticky top-32">
              <motion.div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                style={{ scale: imageScale }}
              >
                <img
                  src="/scott.jpeg"
                  alt="Scott — Karan Pugalia"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              {/* Name under photo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-6"
              >
                <h3 className="text-2xl font-bold text-[#ededed]">
                  Scott<span className="text-[#c8ff00]">.</span>
                </h3>
                <p className="text-sm text-[#666] mt-1">
                  Karan Pugalia — Vadodara, India
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Story text — takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-3"
          >
            <div className="space-y-8 text-lg md:text-xl leading-relaxed">
              {[
                { delay: 0.4, color: "text-[#ccc]", children: (
                  <>My journey began in <span className="text-[#ededed] font-medium">Class 9</span> with nothing more than a <span className="text-[#c8ff00]">mobile phone</span> — photographing the streets of Vadodara and learning composition, light, and storytelling.</>
                )},
                { delay: 0.5, color: "text-[#999]", children: (
                  <>This passion evolved into work with cafés and local businesses, and before completing Class 12, I joined film school — where I discovered my strongest interest in <em className="text-[#c8ff00] not-italic font-medium">concerts, live events, and artists</em>.</>
                )},
                { delay: 0.6, color: "text-[#999]", children: (
                  <>Over 4–5 years of consistent work, I kept investing in my craft and saving from my own earnings — eventually purchasing my first professional camera entirely through my own work.</>
                )},
                { delay: 0.7, color: "text-[#ccc] text-xl md:text-2xl font-medium leading-relaxed", children: (
                  <>From a mobile phone to professional cinema equipment — driven by one thing: <em className="text-[#c8ff00] not-italic">the desire to create</em>.</>
                )},
              ].map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: p.delay, duration: 0.6 }}
                  className={p.color}
                >
                  {p.children}
                </motion.p>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-14"
            >
              <a
                href="#contact"
                data-cursor-hover
                className="magnetic-btn inline-flex items-center gap-3 px-8 py-4 bg-[#c8ff00] text-[#0a0a0a] rounded-full font-semibold text-sm tracking-[0.15em] uppercase hover:bg-[#d4ff33] transition-colors duration-300"
              >
                Let&apos;s Collaborate
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
