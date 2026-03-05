import React, { useRef } from "react";
import { motion } from "framer-motion";
import ThreeDLogo from "./ThreeDLogo";

const LogoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const line1 = "Endless Possibilities Begin";
  const line2 = "With The Right Engineering Partner";

  // Variants for the container to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Speed of typing
      },
    },
  };

  // Variants for each individual character
  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen bg-[#050508]"
    >
      <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden px-6">
        
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
            {/* Animate Line 1 */}
            {line1.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}

            <br />

            {/* Animate Line 2 */}
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