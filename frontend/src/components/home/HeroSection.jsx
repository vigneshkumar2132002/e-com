'use client';
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const heroImages = [
  "/img/pet_wipes_1780255281136.png",
  "/img/mother_baby_wipes.png",
  "/img/makeup_wipes_fresh_1780256009349.png",
  "/img/kitchen_wipes_1780255212230.png",
  "/img/after_wax_wipes_1780255248464.png",
  "/img/after_shave_wipes_1780255231169.png"
];

const SLIDE_INTERVAL_MS = 3600;

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    heroImages.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-[calc(100%-1rem)] md:w-[calc(100%-1.5rem)] min-h-[calc(100svh-72px)] md:min-h-[calc(100vh-2rem)] mx-auto mt-[64px] md:mt-3 bg-black overflow-hidden font-sans rounded-b-3xl md:rounded-b-[40px]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes homeHeroKenBurns {
          0% {
            transform: scale(1.035);
          }
          100% {
            transform: scale(1.13);
          }
        }

        .home-hero-slide {
          opacity: 0;
          transform: scale(1.08);
          filter: blur(2px) saturate(0.96);
          transition:
            opacity 1450ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 1450ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform, filter;
          backface-visibility: hidden;
          transform-origin: center;
          pointer-events: none;
        }

        .home-hero-slide.is-active {
          opacity: 0.8;
          filter: blur(0) saturate(1);
          animation: homeHeroKenBurns ${SLIDE_INTERVAL_MS}ms linear forwards;
          z-index: 2;
        }

        @media (min-width: 768px) {
          .home-hero-slide.is-active {
            opacity: 0.66;
          }
        }
      `}} />

      {/* Animated Background Images */}
      <div className="absolute inset-0 z-0 bg-black">
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="Bapuji Surgicals Products"
            className={`home-hero-slide absolute inset-0 h-full w-full object-contain p-8 pt-12 pb-36 md:object-cover md:p-0 ${currentIndex === index ? 'is-active' : ''}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
        {/* Soft overlay shade for text legibility */}
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 md:from-black/52 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-transparent z-10 pointer-events-none"></div>
      </div>
      
      {/* Content Container - Adjusted padding to match the reference */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-5 md:px-20 pb-6 md:pb-12">
        <div className="max-w-3xl">
          <div>
            {/* Top Tagline */}
            <div className="flex items-center gap-2 text-white/90 text-sm md:text-lg font-semibold mb-4 md:mb-6">
              <Check className="w-4 h-4 md:w-5 md:h-5" />
              <span>Dermatologically tested</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-[2.1rem] md:text-6xl font-bold text-white mb-4 md:mb-6 leading-[1.04] tracking-normal md:tracking-tight">
              Premium Wet Wipes for modern global brands
            </h1>
            
            {/* Subhead */}
            <p className="text-gray-300 text-base md:text-xl mb-7 md:mb-12 max-w-2xl leading-relaxed">
              Custom OEM wet wipes manufacturing for hygiene, beauty, baby care, fitness, and healthcare brands worldwide.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-20">
              <Link href="/catalog" className="w-full sm:w-auto bg-white text-black border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 px-6 md:px-8 py-3.5 rounded-full font-bold hover:bg-[#0976BC] hover:text-white transition-colors text-center">
                Explore Products
              </Link>
              <Link href="/oem" className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-6 md:px-8 py-3.5 rounded-full font-bold hover:bg-[#0976BC] hover:border-[#0976BC] hover:text-white transition-colors text-center">
                Get a Quote
              </Link>
            </div>
            
            {/* Bottom Stats Grid with borders based on the new image */}
            <div className="grid grid-cols-1 gap-4 md:flex md:flex-row md:gap-12">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">TRUSTED</span>
                <span className="text-white font-bold">50M+ wipes produced</span>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20 self-center"></div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">SAFE</span>
                <span className="text-white font-bold">Dermatologically tested</span>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20 self-center"></div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">OEM READY</span>
                <span className="text-white font-bold">Private label manufacturing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};
