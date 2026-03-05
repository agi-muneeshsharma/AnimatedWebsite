"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const NeuralNetworkBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);
  const phrases = ["HELLO", "Welcome to", "Aark Global"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true 
    });
    
    // Ensure renderer matches container size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.SphereGeometry(1.2, 80, 110); 
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, uPointSize: { value: 2.5 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float time;
        uniform float uPointSize;
        varying vec3 vColor;
        void main() {
          vec3 pos = position;
          float noise = sin(pos.x * 3.0 + time) * 0.2 + sin(pos.y * 2.0 + time * 0.8) * 0.2;
          pos += normal * noise;
          vColor = vec3(0.4, 0.6, 1.0) + (normal * 0.3);
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uPointSize * (10.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          gl_FragColor = vec4(vColor, pow(1.0 - (r * 2.0), 2.0));
        }
      `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.time.value = elapsed;
      particles.rotation.y = elapsed * 0.1;
      particles.position.x += (mouseRef.current.x * 0.3 - particles.position.x) * 0.05;
      particles.position.y += (-mouseRef.current.y * 0.3 - particles.position.y) * 0.05;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    // Height must be h-full to be visible in the section
    <div ref={containerRef} className="relative w-full h-full bg-[#050508] overflow-hidden">
      {/* Canvas must be absolute so it stays behind the text */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block w-full h-full" />
      
      {/* Text Layer */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="text-[10vw] text-white text-center drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            {phrases[index]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Background vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(5,5,8,0.7)_100%)]" />
    </div>
  );
};

export default NeuralNetworkBackground;