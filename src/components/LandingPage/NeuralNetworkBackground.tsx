"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralNetworkProps {
  scatter: number;
}

const NeuralNetworkBackground: React.FC<NeuralNetworkProps> = ({ scatter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);
  const phrases = ["HELLO", "Welcome to", "Aark Global"];

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % phrases.length), 2000);
    return () => clearInterval(timer);
  }, [phrases.length]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uScatter.value = scatter;
    }
  }, [scatter]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.SphereGeometry(1.5, 80, 40); 
    
    const material = new THREE.ShaderMaterial({
      uniforms: { 
        time: { value: 0 }, 
        uPointSize: { value: 2.2 }, 
        uScatter: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float time;
        uniform float uPointSize;
        uniform float uScatter;
        uniform vec2 uMouse;
        varying vec3 vColor;

        void main() {
          vec3 pos = position;
          
          // 1. SPHERE LOGIC (Wavy movement)
          float noise = sin(pos.x * 4.0 + time) * 0.1;
          vec3 spherePos = pos + normal * noise;

          // 2. SCATTER LOGIC
          // Instead of a galaxy shape, we push particles along their normals
          // uScatter * 15.0 makes them fly off-screen as you scroll
          vec3 scatteredPos = spherePos + normal * (uScatter * 15.0);

          // 3. FINAL POSITION
          vec3 finalPos = scatteredPos;

          // 4. MOUSE PARALLAX
          // We reduce mouse influence as they scatter away
          float mouseFactor = 1.0 - clamp(uScatter * 1.5, 0.0, 1.0);
          finalPos.x += uMouse.x * 0.5 * mouseFactor;
          finalPos.y += uMouse.y * 0.5 * mouseFactor;

          // COLOR: Transitions to #376a97
          vec3 targetColor = vec3(0.216, 0.416, 0.592); 
          vColor = mix(vec3(0.4, 0.6, 1.0), targetColor, uScatter);
          
          vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
          
          // Shrink points slightly as they scatter for a distant star effect
          float sizeFactor = 1.0 - (uScatter * 0.5);
          gl_PointSize = uPointSize * sizeFactor * (12.0 / -mvPosition.z);
          
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

    materialRef.current = material;
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const clock = new THREE.Clock();
    let frameId: number;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.time.value = elapsed;
      
      material.uniforms.uMouse.value.x += (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y += (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.05;

      // Subtle rotation during scatter
      particles.rotation.y = elapsed * 0.05;

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
    <div className="relative w-full h-full bg-[#050508] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      <motion.div 
        style={{ opacity: 1 - scatter * 2 }}
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10vw] font-oxanium text-white text-center"
          >
            {phrases[index]}
          </motion.h1>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NeuralNetworkBackground;

// 2