'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const heroImages = [
  "/img/pet_wipes_1780255281136.png",
  "/img/mother_baby_wipes.png",
  "/img/makeup_wipes_fresh_1780256009349.png",
  "/img/kitchen_wipes_1780255212230.png",
  "/img/after_wax_wipes_1780255248464.png",
  "/img/after_shave_wipes_1780255231169.png"
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-[calc(100%-1rem)] md:w-[calc(100%-1.5rem)] min-h-[calc(100vh-2rem)] mx-auto mt-2 md:mt-3 bg-black overflow-hidden font-sans rounded-b-3xl md:rounded-b-[40px]">
      {/* Animated Background Images */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={heroImages[currentIndex]}
            alt="Bapuji Surgicals Products"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 3, ease: "linear" }
            }}
          />
        </AnimatePresence>
        {/* Soft overlay shade for text legibility */}
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none"></div>
      </div>
      
      {/* Content Container - Adjusted padding to match the reference */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-10 md:px-20 pb-8 md:pb-12">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Top Tagline */}
            <div className="flex items-center gap-2 text-white/90 text-base md:text-lg font-semibold mb-6">
              <Check className="w-5 h-5" />
              <span>Dermatologically tested</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
              Premium Wet Wipes for modern global brands
            </h1>
            
            {/* Subhead */}
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
              Custom OEM wet wipes manufacturing for hygiene, beauty, baby care, fitness, and healthcare brands worldwide.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <button className="bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-gray-200 transition-colors">
                Explore Products
              </button>
              <button className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition-colors">
                Get a Quote
              </button>
            </div>
            
            {/* Bottom Stats Grid with borders based on the new image */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
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
          </motion.div>
        </div>
      </div>
      
    </section>
  );
};
