"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
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
    span: "col-span-2 row-span-1" as const,
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
    imageW: 800,
    imageH: 500,
    span: "col-span-1 row-span-2" as const,
    accent: "#ff6b35",
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
    imageW: 500,
    imageH: 700,
    span: "col-span-1 row-span-1" as const,
    accent: "#00d4ff",
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
    imageW: 600,
    imageH: 600,
    span: "col-span-1 row-span-1" as const,
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
    imageW: 700,
    imageH: 450,
    span: "col-span-2 row-span-1" as const,
    accent: "#f43f5e",
  },
];

function MagneticCard({
  item,
  index,
}: {
  item: (typeof gearItems)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    },
    []
  );

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer ${item.span}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      style={{ perspective: 800 }}
    >
      {/* Card background */}
      <motion.div
        className="absolute inset-0 bg-[#0c0c0c] rounded-2xl"
        animate={{
          rotateX: isHovered ? -mousePos.y * 8 : 0,
          rotateY: isHovered ? mousePos.x * 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </motion.div>

      {/* Glow border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: `inset 0 0 0 1px ${item.accent}33, 0 0 40px ${item.accent}15`,
        }}
      />

      {/* Big index number watermark */}
      <div className="absolute top-4 right-6 text-[120px] md:text-[160px] font-black leading-none select-none pointer-events-none"
        style={{ color: `${item.accent}08` }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Product image — floating with magnetic follow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10 p-6 md:p-10"
        animate={{
          x: isHovered ? mousePos.x * 20 : 0,
          y: isHovered ? mousePos.y * 20 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{
            y: isHovered ? -6 : [0, -8, 0],
            scale: isHovered ? 1.08 : 1,
          }}
          transition={
            isHovered
              ? { type: "spring", stiffness: 200, damping: 20 }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Image
            src={item.image}
            alt={item.name}
            width={item.imageW}
            height={item.imageH}
            className="w-full h-full object-contain"
            style={{
              filter: isHovered
                ? `drop-shadow(0 0 30px ${item.accent}30) drop-shadow(0 20px 40px rgba(0,0,0,0.6))`
                : "drop-shadow(0 10px 25px rgba(0,0,0,0.5))",
              transition: "filter 0.4s ease",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Top-left category tag */}
      <motion.div
        className="absolute top-5 left-5 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.3 + index * 0.1 }}
      >
        <div
          className="px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium backdrop-blur-md"
          style={{
            color: item.accent,
            background: `${item.accent}15`,
            border: `1px solid ${item.accent}25`,
          }}
        >
          {item.category}
        </div>
      </motion.div>

      {/* Bottom info panel — slides up on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-6"
        animate={{
          y: isHovered ? 0 : 20,
          opacity: isHovered ? 1 : 0.7,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="backdrop-blur-md bg-black/40 rounded-xl p-4 border border-white/5">
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight mb-1">
            {item.name}
          </h3>
          <p
            className="text-xs italic mb-3"
            style={{ color: `${item.accent}aa` }}
          >
            {item.tagline}
          </p>

          {/* Specs — animate in on hover */}
          <div className="flex flex-wrap gap-1.5">
            {item.specs.map((spec, i) => (
              <motion.span
                key={spec}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={
                  isHovered
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0.5, scale: 0.95, y: 5 }
                }
                transition={{ delay: i * 0.05, duration: 0.25 }}
                className="px-2.5 py-1 rounded-full text-[9px] tracking-wider font-medium"
                style={{
                  color: `${item.accent}cc`,
                  background: `${item.accent}10`,
                  border: `1px solid ${item.accent}20`,
                }}
              >
                {spec}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Shine sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        animate={{
          x: isHovered ? "200%" : "-100%",
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
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
      className="py-24 md:py-32 relative overflow-hidden"
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
      <div className="px-6 md:px-12 mb-16 relative z-10">
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

      {/* Bento grid layout */}
      <div className="px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[280px] md:auto-rows-[320px]">
          {gearItems.map((item, i) => (
            <MagneticCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="mt-16 mx-6 md:mx-12 h-[1px] bg-white/5"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: "left" }}
      />
    </section>
  );
}
