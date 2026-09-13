"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let lastTime = 0;
    const FPS = prefersReducedMotion.current ? 30 : 60;
    const frameInterval = 1000 / FPS;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (prefersReducedMotion.current) {
        cursorX = mouseX;
        cursorY = mouseY;
      }
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const animate = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const delta = timestamp - lastTime;
      if (delta < frameInterval) return;
      lastTime = timestamp - (delta % frameInterval);

      const lerp = prefersReducedMotion.current ? 0.5 : 0.85;
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY - cursorY) * lerp;
      cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [data-cursor-hover], input, textarea")
      ) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [data-cursor-hover], input, textarea")
      ) {
        setIsHovering(false);
      }
    };

    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    // Pause when tab not visible
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#c8ff00]/50 pointer-events-none z-[10001] mix-blend-difference hidden md:block"
        style={{
          opacity: isHidden ? 0 : 1,
          transform: isHovering
            ? "scale(1.8)"
            : "scale(1)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          willChange: "transform",
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#c8ff00] pointer-events-none z-[10001] hidden md:block"
        style={{ opacity: isHidden ? 0 : 1 }}
      />
    </>
  );
}
