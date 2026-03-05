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
  const [index, setIndex] = useState(0);
  const phrases = ["HELLO", "Welcome to", "Aark Global"];

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % phrases.length), 2000);
    return () => clearInterval(timer);
  }, []);

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

    const geometry = new THREE.SphereGeometry(1.5, 128, 128); 
    
    const material = new THREE.ShaderMaterial({
      uniforms: { 
        time: { value: 0 }, 
        uPointSize: { value: 2.8 },
        uScatter: { value: 0 } 
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float time;
        uniform float uPointSize;
        uniform float uScatter;
        varying vec3 vColor;

        void main() {
          vec3 pos = position;
          
          // 1. SPHERE LOGIC (Start State)
          float noise = sin(pos.x * 4.0 + time) * 0.1;
          vec3 spherePos = pos + normal * noise;

          // 2. GALAXY SPIRAL LOGIC (End State)
          // We create a spiral based on the angle of the original points
          float angle = length(pos.xy) * 12.0 + (pos.x * 8.0) + (time * 0.2);
          float radius = angle * 0.25;
          vec3 galaxyPos = vec3(cos(angle) * radius, sin(angle) * radius, pos.z * 0.2);

          // 3. THE MORPH: Linear Interpolation
          vec3 finalPos = mix(spherePos, galaxyPos, uScatter);

          // Color shifts from Blue to Cyan
          vColor = mix(vec3(0.4, 0.6, 1.0), vec3(0.2, 0.9, 1.0), uScatter);
          
          vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
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

    materialRef.current = material;
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const clock = new THREE.Clock();
    let frameId: number;
    const animate = () => {
      material.uniforms.time.value = clock.getElapsedTime();
      // Overall rotation increases slightly as it becomes a galaxy
      particles.rotation.z += 0.001 + (scatter * 0.005);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
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
        style={{ opacity: 1 - scatter * 2 }} // Fades out text early in the scroll
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10vw] font-oxanium text-white text-center drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            {phrases[index]}
          </motion.h1>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NeuralNetworkBackground;