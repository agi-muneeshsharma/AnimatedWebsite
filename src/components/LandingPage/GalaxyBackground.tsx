"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GalaxyBackground = ({ progress }: { progress: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const starDataRef = useRef<{ angle: number; radius: number; z: number }[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    group.rotation.x = 1.2;
    scene.add(group);

    // --- 1. The Galaxy Stars ---
    const starCount = 10000;
    const starGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(starCount * 3);
    const starData = [];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 20;
      posArray[i3] = Math.cos(angle) * radius;
      posArray[i3 + 1] = Math.sin(angle) * radius;
      posArray[i3 + 2] = (Math.random() - 0.5) * 2;
      starData.push({ angle, radius, z: posArray[i3 + 2] });
    }
    starDataRef.current = starData;
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0x93c5fd, size: 0.02, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
    }));
    //@ts-ignore
    starsRef.current = stars;
    group.add(stars);

    // --- 2. The Gravity Rings ---
    const rings: THREE.Mesh[] = [];
    const ringCount = 8;
    for (let i = 0; i < ringCount; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(12, 0.03, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0 })
      );
      group.add(ring);
      rings.push(ring);
    }
    ringsRef.current = rings;

    let frameId: number;
    const animate = () => {
      // Update Stars based on the 'progress' prop from the parent
      if (starsRef.current) {
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3;
          const d = starDataRef.current[i];
          const currentRadius = d.radius * (1 - (progress * 0.75));
          const currentAngle = d.angle + (progress * 4);
          positions[i3] = Math.cos(currentAngle) * currentRadius;
          positions[i3 + 1] = Math.sin(currentAngle) * currentRadius;
          positions[i3 + 2] = d.z - (progress * 10);
        }
        starsRef.current.geometry.attributes.position.needsUpdate = true;
        starsRef.current.rotation.z += 0.0005;
      }

      // Update Rings
      ringsRef.current.forEach((ring, i) => {
        const stagger = i / ringCount;
        let flow = (progress * 2 + stagger) % 1;
        const startZ = 25;
        const endZ = -10;
        ring.position.z = startZ - (flow * (startZ - endZ));
        const s = 2.5 - (flow * 2.2);
        ring.scale.set(s, s, 1);

        if (progress > 0.05) {
          let alpha = flow < 0.2 ? flow * 5 : flow > 0.8 ? (1 - flow) * 5 : 0.6;
          (ring.material as THREE.MeshBasicMaterial).opacity = alpha * progress;
        } else {
          (ring.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [progress]); // Re-run logic when progress changes

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default GalaxyBackground;