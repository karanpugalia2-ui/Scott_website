"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c8ff00]/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#c8ff00]" />
            <span className="text-sm tracking-[0.3em] uppercase text-[#c8ff00]">
              Get in Touch
            </span>
            <div className="w-8 h-[1px] bg-[#c8ff00]" />
          </div>

          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">
            Let&apos;s Create
            <br />
            <span className="text-[#c8ff00]">Something Together</span>
          </h2>

          <p className="text-[#999] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Have a project in mind? Need coverage for your next event? Or just want
            to chat about photography? I&apos;m always open to new collaborations and
            creative challenges.
          </p>

          <motion.a
            href="mailto:karanpugalia2@gmail.com"
            data-cursor-hover
            className="magnetic-btn inline-flex items-center gap-4 px-10 py-5 bg-[#c8ff00] text-[#0a0a0a] rounded-full font-bold text-lg tracking-wider hover:bg-[#d4ff33] transition-colors duration-300 mb-16"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            karanpugalia2@gmail.com
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center gap-6 mb-20"
        >
          {[
            { name: "Instagram", url: "https://www.instagram.com/scottt_73/" },
            { name: "YouTube", url: "#" },
            { name: "Behance", url: "#" },
            { name: "LinkedIn", url: "#" },
          ].map((social, i) => (
            <motion.a
              key={social.name}
              href={social.url}
              target={social.url !== "#" ? "_blank" : undefined}
              rel={social.url !== "#" ? "noopener noreferrer" : undefined}
              data-cursor-hover
              className="text-sm tracking-[0.15em] uppercase text-[#666] hover:text-[#c8ff00] transition-colors duration-300"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {social.name}
            </motion.a>
          ))}
        </motion.div>

        {/* Phone number */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-[#555] text-sm tracking-wider mb-16"
        >
          +91 98253 35611
        </motion.p>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="text-sm text-[#666]">
          © 2025 SCOTT. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-sm text-[#666]">
          <span>Crafted with</span>
          <span className="text-[#c8ff00]">♥</span>
          <span>from Daman, India</span>
        </div>
      </motion.footer>
    </section>
  );
}
