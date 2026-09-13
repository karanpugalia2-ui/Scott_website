"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Gear", href: "#gear" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-5 flex items-center justify-between transition-colors duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(10, 10, 10, 0.9)" : "transparent",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link href="/" className="text-lg font-bold tracking-tight">
            SCOTT<span className="text-[#c8ff00]">.</span>
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
            >
              <Link
                href={link.href}
                className="text-sm tracking-[0.15em] uppercase text-[#999] hover:text-[#c8ff00] transition-colors duration-300"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="md:hidden flex flex-col gap-1.5 z-[200]"
          onClick={() => setMenuOpen(!menuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          aria-label="Toggle menu"
        >
          <motion.span
            className="w-6 h-[1.5px] bg-[#ededed]"
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="w-6 h-[1.5px] bg-[#ededed]"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="w-6 h-[1.5px] bg-[#ededed]"
            animate={
              menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
            }
          />
        </motion.button>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-[99] bg-[#0a0a0a]/98 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
        initial={false}
        animate={menuOpen ? { opacity: 1, pointerEvents: "auto" as const } : { opacity: 0, pointerEvents: "none" as const }}
        transition={{ duration: 0.4 }}
      >
        {navLinks.map((link, i) => (
          <motion.div
            key={link.name}
            initial={{ opacity: 0, y: 30 }}
            animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: menuOpen ? 0.1 + i * 0.1 : 0 }}
            className="mb-8"
          >
            <Link
              href={link.href}
              className="text-4xl font-bold tracking-tight text-[#ededed] hover:text-[#c8ff00] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
