"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 800);
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 6) + 2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0a]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="grain-overlay" />

          {/* SCOTT. branding */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold tracking-[0.3em] text-[#ededed] mb-12"
          >
            SCOTT<span className="text-[#c8ff00]">.</span>
          </motion.div>

          {/* Progress bar container */}
          <div className="w-[280px] md:w-[400px] relative">
            {/* Background line */}
            <div className="h-[1px] w-full bg-white/10" />

            {/* Animated fill line */}
            <motion.div
              className="absolute top-0 left-0 h-[1px] bg-[#c8ff00]"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(count, 100)}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />

            {/* Glowing dot at the end */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#c8ff00] shadow-[0_0_8px_#c8ff00,0_0_20px_#c8ff0044]"
              animate={{ left: `${Math.min(count, 100)}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* Percentage */}
          <motion.div
            className="mt-6 text-xs tracking-[0.2em] text-[#555] font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {String(Math.min(count, 100)).padStart(3, "0")}
          </motion.div>

          {/* Bottom text */}
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex justify-between px-10 text-[10px] tracking-[0.2em] uppercase text-[#444]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>Photography & Cinematography</span>
            <span>Vadodara, India</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
