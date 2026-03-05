import React, { useEffect } from 'react';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import LogoSection from './LogoSection';
import MusicPlayer from './MusicPlayer';
import RunicRenderer from './RunicEngine/RunicRenderer';
import aarkLogo from '../../assets/Runic-PNGs/aark-logo.png';
import enterprise from '../../assets/Runic-PNGs/enterprise.png';
import hardware from '../../assets/Runic-PNGs/Hardware.png';
import platform from '../../assets/Runic-PNGs/Platform.png';
import product from '../../assets/Runic-PNGs/Product.png';
import semiconductor from '../../assets/Runic-PNGs/semiconductor.png';
import software from '../../assets/Runic-PNGs/Software.png';

const LandingPage = () => {
  useEffect(() => {
    console.log('LandingPage component mounted successfully');
  }, []);
  // Asset paths for Runic PNGs - Vite resolves these from src/assets at build time
  const runicAssets = [
    aarkLogo,
    enterprise,
    hardware,
    platform,
    product,
    semiconductor,
    software,
  ];

  return (
   <main className="relative bg-[#050508] text-white overflow-x-hidden">
    {/* DEBUG: Add visible test element
     <div className="fixed top-4 left-4 bg-blue-500 text-white p-4 z-50">
       DEBUG: LandingPage is rendering! Time: {new Date().toLocaleTimeString()}
     </div> */}
  <section className="relative w-full h-screen">
    <NeuralNetworkBackground />
  </section>

  <LogoSection /> 

  <section className="relative w-full min-h-screen bg-[#050508]">
    <div className="w-full h-screen">
      <RunicRenderer
        assetPaths={runicAssets}
        width="100%"
        height="100%"
        cameraProps={{ fov: 50, perspective: 800 }}
        rendererProps={{ antialias: false, dpr: window.devicePixelRatio }}
        showLoadingProgress={false}
        onInitialized={(api) => {
          console.log('Runic Renderer initialized:', api.manager);
        }}
      />
    </div>
  </section>

  <MusicPlayer />
</main>
  );
};

export default LandingPage;