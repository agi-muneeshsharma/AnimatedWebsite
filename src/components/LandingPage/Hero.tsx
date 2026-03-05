"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import ThreeDLogo from "./ThreeDLogo";

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen bg-[#050508]"
    >
      {/* Centered Container */}
      <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden px-6">
        
        {/* Static 3D Logo */}
        <div className="w-full max-w-xl h-[350px] mb-8">
          <ThreeDLogo className="w-full h-full" />
        </div>

        {/* Static Text Section */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-oxanium font-light tracking-widest text-white uppercase">
            Endless Possibilities Begin <br/>
            <span className="text-cyan-400 font-normal">With The Right Engineering Partner</span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;