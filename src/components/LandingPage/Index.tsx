"use client";

import React, { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import LogoSection from './LogoSection';
import MusicPlayer from './MusicPlayer';

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollValue, setScrollValue] = useState(0);

  // Track the scroll of the entire page (Section 1 + Section 2)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollValue(latest);
  });

  return (
    <main ref={containerRef} className="relative bg-[#050508] text-white">
      
      {/* PERSISTENT BACKGROUND: Stays fixed so the orb can morph into the galaxy */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground scatter={scrollValue} />
      </div>

      {/* SECTION 1: Intro (Text fades out as you scroll) */}
      <section className="relative h-screen w-full z-10 pointer-events-none" />

      {/* SECTION 2: Logo and Typewriter (Content scrolls into view) */}
      <section className="relative h-screen w-full z-10">
        <LogoSection scatter={scrollValue} />
      </section>

      <MusicPlayer />
    </main>
  );
};

export default LandingPage;