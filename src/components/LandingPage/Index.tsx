"use client";

import React, { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import LogoSection from './LogoSection';
import MusicPlayer from './MusicPlayer';
import { Star } from 'lucide-react';

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollValue, setScrollValue] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollValue(latest);
  });

  return (
    <main ref={containerRef} className="relative bg-[#050508] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground scatter={scrollValue} />
      </div>

    

      <section className="relative h-screen w-full z-10 pointer-events-none" />

      <section className="relative h-screen w-full z-10">
        <LogoSection scatter={scrollValue} />
      </section>

      <MusicPlayer />
    </main>
  );
};

export default LandingPage;