"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import ThreeDLogo from "./ThreeDLogo";
import StarRippleBackground from "./starripplebackground";

const LogoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const line1 = "Endless Possibilities Begin";
  const line2 = "With The Right Engineering Partner";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#050508] overflow-hidden"
    >
      {/* 1. Add it here! This will be the bottom layer */}
      <StarRippleBackground />

      {/* 2. Wrap your content in a relative div with a higher z-index */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">

        {/* Static 3D Logo */}
        <div className="w-full max-w-xl h-[350px] mb-8">
          <ThreeDLogo className="w-full h-full" />
        </div>

        {/* Typing Text Section */}
        <div className="text-center">
          <motion.h1
            className="text-2xl md:text-3xl font-oxanium font-light tracking-widest text-white uppercase"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {line1.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}

            <br />

            <span className="text-cyan-400 font-normal">
              {line2.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>
        </div>
      </div>
    </section>
  );
};

export default LogoSection; 