'use client';
import React, { useEffect, useState } from 'react';

const DigitRoller = ({ value }) => {
  return (
    <div className="digit-roller">
      <div 
        className="digit-list" 
        style={{ 
          transform: `translateY(-${value * 10}%)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <div key={n} className="digit-item">{n}</div>
        ))}
      </div>
    </div>
  );
};

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 0 to 100 animation over 1.2 seconds
    const duration = 1200; 
    const intervalTime = 30; 
    const steps = duration / intervalTime;
    const increment = 100 / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        
        // Hide overlay after it hits 100%
        setTimeout(() => {
          setIsVisible(false);
          // Remove from DOM after fade-out transition completes (800ms)
          setTimeout(() => {
            setIsDismissed(true);
          }, 800);
        }, 600);
      } else {
        setProgress(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (isDismissed) return null;

  const hundreds = Math.floor(progress / 100);
  const tens = Math.floor((progress % 100) / 10);
  const units = progress % 10;

  return (
    <div 
      className="loading-screen-overlay" 
      style={{ 
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .loading-screen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s;
          user-select: none;
        }

        .logo-shape-container {
          position: relative;
          width: 50px;
          height: 70px;
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }

        .logo-shape-bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: grayscale(1) brightness(0.9);
          opacity: 0.18;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .logo-shape-mask {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          mask-image: url('/img/bapuji_logo_icon.png');
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-image: url('/img/bapuji_logo_icon.png');
          -webkit-mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          
          /* Edge smoothing */
          -webkit-mask-box-image: none;
          mask-type: alpha;
          -webkit-mask-clip: border-box;
          mask-clip: border-box;
          transform: translate3d(0, 0, 0) rotate(0.001deg);
          will-change: transform, mask-image;
          filter: blur(0px);
        }

        .liquid-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0%;
          background-color: #0976BC; /* Blue color of Bapuji logo */
          transition: height 0.15s ease-out;
          overflow: visible;
        }

        /* Bubbles rising up in the liquid */
        .bubble {
          position: absolute;
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 50%;
          bottom: -10px;
          pointer-events: none;
          animation: floatUp 2s infinite ease-in;
        }

        .bubble-1 { left: 15%; width: 4px; height: 4px; animation-duration: 1.8s; animation-delay: 0.2s; }
        .bubble-2 { left: 45%; width: 6px; height: 6px; animation-duration: 2.4s; animation-delay: 0.7s; }
        .bubble-3 { left: 75%; width: 3px; height: 3px; animation-duration: 1.5s; animation-delay: 1.1s; }
        .bubble-4 { left: 30%; width: 5px; height: 5px; animation-duration: 2.1s; animation-delay: 0.4s; }
        .bubble-5 { left: 60%; width: 4px; height: 4px; animation-duration: 2.6s; animation-delay: 1.5s; }

        @keyframes floatUp {
          0% {
            bottom: -5px;
            transform: translateX(0) scale(1);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            bottom: 100%;
            transform: translateX(4px) scale(0.7);
            opacity: 0;
          }
        }

        /* Splash droplets bouncing off the surface */
        .splash-droplet {
          position: absolute;
          bottom: 10px; /* offset relative to wave container */
          background-color: #0976BC;
          border-radius: 50%;
          pointer-events: none;
          animation: splashBounce 1.4s infinite ease-in-out;
        }

        .droplet-1 { left: 20%; width: 5px; height: 5px; animation-duration: 1.1s; animation-delay: 0.1s; }
        .droplet-2 { left: 42%; width: 4px; height: 4px; animation-duration: 1.3s; animation-delay: 0.3s; }
        .droplet-3 { left: 68%; width: 5px; height: 5px; animation-duration: 1.0s; animation-delay: 0.6s; }
        .droplet-4 { left: 85%; width: 3px; height: 3px; animation-duration: 1.2s; animation-delay: 0.2s; }

        @keyframes splashBounce {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          50% {
            transform: translate(-3px, -18px) scale(1.1); /* Jumps up */
            opacity: 1;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translate(2px, 2px) scale(0.5); /* Falls back */
            opacity: 0;
          }
        }

        .liquid-wave-wrapper {
          position: absolute;
          top: -15px;
          left: 0;
          width: 100%;
          height: 20px;
          overflow: visible;
          pointer-events: none;
        }

        .liquid-wave-svg {
          width: 200%;
          height: 100%;
          display: block;
          fill: #0976BC;
          transform: translateX(-50%);
          animation: waveAnimation 2.5s linear infinite;
        }

        @keyframes waveAnimation {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(-50%); }
        }

        /* Rolling Counter Styles */
        .rolling-counter-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          font-family: var(--font-display), monospace;
          color: #0f172a;
          margin-top: 10px;
          gap: 6px;
        }

        .digit-roller {
          height: 40px;
          overflow: hidden;
          position: relative;
          width: 20px; /* Balanced width for monospace digits */
          text-align: center;
          font-size: 2.2rem;
          font-weight: 600; /* changed to semi bold */
          line-height: 40px;
        }

        .digit-list {
          display: flex;
          flex-direction: column;
          height: 400px;
        }

        .digit-item {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .percent-sign {
          font-size: 1.3rem;
          font-weight: 700;
          color: #64748b;
          margin-left: 2px;
          line-height: 40px;
        }
      `}} />

      {/* Preloader Logo Graphic */}
      <div className="logo-shape-container">
        {/* Grey background representation of logo shape */}
        <img loading="lazy" src="/img/bapuji_logo_icon.png" 
          alt="Bapuji Logo shape background" 
          className="logo-shape-bg" 
        />
        
        {/* Masked liquid filling representation */}
        <div className="logo-shape-mask">

          <div className="liquid-fill" style={{ height: `${progress}%` }}>
            {/* Bubbles inside rising water */}
            {progress > 0 && progress < 100 && (
              <>
                <div className="bubble bubble-1" />
                <div className="bubble bubble-2" />
                <div className="bubble bubble-3" />
                <div className="bubble bubble-4" />
                <div className="bubble bubble-5" />
              </>
            )}

            {/* Wave layer at the liquid surface */}
            {progress > 0 && progress < 100 && (
              <div className="liquid-wave-wrapper">
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="liquid-wave-svg">
                  <path d="M0,10 C30,20 70,0 100,10 C130,20 170,0 200,10 L200,20 L0,20 Z" />
                </svg>
                
                {/* Splashing droplets bouncing off the surface */}
                <div className="splash-droplet droplet-1" />
                <div className="splash-droplet droplet-2" />
                <div className="splash-droplet droplet-3" />
                <div className="splash-droplet droplet-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preloader Rolling Counter */}
      <div className="rolling-counter-container">
        {progress >= 100 && <DigitRoller value={hundreds} />}
        {(progress >= 10 || progress === 100) && <DigitRoller value={tens} />}
        <DigitRoller value={units} />
      </div>
    </div>
  );
};

export default LoadingScreen;

