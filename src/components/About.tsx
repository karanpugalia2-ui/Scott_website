"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stats = [
  { label: "Concerts Shot", value: "50+" },
  { label: "Music Videos", value: "20+" },
  { label: "Events Covered", value: "100+" },
  { label: "Years Experience", value: "3+" },
];

const timeline = [
  {
    year: "2022",
    title: "Started the Journey",
    desc: "Picked up a camera for the first time during college. What started as a hobby quickly became an obsession with visual storytelling.",
  },
  {
    year: "2023",
    title: "First Major Gig",
    desc: "Shot my first large-scale concert. The energy of 10,000 people screaming in unison through a viewfinder — nothing compares.",
  },
  {
    year: "2024",
    title: "Going Professional",
    desc: "Started freelancing full-time. Collaborated with multiple artists and brands. Expanded into music videos and documentary work.",
  },
  {
    year: "2025",
    title: "Building the Brand",
    desc: "Working with bigger artists, larger stages, and more ambitious projects. Every frame tells a story.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 relative">
      {/* Background accent */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#c8ff00]/[0.02] to-transparent pointer-events-none"
        style={{ y: parallaxY }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-[#ccc] leading-relaxed mb-8">
              Hey, I&apos;m <span className="text-[#c8ff00] font-semibold">Scott</span>{" "}
              <span className="text-[#999]">(Karan Pugalia)</span> — a
              photographer and videographer from{" "}
              <span className="text-[#ededed] font-medium">Daman, India</span>,
              currently studying at Parul University.
            </p>
            <p className="text-lg md:text-xl text-[#999] leading-relaxed mb-8">
              I live for the chaos of live music — the split-second moments where
              light, sound, and human emotion collide. My work isn&apos;t about
              perfection; it&apos;s about capturing the raw, unfiltered energy that
              makes each moment unique.
            </p>
            <p className="text-lg md:text-xl text-[#999] leading-relaxed mb-12">
              From packed concert halls to intimate studio sessions, I bring a
              cinematic eye to every project. Whether it&apos;s a music video,
              event coverage, or a personal portrait series — I believe every frame
              should make you <em className="text-[#c8ff00]">feel</em> something.
            </p>

            {/* CTA */}
            <a
              href="#contact"
              data-cursor-hover
              className="magnetic-btn inline-flex items-center gap-3 px-8 py-4 bg-[#c8ff00] text-[#0a0a0a] rounded-full font-semibold text-sm tracking-[0.15em] uppercase hover:bg-[#d4ff33] transition-colors duration-300"
            >
              Let&apos;s Collaborate
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
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

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#c8ff00]/50 via-[#333] to-transparent" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                  className="flex gap-6 group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#333] flex items-center justify-center group-hover:border-[#c8ff00] transition-colors duration-300">
                      <div className="w-2 h-2 rounded-full bg-[#c8ff00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#c8ff00] text-sm font-mono tracking-wider">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-[#ededed] mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#999] leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-white/5"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#c8ff00] mb-2">
                {stat.value}
              </div>
              <div className="text-sm tracking-[0.2em] uppercase text-[#666]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
