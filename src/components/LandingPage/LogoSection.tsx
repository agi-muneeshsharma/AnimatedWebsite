"use client";
import React, { useRef } from "react";
import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import ThreeDLogo from "./ThreeDLogo";

interface LogoSectionProps {
  scatter: number;
}

const LogoSection: React.FC<LogoSectionProps> = ({ scatter }) => {
  const line1 = "Endless Possibilities Begin";
  const line2 = "With The Right Engineering Partner";

  // UI starts invisible and fades in as the morph reaches 50%
  const uiOpacity = Math.max(0, (scatter - 0.5) * 2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
  };

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative z-10">
      
      {/* 3D LOGO */}
      <motion.div 
        style={{ opacity: uiOpacity, scale: 0.8 + uiOpacity * 0.2 }}
        className="w-full max-w-xl h-[350px] mb-12 flex items-center justify-center"
      >
        <ThreeDLogo className="w-full h-full" />
      </motion.div>

      {/* TYPEWRITER TEXT */}
      <div className="text-center h-24">
        {scatter > 0.7 && (
          <motion.h1
            className="text-2xl md:text-3xl font-oxanium font-light tracking-widest text-white uppercase"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {line1.split("").map((char, index) => (
              <motion.span key={`l1-${index}`} variants={letterVariants}>{char}</motion.span>
            ))}
            <br />
            <span className="text-cyan-400 font-normal">
              {line2.split("").map((char, index) => (
                <motion.span key={`l2-${index}`} variants={letterVariants}>{char}</motion.span>
              ))}
            </span>
          </motion.h1>
        )}
      </div>
    </div>
  );
};

export default LogoSection;