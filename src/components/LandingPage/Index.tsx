"use client";

import React from 'react';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import LogoSection from './LogoSection';
import MusicPlayer from './MusicPlayer';

const LandingPage = () => {
  return (
   <main className="relative bg-[#050508] text-white overflow-x-hidden">
  <section className="relative w-full h-screen">
    <NeuralNetworkBackground />
  </section>

  <LogoSection /> 

  <MusicPlayer />
</main>
  );
};

export default LandingPage;