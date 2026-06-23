'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';

export const WetWipesScrollytelling = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(null);

  const totalFrames = 38;

  // Detect mobile viewports to prevent loading 38 heavy frames
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Hook scroll container progress (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  // 3. Preload all images directly (using offscreen canvases to cache pixels for solid rendering)
  useEffect(() => {
    if (isMobile === null) return;

    if (isMobile) return;

    let loadedCount = 0;
    const loadedImagesList = [];

    const preload = async () => {
      const promises = Array.from({ length: totalFrames }).map((_, i) => {
        const frameIndex = String(i + 1).padStart(3, '0');
        const src = `/wetwipes/ezgif-frame-${frameIndex}.jpg`;

        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          
          img.onload = () => {
            // Create an offscreen canvas to cache image pixels, ensuring reliable render drawing
            const offscreen = document.createElement('canvas');
            offscreen.width = img.width;
            offscreen.height = img.height;
            const ctx = offscreen.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              loadedImagesList[i] = offscreen;
            } else {
              loadedImagesList[i] = img;
            }
            loadedCount++;
            setLoadProgress(Math.floor((loadedCount / totalFrames) * 100));
            resolve();
          };

          img.onerror = () => {
            console.error(`Failed to preload frame: ${src}`);
            loadedCount++;
            resolve();
          };
        });
      });

      await Promise.all(promises);
      setImages(loadedImagesList);
      setLoading(false);
    };

    preload();
  }, [isMobile]);

  // 4. Handle canvas drawing on scroll updates
  useEffect(() => {
    if (isMobile || loading || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sync transition refs
    targetProgress.current = scrollYProgress.get();
    currentProgress.current = scrollYProgress.get();

    const drawFrame = (progress) => {
      const frameIndex = Math.min(
        Math.floor(progress * totalFrames),
        totalFrames - 1
      );

      const activeImage = images[frameIndex];
      if (!activeImage) return;

      // Clear canvas (fills with clean white)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fit image inside canvas boundaries using COVER fit to fill the screen completely
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = 1280 / 720; 

      let drawWidth, drawHeight;

      if (canvasRatio > imgRatio) {
        // Viewport is wider than image aspect ratio: scale to full width
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
      } else {
        // Viewport is taller than image aspect ratio: scale to full height
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(activeImage, x, y, drawWidth, drawHeight);
    };

    let isLoopRunning = false;
    let animationFrameId;

    const renderLoop = () => {
      const diff = targetProgress.current - currentProgress.current;
      
      if (Math.abs(diff) > 0.0001) {
        // Linear interpolation (lerp) step for butter-smooth transition
        currentProgress.current += diff * 0.08;
        drawFrame(currentProgress.current);
        animationFrameId = requestAnimationFrame(renderLoop);
      } else {
        if (currentProgress.current !== targetProgress.current) {
          currentProgress.current = targetProgress.current;
          drawFrame(currentProgress.current);
        }
        isLoopRunning = false;
        animationFrameId = null;
      }
    };

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    // Draw the initial frame
    drawFrame(currentProgress.current);

    const handleResize = () => {
      // Use window.innerWidth and window.innerHeight directly to avoid
      // 0x0 canvas drawing buffer size during layout rendering delays
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      drawFrame(currentProgress.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const unsubscribeScroll = scrollYProgress.on('change', (latest) => {
      targetProgress.current = latest;
      startLoop();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribeScroll();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMobile, loading, images, scrollYProgress]);

  // If mobile, show a high-performance static visual to prevent lag/stutters and scroll fatigue
  if (isMobile === null) {
    return (
      <div
        className="oem-mobile-story"
        style={{
          height: 'clamp(360px, 56svh, 460px)',
          background: '#ffffff'
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <div
        className="oem-mobile-story relative w-full overflow-hidden bg-white flex flex-col items-center justify-center border-b border-zinc-200"
        style={{ height: 'clamp(360px, 56svh, 460px)' }}
      >
        <img loading="eager" src="/img/oem_wipes_mockup.png" 
          alt="OEM Wet Wipes Mockup" 
          style={{ width: '100%', height: '78%', objectFit: 'contain', opacity: 0.98 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0976BC', margin: '0 0 4px 0' }}>OEM Manufacturing</h2>
          <p style={{ fontSize: '0.90rem', color: '#475569', margin: 0, fontWeight: 500 }}>Class 100 Sterile Cleanroom Compounding</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-white overflow-visible">
      {/* 6. Sticky Canvas Section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white pointer-events-none">
        {/* The HTML5 Canvas with optimize-contrast image rendering */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-10"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>
    </div>
  );
};

