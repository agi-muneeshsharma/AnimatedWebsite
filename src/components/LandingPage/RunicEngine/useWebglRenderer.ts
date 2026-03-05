// src/components/landingpage/RunicEngine/useWebglRenderer.ts

import { useEffect, useRef, RefObject } from 'react';
import { Object3D, Material, Mesh } from 'three';
import { WebglManager } from './Core/webgl/Manager';
import { Items } from './Core/Items';

export interface WebglRendererAPI {
  manager: WebglManager;
  items: Items | null;
  updateProgress?: (progress: number) => void;
  destroy: () => void;
}

interface UseWebglRendererProps {
  containerRef: RefObject<HTMLDivElement>;
  assetPaths: string[];
  cameraProps?: {
    fov?: number;
    perspective?: number;
    near?: number;
    far?: number;
  };
  rendererProps?: {
    antialias?: boolean;
    dpr?: number;
  };
}

/**
 * Custom image loader that works with Vite's asset resolution
 * Handles various path formats: /assets/..., /public/..., absolute URLs, etc.
 */
const loadImageVite = (imagePath: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Since assets are now imported, imagePath is already a resolved URL
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`));
    img.src = imagePath;
  });
};

export const useWebglRenderer = ({
  containerRef,
  assetPaths,
  cameraProps = { fov: 50, perspective: 800 },
  rendererProps = { antialias: false },
}: UseWebglRendererProps): WebglRendererAPI => {
  const managerRef = useRef<WebglManager | null>(null);
  const itemsRef = useRef<Items | null>(null);
  const apiRef = useRef<WebglRendererAPI | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize WebGL Manager
    const manager = new WebglManager(container, {
      cameraProps,
      rendererProps,
    });

    manager.play();
    managerRef.current = manager;

    // Load images from asset paths
    let loadCount = 0;

    function handleLoaded() {
      loadCount += 1;
      const progress = loadCount / (assetPaths.length + 1);
      container.setAttribute('data-is-loaded', `${progress}`);
    }

    // Map asset paths to image loading promises
    const loaders = assetPaths.map((imagePath) =>
      loadImageVite(imagePath).catch((err) => {
        console.error(`Failed to load image: ${imagePath}`, err);
        return null;
      })
    );

    // Track individual image completions
    loaders.forEach((loader) => {
      loader
        ?.then(() => handleLoaded())
        .catch(() => {
          // Error already logged above
        });
    });

    // Initialize Items when all images are loaded
    Promise.all(loaders)
      .then((images) => {
        // Filter out null failures
        const validImages = images.filter(
          (img) => img !== null
        ) as HTMLImageElement[];

        if (validImages.length > 0) {
          const items = new Items({ manager, images: validImages });
          itemsRef.current = items;
        }

        handleLoaded(); // Final completion signal
      })
      .catch((err) => {
        console.error('Failed to initialize Items', err);
      });

    // Handle window resize
    const handleResize = () => {
      if (managerRef.current && container) {
        managerRef.current.renderer.setSize(
          container.clientWidth,
          container.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);

    // Set up API object
    apiRef.current = {
      manager,
      items: itemsRef.current,
      destroy: () => {
        if (managerRef.current) {
          // Clean up Three.js resources to prevent memory leaks
          managerRef.current.scene.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                const material = child.material as Material | Material[];
                if (Array.isArray(material)) {
                  material.forEach((m: Material) => m.dispose());
                } else {
                  material.dispose();
                }
              }
            }
          });
          managerRef.current.renderer.dispose();
        }
        window.removeEventListener('resize', handleResize);
      },
    };

    // Cleanup function: called when component unmounts or deps change
    return () => {
      apiRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [assetPaths, containerRef, cameraProps, rendererProps]);

  return (
    apiRef.current || {
      manager: null as unknown as WebglManager,
      items: null,
      destroy: () => {},
    }
  );
};