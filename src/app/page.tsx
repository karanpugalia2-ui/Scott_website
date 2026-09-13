"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";

const Work = dynamic(() => import("@/components/Work"), { ssr: false });
const About = dynamic(() => import("@/components/About"), { ssr: false });
const Gear = dynamic(() => import("@/components/Gear"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: false,
});
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <main
        className={`transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />
        <Hero />
        <Marquee />
        <Work />
        <About />
        <Gear />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
