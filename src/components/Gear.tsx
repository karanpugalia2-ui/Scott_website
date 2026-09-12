"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback } from "react";
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
    image: "/gear/sony-fx3.jpg",
  },
  {
    id: "2470",
    name: "FE 24-70mm f/2.8 GM II",
    category: "Lens",
    tagline: "The versatile king of glass",
    description:
      "From wide concert shots to tight artist portraits — razor-sharp optics with buttery bokeh. The lens that never comes off the camera.",
    specs: ["f/2.8 Constant Aperture", "Nano AR Coating II", "XD Linear Motors", "695g Lightweight"],
    image: "/gear/sony-2470gm.jpg",
  },
  {
    id: "rs5",
    name: "DJI RS 5 Combo",
    category: "Gimbal Stabilizer",
    tagline: "Buttery smooth motion",
    description:
      "3-axis stabilization that turns shaky handheld footage into cinema-grade steady shots. Briefcase handle and focus motor included.",
    specs: ["3-Axis Stabilization", "2.5kg Payload", "Focus Motor Included", "1-Hour Full Charge"],
    image: "/gear/dji-rs5.jpg",
  },
  {
    id: "insta360",
    name: "Insta360 X3",
    category: "360° Action Camera",
    tagline: "Capture everything, reframe later",
    description:
      "360-degree capture means I never miss a moment. Shoot first, choose the angle in post. Perfect for immersive concert coverage.",
    specs: ["5.7K 360° Video", "72MP Photos", "FlowState Stabilization", "Waterproof 10m"],
    image: "/gear/insta360-x3.jpg",
  },
  {
    id: "handycam",
    name: "Handycam",
    category: "Camcorder",
    tagline: "Always ready to roll",
    description:
      "Sometimes you need a camera that's always on standby. Captures behind-the-scenes moments, b-roll, and spontaneous footage.",
    specs: ["Optical Zoom", "SteadyShot", "NightShot Plus", "Compact Form Factor"],
    image: "/gear/handycam.jpg",
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: x * 25, y: y * 25 });
    },
    []
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex-shrink-0 w-[300px] md:w-[380px] lg:w-[440px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      {/* Image container with 3D tilt */}
      <motion.div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#111] mb-6"
        animate={{
          rotateX: isHovered ? -mousePos.y * 0.4 : 0,
          rotateY: isHovered ? mousePos.x * 0.4 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{ perspective: 1000 }}
      >
        {/* The actual image */}
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          sizes="(max-width: 768px) 300px, (max-width: 1200px) 380px, 440px"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 2}% ${50 + mousePos.y * 2}%, rgba(200,255,0,0.15) 0%, transparent 60%)`,
          }}
        />

        {/* Shine sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: isHovered ? "200%" : "-100%",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 60%)",
            width: "200%",
          }}
        />

        {/* Bottom content on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-[#c8ff00] text-[11px] tracking-[0.3em] uppercase mb-2 font-medium">
            {item.category}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {item.name}
          </h3>
        </div>

        {/* Index number */}
        <div className="absolute top-4 right-4 text-[80px] font-bold leading-none text-white/[0.04] select-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>

      {/* Info below image */}
      <motion.div
        className="px-1"
        animate={{
          y: isHovered ? -4 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-[#c8ff00]/70 text-sm italic mb-2">{item.tagline}</p>
        <p className="text-[#999] text-sm leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.specs.map((spec, i) => (
            <motion.span
              key={spec}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="px-3 py-1.5 rounded-full border border-white/8 bg-white/[0.02] text-[10px] tracking-wider text-[#888] transition-all duration-300 group-hover:border-[#c8ff00]/20 group-hover:text-[#c8ff00]/80"
            >
              {spec}
            </motion.span>
          ))}
        </div>
      </motion.div>
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
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

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

      {/* Horizontal scrolling gear showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10"
      >
        <div
          className="flex gap-8 overflow-x-auto px-6 md:px-12 pb-8"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {gearItems.map((item, i) => (
            <GearCard key={item.id} item={item} index={i} />
          ))}
          {/* End spacer */}
          <div className="flex-shrink-0 w-6 md:w-12" />
        </div>
      </motion.div>

      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-2 mt-4">
        {gearItems.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/10 first:bg-[#c8ff00]/50"
          />
        ))}
      </div>
    </section>
  );
}
