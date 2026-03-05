"use client";

import React from 'react';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import Hero from './Hero';
import MusicPlayer from './MusicPlayer';

const LandingPage = () => {
  return (
   <main className="relative bg-[#050508] text-white overflow-x-hidden">
  <section className="relative w-full h-screen">
    <NeuralNetworkBackground />
  </section>

  <Hero /> {/* No div or section wrapper needed if Hero has its own section inside */}

  <MusicPlayer />
</main>
  );
};

export default LandingPage;