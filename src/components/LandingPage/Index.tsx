"use client";

import React, { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import LogoSection from './LogoSection';
import MusicPlayer from './MusicPlayer';

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scatterValue, setScatterValue] = useState(0);

  // Track scroll specifically for the first section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Sync scroll to a state we can pass to Three.js
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScatterValue(latest);
  });

  return (
    <main className="relative bg-[#050508] text-white overflow-x-hidden">
      {/* We use a ref here to track the scroll of this specific 100vh block */}
      <section ref={containerRef} className="relative w-full h-screen">
        <NeuralNetworkBackground scatter={scatterValue} />
      </section>

      <LogoSection /> 
      <MusicPlayer />
    </main>
  );
};

export default LandingPage;