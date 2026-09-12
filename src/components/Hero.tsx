"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [0.55, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      {/* Video Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: videoScale, opacity: videoOpacity }}
      >
        <video
          src="/videos/chaar-diwari-bits-goa.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/work/chaar-diwari/1.jpg"
        />
        {/* Lighter overlay for readability while keeping video visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-[#0a0a0a]/20 to-[#0a0a0a]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 px-6 md:px-12 pb-16 pt-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-6"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-[#c8ff00] font-medium">
            Photography & Videography
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-bold leading-[0.85] tracking-tighter"
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.76, 0, 0.24, 1] }}
          >
            SCOTT
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-2">
          <motion.h1
            className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-bold leading-[0.85] tracking-tighter text-stroke"
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            VISUALS
          </motion.h1>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
          <motion.p
            className="text-[#ccc] text-base md:text-lg max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Capturing raw emotions through the lens — from electrifying concerts
            to intimate portraits. Based in Daman, creating across India.
          </motion.p>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <div className="w-12 h-[1px] bg-[#c8ff00]" />
            <span className="text-sm tracking-[0.2em] uppercase text-[#999]">
              Scroll to explore
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-32 right-12 w-32 h-32 border border-[#c8ff00]/20 rounded-full hidden lg:block z-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#c8ff00]/30 rounded-full hidden lg:block z-10"
        animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c8ff00]/30 to-transparent z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 1.8 }}
      />
    </section>
  );
}
