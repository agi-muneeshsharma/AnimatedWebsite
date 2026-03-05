import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import "./ThreeDLogo.css";

export default function ThreeDLogo({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    // Adjusted FOV and Z-position for better visibility
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 700);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(100, 100, 400);
    scene.add(mainLight);

    // Pivot group acts as the anchor for rotations
    const pivot = new THREE.Group();
    // logoGroup holds the actual geometry
    const logoGroup = new THREE.Group();

    pivot.add(logoGroup);
    scene.add(pivot);

    const loader = new SVGLoader();
    loader.load("/logo.svg", (data) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.2,
        side: THREE.DoubleSide,
      });

      data.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 50,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelSegments: 5,
          });

          const mesh = new THREE.Mesh(geometry, material);
          logoGroup.add(mesh);
        });
      });

      // Flip Y because SVGs use top-down coordinates
      logoGroup.scale.y *= -1;

      // Perfect Centering Logic
      const box = new THREE.Box3().setFromObject(logoGroup);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Offset the logoGroup so its center is at 0,0,0 relative to the Pivot
      logoGroup.position.x = -center.x;
      logoGroup.position.y = -center.y;
      logoGroup.position.z = -center.z;

      // Scale the pivot to fit the container
      const maxDim = Math.max(size.x, size.y);
      const scaleFactor = (Math.min(width, height) * 0.7) / maxDim;
      pivot.scale.multiplyScalar(scaleFactor);
    });

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Rotate the pivot (the center)
      pivot.rotation.y = t * 0.4;
      pivot.rotation.x = Math.sin(t * 0.5) * 0.1;

      // Gentle floating motion without huge Y offsets
      pivot.position.y = Math.sin(t * 0.8) * 10;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`three-d-logo-container ${className || ""}`}
    />
  );
}