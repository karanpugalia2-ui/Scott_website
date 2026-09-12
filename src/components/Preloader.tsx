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
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0a]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="grain-overlay" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-[120px] md:text-[200px] font-bold leading-none tracking-tighter text-[#ededed]">
              {Math.min(count, 100)}
            </div>
            <div className="text-sm tracking-[0.3em] uppercase text-[#666] mt-4">
              Loading Experience
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-12 left-12 text-sm tracking-[0.2em] uppercase text-[#666]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Scott — Photography & Videography
          </motion.div>

          <motion.div
            className="absolute bottom-12 right-12 text-sm tracking-[0.2em] uppercase text-[#666]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Daman, India
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
