"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const socialLinks = [
  {
    href: "https://www.instagram.com/scottt_73/",
    label: "Instagram",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://wa.me/919825335611",
    label: "WhatsApp",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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

          <a
            href="mailto:karanpugalia2@gmail.com"
            data-cursor-hover
            className="magnetic-btn inline-flex items-center gap-4 px-10 py-5 bg-[#c8ff00] text-[#0a0a0a] rounded-full font-bold text-lg tracking-wider hover:bg-[#d4ff33] transition-all duration-300 mb-16"
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
          </a>
        </motion.div>

        {/* Social links */}
        <div className="flex justify-center gap-5 mb-16">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#666] hover:text-[#c8ff00] hover:border-[#c8ff00]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="text-sm text-[#666]">
          © 2025 SCOTT. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-sm text-[#666]">
          <span>Crafted with</span>
          <span className="text-[#c8ff00]">♥</span>
          <span>from Vadodara, India</span>
        </div>
      </motion.footer>
    </section>
  );
}
