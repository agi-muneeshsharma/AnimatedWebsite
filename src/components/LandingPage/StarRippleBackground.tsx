"use client";
import React from "react";
import { motion } from "framer-motion";

const StarRippleBackground = () => {
    const silverStarsCount = 400;
    const galaxyStarsCount = 150; // Stars specifically following the galaxy shape

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#010103]">

            {/* 1. Deep Space - Static Distant Stars */}
            <div className="absolute inset-0">
                {[...Array(silverStarsCount)].map((_, i) => (
                    <div
                        key={`bg-star-${i}`}
                        className="absolute rounded-full bg-slate-500"
                        style={{
                            width: `${Math.random() * 1.5}px`,
                            height: `${Math.random() * 1.5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.3 + 0.05,
                        }}
                    />
                ))}
            </div>

            <div className="relative w-full h-full flex items-center justify-center">

                {/* 2. The Galactic Wavy Movement */}
                <motion.div
                    className="relative flex items-center justify-center"
                    animate={{
                        x: [0, 30, -30, 0],
                        y: [0, -20, 20, 0],
                        // Subtle tilt to give 3D galaxy perspective
                        rotateX: [15, 20, 15],
                    }}
                    transition={{
                        x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 25, repeat: Infinity, ease: "easeInOut" },
                        rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                    }}
                    style={{ perspective: "1000px" }}
                >
                    {/* 3. The Galactic Core (Glow) */}
                    <div className="absolute w-[40vmin] h-[40vmin] rounded-full bg-cyan-500/10 blur-[80px]" />
                    <div className="absolute w-[15vmin] h-[15vmin] rounded-full bg-white/5 blur-[40px]" />

                    {/* 4. The Structural "Arms" (Your 6 Rings, now as faint cosmic shells) */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={`galaxy-shell-${i}`}
                            className="absolute rounded-full border-[3px] border-cyan-400"
                            style={{
                                width: `${180 - i * 25}vmin`,
                                height: `${180 - i * 25}vmin`,
                            }}
                            animate={{
                                borderColor: [
                                    `rgba(34, 211, 238, ${0.3 - i * 0.04})`,
                                    `rgba(34, 211, 238, ${0.5 - i * 0.04})`,
                                    `rgba(34, 211, 238, ${0.3 - i * 0.04})`,
                                ],
                            }}
                            transition={{
                                duration: 8 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* 5. Spiral Dust Particles - Creating the Galaxy Pattern */}
                    {[...Array(galaxyStarsCount)].map((_, i) => {
                        // Archimedean Spiral formula: r = a * angle
                        const angle = 0.1 * i * 2;
                        const radius = 1 * angle * 8; // Adjust multiplier for galaxy spread
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <motion.div
                                key={`galaxy-star-${i}`}
                                className="absolute bg-white rounded-full"
                                style={{
                                    width: "1.5px",
                                    height: "1.5px",
                                    left: `calc(50% + ${x}vmin)`,
                                    top: `calc(50% + ${y}vmin)`,
                                    boxShadow: "0 0 8px rgba(34, 211, 238, 0.8)",
                                }}
                                animate={{
                                    opacity: [0.2, 0.7, 0.2],
                                    scale: [0.8, 1.2, 0.8]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 3,
                                    repeat: Infinity,
                                    delay: Math.random() * 5
                                }}
                            />
                        );
                    })}
                </motion.div>
            </div>

            {/* 6. Atmospheric Nebula Haze */}
            <div className="absolute inset-0 bg-radial-gradient from-cyan-950/5 via-transparent to-black pointer-events-none" />
        </div>
    );
};

export default StarRippleBackground;