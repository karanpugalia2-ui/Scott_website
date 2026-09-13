"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

const gearItems = [
  {
    id: "fx3",
    name: "Sony FX3",
    category: "Camera Body",
    tagline: "The Cinema Line workhorse",
    description:
      "Full-frame sensor, 4K 120fps, S-Log3. Built for run-and-gun filmmaking with cinema-grade internals in a compact body.",
    specs: ["Full-Frame 10.2MP", "4K 120fps", "S-Log3 / S-Cinetone", "Dual Card Slots"],
    image: "/gear/sony-fx3.png",
    imageW: 900,
    imageH: 600,
    span: "",
    link: "https://electronics.sony.com/imaging/camcorders/all-camcorders/p/ilme-fx3",
    accent: "#c8ff00",
  },
  {
    id: "2470",
    name: "FE 24-70mm f/2.8 GM II",
    category: "Lens",
    tagline: "The versatile king of glass",
    description:
      "From wide concert shots to tight artist portraits — razor-sharp optics with buttery bokeh.",
    specs: ["f/2.8 Constant", "Nano AR Coating II", "XD Linear Motors", "695g"],
    image: "/gear/sony-2470gm.png",
    imageW: 650,
    imageH: 400,
    span: "",
    link: "https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel2470gm2",
    accent: "#ff6b35",
  },
  {
    id: "insta360",
    name: "Insta360 X3",
    category: "360° Action Camera",
    tagline: "Capture everything, reframe later",
    description:
      "360-degree capture means I never miss a moment. Shoot first, choose the angle in post.",
    specs: ["5.7K 360°", "72MP Photos", "FlowState", "Waterproof 10m"],
    image: "/gear/insta360-x3.png",
    imageW: 450,
    imageH: 450,
    span: "",
    link: "https://www.insta360.com/product/insta360-x3",
    accent: "#a855f7",
  },
  {
    id: "handycam",
    name: "Handycam",
    category: "Camcorder",
    tagline: "Always ready to roll",
    description:
      "Captures behind-the-scenes moments, b-roll, and spontaneous footage on the go.",
    specs: ["Optical Zoom", "SteadyShot", "NightShot Plus", "Compact"],
    image: "/gear/handycam.png",
    imageW: 550,
    imageH: 350,
    span: "",
    link: "https://electronics.sony.com/imaging/camcorders/all-camcorders/p/fdrax43a-b",
    accent: "#f43f5e",
  },
  {
    id: "rs5",
    name: "DJI RS 5 Combo",
    category: "Gimbal Stabilizer",
    tagline: "Buttery smooth motion",
    description:
      "3-axis stabilization that turns shaky handheld footage into cinema-grade steady shots.",
    specs: ["3-Axis Stabilization", "2.5kg Payload", "Focus Motor", "1Hr Full Charge"],
    image: "/gear/dji-rs5.png",
    imageW: 350,
    imageH: 550,
    span: "",
    link: "https://store.dji.com/product/dji-rs-5",
    accent: "#00d4ff",
  },
];

function GearCard({
  item,
  index,
}: {
  item: (typeof gearItems)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative rounded-2xl cursor-pointer bg-[#0c0c0c] ${item.span} flex flex-col h-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-40"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: `inset 0 0 0 1px ${item.accent}44, 0 0 30px ${item.accent}12`,
        }}
      />

      {/* Category tag — top left */}
      <div className="absolute top-3 left-3 z-30">
        <div
          className="px-2.5 py-0.5 rounded-full text-[9px] tracking-[0.18em] uppercase font-medium backdrop-blur-md"
          style={{
            color: item.accent,
            background: `${item.accent}12`,
            border: `1px solid ${item.accent}22`,
          }}
        >
          {item.category}
        </div>
      </div>

      {/* Watermark number */}
      <div
        className="absolute top-2 right-4 text-[80px] md:text-[100px] font-black leading-none select-none pointer-events-none z-0"
        style={{ color: `${item.accent}06` }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Image area — shrinks and lifts up on hover */}
      <motion.div
        className="relative flex items-center justify-center overflow-hidden z-10 rounded-t-2xl"
        animate={{
          flex: isHovered ? "0 0 42%" : "1 1 100%",
          paddingTop: isHovered ? "0.5rem" : "1.25rem",
          paddingBottom: isHovered ? "0.25rem" : "1.25rem",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="relative w-full h-full flex items-center justify-center px-2 md:px-4"
          animate={{
            y: isHovered ? -4 : 0,
            scale: isHovered ? 0.88 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={item.image}
            alt={item.name}
            width={item.imageW}
            height={item.imageH}
            className="w-full h-full object-contain"
            style={{
              filter: isHovered
                ? `drop-shadow(0 0 20px ${item.accent}18) drop-shadow(0 10px 25px rgba(0,0,0,0.5))`
                : "drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
              transition: "filter 0.4s ease",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Name — always visible, sits between image and details */}
      <div className="px-4 py-1.5 z-20 relative bg-[#0c0c0c]">
        <h3 className="text-[13px] md:text-[15px] font-bold text-white tracking-tight leading-tight">
          {item.name}
        </h3>
      </div>

      {/* Details — slides up from below on hover, no overlap */}
      <motion.div
        className="px-4 pb-3 z-20 relative bg-[#0c0c0c] overflow-hidden"
        initial={false}
        animate={{
          height: isHovered ? "auto" : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="border-t border-white/5 pt-2">
          <p
            className="text-[10px] md:text-[11px] italic mb-1 font-semibold"
            style={{ color: item.accent }}
          >
            {item.tagline}
          </p>
          <p className="text-[10px] md:text-[11px] text-[#999] leading-snug mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {item.specs.map((spec, i) => (
              <motion.span
                key={spec}
                initial={false}
                animate={
                  isHovered
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.85, y: 4 }
                }
                transition={{ delay: isHovered ? i * 0.04 : 0, duration: 0.2 }}
                className="px-1.5 py-px rounded-full text-[7px] md:text-[8px] tracking-wider font-medium"
                style={{
                  color: `${item.accent}cc`,
                  background: `${item.accent}10`,
                  border: `1px solid ${item.accent}18`,
                }}
              >
                {spec}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-40"
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)",
          width: "200%",
        }}
      />
    </motion.div>
  );
}

export default function Gear() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      id="gear"
      ref={sectionRef}
      className="py-24 md:py-32 relative"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #c8ff00 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Vertical scroll line */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] bg-white/5">
        <motion.div
          className="w-full bg-[#c8ff00]/30"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Section header */}
      <div className="px-6 md:px-12 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#c8ff00]" />
            <span className="text-sm tracking-[0.3em] uppercase text-[#c8ff00]">
              Arsenal
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            The Gear
          </h2>
          <p className="text-[#999] mt-4 max-w-lg text-lg">
            Tools of the trade. Every piece chosen for reliability, quality,
            and the ability to perform when it matters most.
          </p>
        </motion.div>
      </div>

      {/* Gear layout — 2×2 grid left + tall gimbal right */}
      <div className="px-6 md:px-12 relative z-10">
        <div className="gear-layout">
          {/* Left: 2×2 grid */}
          <div className="gear-grid-left">
            {gearItems.filter((i) => i.id !== "rs5").map((item, i) => (
              <GearCard key={item.id} item={item} index={i} />
            ))}
          </div>
          {/* Right: tall gimbal */}
          <div className="gear-grid-right">
            <GearCard item={gearItems.find((i) => i.id === "rs5")!} index={4} />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="mt-12 mx-6 md:mx-12 h-[1px] bg-white/5"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: "left" }}
      />
    </section>
  );
}
