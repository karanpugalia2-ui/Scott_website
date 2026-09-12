"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const gearItems = [
  {
    id: "fx3",
    name: "Sony FX3",
    category: "Camera Body",
    tagline: "The Cinema Line workhorse",
    description:
      "Full-frame sensor, 4K 120fps, S-Log3. Built for run-and-gun filmmaking with cinema-grade internals in a compact body. This is what captures every frame.",
    specs: ["Full-Frame 10.2MP", "4K 120fps", "S-Log3 / S-Cinetone", "Dual Card Slots"],
    image: "/gear/sony-fx3.svg",
  },
  {
    id: "2470",
    name: "FE 24-70mm f/2.8 GM II",
    category: "Lens",
    tagline: "The versatile king of glass",
    description:
      "From wide concert shots to tight artist portraits — this lens does it all. Razor-sharp optics with buttery bokeh. The lens that never comes off the camera.",
    specs: ["f/2.8 Constant Aperture", "Nano AR Coating II", "XD Linear Motors", "Dust & Moisture Resistant"],
    image: "/gear/sony-2470gm.svg",
  },
  {
    id: "rs5",
    name: "DJI RS 5 Combo",
    category: "Gimbal Stabilizer",
    tagline: "Buttery smooth motion",
    description:
      "3-axis stabilization that turns shaky handheld footage into cinema-grade steady shots. The combo includes the briefcase handle and focus motor for full creative control.",
    specs: ["3-Axis Stabilization", "2.5kg Payload", "Focus Motor Included", "Briefcase Handle"],
    image: "/gear/dji-rs5.svg",
  },
  {
    id: "insta360",
    name: "Insta360 X3",
    category: "360° Action Camera",
    tagline: "Capture everything, reframe later",
    description:
      "360-degree capture means I never miss a moment. Shoot first, choose the angle in post. Perfect for immersive concert coverage and creative POV shots.",
    specs: ["5.7K 360° Video", "72MP Photos", "FlowState Stabilization", "Waterproof 10m"],
    image: "/gear/insta360-x3.svg",
  },
  {
    id: "handycam",
    name: "Handycam",
    category: "Camcorder",
    tagline: "Always ready to roll",
    description:
      "Sometimes you need a camera that's always on standby. The handycam captures behind-the-scenes moments, b-roll, and spontaneous footage when the main rig is on a tripod.",
    specs: ["Optical Zoom", "SteadyShot", "NightShot Plus", "Compact Form Factor"],
    image: "/gear/handycam.svg",
  },
];

function GearCard({
  item,
  index,
}: {
  item: (typeof gearItems)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    },
    []
  );

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 md:py-24 ${
        index !== gearItems.length - 1 ? "border-b border-white/5" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      {/* SVG Illustration */}
      <div
        className={`relative flex items-center justify-center ${
          isEven ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {/* Glow background */}
        <motion.div
          className="absolute w-64 h-64 rounded-full blur-[80px]"
          style={{
            background: "radial-gradient(circle, rgba(200,255,0,0.08) 0%, transparent 70%)",
          }}
          animate={{
            scale: isHovered ? 1.3 : 1,
            opacity: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Floating SVG */}
        <motion.div
          className="relative w-full max-w-[350px] aspect-[4/3]"
          animate={{
            rotateX: mousePos.y * 0.5,
            rotateY: mousePos.x * 0.5,
            y: isHovered ? -8 : 0,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          style={{ perspective: 800 }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(200,255,0,0.1)]"
            sizes="(max-width: 1024px) 350px, 400px"
          />
        </motion.div>

        {/* Index number */}
        <div className="absolute top-0 left-0 text-[120px] md:text-[180px] font-bold leading-none text-white/[0.02] select-none pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-6 ${
          isEven ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="text-[#c8ff00] text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            {item.category}
          </div>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-[#ededed] mb-2">
            {item.name}
          </h3>
          <p className="text-lg text-[#c8ff00]/70 italic">{item.tagline}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-[#999] leading-relaxed text-base md:text-lg"
        >
          {item.description}
        </motion.p>

        {/* Spec pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-2"
        >
          {item.specs.map((spec, i) => (
            <motion.span
              key={spec}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="px-4 py-2 rounded-full border border-white/8 bg-white/[0.02] text-xs tracking-wider text-[#999] hover:border-[#c8ff00]/30 hover:text-[#c8ff00] transition-all duration-300 cursor-default"
            >
              {spec}
            </motion.span>
          ))}
        </motion.div>
      </div>
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
    <section id="gear" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 relative">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
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
            Tools of the trade. Every piece chosen for a reason — reliability,
            quality, and the ability to perform when it matters most.
          </p>
        </motion.div>

        {/* Progress line */}
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2">
            <motion.div
              className="w-full bg-gradient-to-b from-[#c8ff00] to-[#c8ff00]/20"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Gear items */}
          {gearItems.map((item, i) => (
            <GearCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
